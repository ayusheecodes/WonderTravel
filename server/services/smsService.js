const https = require('https')

const normalizePhone = (phone) => {
  const digits = `${phone}`.replace(/\D/g, '')
  if (digits.length === 10) return `+91${digits}`
  if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`
  if (digits.length > 10 && `${phone}`.startsWith('+')) return `${phone}`
  return `+${digits}`
}

const sendTwilioSms = ({ to, body }) => new Promise((resolve, reject) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_PHONE_NUMBER

  const payload = new URLSearchParams({
    To: to,
    From: from,
    Body: body,
  }).toString()

  const request = https.request({
    hostname: 'api.twilio.com',
    path: `/2010-04-01/Accounts/${accountSid}/Messages.json`,
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(payload),
    },
  }, (response) => {
    let raw = ''

    response.on('data', (chunk) => {
      raw += chunk
    })

    response.on('end', () => {
      if (response.statusCode >= 200 && response.statusCode < 300) {
        resolve()
        return
      }

      reject(new Error(`Twilio request failed with status ${response.statusCode}: ${raw}`))
    })
  })

  request.on('error', reject)
  request.write(payload)
  request.end()
})

const sendOtpSms = async ({ phone, otp }) => {
  const to = normalizePhone(phone)
  const body = `Your WonderTravel OTP is ${otp}. It expires in 5 minutes.`

  if (
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER
  ) {
    await sendTwilioSms({ to, body })
    return { mode: 'twilio' }
  }

  console.log(`[OTP][DEV] Send to ${to}: ${otp}`)
  return { mode: 'console' }
}

module.exports = {
  sendOtpSms,
}
