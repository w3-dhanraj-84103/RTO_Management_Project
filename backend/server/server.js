const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const jwt = require('jsonwebtoken')
const utils = require('./utils')
const config = require('./config')

const app = express()
app.use(cors())
app.use(morgan('combined'))
app.use(express.json({limit : '100mb'}))
app.use(express.urlencoded({extended : true, limit : '100mb'}))

app.use((request, response, next) =>
{
    if (request.url == '/user/login' ||
        request.url == '/admin/login' ||
        request.url == '/user/register' ||
        request.url == '/admin/register')
        {
            next()
        }
    else
    {
        const token = request.headers['token']
        if(!token || token.length == 0)
            {
                response.send(utils.createError('Missing token'))
            }
        else
        {
            try {
                const payload = jwt.verify(token, config.secret)
                request.user = payload
                next()
            }
            catch (ex) {
                response.send(utils.createError('Invalid Token'))
            }
        }
    }
})

const userRouter = require('./routes/user')
const adminRouter = require('./routes/admin')
const drivingLicensesRouter = require('./routes/drivingLicenses')
const learningLicensesRouter = require('./routes/learningLicenses')
const documentsRouter = require('./routes/documents')

app.use('/user', userRouter)
app.use('/admin', adminRouter)
app.use('/drivingLicenses', drivingLicensesRouter)
app.use('/learningLicenses', learningLicensesRouter)
app.use('/documents', documentsRouter)

app.listen(7581, '0.0.0.0', () => {
    console.log(`Server started on port 7581 ....`)
})