const mysqlLib = require('../lib/mysql');

usersService = {
  getAll: async function() {
    const users = await mysqlLib.get(
      (
        'SELECT ' +
          'id, ' +
          'CONCAT(COALESCE(firstname, ""), " ", COALESCE(lastname, "")) name ' +
        'FROM user ' +
        'WHERE ' +
          'status = 1'
      )
    ).then(usersResult => usersResult)
    .catch(err => console.log(err));

    return users;
  },
  getNotes: async function(userId) {
    if (!userId) {
      return [];
    }

    const notes = await mysqlLib.get(
      (
        'SELECT ' +
          'CONCAT(' +
            'COALESCE(u.firstname, ""), ' +
            '" ", ' +
            'COALESCE(u.lastname, "")' +
          ') userName, ' +
          'n.id, ' +
          'n.title, ' +
          'n.content, ' +
          'DATE_FORMAT(n.created_on, "%Y-%m-%d") createdDate ' +
        'FROM note n ' +
        'JOIN user u ON u.id = n.user_id ' +
        'WHERE ' +
          'n.status = 1 AND ' +
          'n.public = 1 AND ' +
          'n.user_id = ? AND ' +
          'u.status = 1'
      ),
      [userId]
    ).then(notesResult => notesResult)
    .catch(err => console.log(err));

    return notes;
  }
};

module.exports = usersService;
