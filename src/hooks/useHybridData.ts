import { UseQueryResult, type UseMutationResult } from '@tanstack/react-query'
import { ls } from '@utils/storage'
import { useEffect, useMemo } from 'react'

function getLocalData<T>(queryData: T | undefined, key: string): T | null {
  if (queryData) return queryData
  // else console.log(`Get local ${key} data`)
  const data = ls.getString(key)
  if (data) return JSON.parse(data)
  return null
}

export function setLocalData<T>(data: T, key: string) {
  if (data) {
    // console.log(`Set local ${key} data`)
    ls.set(key, JSON.stringify(data))
  }
}

export default function useHybridData<T>(query: UseQueryResult<T, Error> | UseMutationResult<T, Error>, key: string): T | null {
  useEffect(() => {
    setLocalData(query.data, key)
  }, [query.data, key])
  return useMemo(() => getLocalData<T>(query.data, key), [key, query.data])
}

export function useLocalData<T>(key: string): T | null {
  return useMemo(() => getLocalData<T>(undefined, key), [key])
}
