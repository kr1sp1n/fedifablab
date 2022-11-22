const test = require('tape')
const config = require('config')
const request = require('supertest')

const db = require('../../src/db')(config)
const app = require('../../src/app')(config)
config.db = db
const api = require('../../src/api')(config)

const agent = request.agent(app)
agent.set('Accept', 'application/json')

function setup () {
  db.truncateAll()
}

const resourceTypeName = 'TestResourceType'

// Show metadata of api
test('GET /api', async (t) => {
  t.plan(9)
  const routes = [
    'resource_types',
    'event_types',
    'agent_types',
    'resources',
    'events',
    'agents'
  ]
  const res = await agent
    .get('/api')
    .expect(200)
  t.equal(res.body.endpoint, config.apiEndpoint)
  t.ok(res.body.routes)
  t.equal(res.body.routes.length, 6)
  for (const route of routes) {
    t.ok(res.body.routes.includes(`${config.apiEndpoint}/${route}`))
  }
})

test('GET /api/resource_types', async (t) => {
  setup()
  t.plan(1)
  const resourceTypes = [
    'Resource Type 1',
    'Resource Type 2'
  ]
  resourceTypes.forEach((typeName) => {
    api.createResourceType({ name: typeName })
  })
  const res = await agent
    .get('/api/resource_types')
    .expect(200)
  t.ok(res.body)
})

test('POST /api/resource_types', async (t) => {
  setup()
  t.plan(2)
  const res = await agent
    .post('/api/resource_types')
    .send({ name: resourceTypeName })
    .expect(201)
  t.ok(res.body.id)
  t.equal(res.body.name, resourceTypeName)
})

test('POST /api/resources', async (t) => {
  setup()
  api.createResourceType({ name: resourceTypeName })

  t.plan(3)
  const testResourceProps = {
    name: 'Test Resource'
  }
  const res = await agent
    .post('/api/resources')
    .send({ type: resourceTypeName, props: testResourceProps })
    .expect(201)
  t.ok(res.body.id)
  t.ok(res.body.type)
  t.ok(res.body.props.name)
})

test('POST /api/agent_types', async (t) => {
  setup()
  t.plan(2)
  const agentTypeName = 'Admin'
  const res = await agent
    .post('/api/agent_types')
    .send({ name: agentTypeName })
    .expect(201)
  t.ok(res.body.id)
  t.equal(res.body.name, agentTypeName)
})
