// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

var CallData = require('./app/models/calldata')
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/calldata'); // connect to our database

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/ivr-data)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// on routes that end in /calldata
// ----------------------------------------------------
router.route('/calldata')

    // create a bear (accessed at POST http://localhost:8080/ivr-data/calldata)
    .post(function(req, res) {

        var ivrCall = new CallData();      // create a new instance of the CallData model
        ivrCall.name = req.body.name;  // set the caller's name (comes from the request)
        ivrCall.uuid = req.body.uuid;  // set the uuid of the call (comes from the request)
        ivrCall.phone = req.body.phone;  // set the caller's phone number (comes from the request)

        // save the call data and check for errors
        ivrCall.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Call created!' });
        });

    })

    // get all call data (accessed at GET http://localhost:8080/ivr-data/calldata)
    .get(function(req, res) {
        CallData.find(function(err, ivrCall) {
            if (err)
                res.send(err);

            res.json(ivrCall);
        });
    });

// on routes that end in /calldata/:uuid
// ----------------------------------------------------
router.route('/calldata/:uuid')

    // get the call with that uuid (accessed at GET http://localhost:8080/ivr-data/calldata/:uuid)
    .get(function(req, res) {
        CallData.find({ uuid: req.params.uuid }, function(err, ivrCall) {
            if (err)
                res.send(err);
            res.json(ivrCall);
        });
    });

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/ivr-data', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);