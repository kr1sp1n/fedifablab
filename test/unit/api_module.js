const test = require('tape')
const sinon = require('sinon')
const config = require('config')

const dbModule = require('../../src/db')
const apiModule = require('../../src/api')

let api
let db

const resourceTypeName = 'Test Resource Type'
const sandbox = sinon.createSandbox()

function setup (options = {}) {
  const { before, after } = options
  db = dbModule(config)
  api = apiModule({
    ...config,
    db
  })
  if (before) before()
  sandbox.spy(db)
  if (after) after()
}

function teardown () {
  sandbox.restore()
}

test('api.createResourceType', (t) => {
  setup()
  t.plan(2)
  api.createResourceType({ name: resourceTypeName })

  t.ok(db.insertInto.calledOnce)
  const result = db.getRowFromTable('resource_types', 'name', resourceTypeName)
  t.assert(result.name === resourceTypeName)
  teardown()
})

test('api.createResource', (t) => {
  let resourceType
  setup({
    before: () => {
      resourceType = api.createResourceType({ name: resourceTypeName })
    }
  })
  t.plan(4)
  const props = {
    name: 'Test Resource'
  }
  api.createResource(resourceTypeName, { props })
  t.ok(db.insertInto.calledOnce)
  const result = db.getRowFromTable('resources', 'resource_types_id', resourceType.id)
  t.ok(result.id)
  t.ok(result.props)
  const resultProps = JSON.parse(result.props)
  t.equal(resultProps.name, props.name)
  teardown()
})

test('api.createAgentType', (t) => {
  setup()
  t.plan(3)
  const agentTypeName = 'Admin'
  api.createAgentType({ name: agentTypeName })

  t.ok(db.insertInto.calledOnce)
  const result = db.getRowFromTable('agent_types', 'name', agentTypeName)
  t.ok(result.id)
  t.equal(result.name, agentTypeName)
  teardown()
})
