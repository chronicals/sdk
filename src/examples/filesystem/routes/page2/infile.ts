import fs from 'fs'
import { Action } from '../../../../index.js'

export default new Action(async io => {
  await io.display.code("This file's source code", {
    code: fs.readFileSync(__filename, { encoding: 'utf8' }),
  })
})
