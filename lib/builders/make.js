/** @babel */

import path from 'path'
import fs from 'fs'
import Builder from '../builder'

const DEFAULT_MAKEFILE = 'Makefile'

export default class MakeBuilder extends Builder {
  executable = 'make'

  static canProcess (filePath) {
    return fs.existsSync(path.join(path.dirname(filePath), DEFAULT_MAKEFILE))
  }

  async run (filePath, jobname, shouldRebuild, shouldClean) {
    const args = this.constructArgs(filePath, jobname, shouldRebuild, shouldClean)
    const directoryPath = path.dirname(filePath)
    const command = `${this.executable} ${args.join(' ')}`
    const options = this.constructChildProcessOptions(directoryPath)

    const { statusCode, stdout, stderr } = await latex.process.executeChildProcess(command, options)
    console.log("make stdout: " + stdout)
    console.log("make stderr: " + stderr)
    return statusCode
  }

  logStatusCode (statusCode) {
    switch (statusCode) {
      case 2:
        latex.log.error('make: failed. See log for details.')
        break
      default:
        super.logStatusCode(statusCode)
    }
  }

  constructArgs (filePath, jobname, shouldRebuild, shouldClean) {
    const args = []

    // Support standard targets (i.e. all, clean, distclean)
    // https://www.gnu.org/prep/standards/html_node/Standard-Targets.html#Standard-Targets

    if (shouldClean) {
      args.push('clean')
    } else if (shouldRebuild) {
      args.push('clean')
      args.push('all')
    } else {
      args.push('all')
    }

    return args
  }
}
