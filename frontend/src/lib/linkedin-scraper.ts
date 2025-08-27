interface LinkedInProfile {
  name: string
  headline: string
  profilePhoto: string
  publicIdentifier: string
}

export async function scrapeLinkedInProfile(cookie: string, userAgent: string): Promise<LinkedInProfile | null> {
  try {
    // First, get the current user's profile data from LinkedIn's API
    const response = await fetch('/api/linkedin/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cookie,
        userAgent,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch profile data')
    }

    const profileData = await response.json()
    return profileData
  } catch (error) {
    console.error('Error scraping LinkedIn profile:', error)
    return null
  }
}

export function parseLinkedInCookies(cookieString: string): Record<string, string> {
  const cookies: Record<string, string> = {}
  
  cookieString.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=')
    if (name && value) {
      cookies[name] = value
    }
  })
  
  return cookies
} 