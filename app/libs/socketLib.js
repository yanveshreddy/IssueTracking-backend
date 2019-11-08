const socketio = require('socket.io');
const mongoose = require('mongoose');
const shortid = require('shortid');
const logger = require('./loggerLib.js');
const events = require('events');
const eventEmitter = new events.EventEmitter();

const tokenLib = require("./tokenLib.js");
const NotificationModel = mongoose.model('Notification')


let setServer = (server) => {

    let allOnlineUsers = []

    let io = socketio.listen(server);

    let myIo = io.of('')

    myIo.on('connection', (socket) => {

        socket.emit("verifyUser", "Some data");
        // code to verify the user and make him online

        socket.on('set-user', (authToken) => {

            tokenLib.verifyClaimWithoutSecret(authToken, (err, user) => {
                if (err) {

                    socket.emit('auth-error', { status: 500, error: 'Please provide correct auth token' })
                }
                else {

                    console.log("user is verified..setting details");
                    let currentUser = user.data;
                    // setting socket user id 
                    socket.userId = currentUser.userId
                    let fullName = `${currentUser.firstName} ${currentUser.lastName}`
                    console.log(`${fullName} has Logged in successfully`);

                    let userObject = { userId: currentUser.userId, fullName: fullName }
                    allOnlineUsers.push(userObject);
                    console.log(allOnlineUsers);

                    // // setting room name
                    socket.room = 'edChat'
                    // joining chat-group room.
                    socket.join(socket.room)
                    myIo.emit('online-user-list', allOnlineUsers);

                }


            })

        }) // end of listening set-user event


        socket.on('disconnect', () => {
            // disconnect the user from socket
            // remove the user from online list
            // unsubscribe the user from his own channel

            console.log('\x1b[33m',"user is disconnected", '\x1b[0m');
            console.log(socket.userId);


            var removeIndex = allOnlineUsers.map(function (user) { return user.userId; }).indexOf(socket.userId);
            allOnlineUsers.splice(removeIndex, 1)

            console.log('\x1b[36m', allOnlineUsers, '\x1b[0m');

            socket.leave(socket.room)
            socket.to(socket.room).broadcast.emit('online-user-list', allOnlineUsers);


        }) // end of on disconnect




        //on notification event
        socket.on('notification', (data) => {

          //  data['notificationId'] = shortid.generate()

           // console.log(data['notificationId'])
            // event to save chat.
            setTimeout(function () {
                eventEmitter.emit('save-notification', data);

            }, 2000)
            myIo.emit(data.receiverId, data)

        });//end of notification evnent

    });//end of task event

}


// database operations are kept outside of socket.io code.

// saving Notificationss to database.
eventEmitter.on('save-notification', (data) => {

    // let today = Date.now();

    let notificationId=shortid.generate();

    let newNotification = new NotificationModel({

        notificationId: notificationId,
        senderName: data.senderName,
        senderId: data.senderId,
        receiverName: data.receiverName || '',
        receiverId: data.receiverId || '',
        issueId: data.issueId,
        message: data.message,
        createdOn: data.createdOn

    });

    newNotification.save((err, result) => {
        if (err) {
            console.log(`error occurred: ${err}`);
        }
        else if (result == undefined || result == null || result == "") {
            console.log("Notification Is Not Saved.");
        }
        else {
            console.log("Notification Saved.");
        }
    });

}); // end of saving chat.



module.exports = {
    setServer: setServer
}