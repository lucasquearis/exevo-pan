import { useCharacters } from 'contexts/useDatabase'
import { AuctionsProvider } from './contexts/useAuctions'
import { FiltersProvider } from './contexts/useFilters'
import AuctionsGrid from './components/AuctionsGrid'
import CharacterGrid from './components/CharacterGrid'
import { CurrentAuctionsProps } from './types'

export const CurrentAuctions = ({
  initialAuctionData,
}: CurrentAuctionsProps): JSX.Element => {
  const { page, sortingMode, descendingOrder, ...pageData } = initialAuctionData

  return (
    <FiltersProvider>
      <AuctionsProvider
        initialPage={page}
        initialPageData={pageData}
        initialSortingMode={sortingMode}
        initialDescendingOrder={descendingOrder}
      >
        <AuctionsGrid />
      </AuctionsProvider>
    </FiltersProvider>
  )
}

export const BazaarHistory = (): JSX.Element => {
  const { historyData, loading } = useCharacters()

  return (
    <CharacterGrid
      characterList={historyData}
      defaultDescendingOrder
      isLoading={loading}
    />
  )
}
