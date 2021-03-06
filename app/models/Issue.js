'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let issueSchema = new Schema({
  issueId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    default: ''
  },
  status:{
    type: String,
    default: 'in- progress'
  },
  reporter: [],
  assignee: [],
  description: {
    type: String,
    default: ''
  },
  file: {
      data: Buffer,
      contentType: String
  },
  watchers:[],
  comments: {
    type:Array,
    default:[]
  
  },
  created:{
    type:Date,
    default:Date.now
  },
  lastModified:{
    type:Date,
    default:Date.now
}

})


mongoose.model('IssueModel', issueSchema);