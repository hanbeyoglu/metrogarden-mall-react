import test from 'node:test'
import assert from 'node:assert/strict'
import { createAnalyticsTracker, createAnalyticsTransport, createLocationVisitGate, cleanInternalPath } from '../src/lib/analyticsCore.ts'
import { buildApiRequestHeaders } from '../src/lib/apiHeaders.ts'

function makeTracker({ consent = true, status, reject = false } = {}) {
  const sent = []
  let nextId = 0
  const track = createAnalyticsTracker({
    hasConsent: () => consent,
    send: async (payload) => {
      sent.push(payload)
      if (reject) throw new Error('mock network error')
      return { accepted: true, status }
    },
    getLocale: () => 'en',
    getOrigin: () => 'https://mall.example',
    makeId: () => `event-${++nextId}`,
  })
  return { track, sent }
}

test('sends one typed public event with a clean target path and current locale', async () => {
  const { track, sent } = makeTracker()
  await track({ entityType: 'STORE', eventType: 'STORE_CLICK', entityId: 'cms-store-42', path: '/stores/adidas?campaign=private#details', source: 'store-list' })
  assert.equal(sent.length, 1)
  assert.deepEqual(sent[0], {
    clientEventId: 'event-1', entityType: 'STORE', entityId: 'cms-store-42', eventType: 'STORE_CLICK',
    path: '/stores/adidas', locale: 'en', metadataJson: { source: 'store-list' },
  })
})

test('sends the expected endpoint and keepalive request using a mocked API client', async () => {
  const requests = []
  const send = createAnalyticsTransport(async (path, body, options) => {
    requests.push({ path, body, options })
    return { success: true, data: { accepted: true } }
  })
  const result = await send({ clientEventId: 'evt-1', entityType: 'CUSTOM', eventType: 'LINK_CLICK', path: '/stores', locale: 'tr', metadataJson: { source: 'header-menu' } })
  assert.equal(result.accepted, true)
  assert.equal(requests.length, 1)
  assert.equal(requests[0].path, '/public/analytics/track')
  assert.deepEqual(requests[0].options, { keepalive: true })
  assert.equal(requests[0].body.clientEventId, 'evt-1')
  assert.deepEqual(buildApiRequestHeaders({ publicApiKey: 'public-key', tenantId: 'tenant-1', mallId: 'mall-1' }, true), {
    Accept: 'application/json', 'Content-Type': 'application/json', 'x-api-key': 'public-key', 'x-tenant-id': 'tenant-1', 'x-mall-id': 'mall-1',
  })
})

test('suppresses StrictMode effect replay but counts a later history revisit', () => {
  const gate = createLocationVisitGate()
  assert.equal(gate.shouldTrack('home-key'), true)
  assert.equal(gate.shouldTrack('home-key'), false)
  assert.equal(gate.shouldTrack('stores-key'), true)
  assert.equal(gate.shouldTrack('home-key'), true)
})

test('does not send without consent or without the required CMS record ID', async () => {
  const denied = makeTracker({ consent: false })
  await denied.track({ entityType: 'PAGE', eventType: 'PAGE_VIEW', path: '/', source: 'route' })
  assert.equal(denied.sent.length, 0)

  const missingId = makeTracker()
  await missingId.track({ entityType: 'MOVIE_SESSION', eventType: 'MOVIE_SESSION_CLICK', path: '/cinema', source: 'cinema-list' })
  assert.equal(missingId.sent.length, 0)
})

test('uses a fresh event ID for each distinct click and stops after 429', async () => {
  const repeated = makeTracker()
  const click = { entityType: 'EVENT', eventType: 'EVENT_CLICK', entityId: 'event-cms-5', path: '/events/music', source: 'event-list' }
  await repeated.track(click)
  await repeated.track(click)
  assert.equal(repeated.sent.length, 2)
  assert.notEqual(repeated.sent[0].clientEventId, repeated.sent[1].clientEventId)

  const rateLimited = makeTracker({ status: 429 })
  await rateLimited.track(click)
  await rateLimited.track(click)
  assert.equal(rateLimited.sent.length, 1)
})

test('rejects external paths and measurement failures remain non-throwing', async () => {
  assert.equal(cleanInternalPath('https://other.example/ticket', 'https://mall.example'), null)
  assert.equal(cleanInternalPath('https://mall.example/stores/a?q=x#y', 'https://mall.example'), '/stores/a')
  const failing = makeTracker({ reject: true })
  await assert.doesNotReject(() => failing.track({ entityType: 'PAGE', eventType: 'PAGE_VIEW', path: '/', source: 'route' }))
})
