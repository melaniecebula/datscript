##datscript

A parser for the datscript format.

Uses hackfile to parse a datscript file and output it as gasket.json

##Usage
Assuming you have a hackfile that looks like this:

```
run echo A
  echo B
  pipe echo hello
    cat
  echo C

pipeline do-stuff
  run echo 1
  run echo 2

run echo END
```

The following example (in `client.js`):

``` js
var datscript = require('./')
var fs = require('fs')

var parsed = datscript(fs.readFileSync('hackfile', 'utf-8'))
console.log(JSON.stringify(parsed, null, '\t'))
```

Then, `node client.js` prints out:

``` JSON
{
	"gasket": [
		{
			"type": "run",
			"command": "echo A"
		},
		{
			"type": "run",
			"command": "echo B"
		},
		{
			"type": "run",
			"command": [
				{
					"type": "pipe",
					"command": "echo hello"
				},
				{
					"type": "pipe",
					"command": "cat"
				}
			]
		},
		{
			"type": "run",
			"command": "echo C"
		},
		{
			"pipeline do-stuff": [
				{
					"type": "run",
					"command": "echo 1"
				},
				{
					"type": "run",
					"command": "echo 2"
				}
			]
		},
		{
			"type": "run",
			"command": "echo END"
		}
	]
}
```

NOTE:  gasket does not yet reflect this format, but this is possible future version of gasket (that supports nestings and datscript command-types)

##License
MIT
