let db = require('./db.js')

//db.all('DROP TABLE users;')
//db.all('CREATE TABLE users (username TEXT, password TEXT, token TEXT);')
async function run(){
    await db.init()
    console.log('Database ');
    db.db.run('CREATE TABLE users (username TEXT, password TEXT, token TEXT);')
}
run()