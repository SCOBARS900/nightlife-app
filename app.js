var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();


app.get('/', function(req, res, next) {
    res.write("SERVER ON!!!");
    next();
}, hellow);

function hellow(req,res,next) {
    res.write("YESS IT IS");
    res.end();
}


























app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

