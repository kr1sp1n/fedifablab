module.exports = ({ db }) => {
  return (options = {}) => {
    const page = options.page || 1
    const perPage = options.perPage || 10
    const {
      totalItems
    } = db.countRowsFromTable('resource_types', 'totalItems')
    return {
      totalItems,
      items: db.getPageFromTable('resource_types', page, perPage)
    }
  }
}
