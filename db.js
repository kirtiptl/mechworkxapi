const pg = require('pg')

// const pool = new pg.Pool({
//     user: "postgres",
//     host: "localhost",
//     port : 5432,
//     user: "postgres",
//     password: "root",
//     database: "mechworkx"
// });

const pool = new pg.Pool({
    user: "mechworkxweb",
    host: "dpg-cijalul9aq01qqi6h3u0-a",
    port : 5432,
    password: "24Eds5Yd3BRkHRHVpipW2sN3L5h88dys",
    database: "mechworkx"
});

module.exports = pool; 