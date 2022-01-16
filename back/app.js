const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const {config} = require('./config/config');
const usersRoute = require('./routes/users');
const notesRoute = require('./routes/notes');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

//Routes
usersRoute(app);
notesRoute(app)

app.listen(process.env.PORT, () => {
  console.log('Servidor escuchando en el puerto', process.env.PORT);
});
