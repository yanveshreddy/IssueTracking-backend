const express = require('express');
const router = express.Router();
const appConfig = require("../../config/appConfig");
const auth = require('../middlewares/auth');
const issueController = require("./../controllers/issueController");
//const notifyController = require("./../controllers/notifyController");
//const multer = require('./../middlewares/multer');

module.exports.setRouter = (app) => {

    
    let baseUrl = `${appConfig.apiVersion}/issues`;

    app.post(`${baseUrl}/create`,auth.isAuthorized,issueController.createIssue);

    app.put(`${baseUrl}/:issueId/edit`,auth.isAuthorized,issueController.editIssue);
   
    app.put(`${baseUrl}/:issueId/addcomment`,auth.isAuthorized,issueController.addComment);

    app.put(`${baseUrl}/:issueId/addwatchee`,auth.isAuthorized,issueController.addWatchee);

    app.post(`${baseUrl}/:issueId/delete`,auth.isAuthorized,issueController.deleteIssue);
  
    app.get(`${baseUrl}/view/all`,auth.isAuthorized,issueController.getAllIssues);

    app.get(`${baseUrl}/:issueId/details`,auth.isAuthorized,issueController.getIssueById);

    app.get(`${baseUrl}/:userId/assigneeIssues`,auth.isAuthorized,issueController.getAllIssuesByAssignee);

    // app.get(`${baseUrl}/autoComplete`,auth.isAuthorized,issueController.assigneeAutocomplete);   

}
