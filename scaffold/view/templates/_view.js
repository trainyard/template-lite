/* <%= name %> */

const html = require('choo/html')
const { header, footer } = require('../elements')

module.exports = (state, prev, send) => html`
  <main>
    ${header()}
    <section class="container color-white well">
      <div style="padding: 2em; min-height: 800px">
        <h2><%= name =></h2>
      </div>
    </section>
    ${footer()}
  </main>
`
