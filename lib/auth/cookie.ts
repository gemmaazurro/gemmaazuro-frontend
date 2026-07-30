// Session cookie contract, shared by the route handlers and the server helpers.
//
// The token is an httpOnly cookie rather than localStorage: the storefront
// renders order history and profile in Server Components, which cannot read
// localStorage. httpOnly also keeps a 30-day token out of reach of XSS.
//
// Note the dashboard deliberately differs — it sets a readable js-cookie token
// because it is a pure client app. Do not copy that here.

export const SESSION_COOKIE = 'ga_token';

/** Django issues a 30-day HS256 token and has no refresh flow. */
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_MAX_AGE,
  };
}
