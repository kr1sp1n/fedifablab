const fs = require('fs')
const path = require('path')
const ulid = require('ulid').ulid

module.exports = (config) => {
  const {
    dbFile
  } = config
  const options = {
    // verbose: console.log
  }

  const Database = require('better-sqlite3')
  const db = new Database(dbFile, options)

  const createSchema = () => {
    const statements = fs.readFileSync(path.join(__dirname, 'schema.sql'))
      .toString()
      .split(');') // split statements
      .map((s) => s + ');')

    // the last element is empty, so drop it:
    statements.pop()
    statements.forEach((statement) => {
      db.prepare(statement).run()
    })
  }

  const insertInto = (table, data) => {
    if (!data.id) data.id = ulid()
    const keys = Object.keys(data)
    const statement = db.prepare(`INSERT INTO ${table} (${keys.join(',')}) VALUES (${keys.map((k) => '?').join(',')})`)
    return statement.run(Object.values(data))
  }

  const generateViews = (typeTable, table) => {
    const statement = db.prepare(`SELECT * FROM ${typeTable}`)
    const items = statement.all()
    const regex = / /gi
    items.forEach((item) => {
      const name = item.name.trim().replace(regex, '')
      const statement = db.prepare(`
        CREATE VIEW IF NOT EXISTS v${name}(id, props) AS
          SELECT
            id,
            props
          FROM
            ${table}
          WHERE ${typeTable}_id LIKE '${item.id}'
      `)
      statement.run()
    })
  }

  db.truncateTable = (table) => {
    const count = db
      .prepare(`SELECT count(*) FROM sqlite_master WHERE type='table' AND name='${table}'`)
      .get()['count(*)']
    if (count === 1) {
      const statement = `DELETE FROM ${table} WHERE EXISTS (SELECT * from ${table})`
      db.prepare(statement).run()
    }
  }

  db.truncateAll = () => {
    const tables = [
      'resources',
      'resource_types',
      'events',
      'event_types',
      'agents',
      'agent_types'
    ]
    for (const table of tables) {
      db.truncateTable(table)
    }
  }

  db.getRowFromTable = (table, columnName, value) => {
    const columnValue = (typeof value === 'string' || value instanceof String) ? `'${value}'` : value
    const statement = db.prepare(`SELECT * FROM ${table} WHERE ${columnName} = ${columnValue}`)
    return statement.get()
  }

  db.getAllFromTable = (table) => {
    const statement = db.prepare(`SELECT * FROM ${table}`)
    return statement.all()
  }

  db.getPageFromTable = (table, page = 1, perPage = 10) => {
    const statement = db.prepare(`SELECT * FROM ${table} LIMIT ${perPage} OFFSET ${(page === 1) ? 0 : ((page - 1) * perPage)}`)
    return statement.all()
  }

  db.countRowsFromTable = (table, as = 'count') => {
    const statement = db.prepare(`SELECT COUNT(*) AS ${as} FROM ${table}`)
    return statement.get()
  }

  db.createSchema = createSchema
  db.generateViews = generateViews
  db.insertInto = insertInto
  // setup
  db.createSchema()
  db.generateViews('resource_types', 'resources')

  return db
}
