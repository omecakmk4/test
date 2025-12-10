import QRCode from 'qrcode'

export interface EsimData {
  qrCodeData: string
  smdpAddress: string
  activationCode: string
  iccid: string
}

export async function generateEsim(params: {
  orderId: string
  planName: string
  country: string
}): Promise<EsimData> {
  const activationCode = generateActivationCode()
  const smdpAddress = 'smdp.esimplatform.com'
  const iccid = generateICCID()

  const lpaString = `LPA:1$${smdpAddress}$${activationCode}`

  const qrCodeDataUrl = await QRCode.toDataURL(lpaString, {
    errorCorrectionLevel: 'M',
    type: 'image/png',
    width: 500,
    margin: 2,
  })

  return {
    qrCodeData: qrCodeDataUrl,
    smdpAddress,
    activationCode,
    iccid,
  }
}

function generateActivationCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 16; i++) {
    if (i > 0 && i % 4 === 0) {
      code += '-'
    }
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

function generateICCID(): string {
  let iccid = '89'
  for (let i = 0; i < 18; i++) {
    iccid += Math.floor(Math.random() * 10)
  }
  return iccid
}

export async function activateEsim(esimId: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return true
}

export async function deactivateEsim(esimId: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return true
}

export async function checkEsimStatus(iccid: string): Promise<{
  status: 'active' | 'inactive' | 'expired' | 'suspended'
  dataUsed: number
  dataTotal: number
  expiryDate: string
}> {
  await new Promise(resolve => setTimeout(resolve, 500))

  return {
    status: 'active',
    dataUsed: 2.5,
    dataTotal: 10,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  }
}
