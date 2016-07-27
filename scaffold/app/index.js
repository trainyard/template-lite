const { prompt } = require('inquirer')
const { xfs, npmInstall } = require('../utils')
const kebab = require('lodash.kebabcase')
const path = require('path')

const projectPath = process.env.CHOO_PATH || process.cwd().split('/').pop()

// create initial scaffold
//   from: $choo init --template @choo/template-lite
exports.init = (argv) => {
  return prompt([{
    name: 'projectName',
    message: 'What do you want to name your project?',
    default: kebab(projectPath)
  }, {
    name: 'projectDescription',
    message: 'A brief description of your app?',
    default: ''
  }, {
    name: 'projectAuthor',
    message: 'Author Name?',
    default: ''
  }, {
    name: 'projectVersion',
    message: 'Version?',
    default: '0.0.0'
  }, {
    name: 'projectLicense',
    message: 'License',
    default: 'MIT'
  }])
}

// called from the cli once the initial configuration has completed.
exports.generate = (destinationPath, config) => {
  const templatePath = path.join(__dirname, 'templates')
  const mv = (a, b) => xfs.move(destinationPath(a), destinationPath(b))
  xfs.copyTpl(`${templatePath}/**`, destinationPath(), config.get('meta'))
  mv('gitignore', '.gitignore')
  mv('_package.json', 'package.json')
  xfs.commit(npmInstall)
}
