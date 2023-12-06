const {headCargoQuery} = require('../connect/headCargo');
const fs = require('fs');


const commission = {
    dados: [],
    listUser: async function(){
        const result = await headCargoQuery(`SELECT * FROM vis_Vendedor_InsideSales`)
        return result;
    },
    getByUser: async function(id, type){
        let where
        console.log(type)
        if(type.vendedor && !type.inside){
            where = `WHERE c.ID_VENDEDOR = ${id}`;
        }else if(!type.vendedor && type.inside){
            where = `WHERE c.ID_INSIDE_SALES = ${id}`;
        }else if (type.vendedor && type.inside){
            where = `WHERE (c.ID_INSIDE_SALES = ${id} OR c.ID_VENDEDOR = ${id})`;
        }



        const result = await headCargoQuery(`SELECT * FROM vis_Comissao_vendedor_atualizada AS c ${where} AND (c.SITUACAO_AGENCIAMENTO = 'AUDITADO')`)
        return result;
    }
}



module.exports = {
    commission
};