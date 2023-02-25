$("document").ready(function(){
    if(localStorage.getItem('user') == undefined){
        window.location.href = './unauth.html';
        return;
    }
    let u_obj = JSON.parse(localStorage.getItem("user"));
    if(!u_obj.isAdmin){
        window.location.href = './unauth.html';
    //noneed
        return;
    }
    let userid = u_obj.userid;
    $(".user-text").html(`Hello, ${u_obj.username}`);
})

$(".submit-btn").click(function(e){
    e.preventDefault();
    let bname = $(".input-bname").val().trim();
    let bauthor = $(".input-bauthor").val().trim();
    let bqty = Number($(".input-bqty").val().trim());
    if(bname == '' || bauthor == '' || bqty == 0){
        showAlert("Book Name, Author, Quantity is Required!", false);
        return;
    }
    //check if user is logged in and is admin as well
    $.ajax({
        url: "https://localhost:5001/api/books/admin/addBook",
        headers:{
            'Content-Type':'application/json;charset=UTF-8',
            'Access-Control-Allow-Origin':'*',
            'Access-Control-Allow-Method':'*'},
           type: "post",
            contentType: "application/json",
            data: JSON.stringify({
                BookName: bname,
                BookAuthor: bauthor,
                BookQty: bqty
            }),
            success: function (result, status, xhr) {
                showAlert("Book Added Successfully!", true);
                setTimeout(function(){
                    window.location.href = './list_books_a.html';
                }, 1500)
            },
            error: function (xhr, status, error) {
                showAlert(xhr.responseJSON.message, false);
                return;
            }
        });
});
$('.back-to-books-btn').click(function(){
    window.location.href = './list_books_a.html';
});
