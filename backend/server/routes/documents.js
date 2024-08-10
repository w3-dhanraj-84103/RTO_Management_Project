const express = require('express');
const multer = require('multer');
const db = require('../db')
const utils = require('../utils')
const jwt = require('jsonwebtoken')
const config = require('../config')

const router = express.Router();

const upload = multer({ dest: 'documents' })

// Create a new document
router.post('/', upload.fields([
    { name: 'aadhar_card', maxCount: 1 },
    { name: 'passport_photo', maxCount: 1 },
    { name: 'leaving_certificate', maxCount: 1 },
    { name: 'birth_certificate', maxCount: 1 },
    { name: 'pan_card', maxCount: 1 },
    { name: 'signature', maxCount: 1 },
]), (request, response) => {
    const {
        aadhar_card,
        passport_photo,
        leaving_certificate,
        birth_certificate,
        pan_card,
        signature,
    } = request.files;

    const statement = `INSERT INTO documents (aadhar_card, user_id, passport_photo, leaving_certificate, birth_certificate, pan_card, signature) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.pool.execute(
        statement,
        [
            aadhar_card[0].filename,
            request.user.user_id,
            passport_photo[0].filename,
            leaving_certificate[0].filename,
            birth_certificate[0].filename,
            pan_card[0].filename,
            signature[0].filename,
        ],
        (error, result) => {
            response.send(utils.createResult(error, result));
        }
    );
});

// Get all documents for a user
router.get('/', (request, response) => {
    const statement = `SELECT * FROM documents WHERE user_id = ?`;
    db.pool.execute(statement, [request.user.user_id], (error, results) => {
        response.send(utils.createResult(error, results));
    });
});

// Get a specific document by aadhar card number
router.get('/documents/:aadharCard', (request, response) => {
    const aadharCard = request.params.aadharCard;
    const statement = `SELECT * FROM documents WHERE aadhar_card = ? AND user_id = ?`;
    db.pool.execute(statement, [aadharCard, request.user.user_id], (error, result) => {
        response.send(utils.createResult(error, result));
    });
});

// Update a document
router.put('/:aadharCard', upload.fields([
    { name: 'aadhar_card', maxCount: 1 },
    { name: 'passport_photo', maxCount: 1 },
    { name: 'leaving_certificate', maxCount: 1 },
    { name: 'birth_certificate', maxCount: 1 },
    { name: 'pan_card', maxCount: 1 },
    { name: 'signature', maxCount: 1 },
]), (request, response) => {
    const aadharCard = request.params.aadharCard;
    const {
        aadhar_card,
        passport_photo,
        leaving_certificate,
        birth_certificate,
        pan_card,
        signature,
    } = request.files;

    const statement = `UPDATE documents SET aadhar_card = ?, passport_photo = ?, leaving_certificate = ?, birth_certificate = ?, pan_card = ?, signature = ? WHERE aadhar_card = ? AND user_id = ?`;
    db.pool.execute(
        statement,
        [
            aadhar_card[0].filename,
            passport_photo[0].filename,
            leaving_certificate[0].filename,
            birth_certificate[0].filename,
            pan_card[0].filename,
            signature[0].filename,
            aadharCard,
            request.user.user_id,
        ],
        (error, result) => {
            response.send(utils.createResult(error, result));
        }
    );
});

// Delete a document
router.delete('/:aadharCard', (request, response) => {
    const aadharCard = request.params.aadharCard;
    const statement = `DELETE FROM documents WHERE aadhar_card = ? AND user_id = ?`;
    db.pool.execute(statement, [aadharCard, request.user.user_id], (error, result) => {
        response.send(utils.createResult(error, result));
    });
});

module.exports = router