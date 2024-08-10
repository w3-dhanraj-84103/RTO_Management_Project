const express = require('express')
const jwt = require('jsonwebtoken')
const db = require('../db')
const utils = require('../utils')
const config = require('../config')
const cryptoJs = require('crypto-js')

const router = express.Router();


router.post('/register', (request, response) => {
    const { admin_id, name, email, password, mobile } = request.body

    const encryptedPassword = String(cryptoJs.SHA256(password))

    const statement = `insert into admin (admin_id, name, email, password, mobile) values (?, ?, ?, ?, ?)`
    db.pool.execute(statement, [admin_id, name, email, encryptedPassword, mobile],
        (error, result) => {
            response.send(utils.createResult(error, result))
        })
})


router.post('/login', (request, response) => {
    const { email, password } = request.body

    const encryptedPassword = String(cryptoJs.SHA256(password))

    const statement = `SELECT admin_id, name FROM admin WHERE email =? and password =?`
    db.pool.execute(statement, [email, encryptedPassword], (error, admin) => {
        if (error) {
            response.send(utils.createError(error))
        } else {
            if (admin.length == 0) {
                response.send(utils.createError('Admin does not exist'))
            }
            else {
                const { admin_id, name } = admin[0]

                const payload = { admin_id, name }

                const token = jwt.sign(payload, config.secret)
                response.send(
                    utils.createSuccess({
                        token,
                        name
                    })
                )
            }
        }
    })
})


router.use((request, response, next) => {
    const token = request.header('token');
    if (!token) return response.status(401).send('Access denied. No token provided.');
    try {
        const decoded = jwt.verify(token, config.secret);
        request.user = decoded;
        next();
    } catch (ex) {
        response.status(400).send('Invalid token.');
    }
});


// Get all driving licenses
router.get('/get-driving-licenses', (request, response) => {
    const statement = 'SELECT * FROM driving_licenses';
    db.pool.execute(statement, (error, result) => {
        if (error) {
            console.error(error);
            response.status(500).send({ message: 'Error fetching driving licenses' });
        } else {
            response.send(utils.createResult(error, result))
        }
    });
});


// Get a specific driving license
router.get('/dl/:user_id', (request, response) => {
    const userId = request.params.user_id;
    const statement = 'SELECT * FROM driving_licenses WHERE user_id = ?';
    db.pool.execute(statement, [userId], (error, result) => {
        if (error) {
            console.error(error);
            response.status(500).send({ message: 'Error fetching driving license' });
        } else {
            response.send(utils.createResult(error, result))
        }
    });
});


// Get all driving licenses
router.get('/get-learning-licenses', (request, response) => {
    const statement = 'SELECT * FROM learning_licenses';
    db.pool.execute(statement, (error, result) => {
        if (error) {
            console.error(error);
            response.status(500).send({ message: 'Error fetching learning licenses' });
        } else {
            response.send(utils.createResult(error, result))
        }
    });
});


// Get a specific learning license
router.get('/ll/:user_id', (request, response) => {
    const userId = request.params.user_id;
    const statement = 'SELECT * FROM learning_licenses WHERE user_id = ?';
    db.pool.execute(statement, [userId], (error, result) => {
        if (error) {
            console.error(error);
            response.status(500).send({ message: 'Error fetching learning license' });
        } else {
            response.send(utils.createResult(error, result))
        }
    });
});


// Update a driving license
router.put('/driving-licenses/:user_id', (request, response) => {
    const userId = request.params.user_id;
    const updates = request.body;
    const statement = 'UPDATE driving_licenses SET ? WHERE user_id = ?';
    db.pool.execute(statement, [updates, userId], (error, result) => {
        if (error) {
            console.error(error);
            res.status(500).send({ message: 'Error updating driving license' });
        } else {
            response.send(utils.createResult(error, result))
        }
    });
});


// Update a driving license
router.put('/learning-licenses/:user_id', (request, response) => {
    const userId = request.params.user_id;
    const updates = request.body;
    const statement = 'UPDATE learning_licenses SET ? WHERE user_id = ?';
    db.pool.execute(statement, [updates, userId], (error, result) => {
        if (error) {
            console.error(error);
            res.status(500).send({ message: 'Error updating learning license' });
        } else {
            response.send(utils.createResult(error, result))
        }
    });
});


router.delete('/dl/:dlNumber', (request, response) => {
    const dlNumber = request.params.dlNumber;
    const statement = `DELETE FROM driving_licenses WHERE dl_number =?`;
    db.pool.execute(statement, [dlNumber], (error, result) => {
        response.send(utils.createResult(error, result));
    });
});


router.delete('/ll/:appNumber', (request, response) => {
    const appNumber = request.params.appNumber;
    const statement = `DELETE FROM learning_licenses WHERE application_number =?`;
    db.pool.execute(statement, [appNumber], (error, result) => {
        if (error) {
            console.error(error);
            response.status(500).send({ message: 'Error deleting learning license' });
        } else {
            response.send(utils.createResult(error, result));
        }
    });
});


// Get documents of a user
router.get('/documents/:userId', (request, response) => {
    const userId = request.params.userId;
    const statement = `SELECT * FROM documents WHERE user_id = ?`;
    db.pool.execute(statement, [userId], (error, result) => {
        if (error) {
            console.error(error);
            response.status(500).send({ message: 'Error fetching documents' });
        } else {
            response.send(utils.createResult(error, result));
        }
    });
});


module.exports = router