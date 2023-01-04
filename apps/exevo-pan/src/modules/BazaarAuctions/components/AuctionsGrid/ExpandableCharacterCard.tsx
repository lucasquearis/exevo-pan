/* eslint-disable react/require-default-props */
import { useRef, useMemo, useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import { CopyButton } from 'components/Atoms'
import { Menu } from 'components/Organisms'
import CharacterCard from 'components/CharacterCard'
import CharacterModal from 'components/CharacterModal'
import { MoreIcon, ExpandIcon, SearchIcon } from 'assets/svgs'
import { CharacterCardProps } from 'components/CharacterCard/types'
import { permalinkResolver } from 'utils'
import { useSyncUrlState } from 'hooks'
import { urlParameters } from 'Constants'

const ExpandableCharacterCard = (props: Omit<CharacterCardProps, 'ref'>) => {
  const { characterData } = props
  const auctionId = characterData.id

  const { locale } = useRouter()

  const permalink = useMemo(
    () => permalinkResolver({ auctionId, locale }),
    [auctionId, locale],
  )

  const [isExpanded, setExpanded] = useState(false)
  const [, setAuctionIdUrl] = useSyncUrlState<number | undefined>({
    key: urlParameters.AUCTION_ID,
    defaultValue: undefined,
  })

  const expandCard = useCallback(() => {
    if (permalink) setAuctionIdUrl(auctionId)
    setExpanded(true)
  }, [auctionId, permalink])

  const copyButtonRef = useRef<HTMLButtonElement>(null)

  const CopyButtonIcon = ({ className }: { className?: string }) => (
    <CopyButton
      ref={copyButtonRef}
      copyString={permalink}
      iconClassname={className}
    />
  )

  const copyLinkAction = useCallback(() => {
    copyButtonRef.current?.click()
  }, [])

  return (
    <>
      <CharacterCard
        cornerElement={
          <Menu
            /* @ ToDo: i18n */
            items={[
              {
                label: 'Details',
                icon: ExpandIcon,
                onSelect: expandCard,
              },
              {
                label: 'Copy link',
                icon: CopyButtonIcon,
                keepOpenAfterSelection: true,
                onSelect: copyLinkAction,
              },
              {
                /* @ ToDo: onSelect action */
                label: 'Find similar',
                icon: SearchIcon,
              },
            ]}
          >
            <MoreIcon className="fill-onSurface" />
          </Menu>
        }
        {...props}
      />
      {isExpanded && (
        <CharacterModal
          characterData={characterData}
          onClose={() => {
            if (permalink) setAuctionIdUrl(undefined)
            setExpanded(false)
          }}
        />
      )}
    </>
  )
}

export default ExpandableCharacterCard
