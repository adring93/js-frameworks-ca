import { useMemo, useState } from "react"
import type { FormEvent } from "react"
type FormValues = {
  fullName: string
  subject: string
  email: string
  message: string
}

type FormErrors = Partial<Record<keyof FormValues, string>>

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {}

  if (values.fullName.trim().length < 3) errors.fullName = "Full name must be at least 3 characters"
  if (values.subject.trim().length < 3) errors.subject = "Subject must be at least 3 characters"
  if (!isValidEmail(values.email)) errors.email = "Please enter a valid email"
  if (values.message.trim().length < 10) errors.message = "Message must be at least 10 characters"

  return errors
}

export default function ContactPage() {
  const [values, setValues] = useState<FormValues>({
    fullName: "",
    subject: "",
    email: "",
    message: ""
  })

  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)

  const errors = useMemo(() => validate(values), [values])
  const hasErrors = Object.keys(errors).length > 0

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitted(true)

    if (hasErrors) {
      setTouched({
        fullName: true,
        subject: true,
        email: true,
        message: true
      })
      return
    }

    setValues({ fullName: "", subject: "", email: "", message: "" })
    setTouched({})
  }

  function showError(field: keyof FormValues) {
    return Boolean((submitted || touched[field]) && errors[field])
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <h1>Contact</h1>

      <form className="form" onSubmit={onSubmit} noValidate>
        <div className="field">
          <label className="label" htmlFor="fullName">
            Full Name
          </label>
          <input
            id="fullName"
            className={`input ${showError("fullName") ? "inputError" : ""}`}
            value={values.fullName}
            onChange={(e) => setValues((v) => ({ ...v, fullName: e.target.value }))}
            onBlur={() => setTouched((t) => ({ ...t, fullName: true }))}
          />
          {showError("fullName") && <p className="errorText">{errors.fullName}</p>}
        </div>

        <div className="field">
          <label className="label" htmlFor="subject">
            Subject
          </label>
          <input
            id="subject"
            className={`input ${showError("subject") ? "inputError" : ""}`}
            value={values.subject}
            onChange={(e) => setValues((v) => ({ ...v, subject: e.target.value }))}
            onBlur={() => setTouched((t) => ({ ...t, subject: true }))}
          />
          {showError("subject") && <p className="errorText">{errors.subject}</p>}
        </div>

        <div className="field">
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className={`input ${showError("email") ? "inputError" : ""}`}
            value={values.email}
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          />
          {showError("email") && <p className="errorText">{errors.email}</p>}
        </div>

        <div className="field">
          <label className="label" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            className={`textarea ${showError("message") ? "inputError" : ""}`}
            rows={6}
            value={values.message}
            onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
            onBlur={() => setTouched((t) => ({ ...t, message: true }))}
          />
          {showError("message") && <p className="errorText">{errors.message}</p>}
        </div>

        <button className="btn" type="submit">
          Send message
        </button>

        {!hasErrors && submitted && <p className="successText">Message sent.</p>}
      </form>
    </div>
  )
}