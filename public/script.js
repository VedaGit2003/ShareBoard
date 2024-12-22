let canvas=document.querySelector('#canvas')

canvas.width=window.innerWidth
canvas.height=window.innerHeight

var io=io.connect('https://shareboard-xome.onrender.com/')

let ctx=canvas.getContext("2d")

//socket io connection


// for drawing a line 
// ctx.moveTo(100 , 100)
// ctx.lineTo(200 , 200)
// ctx.stroke()

let x
let y
let mouseDown=false

window.onmousedown=(e)=>{
ctx.moveTo(x,y)
io.emit('mouseDownEvent',{x,y})
mouseDown=true
}

window.onmouseup=(e)=>{
mouseDown=false
}

io.on('onDraw',({x,y})=>{
    ctx.lineTo(x,y)
    ctx.stroke()
})

io.on('mouseOnDown',({x,y})=>{
    ctx.moveTo(x,y)
})

window.onmousemove=(e)=>{
    x=e.clientX
    y=e.clientY
    // console.log(x,y)
    if(mouseDown){
        io.emit('draw',{x,y})
        ctx.lineTo(x,y)
        ctx.stroke()
    }
}
