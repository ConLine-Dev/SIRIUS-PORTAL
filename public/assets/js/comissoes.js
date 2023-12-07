const tables = []

document.addEventListener('DOMContentLoaded', function () {
    const ButtonSearchComissoes = document.querySelector('.btn_searchComissoes');
    ButtonSearchComissoes.addEventListener('click', handleSearchComissoes);

    listComissionados();
    getInfComissoes()
});

function adicionarLoader(seletor) {
    // Selecione o elemento alvo (pode ser uma classe ou ID)
    var alvo = document.querySelector(seletor);


    // Crie o elemento de loading
    // var html = `<p class="card-text placeholder-glow">
    // <span class="placeholder col-2"></span>
    // <span class="placeholder col-2"></span>
    // <span class="placeholder col-md-2"></span>
    // <span class="placeholder col-md-2"></span>
    // <span class="placeholder col-md-2"></span>
    // <span class="placeholder col-md-2"></span>
    // <span class="placeholder col-md-2"></span>
    // <span class="placeholder col-md-2"></span>
    // <span class="placeholder col-md-2"></span>
    // <span class="placeholder col-md-2"></span>
    // <span class="placeholder col-md-2"></span>
    // <span class="placeholder col-md-2"></span>
    // <span class="placeholder col-md-2"></span>
    // <span class="placeholder col-md-2"></span>
    // <span class="placeholder col-md-2"></span>
    // <span class="placeholder col-md-2"></span>
    // </p>`

    var html = `<div class="loading"> <img src="../assets/images/media/loader.svg" alt=""> </div>` 

    var loader = document.createElement('div');
    loader.classList.add('Newloading')
    loader.innerHTML = html;

   

    // Adicione o loader ao elemento alvo
    alvo.appendChild(loader);

    // Retorne o loader para que possa ser removido posteriormente
    return loader;
}

function removerLoader(loader) {
    // Obtenha o pai do loader e remova o loader
    loader.parentNode.removeChild(loader);
}

async function initializeDataTable() {
    return $('#table-comissoes').DataTable({
        scrollY: '400px',
        scrollCollapse: true,
        order: [],
        columnDefs: [
            { "orderable": false, "targets": [0, 1, 2] },
            {
                targets: 3,
                render: function (data) {
                    const continuar = data.length > 14 ? '...' : '';
                    return data.substr(0, 15) + continuar;
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
}

async function handleSearchComissoes(e) {
    e.preventDefault();

    const meuLoader = adicionarLoader('.bodyCardComissoes .cardLoader');

    const idUser = $('.js-example-templating').val();
    const tableCommissions = await Thefetch('/api/commissionByUser', 'POST', { body: JSON.stringify({ UserId: idUser}) });

    if(!tables['GerenciamentoComissoes']){
        tables['GerenciamentoComissoes'] = await initializeDataTable();
    }
    
    tables['GerenciamentoComissoes'].clear();

    tableCommissions.forEach(dados => {
        const newDados = {
            check: `<input class="form-check-input checkTableComissoes" value="${dados.commission}" checked="" type="checkbox" id="${dados.IdLogistica_House}">`,
            open: ``,
            modal: `<img title="${dados.MODAL}" src="/assets/images/${getModalImage(dados.MODAL)}" style="width: 1.75rem;height: 1.75rem;">`,
            processo: dados.Numero_Processo,
            abertura: formatDate(dados.Data_Auditado),
            vendedor: createAvatarColumn(dados.ID_VENDEDOR, dados.VENDEDOR),
            inside: createAvatarColumn(dados.ID_INSIDE_SALES, dados.INSIDE_SALES),
            efetivo: formatCurrency(dados.VALOR_EFETIVO_TOTAL),
            'porcentagem': dados.percentage+' %',
            'comissao': formatCurrency(dados.commission)
        };

        const rowNode = tables['GerenciamentoComissoes'].row.add(Object.values(newDados)).node();
        $(rowNode).find('td:eq(1)').addClass('dtr-control');
    });

    tables['GerenciamentoComissoes'].draw();
   

    // Manipula o clique no checkbox "checkTableComissoesAll"
    const check = document.querySelectorAll('.checkTableComissoes');
    for (let index = 0; index < check.length; index++) {
        const element = check[index];
        element.addEventListener('change', function() {
            getInfComissoes();
        });
    }



    const namesComissionados = document.querySelectorAll('.NameComissionado')

    for (let index = 0; index < namesComissionados.length; index++) {
        const element = namesComissionados[index];

        element.textContent = $('.js-example-templating option:selected').text();
        
    }

    removerLoader(meuLoader);
    getInfComissoes()


    document.querySelector('.btnGerarComissoes').classList.remove('disabled')

}

async function listComissionados(){
    const comissionados = await Thefetch('/api/listUser', 'POST')
    const selectComissionados = document.querySelector('.js-example-templating');
    selectComissionados.innerHTML = ''
    for (let index = 0; index < comissionados.length; index++) {
        const element = comissionados[index];

        selectComissionados.innerHTML += `<option  value="${element.IdPessoa}">${formatarNomeCompleto(element.Nome)}</option>`

    }


    $(".js-example-templating").select2({
        templateResult: formatState,
        templateSelection: formatState, // Use the same format for the selected option,
        placeholder: "Selecione"
    });
}

function formatCurrency(value) {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
}

function formatState(state) {
    if (!state.id) {
        return state.text;
    }

    
    const imageUrl = `https://cdn.conlinebr.com.br/colaboradores/${state.id}`

    const $state = $(
        `<span><img src="${imageUrl}" class="img-flag"> ${state.text}</span>`
    );

    return $state;
}

function createAvatarColumn(id, name) {
    return `<td>
                <div class="d-flex align-items-center gap-2">
                    <span class="avatar avatar-xs avatar-rounded">
                        <img src="https://cdn.conlinebr.com.br/colaboradores/${id}" alt="">
                    </span>
                    <div class="">${formatarNomeCompleto(name)}</div>
                </div>
            </td>`;
}

function getModalImage(modal) {
    return modal == 'IM' ? 'maritimo_importacao.svg' :
        modal == 'EM' ? 'maritimo_exportacao.svg' :
            modal == 'IA' ? 'aereo_importacao.svg' : 'aereo_exportacao.svg';
}

function formatDate(dataOriginal){
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
    if(nomeCompleto != null){
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
    }else{
        return 'não selecionado'
    }
    
}

function getInfComissoes(){
    // Obtenha todos os elementos com a classe 'checkTableComissoes'
    const checkboxes = document.querySelectorAll('.checkTableComissoes');

    // Crie um array para armazenar os checkboxes selecionados
    const checkboxesSelecionados = [];
    let valueComission = 0

    // Itere sobre os checkboxes para encontrar os selecionados
    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            valueComission += Number(checkbox.value)
            // Adicione o checkbox ao array se estiver selecionado
            checkboxesSelecionados.push(checkbox.value);
        }
    });
   
    document.querySelector('#NumberProcess').textContent = checkboxesSelecionados.length;
    document.querySelector('#valueProcess').textContent = formatCurrency(valueComission);

}


// Manipula o clique no checkbox "checkTableComissoesAll"
const checkAll = document.querySelector('.checkTableComissoesAll');
checkAll.addEventListener('change', function() {
    // Obtém o estado (marcado ou desmarcado) do checkbox "checkTableComissoesAll"
    var isChecked = this.checked;

    // Atualiza o estado de todos os checkboxes com a classe "checkTableComissoes"
    var checkboxes = document.querySelectorAll('.checkTableComissoes');
    checkboxes.forEach(function(checkbox) {
    checkbox.checked = isChecked;
    });

    getInfComissoes();
});



const buttonGenerate = document.querySelector('.btnGerarComissoes')
buttonGenerate.addEventListener('click', async function(e) {
    e.preventDefault()
    const text = buttonGenerate.textContent;
    buttonGenerate.textContent = 'Criando registro, aguarde';
    buttonGenerate.classList.add('disabled')

    const process = []
    const listProcess = document.querySelectorAll('.checkTableComissoes')

    for (let index = 0; index < listProcess.length; index++) {
        const element = listProcess[index];
        process.push(Number(element.getAttribute('id')))
        
        
    }


   await Thefetch('/api/RegisterCommission', 'POST', { body: JSON.stringify({ body: process}) });
   buttonGenerate.textContent = text;
   buttonGenerate.classList.remove('disabled')
})

































// // Formatting function for row details - modify as you need
// function format(d) {
//     // `d` is the original data object for the row
//     return (
//         '<dl>' +
//         '<dt>Full name:</dt>' +
//         '<dd>' +
//         d.name +
//         '</dd>' +
//         '<dt>Extension number:</dt>' +
//         '<dd>' +
//         d.extn +
//         '</dd>' +
//         '<dt>Extra info:</dt>' +
//         '<dd>And any further details here (images etc)...</dd>' +
//         '</dl>'
//     );
// }

// const cadFiltros = document.querySelector('.cardFiltros');



// const table = $('#table-comissoes').DataTable({
//     scrollY: '400px',
//     scrollCollapse: true,
//     order: [],
//     columnDefs: [
//         { "orderable": false, "targets": [0,1,2] },
//         {
//             targets: 3,
//             render: function ( data, type, row ) {

//                 const continuar = data.length > 14 ? '...' : ''
//                 return data.substr( 0, 15 )+continuar;
//             }
//         }
//     ],
//     paging: false,
//     scrollX: true,
//     language: {
//         searchPlaceholder: 'Search...',
//         sSearch: '',
//     },
// });

// // Add event listener for opening and closing details
// table.on('click', 'td.dtr-control', function (e) {
//     let tr = e.target.closest('tr');
//     let row = table.row(tr);
//     let iconCell = $(this);
 
//     if (row.child.isShown()) {
//         // This row is already open - close it
//         row.child.hide();
//         iconCell.removeClass('closed').addClass('open');
        
//     }
//     else {
//         // Open this row
//         row.child(format(row.data())).show();
//         iconCell.removeClass('open').addClass('closed');
//     }
// });

// // Função para obter ou carregar a imagem do cache, usando localStorage
// function getCachedImage(id) {
//     const cachedUrl = localStorage.getItem(`imageCache_${id}`);
    

//     if (cachedUrl) {
//         return cachedUrl;
//     } else {
//         const newUrl = `https://cdn.conlinebr.com.br/colaboradores/${id}`;
//         localStorage.setItem(`imageCache_${id}`, newUrl);
//         return newUrl;
//     }
// }

// // Função para formatar o estado com a imagem do cache
// function formatState(state) {
//     if (!state.id) {
//         return state.text;
//     }

//     const imageUrl = getCachedImage(state.id);

//     const $state = $(
//         `<span><img src="${imageUrl}" class="img-flag"> ${state.text}</span>`
//     );

//     return $state;
// }





// // document.querySelector('.dataTables_scroll').style.minHeight = (cadFiltros.clientHeight - 200) + 'px';



// const ButtonSearchComissoes = document.querySelector('.btn_searchComissoes');

// ButtonSearchComissoes.addEventListener('click', async function(e){
//     e.preventDefault()

//     const loader = document.getElementById("loader");
//     loader.classList.remove("d-none")

//     const type = {
//         vendedor: document.getElementById('vendedor').checked,
//         inside: document.getElementById('inside').checked
//     }

//     const idUser = $('.js-example-templating').val()
//     const tableCommissions = await Thefetch('/api/commissionByUser', 'POST', { body: JSON.stringify({UserId:idUser, type:type})})


//         // Limpar tabela antes de adicionar novos dados
//     table.clear();

//     // Adicionar cada objeto ao DataTable
//     tableCommissions.forEach(dados => {


//         const newDados = {
//             check: `<input class="form-check-input checkTableComissoes" checked="" type="checkbox" id="${dados.IdLogistica_House}" value="">`,
//             open: ``,
//             modal: `<img title="${dados.MODAL}" src="/assets/images/${dados.MODAL == 'IM' ? 'maritimo_importacao' : dados.MODAL == 'EM' ? 'maritimo_exportacao' : dados.MODAL == 'IA' ? 'aereo_importacao' : 'aereo_exportacao' }.svg" style="width: 1.75rem;height: 1.75rem;">`,
//             processo: dados.Numero_Processo,
//             abertura: new Date(dados.Data_Abertura_Processo).toLocaleDateString(),
//             // cliente: formatarNomeCompleto(dados.CLIENTE),
//             vendedor: `<td>
//                         <div class="d-flex align-items-center gap-2">
//                         <span class="avatar avatar-xs avatar-rounded">
//                             <img src="${getCachedImage(dados.ID_VENDEDOR)}" alt="">
//                         </span>
//                         <div class="">${formatarNomeCompleto(dados.VENDEDOR)}</div>
//                         </div>
//                     </td>`,
//             inside: `<td>
//                 <div class="d-flex align-items-center gap-2">
//                 <span class="avatar avatar-xs avatar-rounded">
//                     <img src="${getCachedImage(dados.ID_INSIDE_SALES)}" alt="">
//                 </span>
//                 <div class="">${formatarNomeCompleto(dados.INSIDE_SALES)}</div>
//                 </div>
//             </td>`,
//             efetivo: (dados.VALOR_EFETIVO_TOTAL).toLocaleString('pt-BR', {
//                 style: 'currency',
//                 currency: 'BRL',
//               }),
//             'porcentagem': '1%',
//              'comissao': (33333).toLocaleString('pt-BR', {
//                 style: 'currency',
//                 currency: 'BRL',
//               })

            
//         }

//         // Adiciona a linha de dados ao DataTable
//         // table.row.add(Object.values(newDados));
//         const rowNode = table.row.add(Object.values(newDados)).node();

//         $(rowNode).find('td:eq(1)').addClass('dtr-control');
//     });

//     // Atualizar a exibição da tabela
//     table.draw();
//     loader.classList.add("d-none")


//     // const comissionado = document.querySelector('.js-example-templating')
   
// })


// async function listComissionados(){
//     const comissionados = await Thefetch('/api/listUser', 'POST', { body: JSON.stringify({UserId:1, type:1})})
//     const selectComissionados = document.querySelector('.js-example-templating');
//     selectComissionados.innerHTML = ''
//     for (let index = 0; index < comissionados.length; index++) {
//         const element = comissionados[index];

//         selectComissionados.innerHTML += `<option value="${element.IdPessoa}">${formatarNomeCompleto(element.Nome)}</option>`

//     }


//     $(".js-example-templating").select2({
//         templateResult: formatState,
//         templateSelection: formatState, // Use the same format for the selected option,
//         placeholder: "Selecione"
//     });
// }
// listComissionados()



// function formaDate(dataOriginal){
//     // Criar um objeto de data
//     let data = new Date(dataOriginal);

//     // Obter componentes da data
//     let dia = String(data.getDate()).padStart(2, '0');
//     let mes = String(data.getMonth() + 1).padStart(2, '0'); // Mês é baseado em zero
//     let ano = data.getFullYear();
//     let hora = String(data.getHours()).padStart(2, '0');
//     let minutos = String(data.getMinutes()).padStart(2, '0');

//     // Criar a string formatada
//     return `${dia}/${mes}/${ano} ${hora}:${minutos}`;
// }

// function formatarNomeCompleto(nomeCompleto) {
//     if(nomeCompleto != null){
//     // Lista de prefixos que devem permanecer em minúsculas
//     const prefixos = ["de", "da", "do", "dos", "das"];

//     // Divida o nome completo em palavras
//     const palavras = nomeCompleto.split(' ');

//     // Formate o primeiro nome
//     let primeiroNome = palavras[0].charAt(0).toUpperCase() + palavras[0].slice(1).toLowerCase();

//     // Formate o sobrenome
//     let sobrenome = palavras.slice(1).map(palavra => {
//         return prefixos.includes(palavra.toLowerCase())
//             ? palavra.toLowerCase()
//             : palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase();
//     }).join(' ');

//     // Combine o primeiro nome e o sobrenome formatados
//     let nomeFormatado = `${primeiroNome} ${sobrenome}`;

//     return nomeFormatado;
//     }else{
//         return 'não selecionado'
//     }
    
// }




//     // Manipula o clique no checkbox "checkTableComissoesAll"
//     var checkAll = document.querySelector('.checkTableComissoesAll');
//     checkAll.addEventListener('change', function() {
//       // Obtém o estado (marcado ou desmarcado) do checkbox "checkTableComissoesAll"
//       var isChecked = this.checked;

//       // Atualiza o estado de todos os checkboxes com a classe "checkTableComissoes"
//       var checkboxes = document.querySelectorAll('.checkTableComissoes');
//       checkboxes.forEach(function(checkbox) {
//         checkbox.checked = isChecked;
//       });
//     });

