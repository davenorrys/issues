const mongoose = require('mongoose')
const shortid = require('shortid')

const issueSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
  project: String,
  issue_title: {
    type: String,
    required: [true, 'Title is required']
  },
  issue_text: {
    type: String,
    required: [true, 'Issue text is required']
  },
  created_by: {
    type: String,
    required: [true, 'Created by is required']
  },
  created_on: {
    type: Date,
    default: Date.now
  },
  updated_on: {
    type: Date,
    default: Date.now
  },
  assigned_to: {
    type: String,
    default: 'no one'
  },
  open:{
    type: Boolean,
    default: true
  },
  status_text: {
    type: String,
    default: ''
  }
})

module.exports = mongoose.model('Issue', issueSchema)