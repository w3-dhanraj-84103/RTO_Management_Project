const express = require('express')
const jwt = require('jsonwebtoken')
const db = require('../db')
const utils = require('../utils')
const config = require('../config')
const cryptoJs = require('crypto-js')

const router = express.Router();

router.post('/register', (request, response) => {
    const { email, first_name, last_name, aadhar_number, date_of_birth, age, blood_group, password, gender, mobile_number, address, pincode, city, district, state, country } = request.body

    const encryptedPassword = String(cryptoJs.SHA256(password))

    const statement = `insert into users (email, first_name, last_name, aadhar_number, date_of_birth, age, blood_group, password, gender, mobile_number, address, pincode, city, district, state, country) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    db.pool.execute(statement, [email, first_name, last_name, aadhar_number, date_of_birth, age, blood_group, encryptedPassword, gender, mobile_number, address, pincode, city, district, state, country],
        (error, result) => {
        response.send(utils.createResult(error, result))
    })
})

router.post('/login', (request, response) => {
    const { email, password } = request.body

    const encryptedPassword = String(cryptoJs.SHA256(password))

    const statement = `SELECT user_id, first_name, last_name FROM users WHERE email = ? and password = ?`
    db.pool.execute(statement, [email, encryptedPassword], (error, user) => {
        if (error)
        {
            response.send(utils.createError(error))
        } else {
            if (user.length == 0)
            {
                response.send(utils.createError('User does not exist'))
            }
            else
            {
                const { user_id, first_name, last_name } = user[0]

                const payload = { user_id, first_name, last_name }

                const token = jwt.sign(payload, config.secret)
                response.send(
                    utils.createSuccess({
                        token,
                        first_name,
                        last_name,
                    })
                )
            }
        }
    })
})




module.exports = router