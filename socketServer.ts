import {Server as SocketIOServer} from 'socket.io'
import http from 'http'

export const initSocketServer=(server:http.Server)=>{
    const io =new SocketIOServer(server)
    io.on('connection',(socket)=>{
        console.log('A user connected')

        // listen for notification event from the front end
        socket.on('notification',(data)=>{
            // broadcast the notification data to all connected clients admins dashboard
            io.emit('newNotification',data)
        })
        socket.on('disconnect',()=>{
            console.log('A user disconnect')
        })
    })
}