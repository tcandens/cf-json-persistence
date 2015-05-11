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
    console.log( item );
    _addToCollection( item );
  });
  this.modelEvents.on( 'collectionDone', function( data ) {
    console.log( data );
  });
  this.modelEvents.on( 'error', function( err ) {
    console.log( err );
  })

  var self = this;

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
    qfs.write( self._host + self._id, JSON.stringify( contents ) )
      .then(function() {
        response.json( contents );
      })
      .then( null, console.log )
      .done();
  }

  function _showCollection( response ) {
    response.json( self.collection );
  }

  function _fetchAll( response ) {
    qfs.list( self._host )
      .then(function( notes ) {
        notes.forEach(function( note, i ) {
          qfs.read( self._host + note )
            .then( JSON.parse )
            .then(function( note ) {
              self.modelEvents.emit( 'addToCollection', note );
            })
        });
      })
      .then( null, console.log )
      .done();
  }

  function _addToCollection( item ) {
    self.collection.push( item );
  }

  function _fetchOne( id, response, callback ) {
    qfs.list( self._host )
      .then(function( notes ) {
        notes.forEach(function( note ) {
          if ( note === id ) {
            qfs.read( self._host + id )
              .then( JSON.parse )
              .then(function( item ) {
                self.modelEvents.emit( 'addToCollection', item );
              })
              .then( null, console.log )
              .done();
          }
        })
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

  function _showMessage() {
    console.log( this.message );
  }

  function _showDate() {
    console.log( this.date );
  }

  function fetchCollection( res, callback ) {

    callback( res )
  }

  // Expose PUBLIC API
  return {
    save: _save.bind( this ),
    showMessage: _showMessage.bind( this ),
    showDate: _showDate.bind( this ),
    id: _showId.bind( this ),
    fetchAll: _fetchAll.bind( this ),
    fetchOne: _fetchOne.bind( this ),
    remove: _remove.bind( this ),
    showCollection: _showCollection.bind( this )
  };
}

module.exports = exports = Note;
