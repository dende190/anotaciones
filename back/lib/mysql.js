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
  query: function(query, params = [], row = false) {
    return new Promise((resolve, reject) => {
      this.connection.query(query, params, (err, results) => {
        if (err) {
          return reject(err);
        }

        if (row) {
          return resolve(results[0]);
        }

        resolve(results);
      });
    });
  },
  contructSelect: function(
    columns,
    form,
    wheres = [],
    others = []
  ) {
    let query = 'SELECT ';
    columns.forEach((column, index) => {
      query += (
        column +
        (
          index !== (columns.length - 1) ?
          ',' :
          ''
        ) +
        ' '
      );
    });

    query += 'FROM ';
    form.forEach(value => {
      query += (value + ' ');
    });

    if (wheres.length) {
      query += 'WHERE ';
      wheres.forEach(where => {
        if (!Array.isArray(where)) {
          query += (where.toUpperCase() + ' ');
          return;
        }

        const condition2 = where[1];
        if (Array.isArray(condition2)) {
          query += (where[0] + ' IN (');
          condition2.forEach((value, index) => {
            query += (
              value +
              (
                index !== (condition2.length - 1) ?
                ',' :
                ''
              ) +
              ' '
            );
          });
          query += ') ';
          return;
        }

        let operator = (where[2] || ' = ');
        query += (where[0] + operator + condition2 + ' ');
      });
    }

    if (others.length) {
      others.forEach(other => {
        query += (other + ' ');
      });
    }

    return query;
  },
  select: function(
    columns,
    form,
    wheres = [],
    params = [],
    others = []
  ) {
    const query = this.contructSelect(
      columns,
      form,
      wheres,
      others
    );
    return this.query(query, params);
  },
  selectRow: function(
    columns,
    form,
    wheres = [],
    params = [],
    others = []
  ) {
    const query = this.contructSelect(
      columns,
      form,
      wheres,
      others
    );
    return this.query(query, params, true);
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
  },
  update: function(set, setParam, where, whereParam, table) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `UPDATE ${table} SET ${set} WHERE ${where}`,
        [
          setParam,
          whereParam,
        ],
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
