import { createError, defineEventHandler, getRequestHeader, getRequestIP, readBody } from 'h3'
import nodemailer from 'nodemailer'
import { useRuntimeConfig } from '#imports'

interface ContactPayload {
  name: string
  email: string
  phone?: string
  inquiryType: string
  subject?: string
  message: string
  turnstileToken?: string
  websiteUrl?: string
}

const rateLimitMap = new Map<string, number[]>()
const RATE_WINDOW = 15 * 60 * 1000
const MAX_REQUESTS = 3

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody<ContactPayload>(event)

  if (body.websiteUrl) {
    return { success: true, message: 'Message sent successfully.' }
  }

  const clientIp = getRequestHeader(event, 'x-forwarded-for') || getRequestIP(event) || '127.0.0.1'
  const now = Date.now()
  const timestamps = (rateLimitMap.get(clientIp) || []).filter(t => now - t < RATE_WINDOW)

  if (timestamps.length >= MAX_REQUESTS) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too many submissions. Please wait 15 minutes before sending another message.',
    })
  }
  rateLimitMap.set(clientIp, [...timestamps, now])

  if (!body.turnstileToken) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Security check incomplete. Please complete the captcha.',
    })
  }

  const verifyResult = await verifyTurnstileToken(body.turnstileToken, event)
  if (!verifyResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Security verification failed. Please refresh and try again.',
    })
  }

  if (!body.name || !body.email || !body.message) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Please complete all required fields (Name, Email, Message).',
    })
  }

  const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/
  if (!emailRegex.test(body.email)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Please enter a valid email address.',
    })
  }

  if (config.smtpHost && config.smtpUser && config.smtpPass) {
    const transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: Number(config.smtpPort) || 587,
      secure: Number(config.smtpPort) === 465,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass,
      },
    })

    const subjectLine = `[Yard Inquiry] ${body.inquiryType}: ${body.subject || 'New Contact Request'}`
    const htmlContent = `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #65a30d; margin-top: 0;">Recreation Yard Limited</h2>
        <p style="color: #4b5563; font-size: 14px;">You have received a new inquiry from the website contact form.</p>

        <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <p style="margin: 4px 0; font-size: 13px;"><strong>Name:</strong> ${body.name}</p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Email:</strong> <a href="mailto:${body.email}">${body.email}</a></p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Phone:</strong> ${body.phone || 'Not provided'}</p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Inquiry Type:</strong> ${body.inquiryType}</p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Subject:</strong> ${body.subject || 'N/A'}</p>
        </div>

        <h3 style="font-size: 14px; color: #111827; margin-bottom: 8px;">Message:</h3>
        <p style="white-space: pre-wrap; background-color: #f3f4f6; padding: 16px; border-radius: 8px; font-size: 13px; color: #1f2937;">${body.message}</p>

        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="font-size: 11px; color: #9ca3af; text-align: center;">Sent from Recreation Yard Limited Website • IP: ${clientIp}</p>
      </div>
    `

    try {
      await transporter.sendMail({
        from: `"${body.name}" <${config.smtpFrom}>`,
        to: config.contactRecipient,
        replyTo: body.email,
        subject: subjectLine,
        html: htmlContent,
      })
    } catch (err: any) {
      console.error('[SMTP Send Error]', err)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to dispatch email. Please call or email us directly.',
      })
    }
  } else {
    console.info('[Contact API Dev Submission Log]:', body)
  }

  return {
    success: true,
    message: 'Thank you! Your inquiry has been sent successfully. Our team will get back to you shortly.',
  }
})
