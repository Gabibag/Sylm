let app = require('express')()
const fs = require('fs')


/* app.post('api/creategame', function(req, res ){

} );*/
app.get('/', function (req, res) {
    res.sendFile( __dirname + '/public/pages/index.html')
});
app.get('styles/:f', function(req, res){
  res.setHeader('content-type', "text/css")
  res.sendfile(__dirname + '/public/styles/' + f);

});
app.get('javascript/:f', function(req, res){
  res.sendfile(__dirname + '/public/javascript/' + f);

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