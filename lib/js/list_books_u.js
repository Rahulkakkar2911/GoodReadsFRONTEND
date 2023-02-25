$("document").ready(function () {
    if (localStorage.getItem('user') == undefined) {
        window.location.href = './unauth.html';
        return;
    }
    let u_obj = JSON.parse(localStorage.getItem("user"));
    let userid = u_obj.userid;
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
            // array of objects(books) -> result

            let books = $();
            for (let x = 0; x < result.length; x++) {
                let btnString = result[x].bookQty > 0 ? "Book" : "Out of stock"
                if (result[x].bookQty > 0) {
                    books = books.add(`<div class="card-book">
                        <img class="book-img" src="./lib/img/book.png" width="200px" alt="book-img">
                        <p class="Book-Name">${result[x].bookName}</p>
                        <div class = "btn-container">
                        <a data-bid=${result[x].bookId} class="btn btn-primary book-btn stock-book-btn">${btnString}</a>
                        <a data-bid=${result[x].bookId} class="btn btn-outline-primary book-btn details-book-btn">Details</a>
                        </div>
                        </div>`);
                }
                else {
                    books = books.add(`
                    <div class="card-book">
                        <img class="book-img" src="./lib/img/book.png" width="200px" alt="book-img">
                        <p class="Book-Name">${result[x].bookName}</p>
                        <div class = "btn-container">
                        <a data-bid=${result[x].bookId} class="btn btn-danger book-btn out-of-stock-book-btn" aria-disabled="true">${btnString}</a>
                        <a data-bid=${result[x].bookId} class="btn btn-outline-primary book-btn details-book-btn">Details</a>
                        </div>
                        </div>`);
                }
                //adding a event listener on each btn -> depending on whether it is on stock
                //Stock Button            
            }
            $(".container-books").append(books);
            //booking btn
            let stock_book_btns = document.getElementsByClassName('stock-book-btn');
            let out_of_stock_btns = document.getElementsByClassName('out-of-stock-book-btn');
            let details_btns = document.getElementsByClassName('details-book-btn');

            for (let x = 0; x < stock_book_btns.length; x++) {
                stock_book_btns[x].addEventListener('click', function () {
                    //we have user id in =>
                    let bookid = Number(this.getAttribute('data-bid'));
                    $.ajax({
                        url: "https://localhost:5001/api/bookings",
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Method': '*'
                        },
                        type: "post",
                        contentType: "application/json",
                        data: JSON.stringify({
                            Uid: userid,
                            Bid: bookid
                        }),
                        success: function (result, status, xhr) {
                            showAlert("Booked Successfully!", true);
                        },
                        error: function (xhr, status, error) {
                            showAlert(xhr.responseJSON.message, false);
                        }
                    });
                })
            }
            //do nothing for out of stock buttons
            for (let i = 0; i < out_of_stock_btns.length; i++) {
                out_of_stock_btns[i].addEventListener('click', function (e) {
                    e.preventDefault();
                    showAlert("Out Of Stock, Please comeback later", false);
                });
            }
            for (let i = 0; i < details_btns.length; i++) {
                details_btns[i].addEventListener('click', function (e) {
                    e.preventDefault();
                    localStorage.setItem('bid', this.getAttribute('data-bid'));
                    window.location.href = './details_of_a_book_u.html';
                });
            }

        },
        error: function (xhr, status, error) {
            showAlert(xhr.responseJSON.message, false);
        }
    });
});

$('.view-bookings-btn').click(function (e) {
    e.preventDefault();
    window.location.href = './view_bookings.html';
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
            $(".container-books").empty();
            let books = $();
            for (let x = 0; x < result.length; x++) {
                let btnString = result[x].bookQty > 0 ? "Book" : "Out of stock"
                if (result[x].bookQty > 0) {
                    books = books.add(`<div class="card-book">
                        <img class="book-img" src="./lib/img/book.png" width="200px" alt="book-img">
                        <p class="Book-Name">${result[x].bookName}</p>
                        <div class = "btn-container">
                        <a data-bid=${result[x].bookId} class="btn btn-primary book-btn stock-book-btn">${btnString}</a>
                        <a data-bid=${result[x].bookId} class="btn btn-outline-primary book-btn details-book-btn">Details</a>
                        </div>
                        </div>`);
                }
                else {
                    books = books.add(`
                    <div class="card-book">
                        <img class="book-img" src="./lib/img/book.png" width="200px" alt="book-img">
                        <p class="Book-Name">${result[x].bookName}</p>
                        <div class = "btn-container">
                        <a data-bid=${result[x].bookId} class="btn btn-danger book-btn out-of-stock-book-btn" aria-disabled="true">${btnString}</a>
                        <a data-bid=${result[x].bookId} class="btn btn-outline-primary book-btn details-book-btn">Details</a>
                        </div>
                        </div>`);
                }
                //adding a event listener on each btn -> depending on whether it is on stock
                //Stock Button            
            }
            $(".container-books").append(books);
            //booking btn
            let stock_book_btns = document.getElementsByClassName('stock-book-btn');
            let out_of_stock_btns = document.getElementsByClassName('out-of-stock-book-btn');
            let details_btns = document.getElementsByClassName('details-book-btn');

            for (let x = 0; x < stock_book_btns.length; x++) {
                stock_book_btns[x].addEventListener('click', function () {
                    //we have user id in =>
                    let bookid = Number(this.getAttribute('data-bid'));
                    $.ajax({
                        url: "https://localhost:5001/api/bookings",
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Method': '*'
                        },
                        type: "post",
                        contentType: "application/json",
                        data: JSON.stringify({
                            Uid: userid,
                            Bid: bookid
                        }),
                        success: function (result, status, xhr) {
                            showAlert("Booked Successfully!", true);
                        },
                        error: function (xhr, status, error) {
                            showAlert(xhr.responseJSON.message, false);
                        }
                    });
                })
            }
            //do nothing for out of stock buttons
            for (let i = 0; i < out_of_stock_btns.length; i++) {
                out_of_stock_btns[i].addEventListener('click', function (e) {
                    e.preventDefault();
                    showAlert("Out Of Stock, Please comeback later", false);
                });
            }
            for (let i = 0; i < details_btns.length; i++) {
                details_btns[i].addEventListener('click', function (e) {
                    e.preventDefault();
                    localStorage.setItem('bid', this.getAttribute('data-bid'));
                    window.location.href = './details_of_a_book_u.html';
                });
            }
        },
        error: function (xhr, status, error) {
            showAlert(xhr.responseJSON.message, false);
        }
    });

});