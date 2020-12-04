"use strict"

window.addEventListener("DOMContentLoaded", (event) => {
  let csrf_token = document.querySelector('[name="_csrf"]').value;

  //erros array
  let errosArray = new Array();
  errosArray['E_USER_NOT_FOUND: Cannot find user with email as la@gmail.com'] = "Email non valide";
  errosArray["E_PASSWORD_MISMATCH: Cannot verify user password"] = "Mot de passe incorrecte"
  errosArray["required validation failed on password"] = "Mot de passe requis"
  errosArray["required validation failed on email"] = "Email requis"
  errosArray['email validation failed on email']="Email invalide"
  errosArray['Email introuvable']="Email introuvable"
  errosArray["You first need to register!"]="Coordonnées entrées incorrectes"


  function loader(t) {
    if (t) {
      document.querySelector('#btn_submit').style = "display:none";
      document.querySelector('#btn_load').style = "display:block";
    } else {
      document.querySelector('#btn_submit').style = "display:block";
      document.querySelector('#btn_load').style = "display:none";

    }
  }

  function loader2(t) {
    if (t) {
      document.querySelector('#btn_submit2').style = "display:none";
      document.querySelector('#btn_load2').style = "display:block";
    } else {
      document.querySelector('#btn_submit2').style = "display:block";
      document.querySelector('#btn_load2').style = "display:none";

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
        console.log(data)
        if (data.data) {
          toastr.success('succès: Rédirection...')
          window.location.href = "/home";
          $('#loginForm')[0].reset();
        }

        loader(false);
      },
      error: function (data) {
        loader(false);


        let response = JSON.parse(data.responseText);


        let errorString = '<ul>';
       
        if (response.errors) {
          response.errors.map(itm => {
            errorString += '<li>' + errosArray[itm.message] + '</li>';
          })

        }
        if (response.error) {
          errorString += '<li>' + errosArray[response.error] + '</li>';
        }

        errorString += '</ul>';
        toastr.error(errorString)
      }
    });


  }

  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    loginPost()
  })


//reset
const forgotPost = () => {
  let route = '/resetpass';
  let formData = new FormData($("#forgotForm")[0]);

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
      loader2(true);
    },
    success: (data) => {
      console.log(data)
      if (data.success) {
        toastr.success('succès:Consulter votre mail, Vous avez reçu un nouveau mot de passe')
        $('#forgotForm')[0].reset();
      }

      loader2(false);
    },
    error: function (data) {
      loader2(false);


      let response = JSON.parse(data.responseText);


      let errorString = '<ul>';
     
      if (response.errors) {
        response.errors.map(itm => {
          errorString += '<li>' + errosArray[itm.message] + '</li>';
        })

      }
      if (response.error) {
        errorString += '<li>' + errosArray[response.error] + '</li>';
      }

      errorString += '</ul>';
      toastr.error(errorString)
    }
  });


}

document.getElementById('forgotForm').addEventListener('submit', (e) => {
  e.preventDefault();
  forgotPost()
})






});
