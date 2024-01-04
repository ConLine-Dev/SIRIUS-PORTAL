const tables = []

document.addEventListener('DOMContentLoaded', async function () {
 
    await ComissionHistory()
    await InitSearchComission()
    await HiddenLoader()
    
});

async function HiddenLoader(){
    const loader = document.getElementById("loader");
    loader.classList.add("d-none")
}

async function ComissionHistory(){
    const meuLoader = await adicionarLoader('.bodyHistorico');

    const result = await Thefetch('/api/ComissionHistory', 'POST');

    const bodyHistorico = document.querySelector('.bodyHistorico');

    document.querySelector('.countComission').textContent = result.length;
    

    bodyHistorico.innerHTML = ``;
    let html = '';
    for (let index = 0; index < result.length; index++) {
        const element = result[index];

        html += `<div class="card custom-card">
        <div class="card-body">
          <div class="btn-list float-end">
            <a  data-id="${element.commission_reference_id}" class="avatar avatar-rounded avatar-sm bg-primary text-fixed-white" data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Baixar Resumo" data-bs-original-title="Baixar Resumo">
              <span>
                <i class="bi bi-download"></i>
              </span>
            </a>
            <a href="/comission-details?id=${element.commission_reference_id}" target="_blank" class="avatar avatar-rounded avatar-sm bg-light text-default" data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Ver detalhes" data-bs-original-title="Ver detalhes">
              <span>
                <i class="bi bi-eye"></i>
              </span>
            </a>
          </div>
          <div data-idComission="${element.commission_reference_id}" class="modal-effect d-flex mb-3 align-items-center flex-wrap gap-2" style="cursor:pointer;" data-bs-effect="effect-slide-in-bottom" data-bs-toggle="modal" href="#modaldemo8">
            <div>
              <span class="avatar avatar-lg avatar-rounded">
                <img src="https://cdn.conlinebr.com.br/colaboradores/${element.idHeadCargoUser}" alt="">
              </span>
            </div>
            <div>
              <h5 class="fw-semibold mb-0 d-flex align-items-center">
                <a href="#"> ${element.userComission_name} <i class="bi bi-check-circle-fill text-success fs-16" data-bs-toggle="tooltip" aria-label="Comissão paga" data-bs-original-title="Comissão paga"></i>
                </a>
              </h5>
              <div class="d-flex gap-2 flex-wrap">
                <a href="javascript:void(0);">Vendedor Externo</a>
                <p class="mb-0 fs-12 text-muted">
                  <i class="bi bi-geo-alt fs-11"></i> Itajaí, Santa Catarina
                </p>
              </div>
            </div>
          </div>
          <div class="d-flex align-items-center">
            <p class="mb-0 flex-grow-1">
              <span class="text-muted">Processos:</span>
              <span class="fw-semibold" data-bs-toggle="tooltip" data-bs-original-title="Quantidade de processos"> ${(element.quantidade).toString().padStart(4, '0')}</span>
            </p>
            <p class="mb-0">
              <span class="text-muted">Valor: </span>
              <span class="fw-semibold" data-bs-toggle="tooltip" data-bs-original-title="Valor da Comissão"> ${element.total_commission_value}</span>
            </p>
          </div>
        </div>
        <div class="card-footer">
          <div class="d-flex align-items-center gap-3 flex-wrap">
            <div class="popular-tags flex-grow-1">
            </div>
            <div>
              <a href="javascript:void(0);" class="badge badge-md rounded-pill bg-info-transparent" data-bs-toggle="tooltip" data-bs-original-title="">
                <i class="bi bi-hand-thumbs-up me-1"></i>${element.date} </a>
              <a href="javascript:void(0);" class="badge badge-md rounded-pill bg-success-transparent">
                <i class="bi bi-briefcase me-1"></i>Pago </a>
            </div>
          </div>
        </div>
      </div>`;

        
    }

    bodyHistorico.innerHTML += html

    await removerLoader(meuLoader);

    document.querySelectorAll(".modal-effect").forEach(e => {
        e.addEventListener('click', async function (e) {
            e.preventDefault();
            let effect = this.getAttribute('data-bs-effect');
            let id = this.getAttribute('data-idComission');
            document.querySelector("#modaldemo8").classList.add(effect);
    
            await loadingContentComission(id)

            
        
        });
    })
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
    loader.remove();
}

async function InitSearchComission(){
   
    var input = document.querySelector('.searchAllComissions');
    input.addEventListener('keyup', function() {
        var value = this.value.toLowerCase();
        var bodyHistoricoDivs = document.querySelectorAll('.bodyHistorico > div');
        var visibleCount = 0; // Inicializa o contador
        bodyHistoricoDivs.forEach(function(div) {
            var text = div.textContent.toLowerCase();
            if (text.includes(value)) {
                div.style.display = 'block';
                visibleCount++; // Incrementa o contador
            } else {
                div.style.display = 'none';
            }
        });

        document.querySelector('.countComission').textContent = visibleCount;
    });
}

async function loadingContentComission(id){
    const meuLoader = await adicionarLoader('#modaldemo8 .modal-content');


  const modalBody = document.querySelector('#modaldemo8 .modal-content .modalBody');

  const comissionados = await Thefetch('/api/ContentComissionHistory', 'POST', { body: JSON.stringify({id:id})})
  console.log(comissionados)


    const tableList = comissionados.table

    const comissionGroupID = tableList[0].reference_id;

const body = `
<div class="card custom-card">
  <div class="card-body">
    <div class="d-flex align-items-center justify-content-between gap-2 flex-wrap">
      <div>
        <span class="d-block text-muted fs-12">Comissionado</span>
        <div class="d-flex align-items-center">
          <div class="me-2 lh-1">
            <span class="avatar avatar-xs avatar-rounded">
              <img src="https://cdn.conlinebr.com.br/colaboradores/${comissionados.user_comission}" alt="">
            </span>
          </div>
          <span class="d-block fs-14 fw-semibold">${comissionados.nameComission}</span>
        </div>
      </div>
      <div>
        <span class="d-block text-muted fs-12">Data de criação</span>
        <span class="d-block fs-14 fw-semibold">${comissionados.dateComission}</span>
      </div>
      <div>
      <span class="d-block text-muted fs-12">Valor</span>
      <span class="d-block fs-14 fw-semibold">${comissionados.valueComission}</span>
    </div>
      <div>
        <span class="d-block text-muted fs-12">Status</span>
        <span class="d-block fs-15 fw-semibold">${comissionados.status_comission == 0 ? '<span class="badge bg-secondary"> Pendente </span>' : comissionados.status_comission == 1 ? '<span class="badge bg-warning"> Aprovado <br>'+comissionados.approved_date+'</span>' : comissionados.status_comission == 2 ? '<span class="badge bg-danger"> Reprovado <br>'+comissionados.declined_date+'</span>' : comissionados.status_comission == 3 ? '<span class="badge bg-warning"> Aprovado <br>'+comissionados.payment_date+'</span>' : '' }</span>
      </div>
      <div>
      <span class="d-block fs-14 fw-semibold"><div class="prism-toggle"> <a target="_blank" href="/comission-details?id=${comissionGroupID}" class="btn btn-sm btn-primary">Detalhes<i class="ri-book-mark-fill ms-2 d-inline-block align-middle"></i></a> </div></span>
    </div>
    </div>
    <hr>
    <table id="table-comissoes_info" class="table table-bordered text-nowrap w-100 dataTable no-footer collapsed" style="text-align: left;">
                        <thead>
                          <tr>
                            <th scope="col" style="width: 10px;">Modal</th>
                            <th scope="col">Processo</th>
                            <th scope="col">Auditado</th>
                            <th scope="col">Vendedor</th>
                            <th scope="col">Inside</th>
                            <th scope="col">Efetivo</th>
                            <th scope="col">%</th>
                            <th scope="col">Comissão</th>
                          </tr>
                        </thead>
                        
                        <tbody>
                 
                        </tbody>
    </table>
  </div>

</div>
`;




modalBody.innerHTML = body;
    console.log($('table#table-comissoes_info#table-comissoes_info'))
    tables['tableComissoes_info'] = $('table#table-comissoes_info').DataTable({
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


tables['tableComissoes_info'].clear();

for (let index = 0; index < tableList.length; index++) {
    const dados = tableList[index];
    const newDados = {
        modal: `<img title="${dados.modal}" src="/assets/images/${getModalImage(dados.modal)}" style="width: 1.75rem;height: 1.75rem;">`,
        processo: dados.reference_process,
        auditado: dados.audited,
        vendedor: createAvatarColumn(dados.id_seller, `${dados.seller_name} ${dados.seller_family_name}`),
        inside: createAvatarColumn(dados.id_inside, `${dados.inside_name} ${dados.inside_family_name}`),
        efetivo: formatCurrency(dados.effective),
        'porcentagem': dados.percentage+' %',
        'comissao': formatCurrency(dados.commission)
    };

    const rowNode = tables['tableComissoes_info'].row.add(Object.values(newDados)).node();
}



// tables['tableComissoes_info'].draw();
setTimeout(async () => {
    tables['tableComissoes_info'].columns.adjust().draw();
    await removerLoader(meuLoader);
}, 300);


}

function getModalImage(modal) {
    return modal == 'IM' ? 'maritimo_importacao.svg' :
        modal == 'EM' ? 'maritimo_exportacao.svg' :
            modal == 'IA' ? 'aereo_importacao.svg' : 'aereo_exportacao.svg';
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

