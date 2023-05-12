let db = require('./db.js').db
//db.all('DROP TABLE users;')
db.all('CREATE TABLE users (username TEXT, password TEXT, token TEXT);')
    
