const mongoose=require('mongoose')
const tempSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required: true
    },
    surName:{
        type:String,
        required: true
    },
    birthDate:{
        type:Number,
        require:true
    },
    birthMonth:{
        type:String,
        require:true
    },
    birthYear:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    otp:{
        type:Number,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('TempUser',tempSchema)