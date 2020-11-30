"use strict"

window.addEventListener("DOMContentLoaded", (event) => {
let csrf_token = document.querySelector('[name="_csrf"]').value;


  $('#logout').on('click', function (e) {
    e.preventDefault();
    let url = $(this).attr('href');
    logout(url);

})




function logout(ur) {

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': csrf_token
        }
    });

    $.ajax({
        type: 'POST',
        url: ur,
        success: (data) => {
            window.location.href = "/login";
        }
    });
}

});
