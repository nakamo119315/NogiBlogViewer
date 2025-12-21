/**
 * Comment service utilities
 */

/**
 * Build comment URL for official site
 */
export function buildCommentUrl(blogLink: string): string {
  const baseUrl = 'https://www.nogizaka46.com'
  return blogLink.startsWith('http') ? blogLink : `${baseUrl}${blogLink}`
}
