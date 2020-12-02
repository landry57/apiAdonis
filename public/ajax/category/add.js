"use strict"

window.addEventListener("DOMContentLoaded", (event) => {
  let csrf_token = document.querySelector('[name="_csrf"]').value;


  //erros array
  let errosArray = new Array();
  errosArray['E_USER_NOT_FOUND: Cannot find user with email as la@gmail.com'] = "Email non valide";
  errosArray["E_PASSWORD_MISMATCH: Cannot verify user password"] = "Mot de passe incorrecte"
  errosArray["required validation failed on categorieName"] = "Nom categorie requis"
  errosArray["unique validation failed on categorieName"] = "Il semble que le nom existe déjà"



  function loader(t) {
    if (t) {
      document.querySelector('.btn_submit').style = "display:none";
      document.querySelector('.btn_load').style = "display:block";
    } else {
      document.querySelector('.btn_submit').style = "display:block";
      document.querySelector('.btn_load').style = "display:none";

    }
  }


  const addPost = () => {
    let route = document.querySelector("[name='route'").value;
    let formData = new FormData($("#addCategorie")[0]);

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

        if (data.data) {
          toastr.success('succès: Catégorie ajoutée')
          document.location.reload();
          $('#addCategorie')[0].reset();
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

  document.getElementById('addCategorie').addEventListener('submit', (e) => {
    e.preventDefault();
    addPost()
  })




  function formatDate(date) {
    var date = new Date(date);
    var year = date.getFullYear();
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return day + '/' + month + '/' + year;

  }




  const loadDataTable = (data) => {
    $('#dataTable').DataTable({
      "language": {
        "sLengthMenu": " _MENU_ éléments par page",
        "sZeroRecords": "Aucune donnée trouvée - désolé !",
        "sInfo": "Tableau Montrant _START_ à _END_ éléments sur un Total: _TOTAL_ ",
        "sInfoEmpty": "Tableau Montrant 0 à 0 sur 0 éléments",
        "sInfoFiltered": "(filtré sur un total de _MAX_ )",
        "paginate": {
          "previous": "Retour",
          "next": "Suivant"
        }
      },


      "aaData": data,
      "columns": [{
          "data": "categorieName"

        },

        {
          "data": "created_at",
          "render": function (data, type, row) {
            return formatDate(data);
          },

        },
        {
          "mRender": function (data, type, row) {

            return `<a class="edit" href="category/` + row.id + `" style="color:blue;cursor:pointer;" > 
                <i class="fas fa-fw fa-edit"></i></a>
                <a class="delete" href="deleteCategory/` + row.id + `" style="color:red;cursor:pointer;" > 
                <i class="fas fa-fw fa-trash"></i></a>`;

          }

        }


      ]


    });
  }



  const fetchCategorie = () => {
    $.ajaxSetup({
      headers: {
        'X-CSRF-TOKEN': csrf_token
      }
    });

    $.ajax({
      type: 'GET',
      url: '/listCategory',
      data: false,
      cache: false,
      contentType: false,
      processData: false,

      success: (data) => {
        if (data.data) {
          loadDataTable(data.data);

        }

        loader(false);
      },
      error: function (err) {
        console.log(err)
      }
    });

  }

  fetchCategorie();




  //seuppression
  $(document).on("click", ".delete", function (e) {
    e.preventDefault();
    let url = $(this).attr('href');
    $.confirm({
      title: 'Attention! Vous êtres sur le point de supprimer cet élément',
      content: 'supprimer ?',
      type: 'red',
      typeAnimated: true,

      buttons: {
        tryAgain: {
          text: 'Supprimer',
          btnClass: 'btn-red',
          action: function () {
            deletPost(url);
          }
        },
        close: {
          text: 'Fermer',
          function () {}
        }
      }
    });
  });

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
        toastr.success('Suppression effectuée avec succès')
        document.location.reload();
      }
    });
  }



  //edit
  $(document).on("click", ".edit", function (e) {
    e.preventDefault();
    let url = $(this).attr('href');
    getbyId(url)


  });


  const getbyId = (ur) => {

    $.ajaxSetup({
      headers: {
        'X-CSRF-TOKEN': csrf_token
      }
    });

    $.ajax({
      type: 'GET',
      url: ur,
      success: (data) => {
        const res = data.data;
        document.querySelector('#editCategorieName').value = res.categorieName;
        document.querySelector('#categoryId').value = res.id;
        document.querySelector('#editRoute').value = "/editCategory/" + res.id;
        $('#editModal').modal();

      }
    });
  }

  const EditPost = () => {
    let route = document.querySelector("[name='editRoute'").value;
    let formData = new FormData($("#editCategorie")[0]);

    $.ajaxSetup({
      headers: {
        'X-CSRF-TOKEN': csrf_token
      }
    });

    $.ajax({
      type: 'PUT',
      url: route,
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      beforeSend() {
        loader(true);
      },
      success: (data) => {

        if (data.data) {
          toastr.success('succès: Catégorie modifiée')
          document.location.reload();
          $('#editCategorie')[0].reset();
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

  document.getElementById('editCategorie').addEventListener('submit', (e) => {
    e.preventDefault();
    EditPost();
  })

});
