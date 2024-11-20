//  On document loaded 
document.addEventListener("DOMContentLoaded", function () {
  
    getData()
})

function getData() {
    $('#datatable').DataTable({
        processing: true,
        serverSide: true,
        "bLengthChange": false,
        "bInfo": false,
        destroy: true,
        paging: true,
        searching: true,
        ordering: true,
        pageLength: 10,
        "ajax": {
            url: `inventory/list`,
            type: 'GET',
            data: function (d) {
                delete d.columns
                return d;
            },
        },
        "columnDefs": [
            {
                "targets": 0, render: function (data, type, row, meta) {
                    return parseInt(meta.row) + 1;
                }
            },
            {
                "targets": 1, render: function (data, type, row, meta) {
                    return `${row.name}`
                }
            },
            {
                "targets": 2, render: function (data, type, row, meta) {
                    return `${row.category}`
                }
            },
            {
                "targets": 3, render: function (data, type, row, meta) {
                    return `${row.price}`
                }
            },
            {
                "targets": 4, render: function (data, type, row, meta) {
                    return `${row.taxRate}`
                }
            },
            {
                "targets": 5, render: function (data, type, row, meta) {
                    return `${row.stockStatus}`
                }
            },
            {
                "targets": 6, render: function (data, type, row, meta) {
                    
                    return `<a href='javascript:void(0);'  class="p-1 text-primary link" onclick="editInventory('${encodeURIComponent(JSON.stringify(row)) }')">  Edit </a>
                    <a href='javascript:void(0);' class="p-1 text-danger" onclick="deleteInventory('${encodeURIComponent(JSON.stringify(row)) }')">Delete </a>`
                }
            },


        ],

    });
}

$('#form-add-inventory').on('submit', function (event) {
    event.preventDefault();
    const formData = $(this).serialize();
    $.ajax({
        url: 'inventory/create',
        type: 'POST',
        data: formData,
        success: function (response) {
            console.log(response);
            if (response.data.status == 500) {
                toastr.error(response.data.message)
                return
            }
            toastr.success(response.data.message)
            getData()
            // Optionally, reset the form and close the modal
            $('#form-add-inventory')[0].reset();
            $('#inventoryModal').modal('hide');
        },
        error: function (xhr, status, error) {
            // Handle error response
            toastr.error('Failed to add inventory item. Please try again.')
            console.error(xhr.responseText);
        }
    });
});


 
function editInventory(item ) {
    item=JSON.parse(decodeURIComponent(item))  

    const form = document.getElementById('form-edit-inventory');

    for (const key in item) {
        const field = document.querySelector(`[name="${key}"]`);
        if (field) { 
          if (form.elements[key]) {
            form.elements[key].value = item[key];
          }
        }
      } 
    $('#inventoryModalEdit').modal('show');
}
function deleteInventory(item) {
    item=JSON.parse(decodeURIComponent(item)) 
    const form = document.getElementById('form-delete-inventory');
    for (const key in item) {
        const field = document.querySelector(`[name="${key}"]`);
        if (field) { 
          if (form.elements[key]) {
            form.elements[key].value = item[key];
          }
        }
      }  
      const modalBody = form.getElementsByClassName('modal-body');
    //   modalBody.innerHtml +=
  
      Array.from(modalBody).forEach(component => {
        component.insertAdjacentHTML('afterend', `<p class="p-3">Are you sure you want to remove this<strong> ${item.name}</strong> from the inventory list?</p>`);
      });


    $('#inventoryModalDelete').modal('show');
}



$('#form-edit-inventory').on('submit', function (event) {
    event.preventDefault();
    const formData = $(this).serialize();
    $.ajax({
        url: 'inventory/update',
        type: 'POST',
        data: formData,
        success: function (response) {
             
            if (response.data.status == 500) {
                toastr.error(response.data.message)
                return
            }
            toastr.success(response.data.message)
            getData()
            // Optionally, reset the form and close the modal
            $('#form-edit-inventory')[0].reset();
            $('#inventoryModalEdit').modal('hide');
        },
        error: function (xhr, status, error) {
            // Handle error response 
            console.error(xhr.responseText);
            toastr.error('Failed to edit inventory item. Please try again.')
        }
    });
});

$('#form-delete-inventory').on('submit', function (event) {
    event.preventDefault();
    const formData = $(this).serialize();
    $.ajax({
        url: 'inventory/delete',
        type: 'DELETE',
        data: formData,
        success: function (response) {
            //  console.log(response)
            if (response.status == 500) {
                toastr.error(response.message)
                return
            }
            toastr.success(response.message)
            getData()
            // Optionally, reset the form and close the modal
            $('#form-edit-inventory')[0].reset();
            $('#inventoryModalDelete').modal('hide');
        },
        error: function (xhr, status, error) {
            // Handle error response 
            console.error(xhr.responseText);
            toastr.error('Failed to remove inventory item. Please try again.')
        }
    });
});


 