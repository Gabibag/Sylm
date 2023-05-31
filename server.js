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
  let leaderboard = await db.getLeaderboard(setid, gameid, req.body.amount, req.body.start);
  res.send(JSON.stringify(leaderboard));
});
app.post('/api/submitscore/:setid/:gameid' , async function(req, res){
  console.log("score submitted")
  let setid = req.params.setid;
  let gameid = req.params.gameid;
  let score = req.body.score;
  let user = await db.getUserFromReq(req);
  //look through the scoreborde and see if the user has a score
  let leaderboard = await db.getLeaderboard(setid, gameid, 1, 0);
  let userScore = leaderboard.find((e) => e.user === user.username);
  if (userScore !== undefined) {
    if (userScore.score > score) {
      console.log("Score not submitted, higher score already exists: " + score + "(user: " + user.username + ")");
      return;
    } else {
      await db.changeScore(user, setid, gameid, score);
      console.log("Score updated: " + userScore.score + " -> " + score + "(user: " + user.username + ")");
      return;
    }
  }
  console.log("Score submitted: " + score + "(user: " + user.username + ")");
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
  // console.log(db.acceptableUserName(username))
  if (!await db.acceptableUserName(username)) {
    res.send("Username not acceptable");
    return;
  }
  db.addUser(username, password)
  let u = await db.getUser(username)
  res.cookie('token', u.token);
  res.send("Register success")
});
app.post('/api/availableGames', async function (req, res) {
  //check db for games
  res.send(JSON.stringify(await db.getGames()));

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
  // check if logged in
  let token = req.cookies.token
  if (token === undefined) {
    res.sendFile(__dirname + '/public/pages/index.html')
  } else {
    res.redirect('/home')
  }

});

app.get('/sets/:setid/:game/leaderboard', async function(req, res){
  let setid = req.params.setid;
  let game = req.params.game;
  try {
    let set = await db.getSet(setid);
    let file = fs.readFileSync(__dirname + '/public/pages/leaderboard.html', 'utf8')
    file = file.replace('<!--setid-->', setid),
        file = file.replace('<!--game-->', game);
    file = file.replace("<!--setname-->", set.name)
    res.setHeader('content-type', 'text/html');
    res.send(file);

  } catch (error) {
    console.log(error)
    res.sendFile(__dirname + '/public/pages/404.html')
  }
});
app.get('/styles/:f', function (req, res) {
  res.setHeader('content-type', "text/css")
  res.sendFile(__dirname + '/public/styles/' + req.params.f);

});
app.get('/javascript/:f', function (req, res) {
  res.sendFile(__dirname + '/public/javascript/' + req.params.f);

});
app.get('/sets/:setid/play/:game', async function (req, res) {
  let setid = req.params.setid;
  let game = req.params.game;
  let disallowedGames = await db.getGames()
  let gameDict = {}
  for (let g of disallowedGames) {
    gameDict[g.gameNames] = g.isAllowed
  }
  if (gameDict[game] === 0) {
    return res.sendFile(__dirname + '/public/pages/403.html')
  }
  try {

    let file = fs.readFileSync(__dirname + '/public/pages/games/' + game + '.html', 'utf8')
    let set = await db.db.get('SELECT * FROM sets WHERE id = ?', setid);
    if (set === undefined) {
      return res.sendFile("public/pages/404.html", {root: __dirname})
    }
    file = file.replace('<!--name-->', set.name);
    file = file.replace('<!--desc-->', set.desc);
    file = file.replace('<!--author-->', set.author);
    file = file.replace('<!--terms-->', set.terms);
    file = file.replace("<!--defs-->", set.defs);
    file = file.replace('<!--id-->', set.id);
    res.send(file);

  } catch (error) {
    res.sendFile(__dirname + '/public/pages/404.html')
  }
});

app.get('/:page', async function (req, res) {
  let p = req.params.page
  if (fs.existsSync(__dirname + '/public/pages/' + p + '.html')) {
    res.sendFile(__dirname + '/public/pages/' + p + '.html');

  } else if (fs.existsSync(__dirname + '/public/pages/loggedin/' + p + '.html')) {
    let b = await db.loggedIn(req)
    if (b) {
      res.sendFile(__dirname + '/public/pages/loggedin/' + p + '.html');
    }
    else {
      //TODO mention the error within the url
      res.redirect('/Login')
    }
  } else {
    res.sendFile(__dirname + '/public/pages/404.html');
  }
});
app.get('/images/:f', function (req, res) {
  res.sendFile(__dirname + '/public/images/' + req.params.f);
});
//#endregion
//#endregion
console.log('Starting server');
app.listen(3070, async function () {
  await db.init();
  console.log('Server started');
})