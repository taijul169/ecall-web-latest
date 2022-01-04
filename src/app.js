const { static } = require("express");
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const dotenv =  require('dotenv')
const bodyParser =  require("body-parser");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const session = require('express-session');
const fileUpload = require("express-fileupload");
const flash = require('connect-flash');
const fs  = require("fs");
dotenv.config({path:'./config.env'});
const controlRoute = require("./routes/control");
const helpers = require("../src/middleware/register_helpers")

const app = express();
var http =  require("http").createServer(app)
var io = require("socket.io")(http)

const PORT = process.env.MYSQL_PORT;

// const Docregistration = require("./models/register");
// const Doctorappointment = require("./models/appointment");
const { handlebars } = require("hbs");

const staticPath = path.join(__dirname, "../public");
const templatePath = path.join(__dirname, "../templates/views");
const partialPath = path.join(__dirname, "../templates/partials");

// midleware
app.use(bodyParser.urlencoded({extended: true}));           
app.use(bodyParser.json())
app.use(fileUpload());

// // supporting json data
// app.use(express.json());
// getting cookie from browser
app.use(cookieParser())
app.use(session({
    secret:'secret',
    cookie:{maxAge:2000},
    resave:false,
    saveUninitialized:false
}));
app.use((req,res,next)=>{
    res.locals.message =  req.session.message
    delete req.session.messages;
    next()
})
app.use(flash());
// Middleware----

app.use('/', controlRoute);
app.use(express.static(staticPath));
app.set("view engine", "hbs");
app.set("views", templatePath);
hbs.registerPartials(partialPath);


// app.use(function(req, res, next) {
//     res.local.message = req.flash('message');
//     res.locals.error_msg = req.flash('error_msg');
//     res.locals.error = req.flash('error');
//     next();
//   })
// home-routing-----------------


// create-item-routing-----------------

// home-routing-----------------
// app.get("/create-item",(req, res)=>{
//     res.render("create-item");
// });

http.listen(PORT, ()=>{

    console.log(`Server is listening from:${PORT}`);
    io.on("connection",function(socket){
        console.log("User:" + socket.id)
        socket.on("messageSent",function(message){
            socket.broadcast.emit("messageSent",message)
          console.log(message)
        })
    })
});


