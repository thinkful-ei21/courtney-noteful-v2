'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');


router.get('/', (req, res, next) => {
	knex('tags')
		.select('id', 'name')
		.then(results => {
			res.json(results);
		})
		.catch(err => {
			next(err);
		});
});


router.get('/:id', (req, res, next) => {
	knex('tags')
		.first('id', 'name')
		.where('id', req.params.id)
		.then(result => {
			if (result) {
				res.json(result);
			} else {
				next();
			}
		})
		.catch(err => {
			next(err);
		});
});


router.put(':id', (req, res, next) => {
	const {name} = req.body;

	if(!name) {
		const err = new Error('Missing `name` in request body');
		err.status = 400;
		return next(err);
	}

	const updateItem = {name};

	knex('tags')
		.update(updateItem)
		.where('id', req.params.id)
		.returning(['id', 'name'])
		.then(([result]) => {
			if(result) {
				res.json(result);
			} else {
				next();
			}
		})
		.catch(err => {
			next(err);
		});
});


router.post('/', (req, res, next) => {
	const {name} = req.body;

	if(!name) {
		const err = new Error('Missing `name` in request body');
		err.status = 400;
		return next(err);
	}

	const newItem = {name};

	knex('tags')
		.insert(newItem)
		.returning(['id', 'name'])
		.then(results => {
			res.location(`${req.originalUrl}/${results[0].id}`).status(201).json(results[0]);
		})
		.catch(err => next(err));
});


router.delete('/:id', (req, res, next) => {
	knex('tags')
		.del()
		.where('id', req.params.id)
		.then(() => {
			res.status(204).end();
		})
		.catch(err => {
			next(err);
		});
});


module.exports = router;