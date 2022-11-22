const scheme = process.env.SCHEME || 'http'
const port = process.env.PORT || 3000
const domain = process.env.DOMAIN || `localhost:${port}`

module.exports = {
  port,
  instanceName: process.env.INSTANCE_NAME || 'fedifablab',
  dbFile: process.env.DB_FILE || 'fedifablab.sqlite3',
  scheme,
  domain,
  apiEndpoint: `${scheme}://${domain}/api`
}
