const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const {config} = require('./config/config');
const usersRoute = require('./routes/users');
const notesRoute = require('./routes/notes');

// Middlewares
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: false}));
app.use(cookieParser());
app.use(cors());
app.use('/images', express.static(__dirname + '/assets/images'));

//Routes
usersRoute(app);
notesRoute(app)

app.listen(process.env.PORT, () => {
  console.log('Servidor escuchando en el puerto', process.env.PORT);
});
