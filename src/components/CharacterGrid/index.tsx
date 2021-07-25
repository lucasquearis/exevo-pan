import {
  useState,
  useMemo,
  useRef,
  useEffect,
  useContext,
  useCallback,
} from 'react'
import SideDrawerContext from 'contexts/SideDrawer/context'
import CharacterCard, { CardSkeleton } from './CharacterCard'
import SortingDialog from './SortingDialog'
import { applySort } from './applySort'
import * as S from './styles'
import { CharacterGridProps } from './types'

const CharacterGrid = ({
  itemsPerPage = 10,
  characterList,
  defaultSortMode = 0,
  defaultDescendingOrder = false,
  isLoading,
  ...props
}: CharacterGridProps): JSX.Element => {
  /* @ ToDo: remove this after SideDrawer refactor*/
  const { toggleSideDrawer } = useContext(SideDrawerContext)

  const gridState = useRef<'initial' | 'processing' | 'ready'>('initial')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [sortMode, setSortMode] = useState<number>(defaultSortMode)
  const [descendingOrder, setDescendingOrder] = useState<boolean>(
    defaultDescendingOrder,
  )

  const gridRef = useRef<HTMLDivElement | null>(null)

  const sortedData = useMemo(() => {
    if (gridState.current === 'initial' && characterList.length) {
      gridState.current = 'processing'
    }
    return applySort(characterList, sortMode, descendingOrder)
  }, [characterList, sortMode, descendingOrder])

  const characterPage = useMemo(
    () =>
      sortedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
      ),
    [itemsPerPage, sortedData, currentPage],
  )

  useEffect(() => {
    if (gridState.current === 'ready') {
      setCurrentPage(1)
    } else if (gridState.current === 'processing') {
      gridState.current = 'ready'
    }
  }, [sortedData.length])

  useEffect(() => {
    if (gridState.current === 'ready') {
      setSortMode(defaultSortMode)
      setDescendingOrder(defaultDescendingOrder)
    }
  }, [defaultSortMode, defaultDescendingOrder])

  useEffect(() => {
    if (gridState.current === 'ready')
      gridRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [characterPage])

  return (
    <S.Wrapper {...props}>
      <S.Head>
        <S.FilterIcon
          aria-controls="filter-drawer"
          onClick={toggleSideDrawer}
        />
        <SortingDialog
          sortMode={sortMode}
          setSortMode={setSortMode}
          descendingOrder={descendingOrder}
          setDescendingOrder={setDescendingOrder}
        />

        <S.Paginator
          aria-controls="character-grid"
          pageSize={itemsPerPage}
          totalItems={sortedData.length}
          currentPage={currentPage}
          onChange={useCallback(
            (newPage: number) => setCurrentPage(newPage),
            [],
          )}
          noItemsMessage="No characters found"
        />
      </S.Head>

      <S.Grid ref={gridRef} id="character-grid">
        {isLoading
          ? Array.from({ length: 10 }, (_, index) => (
              <CardSkeleton key={index} />
            ))
          : characterPage.map(item => (
              <CharacterCard key={item.id} characterData={item} />
            ))}
      </S.Grid>
    </S.Wrapper>
  )
}

export default CharacterGrid
