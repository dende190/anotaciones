const mysqlLib = require('../lib/mysql');
const fs = require('fs');

notesService = {
  getOfUser: async function(userId) {
    if (!userId) {
      return [];
    }
    const pathImage = (__dirname + '/../assets/images/');
    const notes = await mysqlLib.get(
      (
        'SELECT ' +
          'CONCAT(' +
            'COALESCE(u.firstname, ""), ' +
            '" ", ' +
            'COALESCE(u.lastname, "")' +
          ') userName, ' +
          'DATE_FORMAT(n.created_on, "%Y-%m-%d") createdDate, ' +
          'n.id, ' +
          'n.title, ' +
          'n.content, ' +
          'n.image_name imageName ' +
        'FROM note n ' +
        'JOIN user u ON u.id = n.user_id ' +
        'WHERE ' +
          'n.status = 1 AND ' +
          'n.public = 1 AND ' +
          'n.user_id = ? AND ' +
          'u.status = 1 ' +
        'ORDER BY n.id DESC'

      ),
      [userId]
    ).then(notesResult => notesResult)
    .catch(err => console.log(err));

    return notes;
  },
  create: async function(
    userId,
    title,
    content,
    imageName
  ) {
    if (!userId || !title || !content) {
      return 0;
    }

    const noteId = await mysqlLib.insert(
      {
        title: title,
        content: content,
        user_id: userId,
        image_name: imageName,
      },
      'note'
    ).then(noteId => noteId)
    .catch(err => console.log(err));

    return (noteId || 0);
  }
};

module.exports = notesService;
