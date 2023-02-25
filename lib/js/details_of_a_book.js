$('document').ready(function(){
    if(localStorage.getItem('user') == undefined){
        window.location.href = './unauth.html';
        return;
    }
    let u_obj = JSON.parse(localStorage.getItem("user"));
    let userid = u_obj.userid;
    $(".user-text").html(`Hello, ${u_obj.username}`);
    let book_id = Number(localStorage.getItem('bid'));
    $.ajax({
        url: `https://localhost:5001/api/books/${book_id}`,
        headers:{
            'Content-Type':'application/json;charset=UTF-8',
            'Access-Control-Allow-Origin':'*',
            'Access-Control-Allow-Method':'*'},
           type: "get",
            contentType: "application/json",
            success: function (result, status, xhr) {
                let isAdmin = JSON.parse(localStorage.getItem('user')).isAdmin;
                if(isAdmin){
                    $('.bid').html(`Book ID: ${result.bookId}`);
                    $('.bname').html(`Book Name: ${result.bookName}`);
                    $('.bauthor').html(`Book Author: ${result.bookAuthor}`);
                    $('.bqty').html(`Book Quantity: ${result.bookQty}`);
                }
                else{
                    $('.bname').html(`Book Name: ${result.bookName}`);
                    $('.bauthor').html(`Book Author: ${result.bookAuthor}`);
                }

            },
            error: function (xhr, status, error) {
                showAlert(xhr.responseJSON.message);
            }
        });
});
$('.back-to-books-btn').click(function(){
    let isAdmin = JSON.parse(localStorage.getItem('user')).isAdmin;
    if(isAdmin){
        window.location.href = './list_books_a.html';
    }
    else{
        window.location.href = './list_books_u.html';
    }
});

$('.add-btn').click(function(){
    let isAdmin = JSON.parse(localStorage.getItem('user')).isAdmin;
    if(isAdmin){
        window.location.href = './add_a_book.html';
    }
    else{
        localStorage.clear();
        setTimeout(function(){
            window.location.href = './unauth.html';
        },1500);
    }
});