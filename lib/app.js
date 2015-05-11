'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    url = require('url'),
    path = require('url'),
    q = require('q'),
    qhttp = require('q-io/http'),
    qfs = require('q-io/fs');


var fs = require('fs');

// Set server port anticipating environment changes
var port = ( process.env.PORT || 3000 );

var app = express();

// Instantiate server for only API call routes
var apiRouter = express.Router();

apiRouter.use( bodyParser.json() );

app.use( '/api', apiRouter );

var Note = require('./models/Note');

apiRouter.route('/note')
  .all(function( req, res, next ) {
    next();
  })
  .get(function( req, res, next ) {
    var newNote = new Note();
    newNote.fetchAll( res );
  })
  .post(function( req, res, next ) {
    var newNote = new Note( req.body.message );
    newNote.save( res );
  });

apiRouter.route('/note/:id')
  .get(function( req, res, next ) {
    var id = req.params.id;
    var newNote = new Note();
    newNote.fetchOne( id, res );
  })
  .delete(function( req, res, next ) {
    var id = req.params.id;
    var newNote = new Note();
    newNote.remove( id, res );
  })


app.listen( port, function() {
  console.log( 'Server listening on port ' + port );
});
