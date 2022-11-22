module.exports = ({ db }) => {
  return (type, data) => {
    const resourceType = db.getRowFromTable('resource_types', 'name', type)
    if (!resourceType) throw new Error(`Resource type '${type}' not found.`)
    if (!resourceType.id) throw new Error(`Resource type '${type}' has no id.`)
    const dbData = {
      resource_types_id: resourceType.id
    }
    if (data.props) dbData.props = JSON.stringify(data.props)
    if (db.insertInto('resources', dbData)) {
      return {
        id: dbData.id,
        type,
        ...data
      }
    }
  }
}
