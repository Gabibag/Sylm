let app = require('express')()
const fs = require('fs')
const db = require('./db.js')

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.post('/Register', function (req, res) {
  console.log('Register attempt')
  let username = req.body.username
  let password = req.body.password
  //prevent sql injection
  username = username.replace(/[^a-zA-Z0-9]/g, '')
  password = password.replace(/[^a-zA-Z0-9]/g, '')
  db.addUser(username, password)
  console.log('Register attempt: ' + username + ' ' + password)
});
app.post('/Login', function (req, res) {
  console.log('Login attempt') 
  let username = req.body.username
  let password = req.body.password
  if(db.vaildUser(username, password)){
    console.log('Login success')
    res.cookie('token', db.getToken(username, password))
    res.send("Login success")
  }else{
    console.log('Login failed')
    res.send("Login failed")
    //todo errors
  }
  console.log('Login attempt: ' + username + ' ' + password)
});
app.get('/', function (req, res) {
    res.sendFile( __dirname + '/public/pages/index.html')
});
app.get('styles/:f', function(req, res){
  res.setHeader('content-type', "text/css")
  res.sendfile(__dirname + '/public/styles/' + f);

});
app.get('javascript/:f', function(req, res){
  res.sendFile(__dirname + '/public/javascript/' + f);

});
app.get('/:page', function (req, res) {
   let p = req.params.page
   console.log('Page request: '+  (__dirname + '/public/pages/' + p + '.html'))
  try {
    res.sendFile(__dirname + '/public/pages/' + p + '.html'); 
  } catch (error) {
    console.log(error)
    //res.sendFile(__dirname + 'public/pages/404.html');
}
  //res.sendFile(__dirname + 'public/pages/404.html');
});
//    /X  > public/pages/x.html
console.log('Starting server');
app.listen(8000)
console.log('Server started');