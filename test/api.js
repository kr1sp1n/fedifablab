const test = require('tape');
const config = require('config')

const db = require('../src/db')(config)
config.db = db
const api = require('../src/api')(config)

test('setup', (t) => {
  db.truncateTable('resource_types')
  t.end()
});

test('api.createReourceType', async function (t) {
  t.plan(1);
  const resourceTypeName = 'TestResourceType'
  api.createResourceType({ name: resourceTypeName })
  const result = db.getFromTable('resource_types', 'name', resourceTypeName)
  t.assert(result.name === resourceTypeName)
});