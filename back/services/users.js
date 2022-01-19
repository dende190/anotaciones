const mysqlLib = require('../lib/mysql');

usersService = {
  getAll: async function() {
    const date = new Date();
    const today = (
      date.getFullYear() +
      '-' +
      (
        date.getMonth() > 10 ?
        (date.getMonth() + 1) :
        '0' + (date.getMonth() + 1)) +
      '-' + date.getDate()
    );
    const users = await mysqlLib.get(
      (
        'SELECT ' +
          'u.id, ' +
          (
            'CONCAT(' +
              'COALESCE(u.firstname, ""), ' +
              '" ", ' +
              'COALESCE(u.lastname, "")' +
            ') name, '
          ) +
          'COUNT(n.id) notesCount ' +
        'FROM user u ' +
        (
          'LEFT JOIN ' +
            'note n ON ' +
            'n.user_id = u.id AND ' +
            'n.created_on > ? AND ' +
            'n.created_on < ? '
        ) +
        'WHERE ' +
          'u.status = 1 ' +
        'GROUP BY u.id'
      ),
      [
        (today + ' 00:00:00'),
        (today + ' 23:59:59'),
      ]
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
