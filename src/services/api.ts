/**
 * JSONP fetch utility for cross-origin API requests
 */

/**
 * Fetch data using JSONP
 * @param url - The API endpoint URL
 * @param timeout - Timeout in milliseconds (default: 10000)
 * @returns Promise with the parsed data
 */
export function fetchJSONP<T>(url: string, timeout = 10000): Promise<T> {
  return new Promise((resolve, reject) => {
    const callbackName = `jsonp_${Date.now()}_${Math.random().toString(36).slice(2)}`
    const script = document.createElement('script')
    let timeoutId: ReturnType<typeof setTimeout>

    // Cleanup function
    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId)
      delete (window as unknown as Record<string, unknown>)[callbackName]
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }

    // Set timeout
    timeoutId = setTimeout(() => {
      cleanup()
      reject(new Error(`JSONP request timeout after ${timeout}ms`))
    }, timeout)

    // Define callback function
    ;(window as unknown as Record<string, unknown>)[callbackName] = (data: T) => {
      cleanup()
      resolve(data)
    }

    // Handle script errors
    script.onerror = () => {
      cleanup()
      reject(new Error('JSONP request failed'))
    }

    // Build URL with callback parameter
    const separator = url.includes('?') ? '&' : '?'
    script.src = `${url}${separator}callback=${callbackName}`

    // Add script to document
    document.head.appendChild(script)
  })
}

/**
 * Build API URL with query parameters
 * @param baseUrl - Base API URL
 * @param params - Query parameters
 * @returns Complete URL string
 */
export function buildApiUrl(
  baseUrl: string,
  params: Record<string, string | number | undefined>
): string {
  const url = new URL(baseUrl)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value))
    }
  })
  return url.toString()
}
