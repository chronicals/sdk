export default class ChronicalsError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ChronicalsError'
  }
}
