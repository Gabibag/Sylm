let db = require('./db.js')

//db.all('DROP TABLE users;')
//db.all('CREATE TABLE users (username TEXT, password TEXT, token TEXT);')
async function run(){
    await db.init()
 //   await db.db.run('DROP TABLE sets;')
  db.db.run('CREATE TABLE users (username TEXT, password TEXT, token TEXT);')
  db.db.run('CREATE TABLE sets (id TEXT, name TEXT, desc TEXT, author TEXT, terms TEXT, defs TEXT);')
  db.db.run('CREATE TABLE scores (setid TEXT, game TEXT, score INT, user TEXT);')
   // let b = await db.db.get('SELECT * FROM users')
  //  console.log(b)
}
run()