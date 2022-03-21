const mysqlLib = require('../lib/mysql');
const fs = require('fs');

notesService = {
  getOfUser: async function(userId) {
    if (!userId) {
      return [];
    }
    const pathImage = (__dirname + '/../assets/images/');
    const notes = await (
      mysqlLib
      .select(
        [
          (
            'CONCAT(' +
              'COALESCE(u.firstname, ""), ' +
              '" ", ' +
              'COALESCE(u.lastname, "")' +
            ') userName'
          ),
          'DATE_FORMAT(n.created_on, "%Y-%m-%d") createdDate',
          'n.id',
          'n.title',
          'n.content',
          'n.image_name imageName',
        ],
        [
          'note n',
          'JOIN user u ON u.id = n.user_id',
        ],
        [
          ['n.status', 1],
          'AND',
          ['n.public', 1],
          'AND',
          ['n.user_id', '?'],
          'AND',
          ['u.status', 1],
        ],
        [userId],
        [
          'ORDER BY n.id DESC',
        ]
      )
      .then(notesResult => notesResult)
      .catch(err => console.log(err))
    );

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

    const noteAutosaveId = await this.getAutosaveId(userId);
    if (noteAutosaveId) {
      this.updateAutosave(noteAutosaveId);
    }

    return (noteId || 0);
  },
  getAutosaveId: async function(userId) {
    const noteAutosave = await (
      mysqlLib
      .selectRow(
        ['id'],
        ['note_autosave'],
        [
          ['user_id', '?']
        ],
        [userId]
      )
      .then(noteAutosave => noteAutosave)
      .catch(err => console.log(err))
    );

    return (noteAutosave ? noteAutosave.id : 0);
  },
  getAutosave: async function(userId) {
    const noteAutosave = await (
      mysqlLib
      .selectRow(
        ['content'],
        ['note_autosave'],
        [
          ['user_id', '?']
        ],
        [userId]
      )
      .then(noteAutosave => noteAutosave)
      .catch(err => console.log(err))
    );

    return (noteAutosave ? noteAutosave.content : '');
  },
  createAutosave: async function(userId, content) {
    if (!userId || !content) {
      return;
    }

    const noteAutosaveId = await this.getAutosaveId(userId);
    if (noteAutosaveId) {
      this.updateAutosave(noteAutosaveId, content);
      return;
    }

    await mysqlLib.insert(
      {
        user_id: userId,
        content: content,
      },
      'note_autosave'
    );
  },
  updateAutosave: async function(noteAutosaveId, content = '') {
    if (!noteAutosaveId) {
      return;
    }
    await mysqlLib.update(
      'content = ?',
      content,
      'id = ?',
      noteAutosaveId,
      'note_autosave'
    );
  }
};

module.exports = notesService;
