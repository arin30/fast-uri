'use strict'

const test = require('tape')
const fastURI = require('..')

test('WebSocket queries preserve additional question marks', (t) => {
  for (const scheme of ['ws', 'wss']) {
    const uri = `${scheme}://example.com/chat?a?b`
    const truncatedURI = `${scheme}://example.com/chat?a`
    const parsed = fastURI.parse(uri)

    t.equal(parsed.resourceName, '/chat?a?b', `${scheme} parse preserves the resource name`)
    t.equal(fastURI.serialize(parsed), uri, `${scheme} parsed components round-trip`)
    t.equal(
      fastURI.serialize({ scheme, host: 'example.com', resourceName: '/chat?a?b' }),
      uri,
      `${scheme} resource name serializes without truncation`
    )
    t.equal(fastURI.normalize(uri), uri, `${scheme} normalization preserves the full query`)
    t.equal(fastURI.equal(uri, truncatedURI), false, `${scheme} equality distinguishes the full query`)
  }

  t.end()
})

test('WebSocket URLs distinguish empty queries from absent queries', (t) => {
  for (const scheme of ['ws', 'wss']) {
    for (const path of ['/', '/chat']) {
      const uri = `${scheme}://example.com${path}?`
      const withoutQuery = `${scheme}://example.com${path}`
      const normalized = `${scheme}://example.com${path === '/' ? '' : path}?`
      const parsed = fastURI.parse(uri)

      t.equal(parsed.resourceName, `${path}?`, `${scheme} preserves an empty query on ${path}`)
      t.equal(fastURI.serialize(parsed), normalized, `${scheme} empty query round-trips on ${path}`)
      t.equal(fastURI.normalize(uri), normalized, `${scheme} normalization preserves an empty query on ${path}`)
      t.equal(fastURI.equal(uri, withoutQuery), false, `${scheme} distinguishes an absent query on ${path}`)
      t.equal(fastURI.parse(withoutQuery).resourceName, path, `${scheme} does not add a query on ${path}`)
    }
  }

  t.end()
})
