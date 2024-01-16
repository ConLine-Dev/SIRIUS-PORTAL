const tables = []
const Alltoasts = [];
let userSelected = 0
document.addEventListener('DOMContentLoaded', async function () {

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    userSelected = id
    await loadingContentComission(id)
    


    // const ButtonSearchComissoes = document.querySelector('.btn-approve');
    // ButtonSearchComissoes?.addEventListener('click', async function(e){
    //     console.log('dsads')
    //     e.preventDefault();
    //     await handleSearchComissoes(ButtonSearchComissoes.getAttribute('data-id'))
    // })

    const ButtonSearchComissoes = document.querySelector('.btn-approve');
    ButtonSearchComissoes?.addEventListener('click', async function(e){
        Swal.fire({
            title: 'Tem certeza?',
            text: "Os processos selecionados serão pagos nesta comissão.",
            icon: 'success',
            showCancelButton: true,
            confirmButtonColor: '#26bf94',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, aprovadar!'
        }).then(async (result)=> {
            if (result.isConfirmed) {

                await changeStatusComissions(2)
                Swal.fire(
                    'Aprovadas!',
                    'Comissões selecionadas foram aprovadas.',
                    'success'
                )
            }
        })
 
    })

    const ButtonRepprove = document.querySelector('.repprove-confirm');
    ButtonRepprove?.addEventListener('click', async function(e){
        Swal.fire({
            title: 'Tem certeza?',
            text: "Os processos selecionados não serão pagos nesta comissão.",
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, reprovar!'
        }).then(async (result)=> {
            if (result.isConfirmed) {

                await changeStatusComissions(1)
                Swal.fire(
                    'Reprovado!',
                    'Comissões selecionadas foram reprovadas.',
                    'success'
                )
            }
        })
 
    })

    const ButtonPay = document.querySelector('.pay-confirm');
    ButtonPay?.addEventListener('click', async function(e){
        Swal.fire({
            title: 'Deseja continuar?',
            text: "Efetuar baixa em todas comissões selecionadas",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, efetuar baixa!'
        }).then(async (result) => {
            if (result.isConfirmed) {

                await changeStatusComissions(3)

                Swal.fire(
                    'Tudo certo!',
                    'Baixa efetuada com sucesso!',
                    'success'
                )
            }
        })
 
    })

    const ButtonSendApprove = document.querySelector('.send-approve');
    ButtonSendApprove?.addEventListener('click', async function(e){
        Swal.fire({
            title: 'Deseja continuar?',
            text: "Enviar novamente para aprovação?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, enviar!'
        }).then(async (result) => {
            if (result.isConfirmed) {

                await changeStatusComissions(0)

                Swal.fire(
                    'Tudo certo!',
                    'Enviado novamente com sucesso!',
                    'success'
                )
            }
        })
 
    })

    // Manipula o clique no checkbox "checkTableComissoesAll"
    const checkAll = document.querySelector('.checkTableComissoesAll');
    checkAll?.addEventListener('change', async function() {
        // Obtém o estado (marcado ou desmarcado) do checkbox "checkTableComissoesAll"
        var isChecked = this.checked;

        // Atualiza o estado de todos os checkboxes com a classe "checkTableComissoes"
        var checkboxes = document.querySelectorAll('.checkTableComissoes');
        checkboxes.forEach(function(checkbox) {
        checkbox.checked = isChecked;
        });

        await getInfComissoes();
    });

    const ButtonSendEmail = document.querySelector('.ButtonSendEmail');
    ButtonSendEmail?.addEventListener('click', async function() {
        Swal.fire({
            title: 'Enviar relatório por e-mail',
            html: `<input
                    type="text"
                    class="swal2-input"
                    id="choices-text-email-filter">`,
            showCancelButton: true,
            confirmButtonText: 'Enviar',
            showLoaderOnConfirm: true,
            preConfirm: (login) => {
                return fetch(`https://jsonplaceholder.typicode.com/posts`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(response.statusText)
                        }
                        return response.json()
                    })
                    .catch(error => {
                        Swal.showValidationMessage(
                            `Request failed: ${error}`
                        )
                    })
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: `E-mail enviado com sucesso`,
                    // imageUrl: result.value.avatar_url
                })
            }
        })


        new Choices('#choices-text-email-filter', {
            allowHTML: true,
            editItems: true,
            addItemFilter: function (value) {
         
              if (!value) {
                return false;
              }
              const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
              const expression = new RegExp(regex.source, 'i');

              console.log(expression.test(value))
              return expression.test(value);
            },
          });
    });







 


    await HiddenLoader()
    
});


async function changeStatusComissions(id){
//0 AGUARDANDO APROVAÇÃO
//1 REPROVADO 
//2 AGUARDANDO Pagamento
//3 Pago

    const process = []
    const listProcess = document.querySelectorAll('.checkTableComissoes')
    for (let index = 0; index < listProcess.length; index++) {
        const element = listProcess[index];
        let data = element.getAttribute('data-json');
        data = JSON.parse(data);

     
        if (element.checked) {
            process.push({
                id:data.id_history,
                status:id
            })
        }
        
        
    }


   await Thefetch('/api/sendPayment', 'POST', { body: JSON.stringify({ body: process}) });
}

async function HiddenLoader(){
    const loader = document.getElementById("loader");
    loader.classList.add("d-none")
}

async function adicionarLoader(seletor) {
    // Selecione o elemento alvo (pode ser uma classe ou ID)
    var alvo = document.querySelector(seletor);


    var html = `<div class="loading"> <img style="width: 150px;" src="../assets/images/media/icon-semfundo2.gif" alt=""> </div>` 

    var loader = document.createElement('div');
    loader.classList.add('Newloading')
    loader.innerHTML = html;

   

    // Adicione o loader ao elemento alvo
    alvo.appendChild(loader);

    // Retorne o loader para que possa ser removido posteriormente
    return loader;
}

async function removerLoader(loader) {
    // Obtenha o pai do loader e remova o loader
    setInterval(() => {
        loader.remove();
    }, 500);2
}

async function loadingContentComission(id){


  const comissionados = await Thefetch('/api/ContentComissionHistory', 'POST', { body: JSON.stringify({id:id})})
  const tableList = comissionados.table



  document.getElementById('nameComission').textContent = comissionados.nameComission;
  document.getElementById('nameCargo').textContent = 'Vendedor Externo';
  document.getElementById('refComission').textContent = comissionados.refComission
  document.getElementById('imgComission').src = `https://cdn.conlinebr.com.br/colaboradores/${comissionados.user_comission}`

  document.getElementById('valueComission').textContent = comissionados.valueComission
  
  
  
  const modalBody = document.querySelector('.candidate-edu-timeline');
  const createTable = `
  <table id="tableComissoes_info_detail" class="table table-bordered text-nowrap w-100 dataTable no-footer collapsed" style="text-align: left;">
  <thead>
    <tr>
    <th scope="col"><input class="form-check-input checkTableComissoesAll" checked="" type="checkbox" value=""></th>
      <th scope="col" style="width: 10px;">Modal</th>
      <th scope="col">Processo</th>
      <th scope="col">Auditado</th>
      <th scope="col">Vendedor</th>
      <th scope="col">Inside</th>
      <th scope="col">Efetivo</th>
      <th scope="col">%</th>
      <th scope="col">Comissão</th>
      <th scope="col">Status</th>
    </tr>
  </thead>
  
  <tbody>

  </tbody>
</table>`;

modalBody.innerHTML = createTable;

tables['tableComissoes_info_detail'] = $('table#tableComissoes_info_detail').DataTable({
    order: [],
    columnDefs: [
        { "orderable": false, "targets": [0, 1, 2] },
    ],
    paging: false,
    scrollX: true,
    info: false,
    language: {
        searchPlaceholder: 'Pesquisar...',
        sSearch: '',
        
    },
});

console.log(tableList)

tables['tableComissoes_info_detail'].clear();



  //0 AGUARDANDO APROVAÇÃO
  //1 REPROVADO 
  //2 AGUARDANDO Pagamento
  //3 Pago

for (let index = 0; index < tableList.length; index++) {
    const dados = tableList[index];
    const newDados = {
        check: `<input class="form-check-input checkTableComissoes" data-json='${JSON.stringify(dados)}' value="${dados.commission}" checked="" type="checkbox" id="${dados.id_history}">`,
        modal: `<img title="${dados.modal}" src="/assets/images/${getModalImage(dados.modal)}" style="width: 1.75rem;height: 1.75rem;">`,
        processo: dados.reference_process,
        auditado: dados.audited,
        vendedor: createAvatarColumn(dados.id_seller, `${dados.seller_name} ${dados.seller_family_name}`),
        inside: createAvatarColumn(dados.id_inside, `${dados.inside_name} ${dados.inside_family_name}`),
        efetivo: formatCurrency(dados.effective),
        'porcentagem': dados.percentage+' %',
        'comissao': formatCurrency(dados.commission),
        status: dados.status_process == 0 ?
                '<span class="badge bg-secondary-transparent ms-2">Ag. Aprovação</span>' : 
                dados.status_process == 2 ? 
                '<span class="badge bg-warning-transparent ms-2">Ag. Pagamento</span>' : 
                dados.status_process == 3 ? 
                '<span class="badge bg-success-transparent ms-2">Pago</span>' : 
                '<span class="badge bg-danger-transparent ms-2">Reprovado</span>',
    };

    const rowNode = tables['tableComissoes_info_detail'].row.add(Object.values(newDados)).node();
}


setTimeout(async () => {

    tables['tableComissoes_info_detail'].columns.adjust().draw();

}, 300);

  console.log(comissionados)

  // Manipula o clique no checkbox "checkTableComissoesAll"
  const check = document.querySelectorAll('.checkTableComissoes');
  for (let index = 0; index < check.length; index++) {
      const element = check[index];
      element.addEventListener('change', async function() {
          await getInfComissoes();
      });
  }


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

function formatCurrency(value) {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
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

async function initializeDataTable() {
    return $('#table-comissoes-approve').DataTable({
        // responsive: {
        //     details: {
        //         display: $.fn.dataTable.Responsive.display.modal({
        //             header: function (row) {
        //                 var data = row.data();
        //                 return data[0] + ' ' + data[1];
        //             }
        //         }),
        //         renderer: $.fn.dataTable.Responsive.renderer.tableAll({
        //             tableClass: 'table'
        //         })
        //     }
        // },
        scrollY: '400px',
        scrollCollapse: true,
        order: [],
        columnDefs: [
            { "orderable": false, "targets": [0, 1, 2] },
            // {
            //     targets: 3,
            //     render: function (data) {
            //         const continuar = data.length > 14 ? '...' : '';
            //         return data.substr(0, 15) + continuar;
            //     }
            // }
        ],
        paging: false,
        scrollX: true,
        language: {
            searchPlaceholder: 'Search...',
            sSearch: '',
        },
    });
}

async function handleSearchComissoes(id) {
  

    const meuLoader = await adicionarLoader('.bodyCardComissoes .cardLoader');

    // const tableCommissions = await Thefetch('/api/commissionByUser', 'POST', { body: JSON.stringify({ UserId: idUser}) });

    const comissionados = await Thefetch('/api/ContentComissionHistory', 'POST', { body: JSON.stringify({id:id})})
    const tableList = comissionados.table

    if(!tables['table-comissoes-approve']){
        tables['table-comissoes-approve'] = await initializeDataTable();
    }
    
    tables['table-comissoes-approve'].clear();

    tableList.forEach(dados => {
        // const newDados = {
        //     check: `<input class="form-check-input checkTableComissoes" data-json='${JSON.stringify(dados)}' value="${dados.commission}" checked="" type="checkbox" id="${dados.IdLogistica_House}">`,
        //     open: ``,
        //     modal: `<img title="${dados.MODAL}" src="/assets/images/${getModalImage(dados.MODAL)}" style="width: 1.75rem;height: 1.75rem;">`,
        //     processo: dados.Numero_Processo,
        //     abertura: formatDate(dados.Data_Auditado),
        //     vendedor: createAvatarColumn(dados.ID_VENDEDOR, dados.VENDEDOR),
        //     inside: createAvatarColumn(dados.ID_INSIDE_SALES, dados.INSIDE_SALES),
        //     efetivo: formatCurrency(dados.VALOR_EFETIVO_TOTAL),
        //     'porcentagem': dados.percentage+' %',
        //     'comissao': formatCurrency(dados.commission)
        // };

        const newDados = {
            check: `<input class="form-check-input checkTableComissoes" data-json='${JSON.stringify(dados)}' value="${dados.commission}" checked="" type="checkbox" id="${dados.id_history}">`,
            modal: `<img title="${dados.modal}" src="/assets/images/${getModalImage(dados.modal)}" style="width: 1.75rem;height: 1.75rem;">`,
            processo: dados.reference_process,
            auditado: dados.audited,
            vendedor: createAvatarColumn(dados.id_seller, `${dados.seller_name} ${dados.seller_family_name}`),
            inside: createAvatarColumn(dados.id_inside, `${dados.inside_name} ${dados.inside_family_name}`),
            efetivo: formatCurrency(dados.effective),
            status: dados.status,
            // 'porcentagem': dados.percentage+' %',
            // 'comissao': formatCurrency(dados.commission)
        };

        const rowNode = tables['table-comissoes-approve'].row.add(Object.values(newDados)).node();
        // $(rowNode).find('td:eq(1)').addClass('dtr-control');
    });

    // tables['table-comissoes-approve'].draw();
    setTimeout(async () => {
        tables['table-comissoes-approve'].columns.adjust().draw();
        await removerLoader(meuLoader);
    }, 300);
   

    // Manipula o clique no checkbox "checkTableComissoesAll"
    const check = document.querySelectorAll('.checkTableComissoes');
    for (let index = 0; index < check.length; index++) {
        const element = check[index];
        element.addEventListener('change', async function() {
            await getInfComissoes();
        });
    }



    // const namesComissionados = document.querySelectorAll('.NameComissionado')

    // for (let index = 0; index < namesComissionados.length; index++) {
    //     const element = namesComissionados[index];

    //     element.textContent = $('.js-example-templating option:selected').text();
        
    // }

    // await removerLoader(meuLoader);





}

function alertToast(titulo, mensagem) {
    // Gera uma classe única usando um timestamp
    const uniqueClass = 'toast-' + new Date().getTime();

    // Cria o elemento do toast com a classe única
    const toastElement = document.createElement('div');
    toastElement.className = `toast ${uniqueClass} colored-toast bg-success-transparent fade hide`;
    toastElement.setAttribute('role', 'alert');
    toastElement.setAttribute('aria-live', 'assertive');
    toastElement.setAttribute('aria-atomic', 'true');

    const toastInnerHtml = `
        <div class="toast-header bg-success text-fixed-white">
     
            <strong class="me-auto title">${titulo}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">${mensagem}</div>
    `;

    toastElement.innerHTML = toastInnerHtml;

    // Adiciona o elemento do toast ao contêiner
    const toastContainer = document.querySelector('.toast-container');
    toastContainer.appendChild(toastElement);

    // Cria e armazena o objeto Toast do Bootstrap no array
    const toastInstance = new bootstrap.Toast(toastElement);
    Alltoasts.push(toastInstance);

    // Exibe o objeto Toast
    toastInstance.show();
}


