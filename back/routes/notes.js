const express = require('express');
const notesService = require('../services/notes');
const jwt = require('jsonwebtoken');

function notesRoute(app) {
  const router = express.Router();
  app.use('/nota', router);

  router.post('/obtener', async (req, res, next) => {
    if (!req.body.token) {
      res.status(301).json({error: true});
      return;
    }

    const notes = await notesService.getOfUser(req.body.userId);
    if (!notes.length) {
      res.status(201).json({notes: []});
      return;
    }

    res.status(200).json({notes, userName: notes[0].userName});
  });

  router.post('/crear', async (req, res, next) => {
    if (!req.body.token) {
      res.status(301).json({error: true});
      return;
    }

    const userData = jwt.decode(req.body.token);
    const userId = userData.id;
    const noteData = req.body.noteData;
    let noteId = 0;
    try {
      noteId = await (
        notesService
        .create(
          userId,
          noteData.title,
          noteData.content,
          noteData.imageName,
          noteData.image
        )
      );
    } catch (error) {
      return res.status(400).send({
         message: error,
      });
    }

    if (!noteId) {
      res.status(301).json({error: true});
      return;
    }

    res.status(200).json({userId: userId});
  });
}

module.exports = notesRoute;
