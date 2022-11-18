const config = require('config')

const db = require('../src/db')(config)
config.db = db
const api = require('../src/api')(config)

const resourceType = { id: '01GJ691VXEPQYS198W9F9AV0FQ', name: 'Lastenfahrrad' }
api.createResourceType(resourceType)

const type = resourceType.id
const resources = [
  { name: 'Lastenfahrrad 1' },
  { name: 'Lastenfahrrad 2' },
]
resources.forEach((props) => {
  api.createResource(type, { props })
})
