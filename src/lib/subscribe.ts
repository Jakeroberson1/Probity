/**
 * Buttondown username for the signup form. It isn't a secret: the form posts to
 * Buttondown's public embed endpoint, the same one their copy-paste form uses,
 * so no API key ever ships in the site. Empty until the account exists, and the
 * form refuses to submit while it is.
 */
export const BUTTONDOWN_USERNAME = 'probity'

export class SignupUnavailableError extends Error {}

/**
 * Add an address to the Buttondown list. The request is `no-cors`, as with
 * Buttondown's own embed form: it resolves once the request is sent and only
 * rejects on a network failure. Subscribers and exports live in Buttondown.
 */
export async function subscribe(email: string): Promise<void> {
  if (!BUTTONDOWN_USERNAME) throw new SignupUnavailableError()
  await fetch(`https://buttondown.com/api/emails/embed-subscribe/${encodeURIComponent(BUTTONDOWN_USERNAME)}`, {
    method: 'POST',
    mode: 'no-cors',
    body: new URLSearchParams({ email, embed: '1' }),
  })
}
