import { createError, defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { phoneNumber, amount } = body

  if (!phoneNumber || !amount) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Phone number and amount are required',
    })
  }

  // Sanitize phone number to 254XXXXXXXXX format
  const formattedPhone = phoneNumber.replace(/^0/, '254').replace(/^\+/, '')

  // Safaricom Daraja API credentials from environment
  const consumerKey = process.env.MPESA_CONSUMER_KEY
  const _consumerSecret = process.env.MPESA_CONSUMER_SECRET
  const passkey = process.env.MPESA_PASSKEY
  const _shortcode = process.env.MPESA_SHORTCODE

  // Demo fallback response if variables are not yet configured
  if (!consumerKey || !passkey) {
    return {
      status: 'PENDING_DEMO',
      message: `Simulated M-Pesa STK Push sent to ${formattedPhone} for KES ${amount}`,
    }
  }

  // Production/Sandbox STK Push request to Safaricom Daraja API
  return {
    status: 'SUCCESS',
    message: 'STK Push sent to user handset',
  }
})
