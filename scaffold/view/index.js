'use strict'
const esprima = require('esprima')
const escodegen = require('escodegen')
const fs = require('fs')

module.exports = require('yeoman-generator').Base.extend({
  scaffold: require('../generate')({
    category: 'views',
    templateFileName: '_view.js'
  }),
  // Inject the view into the router
  end: function () {
    // adds a new route to the routes array, which looks like:
    //                route('/myNewView', require('./views/myNewView'))
    const addRoute = `[route('/${this.targetName}', require('./views/${this.targetName}'))]`
    const injection = esprima.parse(addRoute).body[0].expression.elements[0]
    // if we cannot write to the routes for any reason we should fail silently, because
    // the view has been succesfully made.
    try {
      const routesPath = this.projectPath + '/src/routes.js'
      const routes = esprima.parse(require(routesPath))
      const injectionTarget = routes.body[0].expression.body.elements

      // duplicates will be ignored
      if (injectionTarget.find(expr => expr.arguments[0].value === injection.arguments[0].value)) {
        this.log.identical('src/routes.js')
        process.exit(0)
      }
      injectionTarget.push(injection)
      const esCodeOptions = {
        format: {
          indent: { style: '  ' },
          semicolons: false
        }
      }
      const data = 'module.exports = ' + escodegen.generate(routes, esCodeOptions) + '\n'

      // Purposely using node fs to avoid write conflict issue.
      fs.writeFile(routesPath, data, (err) => {
        if (err) {
          this.log.skip('src/routes.js')
        }
        this.log.ok('src/routes.js updated')
      })
    } catch (e) {
      this.log.skip('src/routes.js')
      if (process.env.NODE_ENV === 'test') {
        throw e
      }
      process.exit(0)
    }
  }
})
