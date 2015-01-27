var hackfile = require('hackfile')
var fs = require('fs')

var hackfileOutput = hackfile(fs.readFileSync('hackfile', 'utf-8'))

//TODO:  multiple pipelines
//TODO: dependencies
//TODO: modules
var pipelines = []

var constructGasket = function(keyword, cmds) {
  var gasket = []
  cmds.forEach(function(cmd) {
    gasket.push({'type': keyword, 'command': cmd})
  })
  return gasket
}

var visit = function(line) {
  var cmd = line[0]
  var params = line[1]

  switch(cmd) {
    case 'pipeline': //TODO: each pipeline is a separate gasket pipeline
      var name = params.shift()
      return 'pipeline ' + name + ' ' + params.map(visit)
    case 'run':
      return constructGasket('run', params.map(visit))
    case 'pipe':
      return constructGasket('pipe', params.map(visit))
    case 'map':
      return constructGasket('map', params.map(visit))
    case 'reduce':
      return constructGasket('reduce', params.map(visit))
    case 'background':
      return constructGasket('background', params.map(visit))
    case 'fork':
      return constructGasket('fork', params.map(visit))
    default:
      if (typeof line === "string") {
        return line
      }
      return cmd + " " + params.join(" ")
    }
  }

var output = {gasket: hackfileOutput.map(visit)[0]} //kind of hacky to grab 0th item in array

console.log("hackfile output")
console.log(JSON.stringify(hackfileOutput))
console.log("gasket.json output")
console.log(JSON.stringify(output))
