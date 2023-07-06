const pg = require('pg')

const pool = new pg.Pool({
    user: "postgres",
    host: "localhost",
    port : 5432,
    user: "postgres",
    password: "root",
    database: "mechworkx"
});

module.exports = pool; 