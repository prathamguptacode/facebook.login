const mongoose=require('mongoose')
const userSchema=new mongoose.Schema({
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
        createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('users',userSchema)