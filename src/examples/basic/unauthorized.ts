import { ChronicalsActionHandler } from '../../index'

const unauthorized: ChronicalsActionHandler = async io => {
  const email = await io.input.email('Email address')

  if (!email.includes('@chronicals.com')) {
    throw new Error('Unauthorized')
  }

  const name = await io.input.text('Name')

  return {
    name,
    email,
    'Download data': 'https://chronicals.com/export.zip',
  }
}

export default unauthorized
