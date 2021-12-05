
const { query } = require('express');
const dotenv =  require('dotenv');
dotenv.config({path:'../config.env'});

const auth = async (req, res, next) =>{
    console.log('i am inside authenticate')
    try {
       
        const token = req.cookies.jwtoken;
        const sql = `SELECT * FROM userinfo WHERE jwtoken = '${token}'`;
        con.query(sql,(err,result)=>{
            console.log("this is mysql error part:",err)
            if(result.length>0){  
              req.userData =  result;
            }
            else{
                res.redirect('/admin/login')
            }
           next()
          })   
    } catch (error) {
        res.status(401).render("/admin/login")
    }
}

module.exports =  auth;