const express = require('express')
const db = require('../db')
const utils = require('../utils')
const jwt = require('jsonwebtoken')
const config = require('../config')

const router = express.Router();


router.post('/register', (request, response) => {
    const { dl_number, name, father_name, validity, issue_date, exam_date } = request.body

    const statement = `insert into driving_licenses (user_id, dl_number, name, father_name, validity, issue_date, exam_date) values (?, ?, ?, ?, ?, ?, ?)`
    db.pool.execute(statement, [request.user.user_id, dl_number, name, father_name, validity, issue_date, exam_date],
        (error, result) => {
            response.send(utils.createResult(error, result))
        })
})


router.get('/licenses', (request, response) => {
    const statement = `SELECT * FROM driving_licenses WHERE user_id =?`;
    db.pool.execute(statement, [request.user.user_id], (error, results) => {
        response.send(utils.createResult(error, results));
    });
});



router.put('/licenses/:dlNumber', (request, response) => {
    const dlNumber = request.params.dlNumber;
    const { name, father_name, validity, issue_date, exam_date } = request.body;

    const statement = `UPDATE driving_licenses SET name = ?, father_name = ?, validity = ?, issue_date = ?, exam_date = ? WHERE dl_number = ? AND user_id = ?`;
    db.pool.execute(statement, [name, father_name, validity, issue_date, exam_date, dlNumber, request.user.user_id], (error, result) => {
        response.send(utils.createResult(error, result));
    });
});

module.exports = router