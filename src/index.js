const path=require('path')
const http=require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage,generateLocationMessage} = require('./utils/messages')
const {addUser,removeUser,getUser,getUserInRoom}=require('./utils/users')


const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT||3000
const publucDirectoryPath = path.join(__dirname,'../public/')

//let count=0
//ใช่โหลด index
//let message = 'Welcome'

app.use(express.static(publucDirectoryPath))

io.on('connection',(socket)=>{
    console.log('New websocket connection')

    socket.on('join',(options,callback)=>{
        const {error,user} = addUser({id:socket.id,...options})

        if(error){
            return callback(error)
        }

        socket.join(user.room)
        socket.emit('message',generateMessage('Admin','Welcome!')) //1 ทุกคนเห็น
        socket.broadcast.to(user.room).emit('message',generateMessage('Admin',`${user.username} has joined.`)) //2 user เข้ามาไม่เห็น
        //socket.emit,io.emit,socket.broadcast.emit
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUserInRoom(user.room)
        })
        callback()
    })
    
    socket.on('sendMessage',(message, callback)=>{
         //3 
        const user = getUser(socket.id)

         const filter = new Filter()
        if(filter.isProfane(message)){
            return callback('Profanity is not allow')
        }

         io.to(user.room).emit('message', generateMessage(user.username,message))
         callback()
     })

     socket.on('disconnect',()=>{
        const user = removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message',generateMessage('Admin',`${user.username} has left`))
            io.to(user.room).emit('roomData',{
                room: user.room,
                users:getUserInRoom(user.room)
            })
        }

       
     })

     socket.on('sendLocation',(location,callback)=>{
         const user = getUser(socket.id)
         io.to(user.room).emit('locationMessage',generateLocationMessage(user.username,`https://google.com/maps?q=${location.latitude},${location.longtitude}`))
        callback('Location delivered')
    })

})

server.listen(port,()=>{
    console.log('Server up '+port)
})
