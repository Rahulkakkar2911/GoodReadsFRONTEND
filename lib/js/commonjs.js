const alertBox = document.querySelector('.alert');
let alertTimer;
const showAlert = (message, success) => {
    if(success === true)
    {           
        alertBox.style.backgroundColor = `#7286D3`;
    }
    else{
        alertBox.style.backgroundColor = "#EB5353";
    }
    alertBox.innerText = message;
    alertBox.style.transform = "translate(-50%, 0px)";
    clearTimeout(alertTimer);
    alertTimer = setTimeout(() => {
    alertBox.style.transform = "translate(-50%, -60px)";
    },2000)
}
