const hbs = require("hbs");
const { handlebars } = require("hbs");
const { all } = require("../routes/control");
// accpet/reject/pending
hbs.registerHelper("statusDisplay",(status)=>{
  
  if(status == 'Accepted'){
    return new handlebars.SafeString(`<a href="javascript:void(0);" class="btn btn-sm bg-success-light">
    <i class="fas fa-check"></i> Accepted
    </a>`)
  }
  else if(status == 'Rejected'){
    return new handlebars.SafeString(`<a href="javascript:void(0);" class="btn btn-sm bg-danger-light">
    <i class="fas fa-times"></i> Canceled
    </a>`)
  }
  else{
    return new handlebars.SafeString(`<a href="javascript:void(0);" class="btn btn-sm bg-info-light">
    <i class="far fa-eye"></i> Pending
    </a>`)
  }


})

// makeFavUnFav
hbs.registerHelper("makeFavUnFav",(allFavList,docId,PatientID)=>{
    console.log("docId",docId)
    if(allFavList.length>0){
        for(var i = 0;i<allFavList.length;i++){
             
            if(allFavList[i].DocNurID == docId){
                console.log("matched!")
               return new handlebars.SafeString(`<a href="/makeunfavourite/${PatientID}/${docId}">
               <i class="far fa-bookmark bg-danger p-1" style="color: #FFFFFF;" title="Remove favourite"></i>
             </a>`)
            }
            else{
              return new handlebars.SafeString(`<a href="/makefavourite/${PatientID}/${docId}">
              <i class="far fa-bookmark p-1" title="Add to Favourite"></i>
            </a>`)
            }
          }
    }
    else{
        return new handlebars.SafeString(`<a href="/makefavourite/${PatientID}/${docId}">
              <i class="far fa-bookmark p-1" title="Add to Favourite"></i>
            </a>`)
    }
  


})
// department name display
hbs.registerHelper("departmentNameDisplay",(allDepartment,singleDepartmentID)=>{
    for(var i = 0;i<allDepartment.length;i++){

      if(allDepartment[i].Dept_ID == singleDepartmentID){
          
         // return allDepartment[i].name;
         return new handlebars.SafeString(`<h5 class="doc-department"><img
         src="${allDepartment[i].Photo}" class="img-fluid"
         alt="Speciality">${allDepartment[i].name}</h5> `)
      }
    }

    // return new handlebars.SafeString(a)
})



hbs.registerHelper("reviewShow",(length)=>{
    var rating = Math.round(length)
    var a = '';
    for(var i = 0;i<rating;i++){

        a = a + '<i class="fas fa-star filled"></i>'; 
    }

    return new handlebars.SafeString(a)
})

// Home footer
hbs.registerHelper("homeFooter", ()=>{
   
    return new handlebars.SafeString(`<footer class="footer">

    <div class="footer-top">
        <div class="container-fluid">
            <div class="row">
                <div class="col-lg-3 col-md-6">

                    <div class="footer-widget footer-about">
                        <div class="footer-logo">
                            <h2 style="font-weight: 700; color:aliceblue">ECALL</h2>
                        </div>
                        <div class="footer-about-content">
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. </p>
                            <div class="social-icon">
                                <ul>
                                    <li>
                                        <a href="#" target="_blank"><i class="fab fa-facebook-f"></i> </a>
                                    </li>
                                    <li>
                                        <a href="#" target="_blank"><i class="fab fa-twitter"></i> </a>
                                    </li>
                                    <li>
                                        <a href="#" target="_blank"><i class="fab fa-linkedin-in"></i></a>
                                    </li>
                                    <li>
                                        <a href="#" target="_blank"><i class="fab fa-instagram"></i></a>
                                    </li>
                                    <li>
                                        <a href="#" target="_blank"><i class="fab fa-dribbble"></i> </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="col-lg-3 col-md-6">

                    <div class="footer-widget footer-menu">
                        <h2 class="footer-title">Quick Links</h2>
                        <ul>
                            <li><a href="/aboutus">About Us</a></li>
                            <li><a href="/howitworks">How It Works</a></li>
                            <li><a href="/features">Features</a></li>
                            <li><a href="/blog">Blog</a></li>
                            <li><a href="/contactus">Contact Us</a></li>
                        </ul>
                    </div>

                </div>
                <div class="col-lg-3 col-md-6">

                    <div class="footer-widget footer-menu">
                        <h2 class="footer-title">Quick Links</h2>
                        <ul>
                            <li><a href="/fordoctors">For Doctors</a></li>
                            <li><a href="chat.html">DocTime for Enterprises</a></li>
                            <li><a href="login.html">Terms & Conditions</a></li>
                            <li><a href="doctor-register.html">Privacy Policy</a></li>
                            <li><a href="doctor-dashboard.html">FAQs</a></li>
                        </ul>
                    </div>

                </div>
                <div class="col-lg-3 col-md-6">

                    <div class="footer-widget footer-contact">
                        <h2 class="footer-title">Quick Links</h2>
                        <div class="footer-contact-info">
                            <div class="footer-address">
                                <span><i class="fas fa-map-marker-alt"></i></span>
                                <p> 68/5 Namroneel Banani DOHS,<br> Dhaka, Bangladesh</p>
                            </div>
                            <p>
                                <i class="fas fa-phone-alt"></i>
                                +1 315 369 5943
                            </p>
                            <p class="mb-0">
                                <i class="fas fa-envelope"></i>
                                <a href="/cdn-cgi/l/email-protection" class="__cf_email__"
                                    data-cfemail="f4909b9797818691b4918c9599849891da979b99">[email&#160;protected]</a>
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>


    <div class="footer-bottom">
        <div class="container-fluid">

            <div class="copyright">
                <div class="row">
                    <div class="col-md-6 col-lg-6">
                        <div class="copyright-text">
                            <p class="mb-0">&copy; 2022 Ecall. All rights reserved.</p>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <div class="copyright-menu">
                            <ul class="policy-menu">
                                <li><a href="term-condition.html">Terms and Conditions</a></li>
                                <li><a href="privacy-policy.html">Policy</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>

</footer>

</div>


<script data-cfasync="false" src="/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js"></script>
<script src="assets/js/jquery-3.6.0.min.js"></script>

<script src="assets/js/bootstrap.bundle.min.js"></script>

<script src="assets/js/slick.js"></script>

<script src="assets/js/script.js"></script>
</body>

</html>
    `)

});
// Home header
hbs.registerHelper("homeHeader", ()=>{
   
    return new handlebars.SafeString(`<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0">
        <title>Ecall</title>
        <link type="image/x-icon" href="/assets/img/favicon.png" rel="icon">
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css">
        <!-- <link rel="stylesheet" href="/assets/plugins/fontawesome/css/fontawesome.min.css"> -->
        <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" />
        <link rel="stylesheet" href="/assets/css/style.css">
        <!--[if lt IE 9]>
                <script src="/assets/js/html5shiv.min.js"></script>
                <script src="assets/js/respond.min.js"></script>
        <![endif]-->
    </head>
    
    <body>
    
        <div class="main-wrapper">
    
            <header class="header">
                <nav class="navbar navbar-expand-lg header-nav">
                    <div class="navbar-header">
                        <a id="mobile_btn" href="javascript:void(0);">
                            <span class="bar-icon">
                                <span></span>
                                <span></span>
                                <span></span>
                            </span>
                        </a>
                        <a href="index.html" class="navbar-brand logo">
                            <img src="assets/img/logo.png" class="" height="80px" alt="Logo">
                        </a>
                    </div>
                    <div class="main-menu-wrapper">
                        <div class="menu-header">
                            <a href="index.html" class="menu-logo">
                                <img src="assets/img/logo.png" height="80px" class="" alt="Logo">
                            </a>
                            <a id="menu_close" class="menu-close"  href="javascript:void(0);">
                                <i class="fas fa-times"></i>
                            </a>
                        </div>
                        <ul class="main-nav">
                            <li class="has-submenu active">
                                <a href="">Home</a>
                            </li>
                            <li class="has-submenu">
                                <a href="">How Ecall Works </a>
                                
                            </li>
                            <li class="has-submenu">
                                <a href="">For Doctors </a>
                                
                            </li>
                            <li class="has-submenu">
                                <a href="">About us </a>
                                
                            </li>
                            <li class="has-submenu">
                                <a href="">FAQs </a>
                                
                            </li>
                        </ul>
                        </ul>
                    </div>
                    <ul class="nav header-navbar-rht">
                        <li class="nav-item contact-item">
                            <div class="header-contact-img">
                                <i class="far fa-hospital"></i>
                            </div>
                            <div class="header-contact-detail">
                                <p class="contact-header">Contact</p>
                                <p class="contact-info-header"> +1 315 369 5943</p>
                            </div>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link header-login" href="/login">login / Signup </a>
                        </li>
                    </ul>
                </nav>
            </header>
    `)

});
// patient header
hbs.registerHelper("patientHeader", (id,photo,name)=>{
   
    return new handlebars.SafeString(`<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="utf-8">
        <title>Doccure</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0">
    
        <link href="/assets/img/favicon.png" rel="icon">
    
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css">
    
        <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" />
    
        <link rel="stylesheet" href="/assets/css/bootstrap-datetimepicker.min.css">
    
        <link rel="stylesheet" href="/assets/plugins/select2/css/select2.min.css">
    
        <link rel="stylesheet" href="/assets/css/style.css">
    
        <!--[if lt IE 9]>
                <script src="/assets/js/html5shiv.min.js"></script>
                <script src="/assets/js/respond.min.js"></script>
            <![endif]-->
    </head>
    
    <body>
    
        <div class="main-wrapper">
    
            <header class="header">
                <nav class="navbar navbar-expand-lg header-nav">
                    <div class="navbar-header">
                        <a id="mobile_btn" href="javascript:void(0);">
                            <span class="bar-icon">
                                <span></span>
                                <span></span>
                                <span></span>
                            </span>
                        </a>
                        <a href="index.html" class="navbar-brand logo">
                            <img src="/assets/img/logo.png" height="80px"  alt="Logo">
                        </a>
                    </div>
                 
                    <ul class="nav header-navbar-rht">
                        <li class="nav-item contact-item">
                            <div class="header-contact-img">
                                <i class="far fa-hospital"></i>
                            </div>
                            <div class="header-contact-detail">
                                <p class="contact-header">Contact</p>
                                <p class="contact-info-header"> +1 315 369 5943</p>
                            </div>
                        </li>
    
                        <li class="nav-item dropdown has-arrow logged-item">
                            <a href="#" class="dropdown-toggle nav-link" data-bs-toggle="dropdown">
                                <span class="user-img">
                                    <img class="rounded-circle" src="${photo}" width="31"
                                        alt="Ryan Taylor">
                                </span>
                            </a>
                            <div class="dropdown-menu dropdown-menu-end">
                                <div class="user-header">
                                    <div class="avatar avatar-sm">
                                        <img src="${photo}" alt="User Image"
                                            class="avatar-img rounded-circle">
                                    </div>
                                    <div class="user-text">
                                        <h6>${name}</h6>
                                       
                                    </div>
                                </div>
                                <a class="dropdown-item" href="/dashboard">Dashboard</a>
                                <a class="dropdown-item" href="/profile-settings/${id}">Profile Settings</a>
                                <a class="dropdown-item" href="/logout">Logout</a>
                            </div>
                        </li>
    
                    </ul>
                </nav>
            </header>
    `)

});

// patient-sidebar
hbs.registerHelper("patientSideNav", (id)=>{
   
    return new handlebars.SafeString(` <nav class="dashboard-menu">
    <ul>
        <li>
            <a href="/dashboard">
                <i class="fas fa-columns"></i>
                <span>Dashboard</span>
            </a>
        </li>
        <li>
            <a href="/favouritedoctorlist/${id}">
                <i class="fas fa-bookmark"></i>
                <span>Favourites</span>
            </a>
        </li>
        <li>
            <a href="/dependent/${id}">
                <i class="fas fa-users"></i>
                <span>Dependent</span>
            </a>
        </li>
        <li>
            <a href="/chat-patient">
                <i class="fas fa-comments"></i>
                <span>Message</span>
                <small class="unread-msg">23</small>
            </a>
        </li>
        <li>
            <a href="/patient-accounts/${id}">
                <i class="fas fa-file-invoice-dollar"></i>
                <span>Accounts</span>
            </a>
        </li>
        <li>
            <a href="/specialities">
                <i class="fas fa-list-alt"></i>
                <span>Specialities</span>
                <small class="unread-msg">30</small>
            </a>
        </li>
        <li>
            <a href="/patient-medical-records/${id}">
                <i class="fas fa-clipboard"></i>
                <span>Add Medical Records</span>
            </a>
        </li>
        <li>
            <a href="/patient-medical-details/${id}">
                <i class="fas fa-file-medical-alt"></i>
                <span>Medical Details</span>
            </a>
        </li>
        <li class="active">
            <a href="/profile-settings/${id}">
                <i class="fas fa-user-cog"></i>
                <span>Profile Settings</span>
            </a>
        </li>
        <li>
            <a href="/change-password/${id}">
                <i class="fas fa-lock"></i>
                <span>Change Password</span>
            </a>
        </li>
        <li>
            <a href="/logout">
                <i class="fas fa-sign-out-alt"></i>
                <span>Logout</span>
            </a>
        </li>
    </ul>
</nav>`)

});
// doctor-sidebar
hbs.registerHelper("doctorSideNav", (id)=>{
   
    return new handlebars.SafeString(` 	<nav class="dashboard-menu">
    <ul>
        <li>
            <a href="/dashboard">
                <i class="fas fa-columns"></i>
                <span>Dashboard</span>
            </a>
        </li>
        <li>
            <a href="/appointments/${id}">
                <i class="fas fa-calendar-check"></i>
                <span>Appointments</span>
            </a>
        </li>
        <li>
            <a href="/my-patients/${id}">
                <i class="fas fa-user-injured"></i>
                <span>My Patients</span>
            </a>
        </li>
        <li>
            <a href="schedule-timings">
                <i class="fas fa-hourglass-start"></i>
                <span>Schedule Timings</span>
            </a>
        </li>
        <li>
            <a href="/available-timings/${id}">
                <i class="fas fa-clock"></i>
                <span>Available Timings</span>
            </a>
        </li>
        <li>
            <a href="/invoices/${id}">
                <i class="fas fa-file-invoice"></i>
                <span>Invoices</span>
            </a>
        </li>
        <li>
            <a href="/accounts/${id}">
                <i class="fas fa-file-invoice-dollar"></i>
                <span>Accounts</span>
            </a>
        </li>
        <li>
            <a href="/reviews/${id}">
                <i class="fas fa-star"></i>
                <span>Reviews</span>
            </a>
        </li>
        <li>
            <a href="/chat-doctor/${id}">
                <i class="fas fa-comments"></i>
                <span>Message</span>
                <small class="unread-msg">23</small>
            </a>
        </li>
        <li class="active">
            <a href="/profile-settings/${id}">
                <i class="fas fa-user-cog"></i>
                <span>Profile Settings</span>
            </a>
        </li>
        <li>
            <a href="social-media">
                <i class="fas fa-share-alt"></i>
                <span>Social Media</span>
            </a>
        </li>
        <li>
            <a href="/change-password/${id}">
                <i class="fas fa-lock"></i>
                <span>Change Password</span>
            </a>
        </li>
        <li>
            <a href="/logout">
                <i class="fas fa-sign-out-alt"></i>
                <span>Logout</span>
            </a>
        </li>
    </ul>
</nav>`)

});

// patient-sidebar
hbs.registerHelper("commonFooter", ()=>{
   
    return new handlebars.SafeString(`
    <footer class="footer">

    <div class="footer-top">
        <div class="container-fluid">
            <div class="row">
                <div class="col-lg-3 col-md-6">

                    <div class="footer-widget footer-about">
                        <div class="footer-logo">
                            <img src="/assets/img/footer-logo.png" alt="logo">
                        </div>
                        <div class="footer-about-content">
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. </p>
                            <div class="social-icon">
                                <ul>
                                    <li>
                                        <a href="#" target="_blank"><i class="fab fa-facebook-f"></i> </a>
                                    </li>
                                    <li>
                                        <a href="#" target="_blank"><i class="fab fa-twitter"></i> </a>
                                    </li>
                                    <li>
                                        <a href="#" target="_blank"><i class="fab fa-linkedin-in"></i></a>
                                    </li>
                                    <li>
                                        <a href="#" target="_blank"><i class="fab fa-instagram"></i></a>
                                    </li>
                                    <li>
                                        <a href="#" target="_blank"><i class="fab fa-dribbble"></i> </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="col-lg-3 col-md-6">

                    <div class="footer-widget footer-menu">
                        <h2 class="footer-title">For Patients</h2>
                        <ul>
                            <li><a href="search.html">Search for Doctors</a></li>
                            <li><a href="login.html">Login</a></li>
                            <li><a href="register.html">Register</a></li>
                            <li><a href="booking.html">Booking</a></li>
                            <li><a href="patient-dashboard.html">Patient Dashboard</a></li>
                        </ul>
                    </div>

                </div>
                <div class="col-lg-3 col-md-6">

                    <div class="footer-widget footer-menu">
                        <h2 class="footer-title">For Doctors</h2>
                        <ul>
                            <li><a href="appointments.html">Appointments</a></li>
                            <li><a href="chat.html">Chat</a></li>
                            <li><a href="login.html">Login</a></li>
                            <li><a href="doctor-register.html">Register</a></li>
                            <li><a href="doctor-dashboard.html">Doctor Dashboard</a></li>
                        </ul>
                    </div>

                </div>
                <div class="col-lg-3 col-md-6">

                    <div class="footer-widget footer-contact">
                        <h2 class="footer-title">Contact Us</h2>
                        <div class="footer-contact-info">
                            <div class="footer-address">
                                <span><i class="fas fa-map-marker-alt"></i></span>
                                <p> 3556 Beech Street, San Francisco,<br> California, CA 94108 </p>
                            </div>
                            <p>
                                <i class="fas fa-phone-alt"></i>
                                +1 315 369 5943
                            </p>
                            <p class="mb-0">
                                <i class="fas fa-envelope"></i>
                                <a href="/cdn-cgi/l/email-protection" class="__cf_email__"
                                    data-cfemail="74101b171701061134110c15190418115a171b19">[email&#160;protected]</a>
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>

    <div class="footer-bottom">
        <div class="container-fluid">

            <div class="copyright">
                <div class="row">
                    <div class="col-md-6 col-lg-6">
                        <div class="copyright-text">
                            <p class="mb-0">&copy; 2020 Doccure. All rights reserved.</p>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-6">

                        <div class="copyright-menu">
                            <ul class="policy-menu">
                                <li><a href="term-condition.html">Terms and Conditions</a></li>
                                <li><a href="privacy-policy.html">Policy</a></li>
                            </ul>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    </div>

</footer>

</div>


<script data-cfasync="false" src="/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js"></script>
<script src="/assets/js/jquery-3.6.0.min.js"></script>

<script src="/assets/js/bootstrap.bundle.min.js"></script>

<script src="/assets/plugins/select2/js/select2.min.js"></script>

<script src="/assets/js/moment.min.js"></script>
<script src="/assets/js/bootstrap-datetimepicker.min.js"></script>

<script src="/assets/plugins/theia-sticky-sidebar/ResizeSensor.js"></script>
<script src="/assets/plugins/theia-sticky-sidebar/theia-sticky-sidebar.js"></script>

<script src="/assets/js/script.js"></script>

<script>
$( document ).ready(function() {
    // alert auto hide-------------------------------------
    $(".alert").delay(4000).slideUp(200, function() {
        $(this).alert('close');
  });
});
</script>
</body>

</html>`)

});




// --------------------------------------ecall-end-------------------------------------------------------------
