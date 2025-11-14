require('dotenv').config()
const express=require('express')
const app=express()
app.use(express.json())
const mongoose=require('mongoose')
mongoose.connect('mongodb://localhost/facebook').then(console.log('connected to database'))
const cors=require('cors')
app.use(cors())

const welcome=require('./routes/welcome')
app.use('/',welcome)

const sign=require('./routes/signup')
app.use('/',sign)

app.listen(process.env.PORT,()=>console.log(`listening to port ${process.env.PORT}`))