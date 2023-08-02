const express = require('express');
const router = express.Router();
//const Task = require('./model/Task');
//precisa adicionar este import
const sequelize = require('./sequelize');

//GET Retorna tarefas com paginação e ordenação
router.get('/tasks', async (req, res) => {
    const {page = 1 , limit = 10} = req.query;
    sequelize.query(`SELECT * FROM Tasks ORDER BY updatedAt DESC LIMIT ${limit} OFFSET ${(page - 1) * limit}`)
    .then(([results, metadata]) => {
        res.json(results)
    }).catch((error) => {
        res.status(500).json({
            sucess: false,
            message: error.message,
        });
    });
});

//GET Consulta uma tarefa pelo ID
router.get('/tasks/:id', async (req, res) => {
    sequelize.query(`SELECT * FROM Tasks WHERE id = ${req.params.id}`)
    .then(([results, metadata]) => {
        if(results.length === 0){
            res.status(404).json({
                sucess: false,
                message:"tarefa não encontrada",
            });
        }else{
            res.json({
                sucess: true,
                task: results[0],
            });
        }
    }).catch((error) => {
        res.status(500).json({
            sucess: false,
            message: error.message,
        });
    });
});

//POST Cria uma tarefa
router.post('/tasks', async (req, res) => {
    sequelize.query(`INSERT INTO Tasks (description) VALUES (${req.body.description})`)
    .then(([results, metadata]) => {
        res.status(201).json({
            sucess: true,
            message: "Tarefa criada com sucesso",
        });
    }).catch((error) => {
        res.status(500).json({
            sucess: false,
            message: error.message,
        });
    });
});

//PUT Atualiza uma tarefa pelo ID
router.put('/tasks/:id', async (req, res) => {
    sequelize.query(`UPDATE Tasks SET description = ${req.body.description} WHERE id = ${req.params.id}`)
    .then(([results, metadata]) => {
        if(metadata.affectedRows === 0){
            res.status(404).json({
                sucess: false,
                message:"tarefa não encontrada",
            });
        }else{
            res.json({
                sucess: true,
                message: "Tarefa atualizada com sucesso",
            });
        }
    }).catch((error) => {
        res.status(500).json({
            sucess: false,
            message: error.message,
        });
    });
});

//DELETE Deleta uma tarefa pelo ID
router.delete('/tasks/:id', async (req, res) => {
    sequelize.query(`DELETE FROM Tasks WHERE id = ${req.params.id}`)
    .then(([results, metadata]) => {
        if(metadata.affectedRows === 0){
            res.status(404).json({
                sucess: false,
                message:"tarefa não encontrada",
            });
        }else{
            res.json({
                sucess: true,
                message: "Tarefa deletada com sucesso",
            });
        }
    }).catch((error) => {
        res.status(500).json({
            sucess: false,
            message: error.message,
        });
    });
});


module.exports = router;