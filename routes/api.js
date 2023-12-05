const express = require('express');
const router = express.Router();
const path = require("path");
const fs = require('fs');
const multer = require('multer');
const xlsx = require('xlsx');

const {db} = require('../functions/dbExcel');

// Configurando o middleware para aceitar uploads de arquivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Rota para lidar com o upload do arquivo
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
      // Lendo o arquivo XLSX do buffer de memória
      const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });

      const resultados = await db.load(workbook)
      console.log(resultados)
  
      // Envie uma resposta ao cliente
      res.status(200).json(resultados);
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao processar o arquivo XLSX.');
    }
  });

router.get('/get', async (req, res, next) => {
    try {
        const result = await db.get()
        res.status(200).json(result)
    } catch (error) {

        res.status(404).json('error')   
    }
    
});





module.exports = router;