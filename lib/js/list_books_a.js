$("document").ready(function () {
    if(localStorage.getItem('user') == undefined){
        window.location.href = './unauth.html';
        return;
    }
    let u_obj = JSON.parse(localStorage.getItem("user"));
    let userid = u_obj.userid;
    if(!u_obj.isAdmin){
        window.location.href = './unauth.html';
    //noneed
        return;
    }

    $(".user-text").html(`Hello, ${u_obj.username}`);
    $.ajax({
        url: "https://localhost:5001/api/books",
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Method': '*'
        },
        type: "get",
        contentType: "application/json",
        success: function (result, status, xhr) {

            let books = $();
            for (let x = 0; x < result.length; x++) {
                books = books.add(`<div class="card-book">
                        <img class="book-img" src="./lib/img/book.png" width="200px" alt="book-img">
                        <p class="Book-Name">${result[x].bookName}</p>
                        <div class = "btn-container">
                        <a data-bid=${result[x].bookId} class="btn btn-outline-primary details-btn">Details</a>
                        <a data-bid=${result[x].bookId} class="btn btn-outline-warning edit-btn">Edit</a>
                        <a data-bid=${result[x].bookId} data-toggle="modal" data-target="#myModal" class="btn btn-danger delete-btn">Delete</a>
                        </div>
                        </div>`);
                //adding a event listener on each btn -> depending on whether it is on stock
                //Stock Button            
            }
            $(".container-books").append(books);

            var modal = document.getElementById("myModal");

            // Get the button that opens the modal
            var btns = document.getElementsByClassName("delete-btn");

            // Get the <span> element that closes the modal
            var no_btn = document.getElementsByClassName("no-btn")[0];
            var yes_btn = document.getElementsByClassName("yes-btn")[0];
            

            for (let i = 0; i < btns.length; i++) {
                btns[i].addEventListener('click', function () {
                    modal.style.display = "block";
                    let bookid = Number(this.getAttribute('data-bid'));
                    localStorage.setItem('bid', bookid);
                });

            }
            // When the user clicks the yes button button, open the modal
            yes_btn.onclick = function(){
                let bookid = Number(localStorage.getItem('bid'));
                $.ajax({
                    url: `https://localhost:5001/api/books/admin/deleteBook/${bookid}`,
                    headers:{
                        'Content-Type':'application/json;charset=UTF-8',
                        'Access-Control-Allow-Origin':'*',
                        'Access-Control-Allow-Method':'*'},
                       type: "delete",
                        contentType: "application/json",
                        success: function (result, status, xhr) {
                            showAlert("Delete Successfull!", true);
                            localStorage.removeItem('bid');
                            setTimeout(function(){
                                window.location.href = "./list_books_a.html";
                            },2000)
                        },
                        error: function (xhr, status, error) {
                            showAlert(xhr.responseJSON.message, false);
                        }
                    });
            }
        
            // When the user clicks on (no), close the modal
            no_btn.onclick = function () {
                localStorage.removeItem('bid');
                modal.style.display = "none";
            }
            
            //edit btn
            // handle ajax call
            let edit_btns = document.getElementsByClassName('edit-btn');
            let details_btns = document.getElementsByClassName('details-btn');
            
            for (let i = 0; i < edit_btns.length; i++) {
                edit_btns[i].addEventListener('click', function (e) {
                    let isAdmin = JSON.parse(localStorage.getItem('user')).isAdmin;
                    if(isAdmin){
                        let book_id = Number(this.getAttribute('data-bid'));
                        localStorage.setItem('bookid', book_id);
                        window.location.href = './edit_a_book.html';
                    }
                    else{
                        showAlert("UnAuthorized", false);
                        setTimeout(function(){
                            window.location.href = './unauth.html';
                        },2000)
                    }
                })
            }
            for (let i = 0; i < details_btns.length; i++) {
                details_btns[i].addEventListener('click', function (e) {
                    e.preventDefault();
                    let isAdmin = JSON.parse(localStorage.getItem('user')).isAdmin;
                    if(isAdmin){
                        localStorage.setItem('bid', this.getAttribute('data-bid'));
                        window.location.href = './details_of_a_book_a.html';
                    }
                    else{
                        window.location.href = './unauth.html';
                    }
                })
            }
        },
        error: function (xhr, status, error) {
            showAlert(xhr.responseJSON.message, false);
        }
    });
});

$('.view-bookings-btn').click(function (e) {
    e.preventDefault();
    if(localStorage.getItem('user')!=undefined){
        window.location.href = './view_bookings.html';
    }
    else{
        showAlert("Unauthorized", false);
        window.location.href = './unauth.html';
    }
})

$('.search-form').submit(function (e) {
    e.preventDefault();
    let keyword_input = $('.input-search').val().trim();
    if (keyword_input == '') {
        showAlert("Enter Query for search!", false);
        return;
    }
    keyword_input = '\"' + keyword_input + '\"';

    $.ajax({
        url: "https://localhost:5001/api/books/search",
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Method': '*'
        },
        type: "post",
        contentType: "application/json",
        data: keyword_input,
        success: function (result, status, xhr) {
            showAlert("Search result found!", true);
            $('.container-books').empty();
            let books = $();
            for (let x = 0; x < result.length; x++) {
                books = books.add(`<div class="card-book">
                        <img class="book-img" src="./lib/img/book.png" width="200px" alt="book-img">
                        <p class="Book-Name">${result[x].bookName}</p>
                        <div class = "btn-container">
                        <a data-bid=${result[x].bookId} class="btn btn-outline-primary details-btn">Details</a>
                        <a data-bid=${result[x].bookId} class="btn btn-outline-warning edit-btn">Edit</a>
                        <a data-bid=${result[x].bookId} data-toggle="modal" data-target="#myModal" class="btn btn-danger delete-btn">Delete</a>
                        </div>
                        </div>`);
                //adding a event listener on each btn -> depending on whether it is on stock
                //Stock Button            
            }
            $(".container-books").append(books);

            var modal = document.getElementById("myModal");

            // Get the button that opens the modal
            var btns = document.getElementsByClassName("delete-btn");

            // Get the <span> element that closes the modal
            var no_btn = document.getElementsByClassName("no-btn")[0];
            var yes_btn = document.getElementsByClassName("yes-btn")[0];
            

            for (let i = 0; i < btns.length; i++) {
                btns[i].addEventListener('click', function () {
                    modal.style.display = "block";
                    let bookid = Number(this.getAttribute('data-bid'));
                    localStorage.setItem('bid', bookid);
                });

            }
            // When the user clicks the yes button button, open the modal
            yes_btn.onclick = function(){
                let bookid = Number(localStorage.getItem('bid'));
                $.ajax({
                    url: `https://localhost:5001/api/books/admin/deleteBook/${bookid}`,
                    headers:{
                        'Content-Type':'application/json;charset=UTF-8',
                        'Access-Control-Allow-Origin':'*',
                        'Access-Control-Allow-Method':'*'},
                       type: "delete",
                        contentType: "application/json",
                        success: function (result, status, xhr) {
                            showAlert("Delete Successfull!", true);
                            localStorage.removeItem('bid');
                            setTimeout(function(){
                                window.location.href = "./list_books_a.html";
                            },2000)
                        },
                        error: function (xhr, status, error) {
                            showAlert(xhr.responseJSON.message, false);
                        }
                    });
            }
        
            // When the user clicks on (no), close the modal
            no_btn.onclick = function () {
                localStorage.removeItem('bid');
                modal.style.display = "none";
            }
            
            //edit btn
            // handle ajax call
            let edit_btns = document.getElementsByClassName('edit-btn');
            let details_btns = document.getElementsByClassName('details-btn');
            
            for (let i = 0; i < edit_btns.length; i++) {
                edit_btns[i].addEventListener('click', function (e) {
                    let isAdmin = JSON.parse(localStorage.getItem('user')).isAdmin;
                    if(isAdmin){
                        let book_id = Number(this.getAttribute('data-bid'));
                        localStorage.setItem('bookid', book_id);
                        window.location.href = './edit_a_book.html';
                    }
                    else{
                        showAlert("UnAuthorized", false);
                        setTimeout(function(){
                            window.location.href = './unauth.html';
                        },2000)
                    }
                })
            }
            for (let i = 0; i < details_btns.length; i++) {
                details_btns[i].addEventListener('click', function (e) {
                    e.preventDefault();
                    let isAdmin = JSON.parse(localStorage.getItem('user')).isAdmin;
                    if(isAdmin){
                        localStorage.setItem('bid', this.getAttribute('data-bid'));
                        window.location.href = './details_of_a_book_a.html';
                    }
                    else{
                        window.location.href = './unauth.html';
                    }
                })
            }
        },
        error: function (xhr, status, error) {
            showAlert(xhr.responseJSON.message, false);
        }
    });

});


