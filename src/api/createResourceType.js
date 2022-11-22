module.exports = ({ db }) => {
  return (data) => {
    if (db.insertInto('resource_types', data)) return data
  }
}
