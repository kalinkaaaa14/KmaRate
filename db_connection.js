'use strict'

const {Pool} = require("pg");

const pool = new Pool({
    // "host": "127.0.0.1",
    "host": "92.249.117.82",
    "port": 5432,
    "user": "postgres",
    "password": "",
    "database": "KmaRate",
});


module.exports = pool;

