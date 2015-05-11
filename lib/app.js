'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    url = require('url'),
    path = require('url'),
    q = require('q'),
    qhttp = require('q-io/http'),
    qfs = require('q-io/fs');

// Set server port anticipating environment changes
var port = ( process.env.PORT || 3000 );

var app = express();

// Instantiate server for only API call routes
var apiRouter = express.Router();

apiRouter.use(function( error, req, res, next ) {
  console.log( 'Request: ' + req );
  if ( error ) console.error( error );
  next();
});

apiRouter.route('/pointer')
  .get(function( req, res ) {
    // Data long kept as point for unique IDs
    var log = require('./data/log.json');
    // Check last unique ID to then increment new ID up and avoid clobbering
    console.log( log[log.length - 1].accessed );
    res.json( log );
    res.end();
  });


app.use( '/api', apiRouter );

app.listen( port, function() {
  console.log( 'Server listening on port ' + port );
})
