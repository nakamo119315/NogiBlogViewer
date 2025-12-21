/**
 * API response mapper functions
 */

import type { ApiBlogEntry, ApiMemberEntry, BlogPost, Member } from '../types/api'
import { parseApiDate } from '../utils/date'
import { extractImagesFromHtml, normalizeImageUrl } from '../utils/image'

/**
 * Map API blog entry to internal BlogPost model
 */
export function mapApiBlogEntry(entry: ApiBlogEntry): BlogPost {
  return {
    id: entry.code,
    title: entry.title,
    content: entry.text,
    thumbnail: normalizeImageUrl(entry.img),
    publishedAt: parseApiDate(entry.date),
    link: entry.link,
    memberId: entry.arti_code,
    memberName: entry.name,
    memberImage: normalizeImageUrl(entry.artist_img),
    images: extractImagesFromHtml(entry.text),
  }
}

/**
 * Map API member entry to internal Member model
 */
export function mapApiMemberEntry(entry: ApiMemberEntry): Member {
  return {
    code: entry.code,
    name: entry.name,
    englishName: entry.english_name,
    kana: entry.kana,
    generation: entry.cate,
    profileImage: normalizeImageUrl(entry.img),
    profileLink: entry.link,
    birthday: entry.birthday,
    bloodType: entry.blood,
    isGraduated: entry.graduation === 'YES',
  }
}

/**
 * Map array of API blog entries
 */
export function mapApiBlogEntries(entries: ApiBlogEntry[]): BlogPost[] {
  return entries.map(mapApiBlogEntry)
}

/**
 * Map array of API member entries
 */
export function mapApiMemberEntries(entries: ApiMemberEntry[]): Member[] {
  return entries.map(mapApiMemberEntry)
}
