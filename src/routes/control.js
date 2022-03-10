
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
//const auth = require('../middleware/authenticate')



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
const auth = require("../middleware/authenticate");
const { isObject } = require('util');
const { stringify } = require('nodemon/lib/utils');


// Home route
router.get("/",async(req,res)=>{

    fetch('http://192.168.0.121:9010/api/getdocnurserlistfeatured')
    .then(res => res.json())
    .then(dataDoc =>{
        fetch('http://192.168.0.121:9010/api/getdepartment')
        .then(res => res.json())
        .then(dataDepartment=>{
            res.render("index",{dataDoc,dataDepartment})
        })
       
    });
     
});


// get doctorlist by department
router.get("/find-doctor/:department", async(req,res)=>{

    const departmentID =  req.params.department;
     fetch(`http://192.168.0.121:9010/api/getdocnurserlist/${departmentID}`)
    .then(res => res.json())
    .then(dataDoclist =>{
        fetch('http://192.168.0.121:9010/api/getdepartment')
        .then(res => res.json())
        .then(departmentData =>{
           ///===================
        console.log(dataDoclist)
        res.render("doctorlistByDepartment",{dataDoclist,departmentData})
        });
    
    });

    

});


// doctor search result
router.get("/searchresult",(req,res)=>{
    fetch('http://192.168.0.121:9010/api/getdepartment')
    .then(res => res.json())
    .then(departmentData =>{
        fetch(`http://192.168.0.121:9010/api/getdocnurserlist`)
        .then(res => res.json())
        .then(dataDoclist =>{
        ///===================
            console.log(dataDoclist)
            res.render("search",{dataDoclist,departmentData})
        });
    });
    
 });


// patient register
router.get("/patient-register",(req,res)=>{
    res.render("patient/patient-register")  
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
        res.redirect(`/otp-verify/${phone}`)
    }
    if(response.status === 409){
        req.session.message={
            type:'alert-danger',
            intro:'Created!',
            message:'Invalid Registration.'
        }
        res.redirect("/patient-register")
    }
    const data = await  response.json()
    console.log(data)

});



// otp verify route
router.get("/otp-verify/:mob",(req,res)=>{
    const mob =req.params.mob;
    res.render("otp-verify",{mob});  
 });
 

 router.post("/otp-verify/:mob", async(req,res)=>{
    const mob =  req.params.mob
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
        res.redirect(`/otp-verify/${mob}`)
    }
    if(response.status === 409){
        req.session.message={
            type:'alert-danger',
            intro:'Created!',
            message:'Invalid Code.'
        }
        res.redirect(`/otp-verify/${mob}`)
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

//=================================== NURSE MODULE START================================================== 

// nurse register
router.get("/nurse-register",(req,res)=>{
    res.render("nurse/nurse-register")
});


router.post("/nurse-register",async(req,res)=>{
      
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
        res.redirect(`/otp-verify/${phone}`)
    }
    if(response.status === 409){
        req.session.message={
            type:'alert-danger',
            intro:'Created!',
            message:'Invalid Registration.'
        }
        res.redirect("/nurse-register")
    }
    const data = await  response.json()
    console.log(data)

});

//=================================== NURSE MODULE END================================================== 

// expericen insert
router.post('/experienceinsert/:id',async(req,res)=>{
    var {institutionName,designation,start_date,end_date} = req.body;
    console.log(req.body)
    const response =  await (fetch(`http://192.168.0.121:9010/api/experienceinsert/${req.params.id}`, 
    { 
        method: 'POST', 
        body: JSON.stringify({institutionName,designation,start_date,end_date}),
        headers: { 'Content-Type': 'application/json' }
    }));
    req.session.message={
        type:'alert-success',
        intro:'Created!',
        message:'Data Updated Successfully.'
    }
    res.redirect(`/profile-settings/${req.params.id}`)
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
     req.session.message={
        type:'alert-success',
        intro:'Created!',
        message:'Data Updated Successfully.'
    }
    res.redirect(`/profile-settings/${id}`)

   
})

// chamber insert
router.post('/chamberinsert/:id',async(req,res)=>{
    var {institutionName,location,day,start_time,end_time} = req.body;
    console.log(req.body)
    const response =  await (fetch(`http://192.168.0.121:9010/api/chamberinsert/${req.params.id}`, 
    { 
        method: 'POST', 
        body: JSON.stringify({institutionName,location,day,start_time,end_time}),
        headers: { 'Content-Type': 'application/json' }
    }));
    req.session.message={
        type:'alert-success',
        intro:'Created!',
        message:'Data inserted Successfully.'
    }
    res.redirect(`/profile-settings/${req.params.id}`)
})

// chamber info update----------------
router.post("/chamberupdate/:id", async(req, res)=>{
    const id =  req.params.id;

    var {
         data_id,
         institutionName,
         location,
         day,
         start_time,
         end_time,
         } = req.body;  
      console.log(req.body);
     if(req.body.institutionName.length>0){
         for(var i=0;i<req.body.institutionName.length; i++){
            var institutionName = req.body.institutionName[i],
                location = req.body.location[i],
                day = req.body.day[i],
                start_time = req.body.start_time[i],
                end_time = req.body.end_time[i],
                data_id =  req.body.data_id[i]
             response =  await (fetch(`http://192.168.0.121:9010/api/chamberupdate/${id}`, 
            { 
                method: 'PUT', 
                body: JSON.stringify({
                    data_id,
                    institutionName,
                    location,
                    day,
                    start_time,
                    end_time}),
                    headers: { 'Content-Type': 'application/json' }
                
            }));

         }
         
     }

     req.session.message={
        type:'alert-success',
        intro:'Created!',
        message:'Data Updated Successfully.'
    }
    res.redirect(`/profile-settings/${id}`)
   
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

    console.log('response-status:',response.status)
    if(response.status === 200){
        req.session.message={
            type:'alert-success',
            intro:'Created!',
            message:'Welcome to Dashboard.'
        }
        const data = await  response.json()
        console.log("data:",data)
        res.cookie("jwtoken",data[0].Jwtoken,{
            expires:new Date(Date.now()+259000000),
            httpOnly:true
        });
           
        const token = req.cookies.checkout;
        if(token == 'no'){
            res.redirect("/checkout-test")
        }
        res.redirect("/dashboard")
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
            res.redirect(`/otp-verify/${phone}`)
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
router.get("/dashboard",auth,(req,res, next)=>{
   
    if(req.userData[0].UserType == 1){

        const id =  req.userData[0].DocNurID;
        console.log(id);
        fetch(`http://192.168.0.121:9010/api/getappoinmentlistbydoc/${id}`)
        .then(res =>res.json())
        .then(appointmentdata =>{
            console.log(appointmentdata.length)
            // current date
            var date = new Date();
            console.log(date)

            var timezoneOffset = date.getMinutes() + date.getTimezoneOffset();
            var timestamp = date.getTime() + timezoneOffset * 1000;
            var correctDate = new Date(timestamp);
            
            correctDate.setUTCHours(0, 0, 0, 0);
            var current_date = correctDate.toISOString()
            var d = current_date;
            d = d.split('T');
            console.log("d=",d[0]);

            var TodayData =[];
            var UPcommingData =[];
            for(var i = 0; i<appointmentdata.length;i++){
                if(appointmentdata[i].BookingDate == d[0]){
                 TodayData.push(appointmentdata[i]);

                }
                else{
                    UPcommingData.push(appointmentdata[i])
                }
            }  
            res.render("doctor/doctor-dashboard",{userData:req.userData,appointmentdata:UPcommingData,TodayData})
        });  
    }
    else if(req.userData[0].UserType == 2){

        const id =  req.userData[0].DocNurID;
        console.log(id);
        fetch(`http://192.168.0.121:9010/api/getappoinmentlistbydoc/${id}`)
        .then(res =>res.json())
        .then(appointmentdata =>{
            console.log(appointmentdata.length)
            // current date
            var date = new Date();
            console.log(date)

            var timezoneOffset = date.getMinutes() + date.getTimezoneOffset();
            var timestamp = date.getTime() + timezoneOffset * 1000;
            var correctDate = new Date(timestamp);
            
            correctDate.setUTCHours(0, 0, 0, 0);
            var current_date = correctDate.toISOString()
            var d = current_date;
            d = d.split('T');
            console.log("d=",d[0]);

            var TodayData =[];
            var UPcommingData =[];
            for(var i = 0; i<appointmentdata.length;i++){
                if(appointmentdata[i].BookingDate == d[0]){
                 TodayData.push(appointmentdata[i]);

                }
                else{
                    UPcommingData.push(appointmentdata[i])
                }
            }  
            res.render("nurse/nurse-dashboard",{userData:req.userData,appointmentdata:UPcommingData,TodayData})
        });  
    }
    else{

        fetch(`http://192.168.0.121:9010/api/getappoinmentlistbypatientid/${req.userData[0].PatientID}`)
        .then(res =>res.json())
        .then(appointmentdata =>{
            fetch(`http://192.168.0.121:9010/api/getprescriptionlistbypatientid/${req.userData[0].PatientID}`)
            .then(res =>res.json())
            .then(prescriptiondata =>{
                res.render("patient/patient-dashboard",{userData:req.userData,appointmentdata:appointmentdata,prescriptiondata})
            });

           
        });
       
    }
    
})

// get appointment list by doctor Id
router.get("/appointmentlistindoctorend/:patientID",auth,(req,res)=>{
    fetch(`http://192.168.0.121:9010/api/getappoinmentlistbydoc/${req.params.patientID}`)
        .then(res =>res.json())
        .then(appointmentdata =>{
            res.render("doctor/appointmentlist",{userData:req.userData,appointmentdata:appointmentdata})
        });
  
})


// get appointment list by patientID
router.get("/appointmentlistinpatientend/:patientID",auth,(req,res)=>{
    fetch(`http://192.168.0.121:9010/api/getappoinmentlistbypatientid/${req.params.patientID}`)
        .then(res =>res.json())
        .then(appointmentdata =>{
            res.render("patient/appointmentlist",{userData:req.userData,appointmentdata:appointmentdata})
        });
  
})


// singleappointmentview by appointment id(doctor /patient same)

router.get("/singleappointmentview/:invoiceid",auth,(req,res)=>{
    fetch(`http://192.168.0.121:9010/api/singleinvoice/${req.params.invoiceid}`)
        .then(res =>res.json())
        .then(singleinvoicedata =>{
            console.log("usertype:",req.userData[0].UserType)
            if(req.userData[0].UserType == '1'){
              res.render("doctor/invoice-view",{userData:req.userData,singleinvoicedata})
            }
            else{
                res.render("patient/invoice-view",{userData:req.userData,singleinvoicedata})
            }
            
        });
  
})

//  profile settings
router.get("/profile-settings/:id",auth,(req,res)=>{
    if(req.userData[0].UserType == 1){
        const id =  req.params.id;
        fetch(`http://192.168.0.121:9010/api/singledoctor/${id}`)
        .then(res => res.json())
        .then(singleDocData =>{
            //console.log(singleDocData)
            res.render("doctor/doctor-profile-settings",{singleDocData,userData:req.userData})
        });
    }
    else if(req.userData[0].UserType == 2){
        const id =  req.params.id;
        fetch(`http://192.168.0.121:9010/api/singledoctor/${id}`)
        .then(res => res.json())
        .then(singleDocData =>{
            //console.log(singleDocData)
            res.render("nurse/nurse-profile-settings",{singleDocData,userData:req.userData})
        });
    }
    else{
        console.log(req.userData)
        res.render("patient/patient-profile-settings",{userData:req.userData})
    }
  
})


// patient profile setting update

router.post("/patient-profile-update",(req,res)=>{

})


router.get("/change-password/:id", auth,(req,res)=>{
    res.render("doctor/change-password",{userData:req.userData})
});


router.get("/reviews/:id", auth,(req,res)=>{
    res.render("doctor/reviews",{userData:req.userData})
});

// router.get("/doctor-profile-settings/:id", (req,res)=>{
//     const id =  req.params.id;
//     fetch(`http://192.168.0.121:9010/api/singledoctor/${id}`)
//     .then(res => res.json())
//     .then(singleDocData =>{
//         res.render("doctor-profile-settings",{singleDocData})
//     });

// });


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

router.post("/updatefees/:id",async(req,res)=>{
    const id =  req.params.id;
    const {homeFees,onlineFees} =  req.body;
    const response =  await (fetch(`http://192.168.0.121:9010/api/feesupdate/${id}`, 
    { 
        method: 'PUT', 
        body: JSON.stringify(req.body),
        headers: { 'Content-Type': 'application/json' }
    }));

    console.log(response.status)
    if(response.status === 200){
        req.session.message={
            type:'alert-success',
            intro:'Created!',
            message:'Data Updated'
        }
        res.redirect(`/profile-settings/${id}`)
    }

});

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

     req.session.message={
        type:'alert-success',
        intro:'Created!',
        message:'Data Updated Successfully.'
    }
    res.redirect(`/profile-settings/${id}`)
   
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
    res.redirect(`/profile-settings/${docid}`)
})
// doctor profile update----------------
router.post("/doctor-profile-settings/:id",  async(req, res)=>{

    try {
        const id =  req.params.id;
        var Photo ='';
        if(req.files){
             Photo =  req.files.photo.name;
        }
       var {
           RegistrationNo,
           FirstName,	
           LastName,	
           userName,	
           PhoneNumber,
           Gender,
           DateOfBirth,
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
           res.redirect(`/profile-settings/${id}`)
       }
       if(response.status === 401){
           req.session.message={
               type:'alert-danger',
               intro:'Created!',
               message:'Invalid Data.'
           }
           res.redirect(`/profile-settings/${id}`)
       }
       else if( response.status === 409){
           req.session.message={
               type:'alert-danger',
               intro:'Created!',
               message:'Invalid Data.'
           }
           res.redirect("/profile-settings")
       }
       const data = await  response.json()
       console.log(data)
    } catch (error) {
        console.log(error)
    }
   
})



// single doctor-profile view

router.get('/singledoctorprofile/:id',(req,res)=>{
    const id =  req.params.id;
    fetch(`http://192.168.0.121:9010/api/singledoctor/${id}`)
    .then(res => res.json())
    .then(singleDocData =>{
        console.log(singleDocData)
        res.render("doctor-profile",{singleDocData})
    });
})


router.post('/feedback/:id',async(req,res)=>{
     const id =  req.params.id;
    var{rating,reviewTitle,reviewDetails,name,userName} = req.body
        const response =  await (fetch(`http://192.168.0.121:9010/api/feedbackinsert/${id}`, 
        { 
            method: 'POST', 
            body: JSON.stringify(req.body),
            headers: { 'Content-Type': 'application/json' }
        }));

        if(response.status === 200){
            req.session.message={
                type:'alert-success',
                intro:'Created!',
                message:'You have puted a comment.'
            }
            res.redirect(`/singledoctorprofile/${id}`)
        }
        const data = await  response.json()
        console.log(data)
})


// checkout page
router.get("/checkout/:docNurId", auth, (req,res)=>{
    console.log("auth data",req.userData)
    const id =  req.params.docNurId
    fetch(`http://192.168.0.121:9010/api/singledoctor/${id}`)
    .then(res => res.json())
    .then(singleDocData =>{
        res.render("patient/checkout",{singleDocData, userData:req.userData})
    });
});

// booking success

router.get("/booking-success/",auth,(req,res)=>{
   const queryData=  [req.query];
   console.log(queryData)
    res.render('booking-success',{queryData,userData:req.userData})
})

// viewinvoice
router.get("/viewinvoice/",auth,(req,res)=>{
    const queryData=  [req.query];
    console.log(queryData)
     res.render('invoice-view',{userData:req.userData,queryData})
 })

// making appointment
router.post("/makeappointment",async(req,res)=>{
    var{firstName,lastName,email,phone,paymentMethod,doctorName,docNurID,bookingDate,bookingTime,serviceType,totalAmount} = req.body
    const response =  await (fetch(`http://192.168.0.121:9010/api/appointmentinsert`, 
    { 
        method: 'POST', 
        body: JSON.stringify(req.body),
        headers: { 'Content-Type': 'application/json' }
    }));

    console.log("response:",response)
    if(response.status === 200){
        req.session.message={
            type:'alert-success',
            intro:'Created!',
            message:'Successfully made appointment.'
        }
        res.redirect(`/booking-success?name=${doctorName}&date=${bookingDate}&time=${bookingTime}`)
    }
    else if(response.status === 205){
        req.session.message={
            type:'alert-warning',
            intro:'Created!',
            message:'Appointment already done'
        }
        res.redirect('back')
    }
    const data = await  response.json()
    console.log("data",data)

});


// logout


router.get('/logout',(req,res)=>{
    try {
        res.clearCookie("jwtoken");
        console.log("logout success...");
        res.redirect("/login");
    } catch (error) {
        res.status(500).send(error)
        
    }
})



// find-doctor

router.get('/specialities',auth,(req,res)=>{
       fetch('http://192.168.0.121:9010/api/getdepartment')
       .then(res => res.json())
       .then(departmentData =>{
         res.render("patient/find-doctor",{userData:req.userData,departmentData})
   
   });
   
})




//doctor result by department 
router.get("/doctors", auth, async(req,res)=>{
    const departmentID =  req.query.specialities;
     fetch(`http://192.168.0.121:9010/api/getdocnurserlist/${departmentID}`)
    .then(res => res.json())
    .then(dataDoclist =>{
        fetch('http://192.168.0.121:9010/api/getdepartment')
        .then(res => res.json())
        .then(departmentData =>{
            fetch(`http://192.168.0.121:9010/api/getfavouriledoclist/${req.userData[0].PatientID}`)
            .then(res => res.json())
            .then(favdoclist =>{
               ///===================
            console.log("favdoclist:",favdoclist)
            res.render("patient/doctorByDepartment",{dataDoclist,departmentData,userData:req.userData,favdoclist})
            });
           ///===================
        });
    
    });

    

});

// single doctor profileview when user is logged
router.get('/singledoctorprofileview/:id',auth,(req,res)=>{
    const id =  req.params.id;
    fetch(`http://192.168.0.121:9010/api/singledoctor/${id}`)
    .then(res => res.json())
    .then(singleDocData =>{
        console.log(singleDocData)
        res.render("patient/singleDoctorProfileView",{singleDocData,userData:req.userData})
    });
});


// get favourite doctorlist by patient id
router.get('/favouritedoctorlist/:PatientID',auth,(req,res)=>{
    const PatientID =  req.params.PatientID;
    fetch(`http://192.168.0.121:9010/api/getfavouriledoclist/${PatientID}`)
    .then(res => res.json())
    .then(favdoclist =>{
        console.log(favdoclist)
        res.render("patient/favourites",{favdoclist,userData:req.userData})
    });
    

});


// make favourite
router.get('/makefavourite/:patientID/:DoctorID',async (req,res)=>{
    const PatientID =  req.params.patientID;
    const DoctorID =  req.params.DoctorID;
        const response =  await (fetch(`http://192.168.0.121:9010/api/makefavourite/${PatientID}/${DoctorID}`, 
        { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }
        }));

        if(response.status === 200){
            req.session.message={
                type:'alert-success',
                intro:'Created!',
                message:'You have added to your favourite list'
            }
            res.redirect('back');
        }
        const data = await  response.json()
        console.log(data)
});
// make unfavourite
router.get('/makeunfavourite/:patientID/:DoctorID',async (req,res)=>{
    const PatientID =  req.params.patientID;
    const DoctorID =  req.params.DoctorID;
        const response =  await (fetch(`http://192.168.0.121:9010/api/removefavdoc/${PatientID}/${DoctorID}`, 
        { 
            method: 'DELETE', 
            headers: { 'Content-Type': 'application/json' }
        }));

        if(response.status === 200){
            req.session.message={
                type:'alert-success',
                intro:'Created!',
                message:'You have removed from your favourite list'
            }
            res.redirect('back');
        }
        const data = await  response.json()
        console.log(data)
});


// status update appoinment

router.get('/appointmentstatusupdate/:id/:status',async (req,res)=>{
    const appID =  req.params.id;
    const status =  req.params.status;
        const response =  await (fetch(`http://192.168.0.121:9010/api/appointmentstatusupdate/${appID}/${status}`, 
        { 
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json' }
        }));

        if(response.status === 200){
            req.session.message={
                type:'alert-success',
                intro:'Created!',
                message:'Status has been Changed'
            }
            res.redirect('back');
        }
        const data = await  response.json()
        console.log(data)
});


// live message
router.get("/user-send-message",(req,res)=>{

    
    res.render('message/login')
});
router.get("/get-message",(req,res)=>{
    res.render('message/admin')
});



// chat patient
router.get("/chat-patient",auth,(req,res)=>{
    fetch(`http://192.168.0.121:9010/api/messagelistbypatientid/${req.userData[0].PatientID}`)
    .then(res => res.json())
    .then(doctorlist =>{
        //console.log(doctorlist)
        res.render("patient/chat",{userData:req.userData,doctorlist})
    });
});

// single doctor and patient chat list
router.get("/chat-patient/:DocNurID/:PatientID",auth,(req,res)=>{

    fetch(`http://192.168.0.121:9010/api/singledoctorchat/${req.params.DocNurID}/${req.params.PatientID}`)
    .then(res => res.json())
    .then(Chatlist =>{
        for(var i = 0;i<Chatlist.messageList.length;i++){
            if(Chatlist.messageList[i].Sender == req.params.PatientID){
                Chatlist.messageList[i].status = 'sent'
            }
            else{
                Chatlist.messageList[i].status = 'received'
            }
           
            
        }
        
        fetch(`http://192.168.0.121:9010/api/messagelistbypatientid/${req.userData[0].PatientID}`)
            .then(res => res.json())
            .then(doctorlist =>{
                //console.log(doctorlist)
                res.render("patient/singlechat",{userData:req.userData,Chatlist,doctorlist})
            });
      
       
    });
});

// single doctor and patient chat list
router.get("/chat-doctor/:DocNurID/:PatientID", auth,(req,res)=>{

    fetch(`http://192.168.0.121:9010/api/singlepatientchat/${req.params.DocNurID}/${req.params.PatientID}`)
    .then(res => res.json())
    .then(Chatlist =>{
        for(var i = 0;i<Chatlist.messageList.length;i++){
            if(Chatlist.messageList[i].Sender == req.params.DocNurID){
                Chatlist.messageList[i].status = 'sent'
            }
            else{
                Chatlist.messageList[i].status = 'received'
            }
           
        }
        
        fetch(`http://192.168.0.121:9010/api/messagelistbydocnurid/${req.params.DocNurID}`)
            .then(res => res.json())
            .then(doctorlist =>{
                //console.log(doctorlist)
                res.render("doctor/singlechat",{userData:req.userData,Chatlist,doctorlist})
            });
      
       
    });
});


// chat-doctor
router.get("/chat-doctor",auth,(req,res)=>{
    fetch(`http://192.168.0.121:9010/api/messagelistbydocnurid/${req.userData[0].DocNurID}`)
    .then(res => res.json())
    .then(doctorlist =>{
       
        res.render("doctor/chat",{userData:req.userData,doctorlist})
    });
    
});

// chat-doctor
router.get("/scheduling/:docnurid",auth,(req,res)=>{
    const DocNurID =  req.params.docnurid;
    res.render("doctor/scheduling",{userData:req.userData})
});


// make prescription
router.post("/makeprescription",async(req,res)=>{
    var{DocNurID,
        PatientID,
        PatientType,
        PatientName,
        PatientGender,
        PatientAge,
        PatientMob,
        PatientSymtomps,
        DoctorName,
        DoctorMob,
        DocGender} = req.body
        console.log("body data",req.body)
    const response =  await (fetch(`http://192.168.0.121:9010/api/makeprescription`, 
    { 
        method: 'POST', 
        body: JSON.stringify(req.body),
        headers: { 'Content-Type': 'application/json' }
    }));

    console.log("response:",response)
    if(response.status === 200){
        req.session.message={
            type:'alert-success',
            intro:'Created!',
            message:'Successfully made Prescription.'
        }
        res.redirect('back')
    }
    else if(response.status === 205){
        req.session.message={
            type:'alert-warning',
            intro:'Created!',
            message:'Appointment already done'
        }
        res.redirect('back')
    }
    const data = await  response.json()
    console.log("data",data)

});


// single prescription view
router.get("/singleprescriptionview/:id",auth,(req,res)=>{

    fetch(`http://192.168.0.121:9010/api/singleprescription/${req.params.id}`)
    .then(res => res.json())
    .then(singlePresData =>{
        console.log(singlePresData)
        res.render("patient/singleprescription",{userData:req.userData,singlePresData})
    });
    
});

// hospital list
router.get("/hospitallist",(req,res)=>{
    fetch(`http://192.168.0.121:9010/api/gethospitallist`)
    .then(res => res.json())
    .then(hospitalList =>{
        console.log(hospitalList)
        res.render("lab/hospital-list",{hospitalList})
    });
    
});
// hospital list
router.get("/singlehospital/:id",(req,res)=>{
    const hospital_id =  req.params.id;
    fetch(`http://192.168.0.121:9010/api/getbranchlistbyhospitalid/${hospital_id}`)
    .then(res => res.json())
    .then(branchlist =>{
        fetch(`http://192.168.0.121:9010/api/getallservicelistbyhospitalid/${hospital_id}`)
            .then(res => res.json())
            .then(servicelist =>{
                console.log(servicelist)
                const data = JSON.stringify(servicelist)
                res.render("lab/single-hospital",{branchlist,servicelist,data})
            });
    });
    
    
});

// get location

router.get("/getlocation",(req,res)=>{

   fetch(`http://192.168.0.121:9010/api/gettestlist`)
   .then(res => res.json())
   .then(servicelist =>{
       res.render("getlocation",{servicelist})
   });
    
});

router.post("/lablisttestid",(req,res)=>{
    const testid =  req.body.testName
    fetch(`http://192.168.0.121:9010/api/lablistbytestid/${testid}`)
   .then(res => res.json())
   .then(lablist =>{
       if(lablist.length<1){

           console.log("no data found!!")
           res.render("lab/search",{lablist,msg:"No Data Found!!!"})
       }else{
          const data = JSON.stringify(lablist)
        res.render("lab/search",{lablist,data})
       }
       
   });
});
router.get("/lablisttestid",(req,res)=>{
    res.redirect('back')
});
// test-checkout
router.get("/checkout-test", auth,(req,res)=>{
    // console.log("auth is working");  
   res.render('patient/checkout-test',{userData:req.userData})
});


// test-checkout
router.post("/checkout-test", auth,(req,res)=>{
    // console.log("auth is working");  
    console.log(req.body)
    res.render('patient/checkout-test',{userData:req.userData})
});

// video calling receiver
router.get("/videocalling-reciever", auth,(req,res)=>{
    // console.log("auth is working");  
   res.render('patient/video-receiver',{userData:req.userData})
});

// video calling sender
router.get("/videocalling-sender", auth,(req,res)=>{
    // console.log("auth is working");  
   res.render('doctor/video-sender',{userData:req.userData})
});











module.exports =  router;