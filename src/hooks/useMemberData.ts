/**
 * Hook for fetching and managing member data
 */

import { useState, useEffect, useCallback } from 'react'
import type { Member } from '../types/api'
import {
  fetchMembers,
  fetchActiveMembers,
  fetchMemberByCode,
  fetchGenerations,
  getStaticMembers,
} from '../services/memberService'

interface UseMemberDataOptions {
  /** Whether to include graduated members */
  includeGraduated?: boolean
  /** Filter by generation */
  generation?: string
  /** Whether to use static data only (no API calls) */
  staticOnly?: boolean
}

interface UseMemberDataResult {
  /** Members list */
  members: Member[]
  /** Whether data is being loaded */
  isLoading: boolean
  /** Error if any */
  error: Error | null
  /** Available generations */
  generations: string[]
  /** Refresh member data */
  refresh: () => Promise<void>
}

/**
 * Hook for fetching member data
 */
export function useMemberData(
  options: UseMemberDataOptions = {}
): UseMemberDataResult {
  const { includeGraduated = false, generation, staticOnly = false } = options

  const [members, setMembers] = useState<Member[]>([])
  const [generations, setGenerations] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Filter members based on options
  const filterMembers = useCallback(
    (allMembers: Member[]) => {
      let filtered = allMembers

      if (!includeGraduated) {
        filtered = filtered.filter((m) => !m.isGraduated)
      }

      if (generation) {
        filtered = filtered.filter((m) => m.generation === generation)
      }

      return filtered
    },
    [includeGraduated, generation]
  )

  // Initial load with hybrid approach
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Start with static data for instant display
        const staticData = getStaticMembers()
        setMembers(filterMembers(staticData))

        // Extract generations from static data
        const staticGenerations = new Set(staticData.map((m) => m.generation))
        setGenerations(Array.from(staticGenerations).sort())

        // Then fetch fresh data from API
        if (!staticOnly) {
          const [freshData, freshGenerations] = await Promise.all([
            includeGraduated ? fetchMembers() : fetchActiveMembers(),
            fetchGenerations(),
          ])

          if (freshData.length > 0) {
            setMembers(filterMembers(freshData))
            setGenerations(freshGenerations)
          }
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to load members')
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [includeGraduated, generation, staticOnly, filterMembers])

  // Refresh data
  const refresh = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const [freshData, freshGenerations] = await Promise.all([
        includeGraduated ? fetchMembers() : fetchActiveMembers(),
        fetchGenerations(),
      ])

      setMembers(filterMembers(freshData))
      setGenerations(freshGenerations)
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to refresh members')
      )
    } finally {
      setIsLoading(false)
    }
  }, [includeGraduated, filterMembers])

  return {
    members,
    isLoading,
    error,
    generations,
    refresh,
  }
}

/**
 * Hook for fetching a single member
 */
export function useMember(code: string | undefined) {
  const [member, setMember] = useState<Member | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!code) {
      setMember(null)
      setIsLoading(false)
      return
    }

    const loadMember = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Try static data first
        const staticMembers = getStaticMembers()
        const staticMember = staticMembers.find((m) => m.code === code)
        if (staticMember) {
          setMember(staticMember)
        }

        // Then try API
        const freshMember = await fetchMemberByCode(code)
        if (freshMember) {
          setMember(freshMember)
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to load member')
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadMember()
  }, [code])

  return { member, isLoading, error }
}
