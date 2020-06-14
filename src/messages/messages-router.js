const express = require('express')
const MessagesService = require('./messages-service')
const path = require('path')
const { requireAuth } = require('../middleware/jwt-auth')

const messagesRouter = express.Router()

messagesRouter
	.route('/')
	.get((req, res, next) => {
		MessagesService.getAllMessages(req.app.get('db'))
			.then(messages => {
				res.json(messages.map(MessagesService.serializeMessage))
			})
			.catch(next)
	})
	.post(requireAuth, (req, res, next) => {
		const { content } = req.body
		const newMessage = { content }

		for (const [key, value] of Object.entries(newMessage))
			if (value == null)
				return res.status(400).json({ error: `Missing '${key}' in request body` })

		newMessage.user_id = req.user.id

		MessagesService.insertMessage(
			req.app.get('db'),
			newMessage
		)
		.then(message => {
			res
				.status(201)
				.location(path.posix.join(req.originalUrl, `/${message.id}`))
				.json(MessagesService.serializeMessage(message))
		})
		.catch(next)
	})

messagesRouter
	.route('/:message_id')
	.all(requireAuth)
	.all(checkMessageExists)
	.get((req, res) => {
		res.json(MessagesService.serializeMessage(res.message))
})

async function checkMessageExists(req, res, next) {
	try {
		const message = await MessagesService.getById(
			req.app.get('db'),
			req.params.message_id
		)

		if (!message)
			return res.status(404).json({
				error: `Message doesn't exist`
			})

		res.message = message
		next()
	} catch (error) {
		next(error)
	}
}

module.exports = messagesRouter
