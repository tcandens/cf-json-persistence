'use strict';


var Note = require('../lib/models/Note');
Note.prototype._switchHost = function() {
  this._host = './test/data';
}
require('../lib/app.js');

var chai = require('chai'),
    chaiHttp = require('chai-http'),
    expect = require('chai').expect;

chai.use( chaiHttp );

describe( 'API VERBS', function() {
  it( 'Should post note', function( done ) {
    chai.request('http://localhost:3000')
      .post('/api/note')
      .send({"message":"turds"})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body).to.have.property('_id');
        expect(res.body.message).to.eql('turds');
        done();
      })
  })

  it( 'Should get full list of notes', function( done ) {
    chai.request('http://localhost:3000')
      .get('/api/note')
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(Array.isArray( res.body )).to.eql( true );
        done();
      })
  })

});
