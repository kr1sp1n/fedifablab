module.exports = ({ db }) => {
  return (type, data) => {
    data.resource_types_id = type
    if (data.props) data.props = JSON.stringify(data.props)
    return db.insertInto('resources', data)
  }
}