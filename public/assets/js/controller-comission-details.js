const tables = []
document.addEventListener('DOMContentLoaded', async function () {
 

    

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
   
    await loadingContentComission(id)
    await HiddenLoader()
    
});

async function HiddenLoader(){
    const loader = document.getElementById("loader");
    loader.classList.add("d-none")
}

async function loadingContentComission(id){

  const comissionados = await Thefetch('/api/ContentComissionHistory', 'POST', { body: JSON.stringify({id:id})})
  const tableList = comissionados.table


  document.getElementById('nameComission').textContent = comissionados.nameComission;
  document.getElementById('nameCargo').textContent = 'Vendedor Externo';
  document.getElementById('imgComission').src = `https://cdn.conlinebr.com.br/colaboradores/${comissionados.user_comission}`

  document.getElementById('valueComission').textContent = comissionados.valueComission
  
  
  
  const modalBody = document.querySelector('.candidate-edu-timeline');
  const createTable = `
  <table id="tableComissoes_info_detail" class="table table-bordered text-nowrap w-100 dataTable no-footer collapsed" style="text-align: left;">
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

tables['tableComissoes_info_detail'].clear();

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

    const rowNode = tables['tableComissoes_info_detail'].row.add(Object.values(newDados)).node();
}


setTimeout(async () => {

    tables['tableComissoes_info_detail'].columns.adjust().draw();

}, 300);

  console.log(comissionados)


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
