

// Formatting function for row details - modify as you need
function format(d) {
    // `d` is the original data object for the row
    return (
        '<dl>' +
        '<dt>Full name:</dt>' +
        '<dd>' +
        d.name +
        '</dd>' +
        '<dt>Extension number:</dt>' +
        '<dd>' +
        d.extn +
        '</dd>' +
        '<dt>Extra info:</dt>' +
        '<dd>And any further details here (images etc)...</dd>' +
        '</dl>'
    );
}







const cadFiltros = document.querySelector('.cardFiltros');



const table = $('#table-comissoes').DataTable({
    scrollY: (cadFiltros.clientHeight - 200)+'px',
    scrollCollapse: true,
    order: [],
    columnDefs: [
        { "orderable": false, "targets": [0,1,2] },
        {
            targets: 3,
            render: function ( data, type, row ) {

                const continuar = data.length > 14 ? '...' : ''
                return data.substr( 0, 15 )+continuar;
            }
        }
    ],
    paging: false,
    scrollX: true,
    language: {
        searchPlaceholder: 'Search...',
        sSearch: '',
    },
});


// Add event listener for opening and closing details
table.on('click', 'td.dtr-control', function (e) {
    let tr = e.target.closest('tr');
    let row = table.row(tr);
    let iconCell = $(this);
 
    if (row.child.isShown()) {
        // This row is already open - close it
        row.child.hide();
        iconCell.removeClass('closed').addClass('open');
        
    }
    else {
        // Open this row
        row.child(format(row.data())).show();
        iconCell.removeClass('open').addClass('closed');
    }
});



function formatState(state) {
    if (!state.id) {
        return state.text;
    }
    var baseUrl = "../assets/images/photo.png";
    var $state = $(
        '<span><img src="' + baseUrl + '" class="img-flag" > ' + state.text + '</span>'
    );
    return $state;
};

$(".js-example-templating").select2({
    templateResult: formatState,
    templateSelection: formatState, // Use the same format for the selected option,
    placeholder: "Choose Customer"
});


// document.querySelector('.dataTables_scroll').style.minHeight = (cadFiltros.clientHeight - 200) + 'px';