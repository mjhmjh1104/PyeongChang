var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect(process.env.PYEONGCHANG_DB, { useMongoClient: true });
var db = mongoose.connection;
db.once('open', function() {
  console.log("DB connected: successfully");
});
db.on('error', function(err) {
  console.log("DB Unexpected ERROR: ", err);
});

var MainSchema = mongoose.Schema({
  Name: String,
  TVs: Number,
  TVName: [String],
  TVProperty: [{
    Name: String,
    Episodes: Number,
    Episode_day: [Number],
    Episode_start_hour: [Number],
    Episode_start_min: [Number],
    Episode_end_hour: [Number],
    Episode_end_min: [Number],
    Episode_name: [String],
    Cover_Width: Number,
    Cover_Height: Number
  }]
});
var MainData = mongoose.model('Main', MainSchema);
MainData.findOne({Name: "Main"}, function(err, data) {
  if (err) return console.log("Data Unexpected ERROR: ", err);
  if (!data) {
    MainData.create({Name: "Main", Count: 0, Title: [], Property: [] }, function(err, data) {
      if (err) return console.log("Data Unexpected ERROR: ", err);
      console.log("Data initialized: ", data);
    });
  }
});

app.use(bodyParser.json());
app.use(express.static('public'));
app.engine('html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  MainData.findOne({Name: "Main"}, function(err, data) {
  if (err) return console.log("Data Unexpected ERROR: ", err);
  res.render('main', data);
});
});

var port = process.env.PORT || 3000;
app.listen(port, function(req, res) {
  console.log('Server Running');
});
