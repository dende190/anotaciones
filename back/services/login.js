const mysqlLib = require('../lib/mysql');
const bcrypt = require('bcrypt');
const saltRounds = 10;

loginService = {
  authUser: async function({email, password}) {
    if (!email || !password) {
      return {};
    }

    const user = await mysqlLib.getRow(
      (
        'SELECT ' +
          'id, ' +
          'email, ' +
          'password, ' +
          'CONCAT(COALESCE(firstname, ""), " ", COALESCE(lastname, "")) name ' +
        'FROM user ' +
        'WHERE ' +
          'email = ? AND ' +
          'status = 1'
      ),
      [email]
    ).then(userResult => userResult)
    .catch(err => console.log(err));

    if (!user) {
      return {};
    }

    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (!passwordCorrect) {
      return {};
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  },
  registrate: async function(userData) {
    if (
      !userData.firstname ||
      !userData.lastname ||
      !userData.email ||
      !userData.password ||
      !userData.passwordRepeat
    ) {
      return {};
    }

    const password = userData.password;
    if (password !== userData.passwordRepeat) {
      return {};
    }

    const passwordWithBcrypt = await bcrypt.hash(password, saltRounds);
    const userId = await mysqlLib.insert(
      {
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.email,
        password: passwordWithBcrypt,
      },
      'user'
    ).then(userId => userId)
    .catch(err => console.log(err));

    if (!userId) {
      return {};
    }

    return {
      id: userId,
      email: userData.email,
      name: (userData.firstname + ' ' + userData.lastname),
    };
  }
};

module.exports = loginService;
