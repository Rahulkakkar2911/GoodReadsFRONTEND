$(".submit-btn").click(function(e){
    e.preventDefault();
    let username = $("#username").val().trim();
    let password = $("#password").val().trim();

    if(username == '' || password == ''){
        showAlert("Username and Password are Required", false);
        return;
    }

    $.ajax({
        url: "https://localhost:5001/api/login",
        headers:{
            'Content-Type':'application/json;charset=UTF-8',
            'Access-Control-Allow-Origin':'*',
            'Access-Control-Allow-Method':'*'},
           type: "post",
            contentType: "application/json",
            data: JSON.stringify({
                Username: username,
                Userpassword: password,
            }),
            success: function (result, status, xhr) {
                showAlert("Login Successfull!", true);
                let datacpy = {
                    userid: result.userid,
                    username:result.username,
                    isAdmin:result.isAdmin
                }
                localStorage.setItem("user", JSON.stringify(datacpy)); 
                if(result.isAdmin){
                    window.location.href = "./list_books_a.html";
                }
                else{
                    window.location.href = "./list_books_u.html";
                }             
            },
            error: function (xhr, status, error) {
                showAlert(xhr.responseJSON.message, false);
            }
        });
});