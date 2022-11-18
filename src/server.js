const http = require('http')

module.exports = (config) => {
  const app = require('./app')(config)
  const server = http.createServer(app)
  return server
}
