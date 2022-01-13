import { createContext, useContext, useCallback, useReducer } from 'react'
import {
  DEFAULT_FILTER_OPTIONS,
  DEFAULT_PAGINATION_OPTIONS,
  DEFAULT_SORT_OPTIONS,
} from 'shared-utils/dist/contracts/BlogFilters/defaults'
import { BlogClient } from 'services'
import FetchPostReducer from './reducer'
import {
  FetchPostsReducerState,
  FetchPostsContextValues,
  FetchPostsProviderProps,
} from './types'

const defaultReducerState: FetchPostsReducerState = {
  currentIndex: 0,
  postList: [],
  filterOptions: DEFAULT_FILTER_OPTIONS,
  activeFilterCount: 0,
  sortOptions: DEFAULT_SORT_OPTIONS,
  requestStatus: 'IDLE',
}

const FetchPostsContext = createContext<FetchPostsContextValues>({
  ...defaultReducerState,
  fetchNextPage: () => Promise.resolve(),
  dispatchFetchPosts: () => {},
})

export const FetchPostsProvider = ({
  initialIndex,
  initialPosts,
  children,
}: FetchPostsProviderProps): JSX.Element => {
  const [
    {
      currentIndex,
      postList,
      filterOptions,
      activeFilterCount,
      sortOptions,
      requestStatus,
    },
    dispatch,
  ] = useReducer(FetchPostReducer, {
    ...defaultReducerState,
    currentIndex: initialIndex,
    postList: initialPosts,
  })

  const fetchNextPage = useCallback(async () => {
    dispatch({ type: 'SET_STATUS', status: 'LOADING' })

    try {
      const { page, hasNext } = await BlogClient.queryBlog({
        sortOptions,
        filterOptions,
        paginationOptions: {
          ...DEFAULT_PAGINATION_OPTIONS,
          pageIndex: currentIndex,
        },
      })

      dispatch({ type: 'APPEND_POSTS', newPosts: page, hasNext })
    } catch (error) {
      dispatch({ type: 'SET_STATUS', status: 'ERROR' })
    }
  }, [currentIndex, filterOptions, sortOptions])

  return (
    <FetchPostsContext.Provider
      value={{
        currentIndex,
        postList,
        filterOptions,
        activeFilterCount,
        sortOptions,
        requestStatus,
        fetchNextPage,
        dispatchFetchPosts: dispatch,
      }}
    >
      {children}
    </FetchPostsContext.Provider>
  )
}

export const useFetchPosts = (): FetchPostsContextValues =>
  useContext(FetchPostsContext)
