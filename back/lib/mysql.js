const mysql = require('mysql2');
const {config} = require('../config/config');
const USER = encodeURIComponent(config.dbUser);
const PASSWROD = encodeURIComponent(config.dbPassword);
const HOST = encodeURIComponent(config.dbHost);
const NAME = encodeURIComponent(config.dbName);

mysqlLib = {
  connection: [],
  connect: function() {
    if (this.connection && this.connection.connectionId) {
      return;
    }

    this.connection = mysql.createConnection({
      host: HOST,
      user: USER,
      password: PASSWROD,
      database: NAME,
    });
  },
  get: function(query, params = []) {
    return new Promise((resolve, reject) => {
      this.connection.query(query, params, (err, results) => {
        if (err) {
          return reject(err);
        }

        resolve(results);
      });
    });
  },
  getRow: function(query, params = []) {
    return new Promise((resolve, reject) => {
      this.connection.query(query, params, (err, results) => {
        if (err) {
          return reject(err);
        }

        resolve(results[0]);
      });
    });
  },
  insert: function(values, table) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `INSERT INTO ${table} SET ?`,
        values,
        (err, result) => {
          if (err) {
            return reject(err);
          }

          resolve(result.insertId);
        }
      );
    });
  }
}

try {
  mysqlLib.connect();
} catch(err) {
  console.log(err)
}

module.exports = mysqlLib;
