const config = require('config')

const {
  port
} = config

const server = require('./server')(config)

server.listen(port, () => {
  console.log('fedifablab server listening on port ' + port)
})
