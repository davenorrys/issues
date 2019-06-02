/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const mongoose = require('mongoose')
const shortid  = require('shortid')
const Issue = require('../model/issue.js')

module.exports = function  (app) {  
  

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      const {project} = req.params;
      
      Issue.find({project, ...req.query}, (err, issues) =>{
        if (err) throw err
        if(issues != false) res.send(issues)
        else res.send(`no issues found for ${project}`)
      })
    })
    
    .post(function (req, res){
      const {project} = req.params;
      if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by) return res.send('missing required fields')
      const issue  = new Issue({...req.body, project})
      issue.save((err, issue)=>{
        res.json(issue.toJSON())
      })      
    })
    
    .put(function (req, res){
      const {project} = req.params
      const {_id} = req.body
      if (!_id) return res.send('id is required')
      let updated = false;
      Issue.findById(_id, (err, issue)=>{
        if (err) throw err
        if (!issue) res.send('Issue not found')
        else{
          const keys = Object.keys(req.body)
          keys.filter(i=>i!='_id').forEach(v=>{
            if (req.body[v].trim()) {
              issue[v] = req.body[v]
              updated = true
            }            
          })
          if (!updated) res.send('no updated field sent')
          else {
            issue.updated_on = Date.now()
            issue.save((err, issue)=>{
              if (err) res.send(`could not update ${_id}`)
              else {
                updated != updated
                res.send('successfully updated')
              }
            })
          }
        }
      })
      
    })
    
    .delete(function (req, res){
      const {_id} = req.body
      if (!_id) return res.send('_id error')
      Issue.findByIdAndRemove(_id, (err, issue)=>{
        if (err) res.send(`could not delete ${_id}`)
        else if (issue) res.send(`deleted ${_id }`)
        else res.send('issue not found')
      })
      
    });
    
};
