var hackfile = require('hackfile')
var fs = require('fs')

//TODO: dependencies
//TODO: modules
var datscript = function(src) {
  var parsed = hackfile(src)
  var pipelines = parsed.map(visit)
  var gasket = []

  pipelines.forEach(function(pipeline) {
    if (typeof pipeline[0] === "string") {
      var line = {}
      var commands = []
      pipeline[1].forEach(function(cmd) {
        commands = commands.concat(cmd.shift())
      })
      line[pipeline[0]] = commands
      gasket.push(line)
    } else {
      gasket= gasket.concat(pipeline)
    }
  })

  console.log(JSON.stringify({gasket: gasket}))
  return {gasket: gasket}
}

var constructCommand = function(keyword, cmds) {
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
    case 'pipeline':
      return ['pipeline ' + params.shift(), params.map(visit)]
    case 'run':
      return constructCommand('run', params.map(visit))
    case 'pipe':
      return constructCommand('pipe', params.map(visit))
    case 'map':
      return constructCommand('map', params.map(visit))
    case 'reduce':
      return constructCommand('reduce', params.map(visit))
    case 'background':
      return constructCommand('background', params.map(visit))
    case 'fork':
      return constructCommand('fork', params.map(visit))
    default:
      if (typeof line === "string") return line
      return cmd + " " + params.join(" ")
  }
}

module.exports = datscript
