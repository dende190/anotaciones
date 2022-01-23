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
          'u.status = 1'
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
    imageName,
    imageBase64 = null
  ) {
    if (!userId || !title || !content) {
      return 0;
    }

    if (imageBase64) {
      await this.saveImage(imageName, imageBase64)
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
  },
  saveImage: async function(imageName, imageBase64) {
    const matches = imageBase64.match(/^data:.+\/(.+);base64,(.*)$/);
    const extention = matches[1];
    const buffer = new Buffer.from(matches[2], 'base64');
    const pathSaveImage = (__dirname + '/../assets/images/' + imageName);
    return fs.writeFileSync(pathSaveImage, buffer, function (err) {
      if (err) {
        console.log(err);
        return false;
      }

      return true;
    });
  }
};

module.exports = notesService;
