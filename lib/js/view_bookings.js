$('document').ready(function () {
    let u_obj = JSON.parse(localStorage.getItem("user"));
    if (u_obj == undefined) {
        window.location.href = './unauth.html';
    }
    $(".user-text").html(`Hello, ${u_obj.username}`);
    let userid = u_obj.userid;
    $.ajax({
        url: `https://localhost:5001/api/bookings/${userid}`,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Method': '*'
        },
        type: "get",
        contentType: "application/json",
        
        success: function (result, status, xhr) {
            if (!result.length) {
                // Show No Bookings for the user
                $('.container-bookings').append('<h2>No Bookings!</h2>');
            } else {
                //show booking table
                $('.container-bookings').append(`
                    <table class="table">
                    <thead class="thead-dark">
                      <tr>
                        <th scope="col">Book Name</th>
                        <th scope="col">Return</th>
                      </tr>
                    </thead>
                    <tbody class="book-row-items">
                      
                     
                    </tbody>
                  </table>
                  `);
                //appending records
                let bookings = $();
                for (let x = 0; x < result.length; x++) {
                    bookings = bookings.add(`
                            <tr>
                                <td>${result[x].bidNavigation.bookName}</td>
                                <td><button data-booking_id = ${result[x].bookingid} class="btn btn-primary return-btn">Return</button></td>
                            </tr>`
                    );
                }
                $(".book-row-items").append(bookings);

                //selecting all return btn
                let return_btns = document.getElementsByClassName('return-btn');
                for (let i = 0; i < return_btns.length; i++) {
                    return_btns[i].addEventListener('click', function (e) {
                        let booking_id = Number(this.getAttribute('data-booking_id'));
                        e.preventDefault();
                        $.ajax({
                            url: `https://localhost:5001/api/bookings/${booking_id}`,
                            headers: {
                                'Content-Type': 'application/json;charset=UTF-8',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Method': '*'
                            },
                            type: "delete",
                            contentType: "application/json",
                            success: function (result, status, xhr) {
                                showAlert('Returned successfully!', true)
                                setTimeout(function () {
                                    window.location.href = "./view_bookings.html";
                                }, 1500);

                            },
                            error: function (xhr, status, error) {
                                showAlert(xhr.responseJSON.message, false);
                            }
                        });
                    })
                }
            }
        },
        error: function (xhr, status, error) {
            showAlert(xhr.responseJSON.message, false);
        }
    });
});

$('.back-to-books-btn').click(function (e) {
    e.preventDefault();
    let is_admin = JSON.parse(localStorage.getItem('user')).isAdmin;
    if (is_admin) {
        window.location.href = './list_books_a.html';
    }
    else {
        window.location.href = './list_books_u.html';
    }
})