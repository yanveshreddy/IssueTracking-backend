const express = require('express');
const shortId = require('shortid');

const mongoose = require('mongoose');
const issueModel = mongoose.model('IssueModel');
const UserModel = mongoose.model('User');

const response = require('../libs/responseLib');
const time = require('../libs/timeLib');
const check = require('../libs/checkLib');
const logger =require('../libs/loggerLib');

let getAllIssues = (req, res) => {
   // console.log(req.xyz);
   issueModel.find().exec((err, result) => {
        if (err) {

            logger.error(err.message, 'Issue Controller: getAllIssues', 10)
            let apiResponse=response.generate(true,"Failed to find Issue Details",500,null);
            res.send(apiResponse);
        }
        else if (check.isEmpty(result)) {
            logger.info('No Issues Found', 'Issue Controller: getAllIssues')
            let apiResponse=response.generate(true,"No Issue found",404,null);
            res.send(apiResponse);
        }
        else {
            let apiResponse=response.generate(false,"Details Found",200,result);
            res.send(apiResponse);
        }
    })
}

let getIssueById = (req, res) => {

    issueModel.findOne({ 'issueId': req.params.issueId }).exec((err, result) => {
        if (err) {
            logger.error(err.message, 'Issue Controller: viewByIssueId', 10)
            let apiResponse=response.generate(true,"Failed to find Issue Details",500,null);
            res.send(apiResponse);
        }
        else if (check.isEmpty(result)) {
            logger.info('No issue Found', 'Issue Controller: viewByIssueId')
            let apiResponse=response.generate(true,"No Issue found",404,null);
            res.send(apiResponse);
        }
        else {
            let apiResponse=response.generate(false,"Details Found",200,result);
            res.send(apiResponse);
        }
    })
}

let getByAssignee = (req, res) => {

    issueModel.findOne({ 'author': req.params.author }).exec((err, result) => {
        if (err) {
            let apiResponse=response.generate(true,"Failed to find Issue Details",500,null);
            res.send(apiResponse);
        }
        else if (check.isEmpty(result)) {
            let apiResponse=response.generate(true,"No issue found",404,null);
            res.send(apiResponse);
        }
        else {
            let apiResponse=response.generate(false,"Details Found",200,result);
            res.send(apiResponse);
        }
    })
}

let assigneeAutocomplete =(req,res)=>{
    let q = req.body.query;
    let query = {

        "$or": [{"fullName.firstName": {"$regex": q, "$options": "i"}}, {"fullName.lastName": {"$regex": q, "$options": "i"}}]
    ,fullName:1
    };

   //
   //
    let output = [];

    Users.find(query).limit(6).exec((err, result) => {
        if (err) {
            let apiResponse=response.generate(true,"Failed to find issue Details",500,null);
            res.send(apiResponse);
        }
        else if (check.isEmpty(result)) {
            let apiResponse=response.generate(true,"No issue found",404,null);
            res.send(apiResponse);
        }
        else {
            let apiResponse=response.generate(false,"Deatails Found",200,result);
            res.send(apiResponse);
        }

    })
}


let createIssue = (req, res) => {

    var today = time.now();
    let issueId = shortId.generate();

   // let reporterObj={reporterId}

    let newIssue = new issueModel({
        issueId: issueId,
        title: req.body.title,
        reporter: req.body.reporter,
        assignee: req.body.assignee,
        description: req.body.description,
        watchers:[req.body.reporter,req.body.assignee],
        created: today,
        lastModified: today
    })

    newIssue.save((err, result) => {
        if (err) {
            logger.error(err.message, 'Issue Controller: createIssue', 10)
            let apiResponse=response.generate(true,"Failed to save Issue Details",500,null);
            res.send(apiResponse);
        }
        
        else {
            let apiResponse=response.generate(false,"created succesfully",200,result);
            res.send(apiResponse);
        }

    })

}

let editIssue = (req, res) => {

    let options = req.body;
    console.log(options);
    issueModel.update({ 'issueId': req.params.issueId }, options, { multi: true }).exec((err, result) => {
        if (err) {
            logger.error(err.message, 'Issue Controller: editissue', 10)
            let apiResponse=response.generate(true,"Failed to edit issue Details",500,null);
            res.send(apiResponse);
        }
        else if (check.isEmpty(result)) {
            let apiResponse=response.generate(true,"No issue found",404,null);
            res.send(apiResponse);
        }
        else {
            let apiResponse=response.generate(false,"Issue edited succesfully",200,result);
            res.send(apiResponse);
        }
    })
}

let addComment = (req, res) => {

    //req.body.comment = JSON.parse(req.body.comment)

    let commentObj = {commenterId:req.body.commenterId, commentedBy: req.body.commentedBy, comment: req.body.comment}

    let options = { $push: { comments: commentObj } }
    if(req.body.comment){

        issueModel.update({ 'issueId': req.params.issueId }, options).exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'issueController: Database error', 10)
                let apiResponse = response.generate(true, 'Failed To Posted comment', 500, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'Successfully Posted comment', 200, result)
                res.send(apiResponse)
            }
        });// end issue model update
    }
    else{
                logger.error(err.message, 'issueController: comment missing error', 10);
                let apiResponse = response.generate(true, 'comment cannot be Null', 500, null)
                res.send(apiResponse)
    }
}

let addWatchee = (req, res) => {

    let watcheeObj = {userId: req.body.userId, firstName: req.body.firstName}
    //req.body.watchers = JSON.parse(req.body.watchers)

    let options = { $push: { watchers: req.body.watchers } }
    issueModel.update({ 'issueId': req.params.issueId }, options).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'issueController: Database error', 10)
            let apiResponse = response.generate(true, 'Failed To Add as Watching', 500, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Successfully Added to  Watchers list', 200, result)
            res.send(apiResponse)
        }
    });// end issue model update

}


let deleteIssue = (req, res) => {

    issueModel.findOneAndRemove({ 'issueId': req.params.issueId }).select(' -__v -_id -password').exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'IssueController: deleteIssue', 10)
            let apiResponse = response.generate(true, 'Failed To delete Issue', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No Issue Found', 'IssueController: deleteIssue')
            let apiResponse = response.generate(true, 'No Issue Found', 404, null)
            res.send(apiResponse)
        } else {
            req.body.previous = req.body.previous.split('/uploads/')[1]
            fs.unlinkSync('./uploads/' +  req.body.previous);

            let apiResponse = response.generate(false, 'Deleted the Issue successfully', 200, result)
            res.send(apiResponse)
        }
    });// end Issue model find and remove


}// end delete Issue



module.exports = {
    getAllIssues: getAllIssues,
    getIssueById: getIssueById,
    getByAssignee:getByAssignee,
    createIssue: createIssue,
   // searchIssue : searchIssue,
    editIssue: editIssue,
    addComment : addComment,
    addWatchee : addWatchee,
    assigneeAutocomplete:assigneeAutocomplete,

    deleteIssue : deleteIssue
}
