import type { Collections, PageCollections } from '@nuxt/content'

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export interface QuerySortItem {
  key: string
  order: 'ASC' | 'DESC'
}

export interface ContentQueryOptions {
  limit?: number
  skip?: number
  sort?: QuerySortItem[]
  where?: Record<string, unknown>
  enableLogging?: boolean
}

export interface SearchSectionsOptions<K extends keyof PageCollections> {
  ignoredTags?: string[]
  minHeading?: HeadingLevel
  maxHeading?: HeadingLevel
  extraFields?: Array<keyof PageCollections[K]>
  enableLogging?: boolean
}

export interface LogMetadata {
  collection: string
  key: string
  durationMs?: number
  resultCount?: number
  path?: string
  error?: string
  [key: string]: unknown
}

export function useContentQuery() {
  const log = (
    level: 'info' | 'warn' | 'error',
    message: string,
    meta: LogMetadata,
  ) => {
    const timestamp = new Date().toISOString()
    const prefix = `[ContentQuery][${meta.collection}]`

    const payload = {
      timestamp,
      message,
      ...meta,
    }

    if (level === 'info') {
      console.info(`${prefix} [INFO]  ${message}`, payload)
    } else if (level === 'warn') {
      console.warn(`${prefix} [WARN]  ${message}`, payload)
    } else {
      console.error(`${prefix} [ERROR] ${message}`, payload)
    }
  }

  const getCollection = async <K extends keyof Collections>(
    asyncKey: string,
    collectionName: K,
    options: ContentQueryOptions = {},
  ) => {
    const { limit, skip, sort, where, enableLogging = true } = options

    return useAsyncData(asyncKey, async () => {
      const startTime = performance.now()

      if (enableLogging) {
        log('info', `Fetching collection list`, {
          collection: String(collectionName),
          key: asyncKey,
          limit,
          skip,
          sort,
          where,
        })
      }

      try {
        let query = queryCollection(collectionName)

        if (where) {
          for (const [key, value] of Object.entries(where)) {
            query = query.where(key as Extract<keyof Collections[K], string>, '=', value)
          }
        }

        if (sort?.length) {
          for (const s of sort) {
            query = query.order(s.key as Extract<keyof Collections[K], string>, s.order)
          }
        }

        if (skip) {
          query = query.skip(skip)
        }

        if (limit) {
          query = query.limit(limit)
        }

        const results = await query.all()
        const durationMs = Number((performance.now() - startTime).toFixed(2))

        if (enableLogging) {
          log('info', `Successfully fetched ${results.length} items`, {
            collection: String(collectionName),
            key: asyncKey,
            resultCount: results.length,
            durationMs,
          })
        }

        return results
      } catch (err: unknown) {
        const durationMs = Number((performance.now() - startTime).toFixed(2))
        const errorMessage = err instanceof Error ? err.message : String(err)
        log('error', `Failed to fetch collection`, {
          collection: String(collectionName),
          key: asyncKey,
          durationMs,
          error: errorMessage,
        })
        throw err
      }
    })
  }

  const getByPath = async <K extends keyof Collections>(
    asyncKey: string,
    collectionName: K,
    path: string,
    options: Pick<ContentQueryOptions, 'enableLogging'> = {},
  ) => {
    const { enableLogging = true } = options

    return useAsyncData(asyncKey, async () => {
      const startTime = performance.now()

      if (enableLogging) {
        log('info', `Fetching document by path`, {
          collection: String(collectionName),
          key: asyncKey,
          path,
        })
      }

      try {
        const result = await queryCollection(collectionName).path(path).first()
        const durationMs = Number((performance.now() - startTime).toFixed(2))

        if (!result) {
          log('warn', `Document not found at path`, {
            collection: String(collectionName),
            key: asyncKey,
            path,
            durationMs,
          })
        } else if (enableLogging) {
          const docTitle = result && typeof result === 'object' && 'title' in result && typeof result.title === 'string'
            ? result.title
            : 'Untitled'

          log('info', `Document fetched successfully`, {
            collection: String(collectionName),
            key: asyncKey,
            path,
            title: docTitle,
            durationMs,
          })
        }

        return result
      } catch (err: unknown) {
        const durationMs = Number((performance.now() - startTime).toFixed(2))
        const errorMessage = err instanceof Error ? err.message : String(err)
        log('error', `Error fetching document by path`, {
          collection: String(collectionName),
          key: asyncKey,
          path,
          durationMs,
          error: errorMessage,
        })
        throw err
      }
    })
  }

  const getNavigation = async <K extends keyof PageCollections>(
    asyncKey: string,
    collectionName: K,
    fields?: Array<keyof PageCollections[K]>,
    options: Pick<ContentQueryOptions, 'enableLogging'> = {},
  ) => {
    const { enableLogging = true } = options

    return useAsyncData(asyncKey, async () => {
      const startTime = performance.now()

      if (enableLogging) {
        log('info', `Fetching collection navigation`, {
          collection: String(collectionName),
          key: asyncKey,
        })
      }

      try {
        const result = await queryCollectionNavigation(collectionName, fields)
        const durationMs = Number((performance.now() - startTime).toFixed(2))

        if (enableLogging) {
          log('info', `Navigation fetched successfully`, {
            collection: String(collectionName),
            key: asyncKey,
            durationMs,
          })
        }

        return result
      } catch (err: unknown) {
        const durationMs = Number((performance.now() - startTime).toFixed(2))
        const errorMessage = err instanceof Error ? err.message : String(err)
        log('error', `Error fetching collection navigation`, {
          collection: String(collectionName),
          key: asyncKey,
          durationMs,
          error: errorMessage,
        })
        throw err
      }
    })
  }

  const getItemSurroundings = async <K extends keyof PageCollections>(
    asyncKey: string,
    collectionName: K,
    path: string,
    surroundOptions?: NonNullable<Parameters<typeof queryCollectionItemSurroundings>[2]>,
    options: Pick<ContentQueryOptions, 'enableLogging'> = {},
  ) => {
    const { enableLogging = true } = options

    return useAsyncData(asyncKey, async () => {
      const startTime = performance.now()

      if (enableLogging) {
        log('info', `Fetching item surroundings`, {
          collection: String(collectionName),
          key: asyncKey,
          path,
        })
      }

      try {
        const result = await queryCollectionItemSurroundings(collectionName, path, surroundOptions)
        const durationMs = Number((performance.now() - startTime).toFixed(2))

        if (enableLogging) {
          log('info', `Item surroundings fetched successfully`, {
            collection: String(collectionName),
            key: asyncKey,
            path,
            durationMs,
          })
        }

        return result
      } catch (err: unknown) {
        const durationMs = Number((performance.now() - startTime).toFixed(2))
        const errorMessage = err instanceof Error ? err.message : String(err)
        log('error', `Error fetching item surroundings`, {
          collection: String(collectionName),
          key: asyncKey,
          path,
          durationMs,
          error: errorMessage,
        })
        throw err
      }
    })
  }

  /**
   * queryCollectionSearchSections wrapper with eager resolution for full-text body indexing
   */
  const getSearchSections = async <K extends keyof PageCollections>(
    asyncKey: string,
    collectionName: K,
    options: SearchSectionsOptions<K> = {},
  ) => {
    const { ignoredTags = ['style'], minHeading, maxHeading, extraFields, enableLogging = true } = options

    return useAsyncData(
      asyncKey,
      async () => {
        const startTime = performance.now()

        if (enableLogging) {
          log('info', `Fetching search sections`, {
            collection: String(collectionName),
            key: asyncKey,
          })
        }

        try {
          const result = await queryCollectionSearchSections(collectionName, {
            ignoredTags,
            minHeading,
            maxHeading,
            extraFields,
          })
          const durationMs = Number((performance.now() - startTime).toFixed(2))

          if (enableLogging) {
            log('info', `Search sections fetched successfully`, {
              collection: String(collectionName),
              key: asyncKey,
              durationMs,
            })
          }

          return result
        } catch (err: unknown) {
          const durationMs = Number((performance.now() - startTime).toFixed(2))
          const errorMessage = err instanceof Error ? err.message : String(err)
          log('error', `Error fetching search sections`, {
            collection: String(collectionName),
            key: asyncKey,
            durationMs,
            error: errorMessage,
          })
          throw err
        }
      },
    )
  }

  const searchCollection = <K extends keyof PageCollections>(
    collectionName: K | K[],
    options?: Parameters<typeof useSearchCollection>[1],
  ) => {
    return useSearchCollection(collectionName, options)
  }

  return {
    getCollection,
    getByPath,
    getNavigation,
    getItemSurroundings,
    getSearchSections,
    searchCollection,
    log,
  }
}
