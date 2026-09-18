import { useState, type FormEvent } from 'react'
import { SubmitButton } from '@/components/threeui'
import { nextCall } from '@/lib/catalysts'
import { formatShortDate } from '@/lib/dates'
import { EMAIL } from '@/lib/site'
import { SignupUnavailableError, subscribe } from '@/lib/subscribe'

type Status = 'idle' | 'sending' | 'done' | 'error'

function successMessage() {
  const call = nextCall()
  return call
    ? `You're in. The ${call.briefName} brief lands before ${formatShortDate(call.date)}.`
    : "You're in. You'll get the next brief as soon as it's out."
}

/** Email capture: "Get the next brief free." Posts to Buttondown. */
export function SubscribeForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'sending') return
    const email = String(new FormData(e.currentTarget).get('email') ?? '').trim()
    setStatus('sending')
    try {
      await subscribe(email)
      setStatus('done')
    } catch (err) {
      setError(
        err instanceof SignupUnavailableError
          ? `Signups open soon. Until then, email ${EMAIL} and we'll add you.`
          : `That didn't go through. Try again, or email ${EMAIL}.`,
      )
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <p className="subscribe__done" role="status">
        {successMessage()}
      </p>
    )
  }

  return (
    <form className="subscribe" onSubmit={onSubmit}>
      <label className="subscribe__label" htmlFor="subscribe-email">
        Get the next brief free.
      </label>
      <div className="subscribe__row">
        <input
          id="subscribe-email"
          className="subscribe__input"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
        />
        <SubmitButton label={status === 'sending' ? 'Sending…' : 'Send me the briefs'} disabled={status === 'sending'} />
      </div>
      {status === 'error' && (
        <p className="subscribe__error" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}
