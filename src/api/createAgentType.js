module.exports = ({ db }) => {
  return (data) => {
    if (db.insertInto('agent_types', data)) return data
  }
}
