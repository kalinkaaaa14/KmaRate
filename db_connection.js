'use strict'

const {Pool} = require("pg");

const pool = new Pool({
    // "host": "127.0.0.1",
    "host": "92.249.117.82",
    "port": 5432,
    "user": "postgres",
    "password": "hpost5t",
    "database": "KmaRate",
});

// pool.query(`
// CREATE TABLE "session" (
//   "sid" varchar NOT NULL COLLATE "default",
//   "sess" json NOT NULL,
//   "expire" timestamp(6) NOT NULL
// )
// WITH (OIDS=FALSE);
//
// ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
//
// CREATE INDEX "IDX_session_expire" ON "session" ("expire");
// `)

module.exports = pool;

