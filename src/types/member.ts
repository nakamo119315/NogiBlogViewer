/**
 * Member type definitions
 */

export interface Member {
  code: string
  name: string
  englishName: string
  kana: string
  generation: string
  profileImage: string
  profileLink: string
  birthday: string
  bloodType: string
  isGraduated: boolean
}

export interface MemberWithStatus extends Member {
  isFavorite: boolean
  latestPostDate?: Date
}
