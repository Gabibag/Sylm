let app = require('express')()
const fs = require('fs')
const GameRunner = require('./GameRunner.js')
app.post('/api/creategame', function(req, res ){
    res.send( {'id': GameRunner.NewGame()} );
} );
app.post('/api/joingame', function(req, res ){
  //TODO
} );
app.post('/api/leavegame', function(req, res ){
  //TODO
} );
app.get('/games/:id' , function(req, res){
  let id = req.params.id
  if (GameRunner.Games[id]){
    res.send( GameRunner.Games[id] )
    return;
  }
  //TODO: 404
  res.send( "Game not found" )
} );
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
  if (fs.existsSync('./public/pages' + p)){
    res.sendFile(__dirname + '/public/pages/' + p + '.html');
  }
  res.sendFile(__dirname + 'public/pages/404.html');
});
//    /X  > public/pages/x.html
console.log('Starting server');
app.listen(8000)