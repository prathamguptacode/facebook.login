require('dotenv').config()
const users = require('../schema/userSchema')
const TempUser = require('../schema/tempSchema')
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const otpgenerator = require('otp-generator')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')

router.post('/signup', async (req, res) => {
    try {
        const firstName = req.body?.firstName;
        const surName = req.body?.surName;
        const birthDate = req.body?.birthDate;
        const birthMonth = req.body?.birthMonth;
        const birthYear = req.body?.birthYear;
        const gender = req.body?.gender;
        const email = req.body?.email;
        const password = req.body?.password;

        if ((!firstName) || (!surName) || (!birthDate) || (!birthMonth) || (!birthYear) || (!email) || (!password) || (!gender)) {
            return res.status(400).json({ message: 'invalid input' })
        }

        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\;:'",.<>/?]).{8,}$/;
        if(!emailRegex.test(email)) return res.status(400).json({ message: 'invalid email' })
        if(!pwdRegex.test(password)) return res.status(400).json({ message: 'please enter a strong password' })

        const prevData = await users.findOne({ email: email })
        if (prevData) return res.status(403).json({ message: `you already have a account on facebook linked with ${email}` })

        const hashpass = await bcrypt.hash(password, 10)
        const otp = await otpgen(email)
        const token = jwt.sign({ email }, process.env.KEY, { expiresIn: '6m' })
        const user = new TempUser({ firstName, surName, birthDate, birthMonth, birthYear, gender, email, password: hashpass, otp })
        await user.save()
        console.log(" pass " + password)
        res.json({ message: 'go to /verify to verify that email', token })
    } catch (error) {
        console.log(error)
        console.log('sign up error')
        res.status(500).json({ message: 'something went wrong in server' })
    }
})

router.post('/verify', async (req, res) => {
    try {
        let useremail;
        const headers = req.headers['authorization']
        if (!headers) return res.json({ message: 'invalid headers' })
        const token = headers.split(' ')[1]
        jwt.verify(token, process.env.KEY, (err, val) => {
            if (err) return res.json({ message: 'something went wrong token' })
            useremail = val.email
        })
        const otp = req.body?.otp;
        if (!otp) return res.json({ message: 'invalid input' })
        const tempdb = await TempUser.where('email').equals(useremail).sort('-createdAt').select('-_id')
        const temp = tempdb[0]
        if (otp == temp.otp) {
            const data = tempdb[0].toObject()
            const user = new users(data)
            await user.save()
            res.json({ message: 'account successfully created' })
        }
        else {
            res.json({ message: 'invalid otp' })
        }
    } catch (error) {
        console.log(error)
        console.log('sign up error')
        res.status(500).json({ message: 'something went wrong in server' })
    }

})

router.post('/login', async (req, res) => {
    try {
        if(!req.body) return res.status(403).json({ message: 'invalid inputs' })
        const { email, password } = req.body
        if ((!email) || (!password)) {
            return res.status(403).json({ message: 'invalid inputs' })
        }
        const user = await users.findOne({ email })
        if (!user) return res.status(403).json({ message: 'invalid creadentials' })
        
        bcrypt.compare(password,user.password,(err,val)=>{
        if(err)return res.status(500).json({message: 'something went wrong'})
        if (val) {
            // const refreshToken=jwt.sign({email: email,message: 'valid user'},process.env.REFRESHTOKEN)
            // const refreshToken=jwt.sign({email: email,message: 'valid user'},process.env.ACCESSTOKEN)
            res.json({ message: 'welcome to facebook' })
             
        }
        else {
            res.status(403).json({ message: 'invalid creadentials' })
        }
        })

    } catch (error) {
        console.log(error)
        console.log('loginin error')
        res.status(500).json({ message: 'something went wrong in server' })
    }
})

async function otpgen(email) {
    const otp = await otpgenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false, digits: true })
    console.log(otp)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'prathamgupta.wk@gmail.com',
            pass: process.env.EMAIL
        }
    })
    const mailOption = {
        from: 'prathamgupta.wk@gmail.com',
        to: email,
        subject: `You OTP from facebook is ${otp}`,
        text: `You OTP from facebook is ${otp} \nwe are facebook connecting people`
    }
    transporter.sendMail(mailOption, (err, val) => {
        if (err) return res.status(400).json({ message: 'something went wrong while sending otp' })
    })
    return otp
}

module.exports = router