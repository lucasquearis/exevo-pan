import Head from 'next/head'
import { Main } from 'templates'
import { GetStaticProps } from 'next'
import { useTranslations } from 'contexts/useTranslation'
import { Layout, AuctionNotifications } from 'modules/Dashboard'
import { toast } from 'react-hot-toast'
import { PreviewImageClient } from 'services'
import { trpc } from 'lib/trpc'
import { buildUrl, buildPageTitle } from 'utils'
import { routes, jsonld } from 'Constants'
import { common, dashboard } from 'locales'

const pageUrl = buildUrl(routes.DASHBOARD.AUCTION_NOTIFICATIONS)

export default function Page() {
  const { translations } = useTranslations()

  const i18n = translations.dashboard

  const pageName = i18n.Meta.auctionNotifications.title
  const previewSrc = PreviewImageClient.getSrc({
    title: pageName,
  })

  const pageTitle = buildPageTitle(pageName)

  const list = trpc.listMyAuctionNotifications.useQuery(undefined, {
    keepPreviousData: true,
  })

  const remove = trpc.deleteMyAuctionNotification.useMutation()
  const onDelete = (id: string) =>
    toast
      .promise(remove.mutateAsync(id), {
        success: i18n.AuctionNotifications.successMessage,
        error: translations.common.genericError,
        loading: translations.common.genericLoading,
      })
      .then(() => list.refetch())

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="title" content={pageTitle} />
        <meta property="og:title" content={pageTitle} />
        <meta property="twitter:title" content={pageTitle} />

        <meta
          name="description"
          content={i18n.Meta.auctionNotifications.description}
        />
        <meta
          property="twitter:description"
          content={i18n.Meta.auctionNotifications.description}
        />
        <meta
          property="og:description"
          content={i18n.Meta.auctionNotifications.description}
        />
        <meta property="og:type" content="website" />

        <link rel="canonical" href={pageUrl} />
        <meta property="og:url" content={pageUrl} />
        <meta property="twitter:url" content={pageUrl} />

        <meta key="preview-1" property="og:image" content={previewSrc} />
        <meta key="preview-2" property="twitter:image" content={previewSrc} />

        <link rel="alternate" hrefLang="en" href={pageUrl} />
        <link
          rel="alternate"
          hrefLang="pt"
          href={buildUrl(routes.LOGIN, 'pt')}
        />
        <link
          rel="alternate"
          hrefLang="es"
          href={buildUrl(routes.LOGIN, 'es')}
        />
        <link
          rel="alternate"
          hrefLang="pl"
          href={buildUrl(routes.LOGIN, 'pl')}
        />
        <link rel="alternate" hrefLang="x-default" href={pageUrl} />

        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: jsonld.standard,
          }}
        />
      </Head>

      <Main>
        <Layout isLoading={list.isLoading}>
          {list.data && (
            <AuctionNotifications.List list={list.data} onDelete={onDelete} />
          )}
        </Layout>
      </Main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    translations: {
      common: common[locale as RegisteredLocale],
      dashboard: dashboard[locale as RegisteredLocale],
    },
  },
})
