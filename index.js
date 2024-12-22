import express from "express"
import dotenv from 'dotenv'
import {createServer} from "node:http"
import { Server } from "socket.io"

dotenv.config()



const app=express()

app.use(express.static("public"))

const server=createServer(app)
const io=new Server(server)
app.use(express.json())


//connection build between sockets
let connections=[]
io.on('connect',(socket) => {
    connections.push(socket)
    console.log(`${socket.id} is connected`);

    socket.on('draw',(data)=>{
        connections.forEach(con=>{
            if (con.id !== socket.id){
                con.emit('onDraw',{x: data.x,y: data.y})
            }
        })
    })

    socket.on('mouseDownEvent',(data)=>{
        connections.forEach(con=>{
            if(con.id!==socket.id){
                con.emit('mouseOnDown',{x:data.x,y:data.y})
            }
        })
    })
    
  socket.on('disconnect',(reason) => {
    console.log(`${socket.id} disconnected`);
    connections=connections.filter((con)=>con.id !== socket.id)
  })
  })

app.get('/test',(req,res)=>{
    return res.status(200).json({success:true,message:"Server started"})
})

const PORT = process.env.PORT || 3000
server.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})