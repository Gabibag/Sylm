let app = require('express')()
const fs = require('fs')
const db = require('./db.js')
const util = require('./util.js')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
app.use(bodyParser.json());
app.use(cookieParser());

//#region routes
//#region api
app.post('/api/search/:query', async function (req, res) {
  console.log("Searching for " + req.params.query);
  let query = req.params.query;
  let body = req.body;

  let sets = await db.searchSets(query, body.amount, body.start);
  res.send(JSON.stringify(sets));
});
app.get('/api/mysets', async function (req, res) {
  let user = await db.getUserFromReq(req);
  let sets = await db.getSets(user);
  res.send(JSON.stringify(sets));
});
app.post('/api/getleaderboard/:setid/:gameid', async function(req, res){
  let setid = req.params.setid;
  let gameid = req.params.gameid;
  let leaderboard = await db.getLeaderboard(setid, gameid);
  res.send(JSON.stringify(leaderboard));
});
app.post('/api/submitscore/:setid/:gameid' , async function(req, res){
  let setid = req.params.setid;
  let gameid = req.params.gameid;
  let score = req.body.score;
  let user = await db.getUserFromReq(req);
  console.log("Submitting score" + user + " " + setid + " " + gameid + " " + score)
  await db.submitScore(user, setid, gameid, score);
});
app.post('/api/createset',async function(req, res){
  let user = await db.getUserFromReq(req);
  let data = req.body
  res.send(await db.createSet(user, data));

});
app.post('/api/getset/:id', async function(req, res){
  let id = req.params.id;
  let set = await db.getSet(id);
  res.send(JSON.stringify(set));
});
app.post('/Register', async function (req, res) {
  let username = req.body.username
  let password = req.body.password
  console.log('Register: ' + username + ' ' + password)
  if (!db.acceptablePassword(password)) {
    res.send("Password not acceptable");
    return;
  }
  console.log(db.acceptableUserName(username))
  if (! await db.acceptableUserName(username)) {
    res.send("Username not acceptable");
    return;
  }
  db.addUser(username, password)
  let u = await db.getUser(username)
  res.cookie('token', u.token);
  res.send("Register success")
});
app.post('/login', async function (req, res) {
  let username = req.body.username
  let password = req.body.password
  console.log('Login attempt via ' + username + ' ' + password)
  let user = await db.getUser(username)
  if (user === undefined) {
    res.send("Username not found")
    return;
  }
  if (user.password !== password) {
    res.send("Password incorrect")
    return;
  }
  let token = db.getToken(username, password)
  res.cookie('token', token)
  res.send("Login success")
});
//#endregion
//#region pages
app.get('/search/:query', async function(req, res){
  let query = req.params.query;
  let file = fs.readFileSync(__dirname + '/public/pages/search.html', 'utf8')
  res.setHeader('content-type', 'text/html')
  res.send(file);
});
app.get('/sets/:setid', async function(req, res){
  let setid = req.params.setid;
  let file = fs.readFileSync(__dirname + '/public/pages/set.html', 'utf8')
  let set = await db.db.get('SELECT * FROM sets WHERE id = ?', setid);
  if(set === undefined){
    return res.sendFile("public/pages/404.html", {root: __dirname})
  }
  file = file.replace('<!--id-->', setid);
  file = file.replace('<!--name-->', set.name);
  file = file.replace('<!--desc-->', set.desc);
  file = file.replace('<!--author-->', set.author);
  file = file.replace('<!--data-->', set.data);
  res.setHeader('content-type', 'text/html')
  res.send(file);
});
app.get('/Logout', function (req, res) {
  res.clearCookie('token')
  res.redirect('/')
});
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/pages/index.html')
});
app.get('/sets/:setid/:game/leaderboard', async function(req, res){
  let setid = req.params.setid;
  let game = req.params.game;
  let file = fs.readFileSync(__dirname + '/public/pages/leaderboard.html', 'utf8')
  file = file.replace('<!--setid-->', setid);
  file = file.replace('<!--game-->', game);
  res.setHeader('content-type', 'text/html');
  res.send(file);
});
app.get('/styles/:f', function (req, res) {
  res.setHeader('content-type', "text/css")
  res.sendFile(__dirname + '/public/styles/' + req.params.f);

});
app.get('/javascript/:f', function (req, res) {
  res.sendFile(__dirname + '/public/javascript/' + req.params.f);

});
app.get('/sets/:setid/play/:game', async function(req, res){
  let setid = req.params.setid;
  let game = req.params.game;
  let file = fs.readFileSync(__dirname + '/public/pages/games/' +game + '.html', 'utf8')
  let set = await db.db.get('SELECT * FROM sets WHERE id = ?', setid);
  if(set === undefined){
    return res.sendFile("public/pages/404.html", {root: __dirname})
  }
  file = file.replace('<!--name-->', set.name);
  file = file.replace('<!--desc-->', set.desc);
  file = file.replace('<!--author-->', set.author);
  file = file.replace('<!--terms-->', set.terms);
  file = file.replace("<!--defs-->", set.defs);
  file = file.replace('<!--id-->', set.id);
  res.send(file);
});

app.get('/:page', async function (req, res) {
  console.lo
  let p = req.params.page
  if (fs.existsSync(__dirname + '/public/pages/' + p + '.html')) {
    console.log('unlogged page')
    res.sendFile(__dirname + '/public/pages/' + p + '.html');
    return;
  } else if (fs.existsSync(__dirname + '/public/pages/loggedin/' + p + '.html')) {
    let b = await db.loggedIn(req)
    if (b) {
      res.sendFile(__dirname + '/public/pages/loggedin/' + p + '.html');
    }
    else {
      //TODO mention the error within the url
      res.redirect('/Login')
    }
  }
  else {
    res.sendFile(__dirname + '/public/pages/404.html');
  }
});
app.get('/images/:f', function (req, res) {
  res.sendFile(__dirname + '/public/images/' + req.params.f);
});
//#endregion
//#endregion
console.log('Starting server');
app.listen(8000, async function () {
  await db.init();
})
console.log('Server started');