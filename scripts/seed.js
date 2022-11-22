const config = require('config')

const db = require('../src/db')(config)
config.db = db
const api = require('../src/api')(config)

const resourceTypes = [
  'Lastenfahrrad',
  '3D Drucker',
  'Heißluftpistole'
]

for(let i = 0; i < resourceTypes.length; i++) {
  const name = resourceTypes[i]
  const resourceType = api.createResourceType({ name })
  for (let j = 1; j <= 6; j++) {
    const props = { name: `${resourceType.name} ${j}`}
    api.createResource(resourceType.name, { props })
  }
}
