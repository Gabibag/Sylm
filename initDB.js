let db = require("./db.js");
const mode = "start";
//db.all('DROP TABLE users;')
async function run() {
  await db.init();
  if (mode === "start") {
    await db.db.run('CREATE TABLE users (username TEXT, password TEXT, token TEXT);')
    await db.db.run('CREATE TABLE sets (id TEXT, name TEXT, desc TEXT, author TEXT, terms TEXT, defs TEXT);')
    await db.db.run('CREATE TABLE games (gameNames TEXT, isAllowed INT);')
    await db.db.run('CREATE TABLE scores (setid TEXT, game TEXT, score INT, user TEXT);')
    console.log("created tables")
    //fill games with default games
    await db.db.run('INSERT INTO games (gameNames, isAllowed) VALUES (?, ?)', ["astronomerrush", 1])
    await db.db.run('INSERT INTO games (gameNames, isAllowed) VALUES (?, ?)', ["study", 1])
    await db.db.run('INSERT INTO games (gameNames, isAllowed) VALUES (?, ?)', ["dragmatch", 1])
  } else if (mode === 'clean') {
    let s = await db.db.all('SELECT * FROM sets');
    console.log(s)
    for (let v of s) {
      if ((v.defs.match(//g) || []).length !== (v.terms.match(//g) || []).length) {
        console.log(v)
        await db.db.run('DELETE FROM sets WHERE id = ?', [v.id])
      }
    }
    console.log("Database edited successfully")
  }
}
run();
