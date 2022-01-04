
const { query, response } = require('express');
const dotenv =  require('dotenv');
const fetch  = require("node-fetch");

const root_url = 'http://192.168.0.121:9010'

const auth = async (req, res, next) =>{
    console.log('i am inside authenticate')
    try {
        // console.log("auth is working");
        const token = req.cookies.jwtoken;
        // var response =  await (fetch(`http://192.168.0.121:9010/api/userauth/${token}`, 
        // { 
        //     method: 'GET',  
        // }));
        // if(response.status == 401){
        //     res.redirect('/login')
        // }
        // console.log("response:",response.headers)


    fetch(`http://192.168.0.121:9010/api/userauth/${token}`)
    .then(res => res.json())
    .then(singleDocData =>{
         console.log(singleDocData)
        if(singleDocData.userData.length<1){
            req.session.message={
                type:'alert-danger',
                intro:'Created!',
                message:'Login Please!!'
            }
            res.redirect("/login")  
        }
        else{
            for(var i=0;i< singleDocData.userData.length;i++){
                singleDocData.userData[i].Photo = `${root_url}${singleDocData.userData[i].Photo}`
            }
            req.userData = singleDocData.userData;
           
            return next()
        }
       
       
        // res.render("doctor-profile",{singleDocData})
    });
    
    
 
    } catch (error) {
        console.log(error)
        res.status(401).render("login")
    }
}






module.exports =  auth;
