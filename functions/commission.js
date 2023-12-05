const {headCargoQuery} = require('../connect/headCargo');
const fs = require('fs');


const commission = {
    dados: [],
    getByUser: async function(id, type){

        let where = type == 1 ? ` WHERE ID_VENDEDOR = ${id}` : ` WHERE ID_INSIDE_SALES = ${id}`

        const result = await headCargoQuery(`SELECT * FROM vis_Comissao_vendedor_atualizada WHERE SITUACAO_AGENCIAMENTO = 'AUDITADO'`)
        return result;
    }
}



module.exports = {
    commission
};