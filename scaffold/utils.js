const store = require('mem-fs').create();
const xfs = require('mem-fs-editor').create(store);
const { spawn } = require('child_process')

exports.xfs = xfs

exports.npmInstall = process.env.NODE_ENV === 'test' ? () => { } : () => process.nextTick(() => {
  spawn('npm', ['install'], {
    env: process.env,
    stdio: 'inherit'
  }).on('exit', code => {
    if (code !== 0) {
      throw new Error('Error code: ' + code)
    }
  })
})

