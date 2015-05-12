'use strict';

var fs = require('fs');
var q = require('q');
var qfs = require('q-io/fs');
var EventEmitter = require('events').EventEmitter;
var util = require('util')

function Note( message ) {
  this.date = new Date().getTime();
  this.message = message || '';
  this._id = _generateId();
  this._host = './lib/data/';
  this.collection = [];

  // Event Listeners
  this.modelEvents = new EventEmitter();
  this.modelEvents.on( 'addToCollection', function( item ) {
    // console.log( item );
    _addToCollection( item );
  });
  this.modelEvents.on( 'collectionDone', function( data ) {
    console.log( data );
  });
  this.modelEvents.on( 'error', function( err ) {
    console.log( err );
  })

  var self = this;

  // HELPER COLLECTION PROMISE FUNCTIONS
  var mapPromise = function( arr, iterator ) {
    var promises = arr.map(function ( el ) { return iterator( el ) })
    return q.all( promises );
  }
  var readFilePromise = function( filename ) {
    var promise = qfs.read( self._host + filename )
      .then(function( file ) {
        return JSON.parse( file );
      })
    return promise;
  }
  var removeFilePromise = function( filename ) {
    return qfs.remove( self._host + filename )
  }
  var fetchCollectionPromise = function() {
    return qfs.list( self._host )
      .then(function( list ) {
        return mapPromise( list, readFilePromise )
      })
  }
  var removeCollectionPromise = function() {
    return qfs.list( self._host )
      .then(function( list ) {
        return mapPromise( list, removeFilePromise )
      })
  }

  // Create random UUID
  function _generateId() {
    var uuid = 'Nxxyxxyxxx'.replace(/[xy]/g, function( char ) {
      var random = ( new Date().getTime() + Math.random()*16 ) % 16 | 0;
      return ( char === 'x' ? random : (random&0x3|0x8)).toString(16);
    });
    return uuid;
  }

  function _showId() {
    console.log( this._id );
  }

  function _save( response ) {
    var contents = {
      _id: self._id,
      message: self.message
    };
    var parsed = JSON.stringify( contents );
    qfs.write( self._host + self._id, parsed )
      .then(function() {
        response.json( contents );
      })
      .then( null, console.log )
      .done();
  }

  function _addToCollection( item ) {
    self.collection.push( item );
  }

  function _showCollection( response ) {
    response.json( self.collection );
  }

  function _fetchAll( response ) {
    fetchCollectionPromise()
      .then(function( collection ) {
        response.json( collection );
      })
      .then( null, console.log )
      .done();
  }

  function _fetchOne( id, response ) {
    readFilePromise( id )
      .then(function( file ) {
        response.json( file );
      })
      .then( null, console.log )
      .done();
  }

  function _remove( id, response ) {
    qfs.remove( self._host + id )
      .then(function( file ) {
        response.json('Removed: ' + file );
      })
      .then( null, console.log )
      .done();
  }

  function _removeAll( response ) {
    removeCollectionPromise()
      .then(function( data ) {
        response.json('All Removed');
        console.log( data );
      })
      .then( console.log )
      .done();
  }

  function _showMessage() {
    console.log( this.message );
  }

  function _showDate() {
    console.log( this.date );
  }

  function _switchHost( newHost ) {
    this._host = newHost;
  }

  // Expose PUBLIC API
  return {
    _switchHost: _switchHost.bind( this ),
    save: _save.bind( this ),
    showMessage: _showMessage.bind( this ),
    showDate: _showDate.bind( this ),
    id: _showId.bind( this ),
    fetchAll: _fetchAll.bind( this ),
    fetchOne: _fetchOne.bind( this ),
    remove: _remove.bind( this ),
    removeAll: _removeAll.bind( this ),
    showCollection: _showCollection.bind( this )
  };
}

module.exports = exports = Note;
