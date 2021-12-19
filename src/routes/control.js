
const express =  require('express');
const crypto = require("crypto");
const bodyParser =  require("body-parser");
const flash =  require('connect-flash')
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const dotenv =  require('dotenv');
dotenv.config({path:'../config.env'});
const fetch  = require("node-fetch");

var FormData = require('form-data');
var fs = require('fs');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

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
const { Console } = require('console');
const async = require('hbs/lib/async');


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

// // doctor profile settings
// router.get("/doctor-profile-settings",(req,res)=>{
//     res.render("doctor-profile-settings")  
//  });

// doctor register
router.get("/doctor-register",(req,res)=>{

    fetch(`http://192.168.0.121:9010/api/getdepartment`)
    .then(res => res.json())
    .then(departmentData =>{
        res.render("doctor-register",{departmentData})
    });
    
});

// login-page
router.get("/login",(req,res)=>{
    res.render("login")
})


router.post('/experienceinsert/:id',async(req,res)=>{
    var {institutionName,designation,start_date,end_date} = req.body;
    console.log(req.body)
    const response =  await (fetch(`http://192.168.0.121:9010/api/experienceinsert/${req.params.id}`, 
    { 
        method: 'POST', 
        body: JSON.stringify({institutionName,designation,start_date,end_date}),
        headers: { 'Content-Type': 'application/json' }
    }));
    console.log(response)
})

// Experience info update----------------
router.post("/experienceupdate/:id", async(req, res)=>{
    const id =  req.params.id;

    var {
         data_id,
         institutionName,
         designation,
         start_date,
         end_date,
         } = req.body;  
      console.log(req.body);
     if(req.body.institutionName.length>0){
         for(var i=0;i<req.body.institutionName.length; i++){
            var institutionName = req.body.institutionName[i],
                designation = req.body.designation[i],
                start_date = req.body.start_date[i],
                end_date = req.body.end_date[i],
                data_id =  req.body.data_id[i]
             response =  await (fetch(`http://192.168.0.121:9010/api/experienceupdate/${id}`, 
            { 
                method: 'PUT', 
                body: JSON.stringify({
                    data_id,
                    institutionName,
                    designation,
                    start_date,
                    end_date}),
                    headers: { 'Content-Type': 'application/json' }
                
            }));

         }
         
     }
   
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


router.get("/doctor-profile-settings/:id", (req,res)=>{
    const id =  req.params.id;
    fetch(`http://192.168.0.121:9010/api/singledoctor/${id}`)
    .then(res => res.json())
    .then(singleDocData =>{
        res.render("doctor-profile-settings",{singleDocData})
    });

});


router.get("/fileupload/:id",(req,res)=>{

    res.render("fileupload")
})
router.post("/fileupload/:id",(req,res)=>{
    var form = new FormData();
    form.append('my_field', 'my value');
    form.append('my_buffer', new Buffer(10));
    form.append('my_file', fs.createReadStream('/foo/bar.jpg'));

    const id =  req.params.id;
    console.log(req.files);
    
})
// education info update----------------
router.post("/educationupdate/:id", async(req, res)=>{
    const id =  req.params.id;

    var {
         data_id,
         institutionName,
         degree,
         start_date,
         end_date,
         } = req.body;  
      console.log(req.body);
     if(req.body.institutionName.length>0){
         for(var i=0;i<req.body.institutionName.length; i++){
            var institutionName = req.body.institutionName[i],
                degree = req.body.degree[i],
                start_date = req.body.start_date[i],
                end_date = req.body.end_date[i],
                data_id =  req.body.data_id[i]
             response =  await (fetch(`http://192.168.0.121:9010/api/educationupdate/${id}`, 
            { 
                method: 'PUT', 
                body: JSON.stringify({
                    data_id,
                    institutionName,
                    degree,
                    start_date,
                    end_date}),
                    headers: { 'Content-Type': 'application/json' }
                
            }));

         }
         
     }
   
})

// single education delete

router.get('/deleteEducation/:id/:docid',(req,res)=>{
    const id =  req.params.id;
    const docid =  req.params.docid;
    fetch(`http://192.168.0.121:9010/api/deleteeducation/${id}`,{
        method:'delete',
    })
    req.session.message={
        type:'alert-danger',
        intro:'Created!',
        message:'Education Deleted.'
    }
    res.redirect(`/doctor-profile-settings/${docid}`)
})
// doctor profile update----------------
router.post("/doctor-profile-settings/:id",  async(req, res)=>{

    try {
        const id =  req.params.id;
        var Photo ='';
        if(req.files){
             Photo =  req.files.photo.name;
        }
        
        // Photo =  fs.createReadStream(Photo.data)
        console.log("Body photo:",Photo)
        console.log("Body data:",req.body)
       var {
           RegistrationNo,
           FirstName,	
           LastName,	
           userName,	
           PhoneNumber	,
           Gender,
           DateOfBirth	,
           BloodGroup,	
           NID,
           Address,	
           Password } = req.body;
   
       
       const response =  await (fetch(`http://192.168.0.121:9010/api/docinfoupdate/${id}`, 
       { 
           method: 'PUT', 
           body:JSON.stringify({
               RegistrationNo,
               FirstName,	
               LastName,	
               userName,	
               PhoneNumber	,
               Gender,
               DateOfBirth,
               BloodGroup,	
               NID,
               Photo,
               Address,	
               Password}),
               headers: { 'Content-Type': 'application/json' } 
       }));
   
       console.log(response.body)
       if(response.status === 200){
           req.session.message={
               type:'alert-success',
               intro:'Created!',
               message:'Profile Updated!.'
           }
           res.redirect(`/doctor-profile-settings/${id}`)
       }
       if(response.status === 401){
           req.session.message={
               type:'alert-danger',
               intro:'Created!',
               message:'Invalid Data.'
           }
           res.redirect(`/doctor-profile-settings/${id}`)
       }
       else if( response.status === 409){
           req.session.message={
               type:'alert-danger',
               intro:'Created!',
               message:'Invalid Data.'
           }
           res.redirect("/doctor-profile-settings")
       }
       const data = await  response.json()
       console.log(data)
    } catch (error) {
        console.log(error)
    }
   
})


module.exports =  router;