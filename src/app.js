require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const authRouter = require('./auth/auth-router')
const usersRouter = require('./users/users-router')
const profilesRouter = require('./profiles/profiles-router')
const conversationsRouter = require('./conversations/conversations-router')
const messagesRouter = require('./messages/messages-router')

const app = express()
app.use(express.json())

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common'

const {CLIENT_ORIGIN} = require('./config');

app.use(morgan(morganOption))
app.use(helmet())
app.use(
  cors({
      origin: CLIENT_ORIGIN
  })
)

app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/profiles', profilesRouter)
app.use('/api/conversations', conversationsRouter)
app.use('/api/messages', messagesRouter)

app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } } 
  } else {
    console.error(error)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
})

module.exports = app
