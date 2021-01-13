const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const _ = require('lodash');
const mongoose = require('mongoose');

require('dotenv').config({ debug: process.env.DEBUG });
const { ObjectID } = require('mongodb');

const { User } = require('./models/user');
const { logger } = require('./logger');
const { sendMail } = require('./mail');

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());

const port = process.env.port || 3000;
const mongourl = process.env.MONGODB_URI || 'mongodb://localhost:27017/njsadev';

//connect to db.
mongoose.Promise = global.Promise;
mongoose.connect(mongourl, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true,
});

app.post('/api/user', async (req, res) => {
	try {
		var body = _.pick(req.body, [
			'firstname',
			'lastname',
			'email',
			'mobile',
		]);
		body.email = body.email.toLowerCase();
		let user = new User(body);
		await user.save();
		res.json(user);
		const text = `Hello ${body.firstname}, thank you for signing up`;

		sendMail('dolordamilola@gmail.com', user.email, 'Welcome', text);
	} catch (err) {
		res.status(400).json({
			error: err.message,
		});
		logger.log({
			level: 'error',
			message: 'err.message',
		});
	}
});

app.get('/api/users', (req, res) => {
	User.find()
		.then(users => {
			res.json({ users });
		})
		.catch(err =>
			res.status(400).json({
				error: err.message,
			})
		);
});

app.get('/api/user/:id', (req, res) => {
	let _id = req.params.id;
	if (!ObjectID.isValid(_id)) {
		return res.status(404).json({
			error: 'Invalid user id',
		});
	}
	User.findOne({
		_id,
	})
		.then(user => {
			if (!user) {
				return res.status(404).json({
					error: 'user not found',
				});
			}
			res.json({ user });
		})
		.catch(err => res.status(404).json({ err }));
});

app.patch('/api/user/:id', (req, res) => {
	let _id = req.params.id;
	var body = _.pick(req.body, ['firstname', 'lastname', 'email', 'mobile']);
	if (!ObjectID.isValid(_id)) {
		return res.status(404).json({
			error: 'Invalid user id',
		});
	}

	User.findOneAndUpdate({ _id }, { $set: body }, { new: true })
		.then(user => {
			if (!user) {
				return res.status(404).json({
					error: 'user not found',
				});
			}
			res.json({ user });
		})
		.catch(err => res.status(404).json({ err }));
});

app.delete('/api/user/:id', async (req, res) => {
	const _id = req.params.id;
	if (!ObjectID.isValid(_id)) {
		return res.status(404).json({
			error: 'Invalid user id',
		});
	}
	try {
		const user = await User.findOneAndRemove({ _id });
		if (!user) {
			return res.status(404).json({
				success: true,
				error: 'user not found',
			});
		}
		res.send({
			success: true,
			user,
		});
	} catch (err) {
		res.status(404).json({ err });
	}
});

app.listen(port, () => console.log(`App running on port ${port}`));

module.exports = app;
