import { AccessControlDefinition } from '../internalRpcSchema.js'
import {
  ExplicitChronicalsActionDefinition,
  ChronicalsActionDefinition,
  ChronicalsActionHandler,
} from '../types.js'

export default class Action implements ExplicitChronicalsActionDefinition {
  handler: ChronicalsActionHandler
  backgroundable?: boolean
  unlisted?: boolean
  warnOnClose?: boolean
  name?: string
  description?: string
  access?: AccessControlDefinition

  constructor(
    def: ExplicitChronicalsActionDefinition | ChronicalsActionDefinition
  ) {
    if (typeof def === 'function') {
      this.handler = def
    } else {
      Object.assign(this, def)
      // to appease typescript
      this.handler = def.handler
    }
  }
}
