'use strict';

var fs = require('fs');
var qfs = require('q-io/fs');

function Note( message ) {
  this.date = new Date().getTime();
  this.message = message;
  this._id = _generateId();
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

  function _save() {
    var contents = {
      _id: self._id,
      message: self.message
    };
    qfs.append('./data/log.json', JSON.stringify( contents ) )
      .then(function( data ) {
        console.log( data.toString() );
      })
      .then( null, console.log )
      .done();
  }

  function _fetchAll() {
    qfs.read('./data/log.json')
      .then( JSON.parse )
      .then( console.log )
      .then( null, console.log )
      .done();
  }

  function _showMessage() {
    console.log( this.message );
  }

  function _showDate() {
    console.log( this.date );
  }

  return {
    save: _save.bind( this ),
    showMessage: _showMessage.bind( this ),
    showDate: _showDate.bind( this ),
    id: _showId.bind( this ),
    fetchAll: _fetchAll.bind( this )
  };
}

Note.prototype.fetchAll = function() {
  qfs.read('./data/log.json')
    .then( JSON.parse )
    .then( console.log )
    .then( null, console.log )
    .done();
};

module.exports = exports = Note;
