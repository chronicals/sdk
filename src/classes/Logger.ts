import type { SdkAlert } from '../internalRpcSchema'
import {
  detectPackageManager,
  getInstallCommand,
} from '../utils/packageManager'

export type LogLevel =
  | 'quiet'
  | 'info'
  | 'prod' /* @deprecated, alias for 'info' */
  | 'debug'

export const CHANGELOG_URL = 'https://chronicals.com/changelog'

export default class Logger {
  logLevel: LogLevel = 'info'

  constructor(logLevel?: LogLevel) {
    if (logLevel) {
      this.logLevel = logLevel
    }
  }

  /* Important messages, always emitted */
  prod(...args: any[]) {
    console.log('[Chronicals] ', ...args)
  }

  /* Same as prod, but without the [Chronicals] prefix */
  prodNoPrefix(...args: any[]) {
    console.log(...args)
  }

  /* Fatal errors or errors in user code, always emitted */
  error(...args: any[]) {
    console.error('[Chronicals] ', ...args)
  }

  /* Informational messages, not emitted in "quiet" logLevel */
  info(...args: any[]) {
    if (this.logLevel !== 'quiet') {
      console.info('[Chronicals] ', ...args)
    }
  }

  /* Same as info, but without the [Chronicals] prefix */
  infoNoPrefix(...args: any[]) {
    if (this.logLevel !== 'quiet') {
      console.log(...args)
    }
  }

  /* Non-fatal warnings, not emitted in "quiet" logLevel */
  warn(...args: any[]) {
    if (this.logLevel !== 'quiet') {
      console.warn('[Chronicals] ', ...args)
    }
  }

  /* Debugging/tracing information, only emitted in "debug" logLevel */
  debug(...args: any[]) {
    if (this.logLevel === 'debug') {
      console.debug('[Chronicals] ', ...args)
    }
  }

  handleSdkAlert(sdkAlert: SdkAlert) {
    this.infoNoPrefix()

    const WARN_EMOJI = '\u26A0\uFE0F'
    const ERROR_EMOJI = '‼️'

    const { severity, message } = sdkAlert

    switch (severity) {
      case 'INFO':
        this.info('🆕\tA new Chronicals SDK version is available.')
        if (message) {
          this.info(message)
        }
        break
      case 'WARNING':
        this.warn(
          `${WARN_EMOJI}\tThis version of the Chronicals SDK has been deprecated. Please update as soon as possible, it will not work in a future update.`
        )
        if (message) {
          this.warn(message)
        }
        break
      case 'ERROR':
        this.error(
          `${ERROR_EMOJI}\tThis version of the Chronicals SDK is no longer supported. Your app will not work until you update.`
        )
        if (message) {
          this.error(message)
        }
        break
      default:
        if (message) {
          this.prod(message)
        }
    }

    this.info("\t- See what's new at:", CHANGELOG_URL)
    this.info(
      '\t- Update now by running:',
      getInstallCommand(`@chronicles/sdk@latest`, detectPackageManager())
    )

    this.infoNoPrefix()
  }
}
