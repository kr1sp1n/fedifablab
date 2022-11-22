module.exports = (config) => {
  const methods = [
    'createResourceType',
    'getResourceTypes',
    'createResource',
    'createAgentType'
    // 'updateResourceType',
    // 'deleteResourceType',
    // 'updateResource',
    // 'deleteResource',
    // 'createAgent',
    // 'updateAgent',
    // 'deleteAgent',
    // 'updateAgentType',
    // 'deleteAgentType',
    // 'createEvent',
    // 'deleteEvent',
  ]
  const index = {}
  methods.forEach((method) => {
    index[method] = require(`./${method}`)(config)
  })
  return index
}
