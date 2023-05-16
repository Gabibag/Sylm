let db = require('./db.js')

//db.all('DROP TABLE users;')
//db.all('CREATE TABLE users (username TEXT, password TEXT, token TEXT);')
async function run(){
    await db.init()
 //   await db.db.run('DROP TABLE sets;')
  db.db.run('CREATE TABLE users (username TEXT, password TEXT, token TEXT);')
  db.db.run('CREATE TABLE sets (id TEXT, name TEXT, desc TEXT, author TEXT, data TEXT);')
   // let b = await db.db.get('SELECT * FROM users')
  //  console.log(b)
}
run()