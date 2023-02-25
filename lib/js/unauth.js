$('document').ready(function(){
    setTimeout(function(){
        showAlert("Redirecting to Home Page...", true);
        setTimeout(function(){
            window.location.href = './index.html';
        },2000)
    },1500)
})