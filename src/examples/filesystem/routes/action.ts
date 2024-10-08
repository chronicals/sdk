import fs from 'fs'
import { ChronicalsActionDefinition } from '../../../types'

const action: ChronicalsActionDefinition = {
  name: 'File-based object-based action',
  description: 'Defined in a file, as a plain object',
  handler: async io => {
    await io.display.code("This file's source code", {
      code: fs.readFileSync(__filename, { encoding: 'utf8' }),
    })
  },
}

export default action
