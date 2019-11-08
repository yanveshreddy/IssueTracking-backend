const express = require('express');
const router = express.Router();
const appConfig = require("../../config/appConfig");
const auth = require('../middlewares/auth');
const issueController = require("./../controllers/issueController");
const notificationController = require("./../controllers/notificationController");

//const notifyController = require("./../controllers/notifyController");
//const multer = require('./../middlewares/multer');

module.exports.setRouter = (app) => {

    
    let baseUrl = `${appConfig.apiVersion}/issues`;

    app.post(`${baseUrl}/create`,auth.isAuthorized,issueController.createIssue);
    /**
        * @api {post} /api/v1/issues/create api to Create Issue
        * @apiVersion 0.0.1
        * @apiGroup Issue
        *
        * @apiParam {String} authToken The token for authentication.(Send authToken as query parameter, body parameter or as a header)
        * @apiParam {String} title title of the issue passed as a body parameter
        * @apiParam {String} description description of the issue passed as a body parameter
        * @apiParam {String} status status of the issue passed as a body parameter
        * @apiParam {String} reporter reporter object(type = array) of the issue passed as a body parameter
        * @apiParam {String} assignee assignee object(type = array) of the issue passed as a body parameter
        *
        *  @apiSuccessExample {json} Success-Response:
        *  {
           "error": false,
           "message": "Created successfully",
           "status": 200,
           "data": [
                       {
                           _Id:"string",
                           __v:number,
                           issueId: "string",
                           title: "string",
                           description: "string",
                           status: "string",
                           reporter: object(type = array),
                           assignee: object(type = array),
                           watchers: object(type = array),
                           comments: object(type = array),
                           created: "date",
                           lastModified: "date"
                       }
                   ]
               }
           }
       
         @apiErrorExample {json} Error-Response:
        *
        * {
           "error": true,
           "message": "Error Occured.,
           "status": 500,
           "data": null
          }
        */


    app.put(`${baseUrl}/:issueId/edit`,auth.isAuthorized,issueController.editIssue);

    /**
	 * @api {put} /api/v1/issues/:issueId/edit Edit issue by issueId
	 * @apiVersion 0.0.1
	 * @apiGroup Issue
	 *
	 * @apiParam {String} authToken The token for authentication.(Send authToken as query parameter, body parameter or as a header)
	 * @apiParam {String} issueId issueId of the issue passed as the URL parameter
	 *
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "issue Edited Successfully.",
	    "status": 200,
	    "data": [
					{
						issueId: "string",
                        title: "string",
                        description: "string",
                        status: "string",
                        reporter: object(type = array),
                        assignee: object(type = array),
                        watchers: object(type = array),
                        comments: object(type = array),
                        created: "date",
                        lastModified: "date"
					}
	    		]
	    	}
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Error Occured.,
	    "status": 500,
	    "data": null
	   }
	 */

   
    app.put(`${baseUrl}/:issueId/addComment`,auth.isAuthorized,issueController.addComment);
    
    /**
	 * @api {put} /api/v1/issues/:issueId/addComment api to post comment to issue.
	 * @apiVersion 0.0.1
	 * @apiGroup Issue
	 *
	 * @apiParam {String} authToken The token for authentication.(Send authToken as query parameter, body parameter or as a header)
	 * @apiParam {String} issueId issueId of the issue passed as the URL parameter
	 * @apiParam {String} comments comments object(type = array) of the issue passed as a body parameter
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "comment Posted Successfully.",
	    "status": 200,
	    "data": [
					{
						issueId: "string",
                        title: "string",
                        description: "string",
                        status: "string",
                        reporter: object(type = array),
                        assignee: object(type = array),
                        watchers: object(type = array),
                        comments: object(type = array),
                        created: "date",
                        lastModified: "date"
					}
	    		]
	    	}
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Error Occured.,
	    "status": 500,
	    "data": null
	   }
	 */



    app.put(`${baseUrl}/:issueId/addWatchee`,auth.isAuthorized,issueController.addWatchee);

    /**
	 * @api {put} /api/v1/issues/:issueId/addWatchee api to add watchee to issue.
	 * @apiVersion 0.0.1
	 * @apiGroup Issue
	 *
	 * @apiParam {String} authToken The token for authentication.(Send authToken as query parameter, body parameter or as a header)
	 * @apiParam {String} issueId issueId of the issue passed as the URL parameter
	 * @apiParam {String} watchers watchers object(type = array) of the issue passed as a body parameter
	 *  @apiSuccessExample {json} Success-Response:
	 *  {
	    "error": false,
	    "message": "Successfully Added to  Watchers list",
	    "status": 200,
	    "data": [
					{
						issueId: "string",
                        title: "string",
                        description: "string",
                        status: "string",
                        reporter: object(type = array),
                        assignee: object(type = array),
                        watchers: object(type = array),
                        comments: object(type = array),
                        created: "date",
                        lastModified: "date"
					}
	    		]
	    	}
		}
	}
	  @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Error Occured.,
	    "status": 500,
	    "data": null
	   }
	 */



    app.post(`${baseUrl}/:issueId/delete`,auth.isAuthorized,issueController.deleteIssue);

  
    app.get(`${baseUrl}/view/all`,auth.isAuthorized,issueController.getAllIssues);

    


    app.get(`${baseUrl}/:issueId/details`,auth.isAuthorized,issueController.getIssueById);

    app.get(`${baseUrl}/:userId/assigneeIssues`,auth.isAuthorized,issueController.getAllIssuesByAssignee);

	// app.get(`${baseUrl}/autoComplete`,auth.isAuthorized,issueController.assigneeAutocomplete);   
	app.get(`${baseUrl}/:userId/notification`, auth.isAuthorized,notificationController.getNotificationById);
	/**
	* @api {get} /api/v1/issues/:userId/notification Get notifications
	* @apiVersion 0.0.1
	* @apiGroup notification
	*
	* @apiParam {String} authToken The authToken for authentication. (Send authToken as query params)
	* @apiParam {String} userId The userId of user. (params) (required)
	*
	* @apiSuccessExample {json} Success-Response:
	*    
	*   {
	*		"error": false,
	*		"message": "Notify Details Found",
	*		"status": 200,
	*		"data":[
	*                {
	*                    "notifyId": "String",
	*                    "createdOn": "Date",
	*                    "seen": "Boolean",
	*                    "message": "String",
	*                    "receiverId": Object.type(Array),
	*                    "receiverName": "String",
	*                    "senderId": "String",
	*                    "senderName": "String"
	*                },
	*               .......
	*               ]
	*   }
	* @apiErrorExample {json} Error-Response:
	*
	* {
	*   "error": true,
	*   "message": "Failed To Find Notify Details",
	*   "status": 500,
	*   "data": null
	* }
	*/
  

}
