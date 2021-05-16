const fetch = require('node-fetch').default

module.exports = function () {
  const response = await fetch('https://soundcloud.com')
  const text = await response.text()
  const scripts = text.matchAll(/<script.+src="(.+)">/g)

  for (const script of scripts) {
    const url = script[1]

    if (url && !url.startsWith('https://a-v2.sndcdn.com')) return

    const response = await fetch(url)
    const text = await response.text()
    const id = text.match(/client_id:\s+"([0-9a-zA-Z]{32})"/)

    if (id && typeof id[1] === 'string') return id[1]
    else continue
  }

  throw new Error('The Client ID was not found.')
}
