const express = require('express')
const helmet = require('helmet')
const { I18n } = require('i18n')
const path = require('path')

module.exports = (config) => {
  const apiRouter = require('./routes/api')(config)
  const app = express()

  // Used in views as variables:
  app.locals.instanceName = config.instanceName

  const i18n = new I18n({
    locales: ['en', 'de'],
    directory: path.join(__dirname, 'locales'),
    objectNotation: true
  })
  app.set('view engine', 'pug')
  app.set('views', path.join(__dirname, 'views'))
  app.use(helmet())
  app.use(i18n.init)
  app.use(express.static('public'))
  app.use(express.json())
  app.use('/api', apiRouter)

  // custom error handler:
  app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Error: ' + err.message)
  })

  app.get('/', (_, res) => {
    res.render('index', { title: 'Hey', message: 'Hello there!' })
  })

  app.get('/things', (_, res) => {
    res.render('things')
  })

  return app
}
