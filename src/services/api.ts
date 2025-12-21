/**
 * JSONP fetch utility for cross-origin API requests
 */

/**
 * Fetch data using JSONP
 * @param url - The API endpoint URL
 * @param timeout - Timeout in milliseconds (default: 10000)
 * @returns Promise with the parsed data
 */
// Queue for serializing JSONP requests (API uses fixed callback name "res")
let jsonpQueue: Promise<unknown> = Promise.resolve()

export function fetchJSONP<T>(url: string, timeout = 10000): Promise<T> {
  // Serialize requests since we must use the fixed "res" callback name
  const request = jsonpQueue.then(() => executeJSONP<T>(url, timeout))
  jsonpQueue = request.catch(() => {}) // Continue queue even if request fails
  return request
}

function executeJSONP<T>(url: string, timeout: number): Promise<T> {
  return new Promise((resolve, reject) => {
    // The Nogizaka46 API ignores the callback parameter and always uses "res"
    const callbackName = 'res'
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

    // Use the URL as-is (API ignores callback parameter anyway)
    script.src = url

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
