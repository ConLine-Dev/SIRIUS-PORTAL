const {executeQuery} = require('../connect/mysql');
const {headCargoQuery} = require('../connect/headCargo');
const fs = require('fs');
const { isNumberObject } = require('util/types');


const commission = {
    dados: [],
    getValuesCommisionsByUser: async function(id){
        const commissions = await executeQuery(`SELECT DISTINCT commission_percentage.*,collaborators.id_headcargo  FROM commission_percentage
        JOIN collaborators ON collaborators.id = id_collaborators WHERE id_headcargo = ${id}`)


        return commissions
    },
    listUser: async function(){
        const ListUsersHeadcago = await headCargoQuery(`SELECT * FROM vis_Vendedor_InsideSales`)
        

        const commissions = await executeQuery(`SELECT DISTINCT commission_percentage.*,collaborators.id_headcargo  FROM commission_percentage
        JOIN collaborators ON collaborators.id = id_collaborators`)

 

        let Comissionados = commissions.map(item => item.id_headcargo);

        let itensIguais = ListUsersHeadcago.filter(item => Comissionados.includes(item.IdPessoa));

        const novoArray = itensIguais.filter((item, index, array) => {
            // Retorna true se o índice do item atual for igual ao índice do primeiro item com o mesmo IdPessoa
            return array.findIndex(i => i.IdPessoa === item.IdPessoa) === index;
          });

          console.log(await this.criarReferencia())
        return novoArray;
    },
    getByUser: async function(id) {
        const where = `WHERE c.ID_INSIDE_SALES = ${id} AND (c.SITUACAO_AGENCIAMENTO = 'AUDITADO')
            UNION ALL
            SELECT * FROM vis_Comissao_vendedor_atualizada
            WHERE ID_VENDEDOR = ${id} AND SITUACAO_AGENCIAMENTO = 'AUDITADO';`;

        const result = await headCargoQuery(`
            SELECT * FROM vis_Comissao_vendedor_atualizada AS c
            ${where} 
        `);

        const commissions = await executeQuery(`SELECT commission_percentage.*,collaborators.id_headcargo  FROM commission_percentage
        JOIN collaborators ON collaborators.id = id_collaborators`)


        for (let index = 0; index < result.length; index++) {
            const element = result[index];
            if((element.ID_VENDEDOR == id && element.ID_INSIDE_SALES != id)){
                const comissao = commissions.find(objeto => objeto.id_headcargo == id && objeto.type == 1);
                element.percentage = comissao && comissao.percentage ? Number(comissao.percentage) : 'Não definida'
            }else if (element.ID_VENDEDOR != id && element.ID_INSIDE_SALES == id){
                const comissao = commissions.find(objeto => objeto.id_headcargo == id && objeto.type == 2);
                element.percentage = comissao && comissao.percentage ? Number(comissao.percentage) : 'Não definida'
            }else if(element.ID_VENDEDOR == id && element.ID_INSIDE_SALES == id){
                const comissao = commissions.filter(objeto => objeto.id_headcargo == id);
                const countComissao = comissao.reduce((total, comissao) => total + comissao.percentage, 0);
                
                element.percentage = Number(countComissao)
            }



            element.commission = typeof element.percentage === 'number' ? (element.percentage / 100) * element.VALOR_EFETIVO_TOTAL : 0
            
            
        }

    
        return result;
    },
    RegisterCommission: async function(body){
        const reference = await this.criarReferencia();
        console.log(reference);
    },

    criarReferencia: async function(){
        const commissions = await executeQuery(`SELECT * FROM commission_reference`);
        const NumberCommission = commissions.length + 1;
        // Garante que a quantidade seja formatada com pelo menos 4 dígitos
        const quantidadeFormatada = String(NumberCommission).padStart(4, '0');
        const anoAtual = new Date().getFullYear();
        // Obtém os dois últimos dígitos do ano atual
        const doisUltimosDigitosAno = String(anoAtual).slice(-2);

        // Combina os elementos para formar a referência
        const referencia = `CMS${quantidadeFormatada}-${doisUltimosDigitosAno}`;

        const ValidateReference = await executeQuery(`SELECT * FROM commission_reference WHERE reference = '${referencia}'`);

        if (ValidateReference.length > 0) {
            // Se a referência já existe, chama recursivamente para gerar uma nova referência
            return this.criarReferencia();
        } else {
            // Se a referência não existe, retorna a referência gerada
            return referencia;
        }
    }
}


module.exports = {
    commission
};