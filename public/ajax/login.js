"use strict"

window.addEventListener("DOMContentLoaded", (event) => {
  let csrf_token = document.querySelector('[name="_csrf"]').value;


  function loader(t) {
    if (t) {
      document.querySelector('#btn_submit').style = "display:none";
      document.querySelector('#btn_load').style = "display:block";
    } else {
      document.querySelector('#btn_submit').style = "display:block";
      document.querySelector('#btn_load').style = "display:none";

    }
  }


  const loginPost = () => {
    let route = document.querySelector('#loginForm').action;
    let formData = new FormData($("#loginForm")[0]);

    $.ajaxSetup({
      headers: {
        'X-CSRF-TOKEN': csrf_token
      }
    });

    $.ajax({
      type: 'POST',
      url: route,
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      beforeSend() {
        loader(true);
      },
      success: (data) => {

        loader(false);
      },
      error: function (data) {

        loader(false);

      }
    });


  }

  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    loginPost()
  })


});
