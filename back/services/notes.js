const mysqlLib = require('../lib/mysql');

notesService = {
  getOfUser: async function(userId) {
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
  },
  create: async function(title, content, userId) {
    if (!title || !content || !userId) {
      return 0;
    }

    const noteId = await mysqlLib.insert(
      {
        title: title,
        content: content,
        user_id: userId,
      },
      'note'
    ).then(noteId => noteId)
    .catch(err => console.log(err));
    if (!noteId) {
      return 0;
    }

    return noteId;
  }
};

module.exports = notesService;
