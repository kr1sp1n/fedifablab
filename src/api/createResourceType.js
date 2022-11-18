module.exports = ({ db }) => {
  return (data) => db.insertInto('resource_types', data)
}