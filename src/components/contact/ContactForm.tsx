import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router'
import { Send, CheckCircle, Loader } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/cn'
import { apiClient, ApiError, hasPublicApiConfig } from '@/api/client'

/* Schema is defined inside the component so error messages can use t() */

/* ── Input shared styles ─────────────────────────────────── */
const INPUT_BASE =
  'w-full border border-mist bg-white px-4 py-3 font-sans text-[14px] text-carbon placeholder:text-ash focus:border-champagne focus:outline-none focus:ring-1 focus:ring-champagne transition-colors duration-200'
const INPUT_ERROR = 'border-red-400 focus:border-red-400 focus:ring-red-400'

/* ── Reusable field wrapper ──────────────────────────────── */
function Field({
  label,
  error,
  required,
  children,
}: {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-1.5 block font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-carbon/80">
        {label}
        {required && <span className="ml-1 text-champagne">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 font-sans text-[11px] text-red-500">{error}</p>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────── */

export function ContactForm() {
  const { t, i18n } = useTranslation()
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  /* Build schema using translated error messages */
  const schema = z.object({
    name: z.string().trim().min(1, t('form.errors.nameMin')).max(120, t('form.errors.nameMax')),
    email: z.string().trim().email(t('form.errors.emailInvalid')).max(254, t('form.errors.emailMax')),
    phone: z.string().max(30, t('form.errors.phoneMax')).optional(),
    subject: z.string().max(180, t('form.errors.subjectMax')).optional(),
    message: z.string().trim().min(1, t('form.errors.messageMin')).max(5000, t('form.errors.messageMax')),
    kvkk: z.boolean().refine((accepted) => accepted, t('form.errors.kvkkRequired')),
    website: z.string().max(200).optional(),
  })

  type FormValues = z.infer<typeof schema>

  const SUBJECTS = [
    { value: 'general', label: t('form.subjects.general') },
    { value: 'store', label: t('form.subjects.store') },
    { value: 'event', label: t('form.subjects.event') },
    { value: 'complaint', label: t('form.subjects.complaint') },
    { value: 'suggestion', label: t('form.subjects.suggestion') },
    { value: 'press', label: t('form.subjects.press') },
  ]

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { phone: '', subject: '', kvkk: false, website: '' },
  })

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true)
    setSubmitError('')
    try {
      if (!hasPublicApiConfig(true)) throw new Error('Contact API is not configured')
      const language = (i18n.resolvedLanguage ?? i18n.language).toLowerCase()
      const locale = language.startsWith('en') ? 'en' : 'tr'
      const subject = SUBJECTS.find((item) => item.value === data.subject)?.label ?? data.subject ?? ''
      const response = await apiClient.post<{
        success?: boolean
        data?: { accepted?: boolean; [key: string]: unknown }
        [key: string]: unknown
      }>(`/public/contact-messages?locale=${locale}`, {
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone?.trim() ?? '',
        subject: subject.trim(),
        message: data.message.trim(),
        kvkkConsent: data.kvkk === true,
        website: data.website?.trim() ?? '',
      })

      if (response?.success !== true || response.data?.accepted !== true) {
        throw new Error('Contact message was not accepted')
      }
      reset()
      setSubmitted(true)
    } catch (error) {
      setSubmitError(
        error instanceof ApiError && error.status === 429
          ? t('form.errors.rateLimit')
          : t('form.errors.sendFailed'),
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence mode="wait">
      {submitted ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-start gap-5 py-8"
        >
          <div className="flex h-14 w-14 items-center justify-center border border-[#2d6a4f] text-[#2d6a4f]">
            <CheckCircle size={26} strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="mb-2 font-display text-2xl font-light text-carbon">
              {t('form.successTitle')}
            </h3>
            <p className="font-sans text-[14px] leading-relaxed text-graphite">
              {t('form.successDesc')}
            </p>
          </div>
          <button
            onClick={() => {
              reset()
              setSubmitError('')
              setSubmitted(false)
            }}
            className="font-sans text-[12px] font-medium text-champagne underline-offset-2 hover:underline"
          >
            {t('form.newMessage')}
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5"
        >
          {/* Honeypot: hidden from people and removed from keyboard navigation. */}
          <div aria-hidden="true" className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden">
            <label>
              Website
              <input {...register('website')} type="text" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          {/* Name + Email */}
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={t('form.name')} error={errors.name?.message} required>
              <input
                {...register('name')}
                type="text"
                autoComplete="name"
                placeholder={t('form.namePlaceholder')}
                className={cn(INPUT_BASE, errors.name && INPUT_ERROR)}
              />
            </Field>
            <Field label={t('form.email')} error={errors.email?.message} required>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                placeholder={t('form.emailPlaceholder')}
                className={cn(INPUT_BASE, errors.email && INPUT_ERROR)}
              />
            </Field>
          </div>

          {/* Phone + Subject */}
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={t('form.phone')} error={errors.phone?.message}>
              <input
                {...register('phone')}
                type="tel"
                autoComplete="tel"
                placeholder={t('form.phonePlaceholder')}
                className={cn(INPUT_BASE)}
              />
            </Field>
            <Field label={t('form.subject')} error={errors.subject?.message}>
              <select
                {...register('subject')}
                className={cn(
                  INPUT_BASE,
                  'appearance-none cursor-pointer',
                  errors.subject && INPUT_ERROR,
                )}
                defaultValue=""
                style={{
                  backgroundImage:
                    'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%237a7a7a\' stroke-width=\'2\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E") no-repeat right 14px center',
                }}
              >
                <option value="" disabled>{t('form.subjectPlaceholder')}</option>
                {SUBJECTS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* Message */}
          <Field label={t('form.message')} error={errors.message?.message} required>
            <textarea
              {...register('message')}
              rows={5}
              placeholder={t('form.messagePlaceholder')}
              className={cn(INPUT_BASE, 'resize-none', errors.message && INPUT_ERROR)}
            />
          </Field>

          {/* KVKK */}
          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                {...register('kvkk')}
                type="checkbox"
                className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-champagne"
              />
              <span className="font-sans text-[12px] leading-relaxed text-graphite">
                <Link
                  to={ROUTES.KVKK}
                  className="text-champagne underline-offset-2 hover:underline"
                  target="_blank"
                >
                  {t('form.kvkkLink')}
                </Link>
                {' '}{t('form.kvkkLabel')}{' '}
                <span className="text-champagne">*</span>
              </span>
            </label>
            {errors.kvkk && (
              <p className="mt-1.5 font-sans text-[11px] text-red-500">
                {errors.kvkk.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="pt-2">
            {submitError && (
              <p role="alert" className="mb-3 font-sans text-[12px] text-red-600">
                {submitError}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className={cn(
                'group flex items-center gap-3 bg-carbon px-8 py-4 font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300',
                submitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-champagne',
              )}
            >
              {submitting ? (
                <>
                  <Loader size={14} className="animate-spin" />
                  {t('form.sending')}
                </>
              ) : (
                <>
                  <Send size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  {t('form.submit')}
                </>
              )}
            </button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  )
}
