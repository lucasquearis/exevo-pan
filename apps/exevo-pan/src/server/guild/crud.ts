import { z } from 'zod'
import { authedProcedure, publicProcedure } from 'server/trpc'
import { TRPCError } from '@trpc/server'
import { prisma } from 'lib/prisma'
import { avatar, guildValidationRules } from 'Constants'
import type { GUILD_MEMBER_ROLE, GuildMember } from '@prisma/client'
import { can } from './permissions'

type UniqueMemberArgs =
  | { id: string; guildId?: never; userId?: never }
  | { id?: never; guildId: string; userId: string }

const findGuildMember = async ({
  id,
  guildId,
  userId,
}: UniqueMemberArgs): Promise<GuildMember> => {
  const member = await prisma.guildMember.findUnique({
    where: {
      id,
      guildId_userId: guildId ? { guildId, userId } : undefined,
    },
  })

  if (!member) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Guild member not found',
    })
  }

  return member
}

const throwIfForbiddenGuildRequest = async ({
  guildId,
  requesterId,
}: {
  guildId: string
  requesterId: string
}) => {
  const guild = await prisma.guild.findUnique({
    where: { id: guildId },
    include: { guildMembers: { include: { user: true } } },
  })

  if (!guild) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `Guild [${guildId}] not found`,
    })
  }

  const requesterMember = guild.guildMembers.find(
    ({ userId }) => userId === requesterId,
  )

  if (!requesterMember) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message:
        "You don't have the necessary privileges to edit information from this guild",
    })
  }

  const hasProMember = guild.guildMembers.some(
    ({ user: { proStatus } }) => proStatus,
  )

  const isEditor = can[requesterMember.role].editGuild

  return { guild, requesterMember, hasProMember, isEditor }
}

const CreationSchema = z.object({
  name: z
    .string()
    .min(guildValidationRules.name.MIN)
    .max(guildValidationRules.name.MAX),
  private: z.boolean(),
  server: z
    .string()
    .min(guildValidationRules.server.MIN)
    .max(guildValidationRules.server.MAX),
  description: z.string().max(guildValidationRules.description.MAX).nullable(),
  avatarId: z.number().min(avatar.id.min).max(avatar.id.max),
  avatarDegree: z.number().min(avatar.degree.min).max(avatar.degree.max),
})

export type GuildCreationInput = z.infer<typeof CreationSchema>

export const createGuild = authedProcedure.input(CreationSchema).mutation(
  async ({
    ctx: {
      token: { id, name, proStatus },
    },
    input: { name: guildName, description, server, ...guildData },
  }) =>
    prisma.guild.create({
      data: {
        ...guildData,
        name: guildName.trim(),
        description: description?.trim(),
        server: server.trim(),
        private: proStatus ? guildData.private : false,
        guildMembers: {
          create: {
            userId: id,
            name,
            role: 'ADMIN',
          },
        },
      },
    }),
)

const EditSchema = z.object({
  guildId: z.string(),
  name: z
    .string()
    .min(guildValidationRules.name.MIN)
    .max(guildValidationRules.name.MAX)
    .optional(),
  private: z.boolean().optional(),
  server: z
    .string()
    .min(guildValidationRules.server.MIN)
    .max(guildValidationRules.server.MAX)
    .optional(),
  description: z.string().max(guildValidationRules.description.MAX).optional(),
  messageBoard: z
    .string()
    .max(guildValidationRules.messageBoard.MAX)
    .optional(),
  avatarId: z.number().min(avatar.id.min).max(avatar.id.max).optional(),
  avatarDegree: z
    .number()
    .min(avatar.degree.min)
    .max(avatar.degree.max)
    .optional(),
})

export type GuildEditInput = z.infer<typeof EditSchema>

export const updateGuild = authedProcedure
  .input(EditSchema)
  .mutation(async ({ ctx: { token }, input }) => {
    const { guildId, name, description, messageBoard, server, ...guildData } =
      input

    const { guild, hasProMember, isEditor } =
      await throwIfForbiddenGuildRequest({
        guildId,
        requesterId: token.id,
      })

    if (!isEditor) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message:
          "You don't have the necessary privileges to edit information from this guild",
      })
    }

    const isUpdatingGuildPrivacy = guildData.private !== guild.private
    if (isUpdatingGuildPrivacy && guildData.private && !hasProMember) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'PRO_REQUIRED',
      })
    }

    const result = prisma.guild.update({
      where: { id: guildId },
      data: {
        ...guildData,
        name: name?.trim(),
        description: description?.trim(),
        messageBoard: messageBoard?.trim(),
        server: server?.trim(),
      },
    })

    return result
  })

export const listGuilds = publicProcedure
  .input(
    z.object({
      pageSize: z.number().optional().default(20),
      pageIndex: z.number().optional().default(0),
      server: z.string().optional(),
      name: z.string().optional(),
      myGuilds: z.boolean().optional().default(false),
    }),
  )
  .query(
    async ({ ctx, input: { pageIndex, pageSize, server, name, myGuilds } }) => {
      const where = {
        name: myGuilds ? undefined : { contains: name },
        server: myGuilds ? undefined : { contains: server },
        guildMembers:
          myGuilds && ctx.token
            ? { some: { userId: ctx.token.id } }
            : undefined,
      }

      const [page, count] = await Promise.all([
        prisma.guild.findMany({
          where,
          include: {
            _count: {
              select: { guildMembers: true },
            },
          },
          take: pageSize,
          skip: pageIndex * pageSize,
        }),
        prisma.guild.count({
          where,
        }),
      ])

      return {
        page: page.map(
          ({ _count: { guildMembers }, messageBoard, ...data }) => ({
            ...data,
            memberCount: guildMembers,
          }),
        ),
        count,
      }
    },
  )

export const manageGuildMemberRole = authedProcedure
  .input(
    z.object({
      managedGuildMemberId: z.string(),
      role: z.union([
        z.literal<GUILD_MEMBER_ROLE>('MODERATOR'),
        z.literal<GUILD_MEMBER_ROLE>('USER'),
      ]),
    }),
  )
  .mutation(async ({ ctx: { token }, input }) => {
    const { managedGuildMemberId, role } = input

    const managedMember = await findGuildMember({ id: managedGuildMemberId })

    const requesterMember = await findGuildMember({
      guildId: managedMember.guildId,
      userId: token.id,
    })

    if (requesterMember.role !== 'ADMIN') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message:
          "You don't have the necessary privileges change a member role from this guild",
      })
    }

    const result = prisma.guildMember.update({
      where: { id: managedMember.id },
      data: { role },
    })

    return result
  })

export const excludeGuildMember = authedProcedure
  .input(
    z.object({
      excludedGuildMemberId: z.string(),
    }),
  )
  .mutation(async ({ ctx: { token }, input: { excludedGuildMemberId } }) => {
    const excludedMember = await findGuildMember({ id: excludedGuildMemberId })

    const allMembers = await prisma.guildMember.findMany({
      where: { guildId: excludedMember.guildId },
      orderBy: { joinedAt: 'asc' },
    })

    const requesterMember = allMembers.find(({ userId }) => userId === token.id)

    if (!requesterMember) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message:
          'You are not allowed to leave/kick from a guild you are not member of',
      })
    }

    const isSelfExcluding = requesterMember.id === excludedMember.id

    if (isSelfExcluding) {
      const guildWillDisband = allMembers.length === 1

      if (guildWillDisband) {
        await prisma.guild.delete({ where: { id: excludedMember.guildId } })

        return excludedMember
      }

      if (excludedMember.role === 'ADMIN') {
        const [newElectedAdmin] = allMembers.filter(
          ({ id }) => id !== excludedMember.id,
        )

        await prisma.$transaction([
          prisma.guildMember.delete({ where: { id: excludedMember.id } }),
          prisma.guildMember.update({
            where: { id: newElectedAdmin.id },
            data: { role: 'ADMIN' },
          }),
        ])

        return excludedMember
      }

      const result = await prisma.guildMember.delete({
        where: { id: excludedMember.id },
      })

      return result
    }

    if (!can[requesterMember.role].exclude(excludedMember.role)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `The role [${requesterMember.role}] doesn't have the necessary privileges to exclude a guild member with the role [${excludedMember.role}]`,
      })
    }

    const result = await prisma.guildMember.delete({
      where: { id: excludedMember.id },
    })

    return result
  })

export const changeGuildMemberName = authedProcedure
  .input(
    z.object({
      guildMemberId: z.string(),
      name: z
        .string()
        .min(guildValidationRules.name.MIN)
        .max(guildValidationRules.name.MAX),
    }),
  )
  .mutation(async ({ ctx: { token }, input: { guildMemberId, name } }) => {
    const managedGuildMember = await findGuildMember({ id: guildMemberId })

    if (managedGuildMember.userId !== token.id) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message:
          'You are not allowed to change the name of other guild members',
      })
    }

    const result = await prisma.guildMember.update({
      where: { id: guildMemberId },
      data: { name },
    })

    return result
  })

export const applyToGuild = authedProcedure
  .input(
    z.object({
      guildId: z.string(),
      applyAs: z
        .string()
        .min(guildValidationRules.name.MIN)
        .max(guildValidationRules.name.MAX),
      message: z.string().max(guildValidationRules.applyMessage.MAX).optional(),
    }),
  )
  .mutation(
    async ({ ctx: { token }, input: { guildId, applyAs, message } }) => {
      const userId = token.id

      const isMemberAlready = !!(await prisma.guildMember.findUnique({
        where: { guildId_userId: { guildId, userId } },
      }))

      if (isMemberAlready) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are already a member of this guild',
        })
      }

      const result = await prisma.guildApplication.create({
        data: { userId, guildId, applyAs, message },
      })

      return result
    },
  )
