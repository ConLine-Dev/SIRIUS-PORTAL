
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
    scrollY: '400px',
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



const ButtonSearchComissoes = document.querySelector('.btn_searchComissoes');

ButtonSearchComissoes.addEventListener('click', async function(e){
    e.preventDefault()

    const loader = document.getElementById("loader");
    loader.classList.remove("d-none")

    const tableCommissions = await Thefetch('/api/commissionByUser', 'POST', { body: JSON.stringify({UserId:1, type:1})})
    console.log(tableCommissions)

        // Limpar tabela antes de adicionar novos dados
    table.clear();

    // Adicionar cada objeto ao DataTable
    tableCommissions.forEach(dados => {



        const newDados = {
            check: `<input class="form-check-input" checked="" type="checkbox" value="" id="electronics">`,
            open: ``,
            modal: `<img title="${dados.MODAL}" src="/assets/images/${dados.MODAL == 'IM' ? 'maritimo_importacao' : dados.MODAL == 'EM' ? 'maritimo_exportacao' : dados.MODAL == 'IA' ? 'aereo_importacao' : 'aereo_exportacao' }.svg" style="width: 1.75rem;height: 1.75rem;">`,
            processo: dados.Numero_Processo,
            abertura: new Date(dados.Data_Abertura_Processo).toLocaleDateString(),
            cliente: formatarNomeCompleto(dados.CLIENTE),
            vendedor: `<td>
                        <div class="d-flex align-items-center gap-2">
                        <span class="avatar avatar-xs avatar-rounded">
                            <img src="https://cdn.conlinebr.com.br/colaboradores/${dados.ID_VENDEDOR}" alt="">
                        </span>
                        <div class="">${dados.VENDEDOR}</div>
                        </div>
                    </td>`,
            inside: `<td>
                <div class="d-flex align-items-center gap-2">
                <span class="avatar avatar-xs avatar-rounded">
                    <img src="https://cdn.conlinebr.com.br/colaboradores/${dados.ID_INSIDE_SALES}" alt="">
                </span>
                <div class="">${dados.INSIDE_SALES}</div>
                </div>
            </td>`,
            efetivo: (dados.VALOR_EFETIVO_TOTAL).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }),
            'porcentagem': '1%',
             'comissao': (33333).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })

            
        }

        // Adiciona a linha de dados ao DataTable
        // table.row.add(Object.values(newDados));
        const rowNode = table.row.add(Object.values(newDados)).node();

        $(rowNode).find('td:eq(1)').addClass('dtr-control');
    });

    // Atualizar a exibição da tabela
    table.draw();
    loader.classList.add("d-none")
})



function formaDate(dataOriginal){
    // Criar um objeto de data
    let data = new Date(dataOriginal);

    // Obter componentes da data
    let dia = String(data.getDate()).padStart(2, '0');
    let mes = String(data.getMonth() + 1).padStart(2, '0'); // Mês é baseado em zero
    let ano = data.getFullYear();
    let hora = String(data.getHours()).padStart(2, '0');
    let minutos = String(data.getMinutes()).padStart(2, '0');

    // Criar a string formatada
    return `${dia}/${mes}/${ano} ${hora}:${minutos}`;
}

function formatarNomeCompleto(nomeCompleto) {
    // Lista de prefixos que devem permanecer em minúsculas
    const prefixos = ["de", "da", "do", "dos", "das"];

    // Divida o nome completo em palavras
    const palavras = nomeCompleto.split(' ');

    // Formate o primeiro nome
    let primeiroNome = palavras[0].charAt(0).toUpperCase() + palavras[0].slice(1).toLowerCase();

    // Formate o sobrenome
    let sobrenome = palavras.slice(1).map(palavra => {
        return prefixos.includes(palavra.toLowerCase())
            ? palavra.toLowerCase()
            : palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase();
    }).join(' ');

    // Combine o primeiro nome e o sobrenome formatados
    let nomeFormatado = `${primeiroNome} ${sobrenome}`;

    return nomeFormatado;
}