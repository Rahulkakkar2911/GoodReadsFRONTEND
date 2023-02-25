$('document').ready(function () {
    if(localStorage.getItem('user') == undefined){
        window.location.href = './unauth.html';
    //no need to return;
        return;
    }
    let u_obj = JSON.parse(localStorage.getItem("user"));
    if(!u_obj.isAdmin){
        window.location.href = './unauth.html';
    //no need to return;
        return;
    }
    let userid = u_obj.userid;
    $(".user-text").html(`Hello, ${u_obj.username}`);
    let bookid = Number(localStorage.getItem("bookid"));
    
    $.ajax({
        url: `https://localhost:5001/api/books/${bookid}`,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Method': '*'
        },
        type: "get",
        contentType: "application/json",
        success: function (result, status, xhr) {
            $('.input-bname').val(result.bookName);
            $('.input-bauthor').val(result.bookAuthor);
            $('.input-bqty').val(Number(result.bookQty));
        },
        error: function (xhr, status, error) {
            showAlert(xhr.responseJSON.message,false);
        }
    });
});

$('.edit-save-btn').click(function (e) {
    let bookid = Number(localStorage.getItem("bookid"));
    e.preventDefault();
    let bn = $('.input-bname').val().trim();
    let ba = $('.input-bauthor').val().trim();
    let bq = $('.input-bqty').val().trim();

    if(bn == '' || ba == '' || bq == 0){
        showAlert("Book Name, Author, Quantity is Required!", false);
        return;
    }
    $.ajax({
        url: `https://localhost:5001/api/books/admin/editBook/${bookid}`,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Method': '*'
        },
        type: "put",
        data: JSON.stringify({
            BookName: bn,
            BookAuthor: ba,
            BookQty: Number(bq)
        }),
        contentType: "application/json",
        success: function (result, status, xhr) {
            showAlert('Updated Successfully', true);
            setTimeout(function(){
                window.location.href = "./list_books_a.html";
            }, 1500);
        },
        error: function (xhr, status, error) {
            showAlert(xhr.responseJSON.message, false);
        }
    });
});

$('.back-to-books-btn').click(function(){
    window.location.href = './list_books_a.html';
})