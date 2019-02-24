// LOADING MODULES
var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');



// INSTANTIATE THE APP
var app = express();

// MONGOdb SETUP
var uri = process.env.CONNECTION;
mongoose.connect(uri);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
  console.log('database opened');
});

var mySchema = new mongoose.Schema({
  userid: {type: String},
  data: {type: String}
}, {timestamps: true}, { strict: false });
var Entry = mongoose.model('Entry', mySchema);

// STATIC MIDDLEWARE
app.use(express.static('public'));
app.use('/jspsych-6', express.static(path.join(__dirname, '/jspsych-6')));

// BODY PARSING
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit:50000}));

// VIEW LOCAITON, SET UP SERVING STATIC HTML
app.set('views', (path.join(__dirname, '/public/views')));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// ROUTING
app.get('/', function (request, response) {
    response.render('experiment.html');
});
/*
app.get('/finish', function (request, response) {
  var userid = request.body.userid;
  response.redirect('www.google.com');
});

app.post('/experiment-data', function (request, response) {
  var userid = request.body.userid;
  var data = request.body.data;
  Entry.create({
    userid : request.body.userid,
    data : request.body.data,
  });
  response.end();
})
*/

// START THE SERVER
var server = app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on port %d', server.address().port);
});
