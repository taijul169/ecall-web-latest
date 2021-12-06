
const express =  require('express');
const crypto = require("crypto");
const bodyParser =  require("body-parser");
const flash =  require('connect-flash')
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const dotenv =  require('dotenv');
dotenv.config({path:'../config.env'});
const fetch  = require("node-fetch");

// middleware
const auth = require('../middleware/authenticate')



// localStorage
// var LocalStorage = require('node-localstorage').LocalStorage,
// localStorage = new LocalStorage('./scratch');

// const { rawListeners, schema } = require("../models/model");
const { handlebars } = require("hbs");
const router = express.Router();
const { query } = require('express');
const { json } = require('body-parser');
const { METHODS } = require('http');


// Home route
router.get("/",(req,res)=>{
    fetch('http://192.168.0.121:9010/api/getdocnurserlist')
    .then(res => res.json())
    .then(dataDoc =>{
        console.log(dataDoc)
        res.render("index",{dataDoc})
    });
     
});

// patient register
router.get("/patient-register",(req,res)=>{
    res.render("patient-register")  
 });
// patient account create
 router.post("/patient-register",async(req,res)=>{
      
    var {phone,username,usertype,password} = req.body;
    const response =  await (fetch('http://192.168.0.121:9010/api/signup', 
    { 
        method: 'POST', 
        body: JSON.stringify(req.body),
        headers: { 'Content-Type': 'application/json' }
    }));

    console.log(response.status)
    if(response.status === 200){
        req.session.message={
            type:'alert-success',
            intro:'Created!',
            message:'A Verification Code has been sent to your Phone.'
        }
        res.redirect("/otp-verify")
    }
    if(response.status === 409){
        req.session.message={
            type:'alert-danger',
            intro:'Created!',
            message:'Invalid Registration.'
        }
        res.redirect("/doctor-register")
    }
    const data = await  response.json()
    console.log(data)

});



// otp verify route
router.get("/otp-verify",(req,res)=>{
    res.render("otp-verify");  
 });
 

 router.post("/otp-verify", async(req,res)=>{
    var {phone,code} = req.body;
    const response =  await (fetch('http://192.168.0.121:9010/api/otp-verify', 
    { 
        method: 'POST', 
        body: JSON.stringify(req.body),
        headers: { 'Content-Type': 'application/json' }
    }));
    console.log("status code:",response.status)
    if(response.status === 200){
        req.session.message={
            type:'alert-success',
            intro:'Created!',
            message:'Your account has been created successfully.'
        }
        res.redirect("/login")
    }
    if(response.status === 401){
        req.session.message={
            type:'alert-danger',
            intro:'Created!',
            message:'Invalid Code.'
        }
        res.redirect("/otp-verify")
    }
    if(response.status === 409){
        req.session.message={
            type:'alert-danger',
            intro:'Created!',
            message:'Invalid Code.'
        }
        res.redirect("/otp-verify")
    }
    const data = await  response.json()

});

// single doctor profile

router.get("/doctor-profile",(req,res)=>{
   res.render("doctor-profile")  
});

// doctor profile settings
router.get("/doctor-profile-settings",(req,res)=>{
    res.render("doctor-profile-settings")  
 });

// doctor register
router.get("/doctor-register",(req,res)=>{
   res.render("doctor-register")
    
});

// login-page
router.get("/login",(req,res)=>{
    res.render("login")
})
// login-page
router.post("/login",async(req,res)=>{

    var {phone, password} = req.body;
    const response =  await (fetch('http://192.168.0.121:9010/api/login', 
    { 
        method: 'POST', 
        body: JSON.stringify(req.body),
        headers: { 'Content-Type': 'application/json' }
    }));

    console.log(response.status)
    if(response.status === 200){
        req.session.message={
            type:'alert-success',
            intro:'Created!',
            message:'Welcome to Dashboard.'
        }
        res.redirect("/doctor-dashboard")
    }
    if(response.status === 401){
        req.session.message={
            type:'alert-danger',
            intro:'Created!',
            message:'Invalid Login.'
        }
        res.redirect("/login")
    }
    else if( response.status === 409){
        req.session.message={
            type:'alert-danger',
            intro:'Created!',
            message:'Invalid Login.'
        }
        res.redirect("/login")
    }
    const data = await  response.json()
    console.log(data)
})

router.post("/doctor-register",async(req,res)=>{
      
        var {phone,username,department,usertype, password} = req.body;
        const response =  await (fetch('http://192.168.0.121:9010/api/signup', 
        { 
            method: 'POST', 
            body: JSON.stringify(req.body),
            headers: { 'Content-Type': 'application/json' }
        }));

        console.log(response.status)
        if(response.status === 200){
            req.session.message={
                type:'alert-success',
                intro:'Created!',
                message:'A Verification Code has been sent to your Phone.'
            }
            res.redirect("/otp-verify")
        }
        if(response.status === 409){
            req.session.message={
                type:'alert-danger',
                intro:'Created!',
                message:'Invalid Registration.'
            }
            res.redirect("/doctor-register")
        }
        const data = await  response.json()
        console.log(data)
   
});


// doctor-dashboard
// login-page
router.get("/doctor-dashboard",(req,res)=>{

    res.render("doctor-dashboard")
})



module.exports =  router;