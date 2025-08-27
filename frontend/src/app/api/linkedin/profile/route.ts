import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { cookie, userAgent } = await request.json()

    if (!cookie || !userAgent) {
      return NextResponse.json(
        { error: 'Cookie and user agent are required' },
        { status: 400 }
      )
    }

    // Make a request to LinkedIn's profile API endpoint
    const linkedinResponse = await fetch('https://www.linkedin.com/voyager/api/me', {
      headers: {
        'Cookie': cookie,
        'User-Agent': userAgent,
        'Accept': 'application/vnd.linkedin.normalized+json+2.1',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'csrf-token': extractCsrfToken(cookie),
        'x-restli-protocol-version': '2.0.0',
      },
    })

    if (!linkedinResponse.ok) {
      console.error('LinkedIn API error:', linkedinResponse.status, linkedinResponse.statusText)
      return NextResponse.json(
        { error: 'Failed to fetch profile data from LinkedIn' },
        { status: linkedinResponse.status }
      )
    }

    const data = await linkedinResponse.json()
    
    // Extract profile information from LinkedIn's response
    const profile = {
      name: `${data.firstName} ${data.lastName}`,
      headline: data.headline || 'No headline available',
      profilePhoto: data.profilePicture?.displayImageReference?.vectorImage?.rootUrl 
        ? `${data.profilePicture.displayImageReference.vectorImage.rootUrl}${data.profilePicture.displayImageReference.vectorImage.artifacts[0].fileIdentifyingUrlPathSegment}`
        : '/default-avatar.png',
      publicIdentifier: data.publicIdentifier || '',
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error in profile API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function extractCsrfToken(cookieString: string): string {
  const match = cookieString.match(/JSESSIONID="([^"]+)"/)
  return match ? match[1].replace('ajax:', '') : ''
} 