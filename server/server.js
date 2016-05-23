var express = require('express');
var cfenv = require('cfenv');
var cors = require('cors');
var axios = require('axios');
var Promise = require('bluebird');
var bodyParser = require('body-parser');

// create a new express server
var app = express();
app.use(bodyParser.json({limit: '10mb'}));
app.use(cors());

app.get('/', function (req, res) {
    res.send('Hello World');
});

app.get('/jadwal', function(req, res) {
    axios.get('https://0c5db71b-64b3-4889-8704-9e0798202763-bluemix.cloudant.com/trainerplayer/_all_docs')
        .then(function(response) {
            var data = response.data;
            Promise.all(data.rows.map(function(item) {
                return axios.get('https://0c5db71b-64b3-4889-8704-9e0798202763-bluemix.cloudant.com/trainerplayer/' + item.id)
                    .then(function(response) {
                        var data = response.data;
                        return data;
                    });
            })).then(function(results) {
                res.json(results);
            });
        });
});

app.post('/jadwal', function(req, res) {
    axios.post('https://0c5db71b-64b3-4889-8704-9e0798202763-bluemix.cloudant.com/trainerplayer', {
        jam: req.body.jam,
        kegiatan: req.body.kegiatan,
        done: req.body.done
    }).then(function(response) {
        var data = response.data;
        res.json(data);
    });
})
// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, appEnv.bind, function() {

    // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
