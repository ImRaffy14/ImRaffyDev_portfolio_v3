import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useId, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { stripUiMotion } from '@/config/debugMotion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/cn'

const WEB3FORMS_URL = 'https://api.web3forms.com/submit'

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

type FieldErrors = {
  name?: string
  email?: string
  message?: string
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

const fieldClass = cn(
  'w-full rounded-lg border border-border bg-background px-4 py-3.5 text-base text-foreground shadow-none',
  'placeholder:text-muted/55',
  'transition-[border-color,box-shadow] duration-200',
  'outline-none focus-visible:outline-none',
  'focus-visible:border-accent focus-visible:shadow-[0_0_0_3px_var(--accent-muted)]',
  'aria-[invalid=true]:border-red-500/55 dark:aria-[invalid=true]:border-red-400/45',
  'aria-[invalid=true]:shadow-[0_0_0_3px_color-mix(in_srgb,#ef4444_22%,transparent)] dark:aria-[invalid=true]:shadow-[0_0_0_3px_color-mix(in_srgb,#f87171_18%,transparent)]',
)

const labelClass = 'text-foreground/80 block text-sm font-medium tracking-tight'

const fieldGroupClass = 'flex flex-col gap-2'

type ContactFormProps = {
  className?: string
}

export function ContactForm({ className }: ContactFormProps) {
  const reducedMotion = usePrefersReducedMotion()
  const formId = useId()
  const nameId = `${formId}-name`
  const emailId = `${formId}-email`
  const messageId = `${formId}-message`

  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim() ?? ''
  const hasKey = accessKey.length > 0

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [touched, setTouched] = useState({ name: false, email: false, message: false })
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<FormStatus>('idle')
  const [apiError, setApiError] = useState('')

  const validate = useCallback(
    (n: string, e: string, m: string) => {
      const next: FieldErrors = {}
      if (!n.trim()) next.name = 'Please enter your name.'
      if (!e.trim()) next.email = 'Please enter your email.'
      else if (!emailOk(e.trim())) next.email = 'Enter a valid email address.'
      if (!m.trim()) next.message = 'Please enter a message.'
      else if (m.trim().length < 8) next.message = 'Message is too short (at least a few words).'
      return next
    },
    [],
  )

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    setTouched({ name: true, email: true, message: true })
    setApiError('')

    if (!hasKey) {
      setStatus('error')
      setApiError('Add VITE_WEB3FORMS_ACCESS_KEY to your .env file to enable sending.')
      return
    }

    const errors = validate(name, email, message)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) {
      setStatus('idle')
      return
    }

    setStatus('submitting')

    try {
      const res = await fetch(WEB3FORMS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `Portfolio inquiry from ${name.trim()}`,
          from_name: name.trim(),
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        }),
      })

      const data = (await res.json()) as { success?: boolean; message?: string }

      if (res.ok && data.success === true) {
        setStatus('success')
        setName('')
        setEmail('')
        setMessage('')
        setTouched({ name: false, email: false, message: false })
        setFieldErrors({})
        return
      }

      setStatus('error')
      setApiError(
        typeof data.message === 'string' && data.message
          ? data.message
          : 'Something went wrong. Please try again.',
      )
    } catch {
      setStatus('error')
      setApiError('Network error. Check your connection and try again.')
    }
  }

  const resetSuccess = () => {
    setStatus('idle')
    setApiError('')
  }

  const clearApiState = () => {
    setApiError('')
    setStatus((s) => (s === 'error' ? 'idle' : s))
  }

  const motionProps = reducedMotion
    ? { initial: false, animate: { opacity: 1 }, transition: { duration: 0 } }
    : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.25 } }

  const successPanel = (
    <div
      className="border-border/60 bg-foreground/2 mb-8 rounded-2xl border p-6"
      key="success"
    >
      <p className="font-display text-lg font-semibold text-foreground">Message sent</p>
      <p className="text-muted mt-2 text-sm leading-relaxed">
        Thanks for reaching out. You’ll hear back soon.
      </p>
      <Button type="button" variant="outline" size="md" className="mt-5" onClick={resetSuccess}>
        Send another message
      </Button>
    </div>
  )

  return (
    <div className={cn('max-w-xl', className)}>
      {!hasKey ? (
        <p className="text-muted bg-foreground/4 border-border/60 mb-6 rounded-xl border px-4 py-3 text-sm leading-relaxed">
          Form is in preview mode. Add{' '}
          <code className="text-foreground/90 font-mono text-xs">VITE_WEB3FORMS_ACCESS_KEY</code> to{' '}
          <code className="text-foreground/90 font-mono text-xs">.env</code> to send messages via
          Web3Forms.
        </p>
      ) : null}

      <div
        className="min-h-6"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {stripUiMotion ? (
          status === 'success' ? successPanel : null
        ) : (
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                {...motionProps}
                exit={reducedMotion ? undefined : { opacity: 0, y: -6 }}
                className="border-border/60 bg-foreground/2 mb-8 rounded-2xl border p-6"
              >
                <p className="font-display text-lg font-semibold text-foreground">Message sent</p>
                <p className="text-muted mt-2 text-sm leading-relaxed">
                  Thanks for reaching out. You’ll hear back soon.
                </p>
                <Button type="button" variant="outline" size="md" className="mt-5" onClick={resetSuccess}>
                  Send another message
                </Button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        )}
      </div>

      {status !== 'success' ? (
        <form
          onSubmit={onSubmit}
          className="space-y-6"
          aria-busy={status === 'submitting'}
          noValidate
        >
          {status === 'error' && apiError ? (
            <div
              role="alert"
              className="rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm leading-relaxed text-red-800 dark:border-red-400/40 dark:bg-red-500/15 dark:text-red-200"
            >
              {apiError}
            </div>
          ) : null}

          <div className={fieldGroupClass}>
            <label htmlFor={nameId} className={labelClass}>
              Name
            </label>
            <input
              id={nameId}
              name="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => {
                clearApiState()
                setName(e.target.value)
              }}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              aria-invalid={touched.name && Boolean(fieldErrors.name)}
              aria-describedby={touched.name && fieldErrors.name ? `${nameId}-err` : undefined}
              className={fieldClass}
              placeholder="Your name"
            />
            {touched.name && fieldErrors.name ? (
              <p id={`${nameId}-err`} className="text-xs text-red-600 dark:text-red-300">
                {fieldErrors.name}
              </p>
            ) : null}
          </div>

          <div className={fieldGroupClass}>
            <label htmlFor={emailId} className={labelClass}>
              Email
            </label>
            <input
              id={emailId}
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => {
                clearApiState()
                setEmail(e.target.value)
              }}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              aria-invalid={touched.email && Boolean(fieldErrors.email)}
              aria-describedby={touched.email && fieldErrors.email ? `${emailId}-err` : undefined}
              className={fieldClass}
              placeholder="you@example.com"
            />
            {touched.email && fieldErrors.email ? (
              <p id={`${emailId}-err`} className="text-xs text-red-600 dark:text-red-300">
                {fieldErrors.email}
              </p>
            ) : null}
          </div>

          <div className={fieldGroupClass}>
            <label htmlFor={messageId} className={labelClass}>
              Message
            </label>
            <textarea
              id={messageId}
              name="message"
              rows={5}
              value={message}
              onChange={(e) => {
                clearApiState()
                setMessage(e.target.value)
              }}
              onBlur={() => setTouched((t) => ({ ...t, message: true }))}
              aria-invalid={touched.message && Boolean(fieldErrors.message)}
              aria-describedby={
                touched.message && fieldErrors.message ? `${messageId}-err` : undefined
              }
              className={cn(fieldClass, 'min-h-32 resize-y')}
              placeholder="What would you like to discuss?"
            />
            {touched.message && fieldErrors.message ? (
              <p id={`${messageId}-err`} className="text-xs text-red-600 dark:text-red-300">
                {fieldErrors.message}
              </p>
            ) : null}
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full sm:w-auto"
            disabled={status === 'submitting' || !hasKey}
          >
            {status === 'submitting' ? 'Sending…' : 'Send message'}
          </Button>
        </form>
      ) : null}
    </div>
  )
}
