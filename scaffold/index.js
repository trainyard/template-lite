const fs = require('fs')
const app = require('./app')

exports.init = app.init
exports.generate = app.generate

// add functions, used only after init is true
exports.add = () => {
  const arg = process.env.CHOO_CMD_ARGS[0]
  // Where command was:
  //    $ choo add {arg}
  switch (arg) {
    case 'element':
      return require('./element')
    case 'model':
      return require('./model')
    case 'view':
      return require('./view')
    default:
      // display help file
      return console.log(fs.readFileSync('./usage.txt').toString())
  }
}

