const express = require('express');
const loginServices = require('../services/login');
const usersServices = require('../services/users');
const jwt = require('jsonwebtoken');
const jwtKey = 'z3FZjftGDWCr7N';

function usersRoute(app) {
  const router = express.Router();
  app.use('/usuario', router);

  router.post('/iniciar_sesion', async (req, res, next) => {
    const userData = await loginServices.authUser(req.body);
    if (!Object.values(userData).length) {
      res.json({login: false});
      return;
    }

    const token = jwt.sign(
      userData,
      jwtKey,
      {expiresIn: '1d'}
    );

    res.status(200).json({login: true, token: token});
  });

  router.post('/registrarse', async (req, res, next) => {
    const userData = await loginServices.registrate(req.body);
    if (!Object.values(userData).length) {
      res.json({login: false});
      return;
    }

    const token = jwt.sign(
      userData,
      jwtKey,
      {expiresIn: '1d'}
    );

    res.status(200).json({login: true, token: token});
  });

  router.post('/obtener_listado', async (req, res, next) => {
    if (!req.body.token) {
      res.status(301).json({error: true});
      return;
    }

    const userList = await usersServices.getAll();
    res.status(200).json(userList);
  });

  router.post('/obtener_notas', async (req, res, next) => {
    if (!req.body.token) {
      res.status(301).json({error: true});
      return;
    }

    const notes = await usersServices.getNotes(req.body.userId);
    res.status(200).json({notes, userName: notes[0].userName});
  });

  router.post('/cerrar_sesion', async (req, res, next) => {
    if (!req.body.token) {
      res.status(301).json({error: true});
      return;
    }

    const notes = await usersServices.getNotes(req.body.userId);
    res.status(200).json({notes, userName: notes[0].userName});
  });
}

module.exports = usersRoute;
