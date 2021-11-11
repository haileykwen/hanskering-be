const mysql = require('mysql');

const db = mysql.createPool({
    host: 'us-cdbr-east-04.cleardb.com',
    user: 'b12baeae7407ec',
    password: 'a0ab0db4',
    database: 'heroku_3cbda1abf527e49'
})

module.exports = db;