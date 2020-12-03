"use strict"

window.addEventListener("DOMContentLoaded", (event) => {
  let csrf_token = document.querySelector('[name="_csrf"]').value;







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
      "columns": [
        {
          "data": "title"

        },
        {
          "data": "category.categorieName"

        },
        {
          "data": "type"

        },
        {
          "data": "imei"

        },
        {
          "data": "created_at",
          "render": function (data, type, row) {
            return formatDate(data);
          },

        },
        {
          "mRender": function (data, type, row) {

            return `<a href="/proposition/edit/` + row.id + `" style="color:blue;cursor:pointer;" > 
                <i class="fas fa-fw fa-edit"></i></a>
                <a class="delete" href="/deleteProposition/` + row.id + `" style="color:red;cursor:pointer;" > 
                <i class="fas fa-fw fa-trash"></i></a>
                <a class="showModal" href="/propositionbyid/` + row.id + `" style="color:green;cursor:pointer;" > 
                <i class="fas fa-fw fa-eye"></i></a>
               
                <a class="download" href="/`+row.path+`" download><i class="fas fa-fw fa-download"></i></a>

                `;

          }

        }


      ]


    });
  }



  const fetchSong = () => {
    $.ajaxSetup({
      headers: {
        'X-CSRF-TOKEN': csrf_token
      }
    });

    $.ajax({
      type: 'GET',
      url: '/listProposition',
      data: false,
      cache: false,
      contentType: false,
      processData: false,

      success: (data) => {
         console.log(data.data)
        if (data.data) {
         loadDataTable(data.data);

        }

      },
      error: function (err) {
        console.log(err)
      }
    });

  }

  fetchSong();




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


//dowload

$(document).on("click", ".download", function (e) {
  e.preventDefault();
  let url = $(this).attr('href');

  window.open(url)

  
  })
  
//show modal
$(document).on("click", ".showModal", function (e) {
e.preventDefault();

let url = $(this).attr('href');
getbyId(url)

})

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
      let res = data.data;
     if (res){
      $('#songText').text(res.content);
      $('#player').append(`<source   src="`+res.path+`" type="audio/mpeg">`);
     }
      $('#songModal').modal();

    }
  });
}

});
