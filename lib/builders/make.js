/** @babel */

import path from 'path'
import fs from 'fs'
import Builder from '../builder'

const DEFAULT_MAKEFILE = 'Makefile'

export default class MakeBuilder extends Builder {
  executable = 'make'

  static canProcess (state) {
    return fs.existsSync(path.join(path.dirname(state.getFilePath()), DEFAULT_MAKEFILE))
  }

  canClean () {
    return true
  }

  async run (jobState) {
    const args = this.constructArgs(jobState)
    const directoryPath = path.dirname(jobState.getFilePath())
    const command = `${this.executable} ${args.join(' ')}`
    const options = this.constructChildProcessOptions(directoryPath)

    const { statusCode, stdout, stderr } = await latex.process.executeChildProcess(command, options)
    console.log("make stdout: " + stdout)
    console.log("make stderr: " + stderr)
    return statusCode
  }

  logStatusCode (statusCode, stderr) {
    switch (statusCode) {
      case 2:
        latex.log.error('make: failed. See log for details.')
        break
      default:
        super.logStatusCode(statusCode, stderr)
    }
  }

  constructArgs (jobState) {
    const args = []

    // Support standard targets (i.e. all, clean, distclean)
    // https://www.gnu.org/prep/standards/html_node/Standard-Targets.html#Standard-Targets

    if (jobState.getShouldClean()) {
      args.push('clean')
    } else if (jobState.getShouldRebuild()) {
      args.push('clean')
      args.push('all')
    } else {
      args.push('all')
    }

    return args
  }
}
