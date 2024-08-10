const express = require('express')
const db = require('../db')
const utils = require('../utils')
const jwt = require('jsonwebtoken')
const config = require('../config')

const router = express.Router();

router.post('/register', (request, response) => {
    const { application_number, aadhar_number, application_date, name, father_name, validity, issue_date } = request.body

    const statement = `insert into learning_licenses (application_number, user_id, aadhar_number, application_date, name, father_name, validity, issue_date) values (?, ?, ?, ?, ?, ?, ?, ?)`
    db.pool.execute(statement, [application_number, request.user.user_id, aadhar_number, application_date, name, father_name, validity, issue_date],
        (error, result) => {
            response.send(utils.createResult(error, result))
        })
})


router.get('/licenses', (request, response) => {
    const statement = `SELECT * FROM learning_licenses WHERE user_id =?`;
    db.pool.execute(statement, [request.user.user_id], (error, results) => {
        response.send(utils.createResult(error, results));
    });
});



router.put('/licenses/:appNumber', (request, response) => {
    const appNumber = request.params.appNumber;
    const { aadhar_number, name, father_name, validity, issue_date } = request.body;

    const statement = `UPDATE learning_licenses SET aadhar_number = ?, name = ?, father_name = ?, validity = ?, issue_date = ? WHERE application_number = ? AND user_id = ?`;
    db.pool.execute(statement, [aadhar_number, name, father_name, validity, issue_date, appNumber, request.user.user_id], (error, result) => {
        response.send(utils.createResult(error, result));
    });
});

module.exports = router
