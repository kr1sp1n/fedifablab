const express = require('express')
const router = express.Router()

module.exports = (config) => {
  const db = require('../../db')(config)
  config.db = db
  const api = require('./../../api')(config)

  router.get('/', (_, res) => {
    const metadata = {
      endpoint: config.apiEndpoint,
      routes: [
       `${config.apiEndpoint}/resource_types`,
       `${config.apiEndpoint}/event_types`,
       `${config.apiEndpoint}/agent_types`,
       `${config.apiEndpoint}/resources`,
       `${config.apiEndpoint}/events`,
       `${config.apiEndpoint}/agents`
      ]
    }
    res.send(metadata)
  })

  router.get('/resource_types', (req, res) => {
    const {
      page,
      perPage
    } = req.query
    const result = api.getResourceTypes({
      page,
      perPage
    })
    res.send(result)
  })

  router.post('/resource_types', (req, res) => {
    const {
      name
    } = req.body
    const result = api.createResourceType({ name })
    res.status(201).send(result)
  })

  router.post('/resources', (req, res) => {
    const {
      type,
      props
    } = req.body
    const result = api.createResource(type, { props })
    res.status(201).send(result)
  })

  router.post('/agent_types', (req, res) => {
    const {
      name
    } = req.body
    const result = api.createAgentType({ name })
    res.status(201).send(result)
  })

  return router
}
