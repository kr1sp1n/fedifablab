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

  const Database = require('better-sqlite3');
  const db = new Database(dbFile, options);

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
    const statement = db.prepare(`INSERT INTO ${table} (${keys.join(',')}) VALUES (${keys.map((k) => '?').join(',')})`);
    return statement.run(Object.values(data));
  }

  const generateViews = (typeTable, table) => {
    const statement = db.prepare(`SELECT * FROM ${typeTable}`)
    const items = statement.all();
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
    const statement = `DELETE FROM ${table}`
    db.prepare(statement).run()
  }

  db.getFromTable = (table, columnName, value) => {
    const stmt = db.prepare(`SELECT ${columnName} FROM ${table} WHERE ${columnName} = ?`)
    return stmt.get(value);
  }

  db.createSchema = createSchema
  db.generateViews = generateViews
  db.insertInto = insertInto
  // setup
  db.createSchema()
  db.generateViews('resource_types', 'resources')

  return db
}