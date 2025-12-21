import { describe, it, expect } from 'vitest'
import { mapApiBlogEntry, mapApiMemberEntry, mapApiBlogEntries, mapApiMemberEntries } from './mappers'
import type { ApiBlogEntry, ApiMemberEntry } from '../types/api'

describe('mappers', () => {
  describe('mapApiBlogEntry', () => {
    it('should map API blog entry to BlogPost', () => {
      const apiEntry: ApiBlogEntry = {
        code: '123456',
        title: 'Test Blog Title',
        text: '<p>Content</p><img src="/images/photo.jpg">',
        img: '/thumbnails/thumb.jpg',
        date: '2024/01/15 12:30:00',
        link: '/s/n46/diary/123456',
        arti_code: 'member001',
        name: 'Test Member',
        artist_img: '/members/member001.jpg',
      }

      const result = mapApiBlogEntry(apiEntry)

      expect(result.id).toBe('123456')
      expect(result.title).toBe('Test Blog Title')
      expect(result.content).toContain('<p>Content</p>')
      expect(result.thumbnail).toContain('nogizaka46.com')
      expect(result.publishedAt).toBeInstanceOf(Date)
      expect(result.link).toBe('/s/n46/diary/123456')
      expect(result.memberId).toBe('member001')
      expect(result.memberName).toBe('Test Member')
      expect(result.images).toHaveLength(1)
    })

    it('should extract images from content', () => {
      const apiEntry: ApiBlogEntry = {
        code: '123',
        title: 'Multi Image',
        text: '<img src="/1.jpg"><img src="/2.jpg"><img src="/3.jpg">',
        img: '/thumb.jpg',
        date: '2024/01/15 12:00:00',
        link: '/blog',
        arti_code: 'member001',
        name: 'Member',
        artist_img: '/member.jpg',
      }

      const result = mapApiBlogEntry(apiEntry)
      expect(result.images).toHaveLength(3)
    })
  })

  describe('mapApiMemberEntry', () => {
    it('should map API member entry to Member', () => {
      const apiEntry: ApiMemberEntry = {
        code: 'member001',
        name: '山田 太郎',
        english_name: 'Taro Yamada',
        kana: 'やまだ たろう',
        cate: '1期生',
        img: '/members/member001.jpg',
        link: '/s/n46/artist/member001',
        pick: '',
        god: '',
        under: '',
        birthday: '2000年1月15日',
        blood: 'A型',
        constellation: 'やぎ座',
        graduation: 'NO',
        groupcode: '',
      }

      const result = mapApiMemberEntry(apiEntry)

      expect(result.code).toBe('member001')
      expect(result.name).toBe('山田 太郎')
      expect(result.englishName).toBe('Taro Yamada')
      expect(result.kana).toBe('やまだ たろう')
      expect(result.generation).toBe('1期生')
      expect(result.profileImage).toContain('nogizaka46.com')
      expect(result.birthday).toBe('2000年1月15日')
      expect(result.bloodType).toBe('A型')
      expect(result.isGraduated).toBe(false)
    })

    it('should mark graduated members correctly', () => {
      const apiEntry: ApiMemberEntry = {
        code: 'member002',
        name: '卒業メンバー',
        english_name: 'Graduated Member',
        kana: 'そつぎょう めんばー',
        cate: '1期生',
        img: '/member.jpg',
        link: '/member',
        pick: '',
        god: '',
        under: '',
        birthday: '1990年1月1日',
        blood: 'B型',
        constellation: 'やぎ座',
        graduation: 'YES',
        groupcode: '',
      }

      const result = mapApiMemberEntry(apiEntry)
      expect(result.isGraduated).toBe(true)
    })
  })

  describe('mapApiBlogEntries', () => {
    it('should map array of blog entries', () => {
      const entries: ApiBlogEntry[] = [
        { code: '1', title: 'Blog 1', text: '', img: '', date: '2024/01/15 12:00:00', link: '', arti_code: '', name: '', artist_img: '' },
        { code: '2', title: 'Blog 2', text: '', img: '', date: '2024/01/16 12:00:00', link: '', arti_code: '', name: '', artist_img: '' },
      ]

      const result = mapApiBlogEntries(entries)
      expect(result).toHaveLength(2)
      expect(result[0].id).toBe('1')
      expect(result[1].id).toBe('2')
    })
  })

  describe('mapApiMemberEntries', () => {
    it('should map array of member entries', () => {
      const entries: ApiMemberEntry[] = [
        { code: 'm1', name: 'Member 1', english_name: '', kana: '', cate: '', img: '', link: '', pick: '', god: '', under: '', birthday: '', blood: '', constellation: '', graduation: 'NO', groupcode: '' },
        { code: 'm2', name: 'Member 2', english_name: '', kana: '', cate: '', img: '', link: '', pick: '', god: '', under: '', birthday: '', blood: '', constellation: '', graduation: 'NO', groupcode: '' },
      ]

      const result = mapApiMemberEntries(entries)
      expect(result).toHaveLength(2)
      expect(result[0].code).toBe('m1')
      expect(result[1].code).toBe('m2')
    })
  })
})
