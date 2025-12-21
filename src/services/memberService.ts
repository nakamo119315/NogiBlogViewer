/**
 * Member service for fetching member data
 */

import type { ApiMemberResponse, Member } from '../types/api'
import { fetchJSONP, buildApiUrl } from './api'
import { mapApiMemberEntries } from './mappers'
import { API_ENDPOINTS } from '../types/api'
import staticMembersData from '../data/members.json'

/**
 * Fetch all members from the official API
 */
export async function fetchMembers(): Promise<Member[]> {
  try {
    const url = buildApiUrl(API_ENDPOINTS.MEMBER_LIST, {
      rw: 100,
    })
    const response = await fetchJSONP<ApiMemberResponse>(url)
    return mapApiMemberEntries(response.data)
  } catch (error) {
    console.error('Failed to fetch members from API:', error)
    // Fallback to static data
    return getStaticMembers()
  }
}

/**
 * Fetch active (non-graduated) members only
 */
export async function fetchActiveMembers(): Promise<Member[]> {
  const members = await fetchMembers()
  return members.filter((member) => !member.isGraduated)
}

/**
 * Fetch members by generation
 */
export async function fetchMembersByGeneration(
  generation: string
): Promise<Member[]> {
  const members = await fetchMembers()
  return members.filter((member) => member.generation === generation)
}

/**
 * Find a specific member by code
 */
export async function fetchMemberByCode(
  code: string
): Promise<Member | undefined> {
  const members = await fetchMembers()
  return members.find((member) => member.code === code)
}

/**
 * Get static member data (fallback)
 */
export function getStaticMembers(): Member[] {
  return staticMembersData.data.map((m) => ({
    code: m.code,
    name: m.name,
    englishName: m.englishName,
    kana: m.kana,
    generation: m.generation,
    profileImage: m.profileImage,
    profileLink: m.profileLink,
    birthday: m.birthday,
    bloodType: m.bloodType,
    isGraduated: m.isGraduated,
  }))
}

/**
 * Get all unique generations from members
 */
export async function fetchGenerations(): Promise<string[]> {
  const members = await fetchMembers()
  const generations = new Set(
    members.map((m) => m.generation).filter((g) => g && g.trim() !== '')
  )
  return Array.from(generations).sort()
}
