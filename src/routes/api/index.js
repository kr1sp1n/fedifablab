const express = require('express')
const router = express.Router()

module.exports = (config) => {
  const db = require('../../db')(config)
  config.db = db
  const api = require('./../../api')(config)
  // console.log(api)

  router.post('/resource_types', (req, res) => {
    console.log(req.body)
    res.send()
  })

  return router
}