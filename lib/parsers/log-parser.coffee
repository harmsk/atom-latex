fs = require "fs-plus"
path = require "path"

outputPattern = ///
  ^Output\swritten\son\s  # Leading text.
  (.*)                    # Output path.
  \s\(.*\)\.$             # Trailing text.
  ///

module.exports =
class LogParser
  constructor: (filePath) ->
    @filePath = filePath
    @projectPath = path.dirname(filePath)

  parse: ->
    result =
      outputFilePath: null
      errors: []
      warnings: []

    for line in lines = @getLines()
      # Simplest Thing That Works™ and KISS®
      match = line.match(outputPattern)
      result.outputFilePath = path.resolve(@projectPath, match[1]) if match?

    result

  getLines: ->
    unless fs.existsSync(@filePath)
      throw new Error("No such file: #{@filePath}")

    rawFile = fs.readFileSync(@filePath, {encoding: "utf-8"})
    lines = rawFile.replace(/(\r\n)|\r/g, "\n").split("\n")