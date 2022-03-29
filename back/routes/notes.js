const express = require('express');
const notesService = require('../services/notes');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'assets/images')
  },
  filename: function (req, file, callback) {
    const date = new Date();
    const today = (
      date.getFullYear() +
      '-' +
      (
        date.getMonth() > 10 ?
        (date.getMonth() + 1) :
        ('0' + (date.getMonth() + 1))
      ) +
      '-' +
      date.getDate() +
      '-' +
      date.getHours() +
      '-' +
      date.getMinutes() +
      '-' +
      date.getSeconds()
    );
    const fileName = file.originalname.match(/^(.+)(\.\w{3,4})$/)[1]
    callback(
      null,
      (
        fileName +
        '-' +
        today +
        '.' +
        file.mimetype.split('/')[1]
      )
    );
  }
})
const upload = multer({ storage: storage })

function notesRoute(app) {
  const router = express.Router();
  app.use('/nota', router);

  router.post('/obtener', async (req, res, next) => {
    if (!req.body.token) {
      res.status(301).json({error: true});
      return;
    }

    const userData = jwt.decode(req.body.token);
    const userLogged = parseInt(req.body.userId) === parseInt(userData.id);
    const notes = await notesService.getOfUser(req.body.userId, userLogged);
    if (!notes.length) {
      res.status(201).json({notes: []});
      return;
    }

    res.status(200).json({notes, userName: notes[0].userName, userLogged});
  });

  router.post('/crear', upload.single('image'), async (req, res, next) => {
    if (!req.body.token) {
      res.status(301).json({error: true});
      return;
    }

    const userData = jwt.decode(req.body.token);
    const userId = userData.id;
    const noteData = req.body;
    let noteId = 0;
    let imageName = '';
    if (req.file) {
      imageName = req.file.filename
    }

    try {
      noteId = await (
        notesService
        .create(
          userId,
          noteData.title,
          noteData.content,
          noteData.public,
          imageName
        )
      );
    } catch (error) {
      return res.status(400).json({
         message: error,
      });
    }

    if (!noteId) {
      res.status(301).json({error: true});
      return;
    }

    res.status(200).json({userId: userId});
  });

  router.post('/obtener_auto_guardado', async (req, res, next) => {
    if (!req.body.token) {
      res.status(301).json({error: true});
      return;
    }

    const userData = jwt.decode(req.body.token);
    const content = await notesService.getAutosave(userData.id);
    res.status(200).json(content);
  });

  router.post('/auto_guardar', async (req, res, next) => {
    if (!req.body.token) {
      res.status(301).json({error: true});
      return;
    }

    const userData = jwt.decode(req.body.token);
    await notesService.createAutosave(userData.id, req.body.content);
    res.status(200).json();
  });

  router.post('/cambiar_privacidad', async (req, res, next) => {
    if (!req.body.token) {
      res.status(301).json({error: true});
      return;
    }

    const userData = jwt.decode(req.body.token);
    const noteData = req.body;
    if (parseInt(userData.id) !== parseInt(noteData.userId)) {
      res.status(301).json();
      return;
    }
    await notesService.changePrivacy(noteData.noteId, noteData.public);
    res.status(200).json();
  });
}

module.exports = notesRoute;
