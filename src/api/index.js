module.exports = (config) => {
  return {
    createResourceType: require('./createResourceType')(config),
    // updateResourceType,
    // deleteResourceType,
    createResource: require('./createResource')(config),
    // updateResource,
    // deleteResource,
    // createAgent,
    // updateAgent,
    // deleteAgent,
    // createAgentType,
    // updateAgentType,
    // deleteAgentType,
    // createEvent,
    // deleteEvent,
  }
}