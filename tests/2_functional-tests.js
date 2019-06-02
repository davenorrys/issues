/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

const mongoose = require('mongoose')
const Issue = require('../model/issue.js')

chai.use(chaiHttp);

suite('Functional Tests', function() {
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){         
         assert.equal(res.status, 200);
         assert.equal(res.body.issue_title, 'Title')
         assert.equal(res.body.issue_text, 'text')
         assert.equal(res.body.created_by, 'Functional Test - Every field filled in')
         assert.equal(res.body.assigned_to, 'Chai and Mocha')
         assert.equal(res.body.status_text, 'In QA')
          //fill me in too!
          Issue.findOneAndDelete().exec()
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: 'Title',
            issue_text: 'text',
            created_by: 'Functional Test - Required fields filled in'
          })
          .end((err, res)=>{
            assert.equal(res.status, 200)
            assert.equal(res.body.issue_title, 'Title')
            assert.equal(res.body.issue_text, 'text')
            assert.equal(res.body.created_by, 'Functional Test - Required fields filled in')
            
            Issue.findOneAndDelete().exec()
            done()
          })
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            assigned_to: 'Chai and Mocha',
            status_text: 'In QA'
          })
          .end((err, res)=>{
            assert.equal(res.status, 200)
            assert.equal(res.text, 'missing required fields')
            done()
          })
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({})
        .end((err, res)=>{
          assert.equal(res.status, 200)
          assert.equal(res.text, 'id is required')
          done()
        })
      });
      
      test('One field to update', function(done) {
        const issue = new Issue({issue_title: 'Title', issue_text: 'Text', created_by: 'Chai and Mocha'})
        issue.save((err, issue)=>{
          if (err) throw err
          const {_id} = issue
          chai.request(server)
            .put('/api/issues/test')
            .send({_id, issue_title: 'Title updated'})
            .end((err, res)=>{
              assert.equal(res.status, 200)
              assert.equal(res.text, 'successfully updated')
              Issue.findById(_id, (err, issue)=>{
                if (err) throw err
                assert.equal(issue.issue_title, 'Title updated')
                Issue.findOneAndDelete().exec()
                done()  
              })              
            })
        })
        
      });
      
      test('Multiple fields to update', function(done) {
        const issue = new Issue({issue_title: 'Title', issue_text: 'Text', created_by: 'Chai and Mocha'})
        issue.save((err, issue)=>{
          const {_id} = issue
          chai.request(server)
            .put('/api/issues/test')
            .send({_id, issue_title: 'Title updated', issue_text: 'Text Updated', status_text: 'New status'})
            .end((err, res)=>{
              assert.equal(res.status, 200)
              assert.equal(res.text, 'successfully updated')
              Issue.findById(_id, (err, issue)=>{
                if (err) throw err
                assert.equal(issue.issue_title, 'Title updated')
                assert.equal(issue.issue_text, 'Text Updated')
                assert.equal(issue.status_text, 'New status')
                Issue.findOneAndDelete().exec()
                done()
              })
              
            })
        })
        
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        const issue = new Issue({issue_title: 'Title', issue_text: 'Text', created_by: 'Chai and Mocha', project: 'test'})
        issue.save((err, issue)=>{
          chai.request(server)
            .get('/api/issues/test')
            .query({})
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.isArray(res.body);
              assert.property(res.body[0], 'issue_title');
              assert.property(res.body[0], 'issue_text');
              assert.property(res.body[0], 'created_on');
              assert.property(res.body[0], 'updated_on');
              assert.property(res.body[0], 'created_by');
              assert.property(res.body[0], 'assigned_to');
              assert.property(res.body[0], 'open');
              assert.property(res.body[0], 'status_text');
              assert.property(res.body[0], '_id');
              Issue.findOneAndDelete().exec()
              done();
            });
        })
        
      });
      
      test('One filter', function(done) {
        const issue = new Issue({assigned_to: 'Chai and Mocha', issue_title: 'Title', issue_text: 'Text', created_by: 'Chai and Mocha', project: 'test'})
        issue.save((err, issue)=>{
          chai.request(server)
            .get('/api/issues/test')
            .query({issue_title: 'Title'})
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.isArray(res.body);
              assert.property(res.body[0], 'issue_title');
              assert.property(res.body[0], 'issue_text');
              assert.property(res.body[0], 'created_on');
              assert.property(res.body[0], 'updated_on');
              assert.property(res.body[0], 'created_by');
              assert.property(res.body[0], 'assigned_to');
              assert.property(res.body[0], 'open');
              assert.property(res.body[0], 'status_text');
              assert.property(res.body[0], '_id');
              assert.equal(res.body[0].issue_title, 'Title')
            
              Issue.findOneAndDelete().exec()
              
              done();
            });
        })
        
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        const issue = new Issue({
          issue_title: 'Title',
          issue_text: 'Text',
          created_by: 'Chai and Mocha',
          status_text: 'Chai and Mocha',
          assigned_to:'Chai and Mocha',
          project: 'test'
        })
        issue.save((err, issue)=>{
          if (err) throw err
          chai.request(server)
            .get('/api/issues/test')
            .query({issue_title: 'Title', issue_text: 'Text', status_text: 'Chai and Mocha' })
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.isArray(res.body);
              assert.property(res.body[0], 'issue_title');
              assert.property(res.body[0], 'issue_text');
              assert.property(res.body[0], 'created_on');
              assert.property(res.body[0], 'updated_on');
              assert.property(res.body[0], 'created_by');
              assert.property(res.body[0], 'assigned_to');
              assert.property(res.body[0], 'open');
              assert.property(res.body[0], 'status_text');
              assert.property(res.body[0], '_id');
              assert.equal(res.body[0].issue_title, 'Title')
              assert.equal(res.body[0].issue_text, 'Text')
              assert.equal(res.body[0].status_text, 'Chai and Mocha')
            
              Issue.findOneAndDelete().exec()
              done();
            });
        })
        
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({})
        .end((err, res)=>{
          assert.equal(res.status, 200)
          assert.equal(res.text, '_id error')
          done()
        })
        
      });
      
      test('Valid _id', function(done) {
        const issue = new Issue({issue_title: 'Title', issue_text: 'Text', created_by: 'Chai and Mocha'})
        issue.save((err, issue)=>{
          chai.request(server)
            .delete('/api/issues/test')
            .send({_id: issue._id})
            .end((err, res)=>{
              assert.equal(res.status, 200)
              Issue.findById(issue._id, (err, issue)=>{
                assert.isNotOk(issue)
              })
              done()
            })
        })
        
      });
      
    });

});
