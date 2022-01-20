document.addEventListener("DOMContentLoaded", function(){
    var toastElementList = [].slice.call(document.querySelectorAll(".toast"));
    var toastList = toastElementList.map(function(element){
        return new bootstrap.Toast(element, {
            autohide: false
        });
    });
});

    



//append notification in toast container
var messagearea = document.getElementById('messagearea');  
var SenderID_noti = document.getElementById('SenderIDNoti');  
function appendMessage_noti(msg){
    var wrapdiv = document.createElement('div');
    wrapdiv.classList.add('toast', 'bg-primary' ,'text-white' ,'fade', 'show');
    

    let markup = ` <div class="toast-header bg-primary text-white">
        <strong class="me-auto"><i class="bi-gift-fill"></i> ${msg.Message.heading}</strong>
        <small>10 mins ago</small>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
    </div>
    <div class="toast-body">
        It's been a long time since you visited us. We've something special for you. <a class="btn btn-primary" onclick="appAccept('${msg.Message.PatientID}')" href="/chat-doctor/${msg.Message.DocNurID}/${msg.Message.PatientID}" class="text-white">Go To Live Chat</a>
    </div>
`
        wrapdiv.innerHTML= markup;
        messagearea.appendChild(wrapdiv)
}

function appendMessageAccept(msg){
    var wrapdiv = document.createElement('div');
    wrapdiv.classList.add('toast', 'bg-primary' ,'text-white' ,'fade', 'show');
    

    let markup = ` <div class="toast-header bg-primary text-white">
        <strong class="me-auto"><i class="bi-gift-fill"></i> Appointment Accepted.</strong>
        <small>10 mins ago</small>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
    </div>
    <div class="toast-body">
        It's been a long time since you visited us. We've something special for you. <a class="btn btn-primary" href="/chat-doctor" class="text-white">Go To Live Chat</a>
    </div>
`
        wrapdiv.innerHTML= markup;
        messagearea.appendChild(wrapdiv)
}


    //getting notification message from patient end
      var  socket =  io('192.168.0.121:8000')
    socket.on("appointmentSent", function(message){
     //console.log("message", message)
    if(message.Message.DocNurID == SenderID_noti.value){
        appendMessage_noti(message)
       //console.log(message)
    }
  
})



function appAccept(patientID){ 
    console.log("patientID:",patientID)
    console.log("working:")
    window.alert("patientID:",patientID)
   //sending message to the opposite user
    socket.emit("appointmentAccept",{
        "patientID":patientID,
    })
}



// after accept appointmnet from doctor end
socket.on("appointmentAccept", function(message){
    console.log("message", message.patientID)
    console.log("working for patient confirmation", message)
   if(message.patientID == SenderID_noti.value){
    appendMessageAccept(message)
      console.log(message)
   }
});



