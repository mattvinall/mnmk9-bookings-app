import { withClerkMiddleware, getAuth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Set the paths that don't require the user to be signed in
const publicPaths = ['/', '/sign-in*', '/sign-up*']

const isPublic = (path: string) => {
  return publicPaths.find(x =>
    path.match(new RegExp(`^${x}$`.replace('*$', '($|/)')))
  )
}

const clerkMiddleware = withClerkMiddleware(async (request: NextRequest) => {
  if (isPublic(request.nextUrl.pathname)) {
    return NextResponse.next()
  }
  
  // if the user is not signed in redirect them to the sign in page.
  const { userId } = await getAuth(request)

  if (!userId) {
    // redirect the users to /pages/sign-in/[[...index]].ts
    const signInUrl = new URL('/sign-in', request.url)
    signInUrl.searchParams.set('redirect_url', request.url)
    return NextResponse.redirect(signInUrl.toString())
  }
  
  return NextResponse.next()
})

export default clerkMiddleware

export const config = {
  api: {
    bodyParser: false,
  },
}
