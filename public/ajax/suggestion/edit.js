"use strict"

window.addEventListener("DOMContentLoaded", (event) => {
  let csrf_token = document.querySelector('[name="_csrf"]').value;

  $('#categorie_id').select2()
  $('#type_id').select2()

  //erros array
  let errosArray = new Array();
  errosArray['E_USER_NOT_FOUND: Cannot find user with email as la@gmail.com'] = "Email non valide";
  errosArray["E_PASSWORD_MISMATCH: Cannot verify user password"] = "Mot de passe incorrecte"
  errosArray["required validation failed on path"] = "Le champ audio est requis"
  errosArray["required validation failed on content"] = "Le champ contenu est requis"
  errosArray["required validation failed on title"] = "Le champ titre est requis"
  errosArray["required validation failed on categorie_id"] = "Le champ niveau est requis"
  errosArray["unique validation failed on title"] = "Il semble que le titre existe déjà"



  function loader(t) {
    if (t) {
      document.querySelector('.btn_submit').style = "display:none";
      document.querySelector('.btn_load').style = "display:block";
    } else {
      document.querySelector('.btn_submit').style = "display:block";
      document.querySelector('.btn_load').style = "display:none";

    }
  }

  function deletPost(ur) {

    $.ajaxSetup({
      headers: {
        'X-CSRF-TOKEN': csrf_token
      }
    });

    $.ajax({
      type: 'DELETE',
      url: ur,
      success: (data) => {
        toastr.success('succès: musique ajoutée')
        document.location.href='/song'
      }
    });
  }


  const EditPost = () => {
   
    let id = document.querySelector("[name='id']").value;
    let formData = new FormData($("#addSong")[0]);
  
    $.ajaxSetup({
      headers: {
        'X-CSRF-TOKEN': csrf_token
      }
    });

    $.ajax({
      type: 'POST',
      url: '/editProposition/'+id,
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      beforeSend() {
        loader(true);
      },
      success: (data) => {

        if (data.data) {
          deletPost('/deleteProposition/'+id)
        
          $('#addSong')[0].reset();
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

  document.getElementById('addSong').addEventListener('submit', (e) => {
    e.preventDefault();
    EditPost();
  })

});
