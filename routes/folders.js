'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');


router.get('/', (req, res, next) => {
	knex('folders')
		.select('id', 'name')
		.then(results => {
			res.json(results);
		})
		.catch(err => next(err));

});



router.get('/:id', (req, res, next) => {
	const id = req.params.id;

	knex('folders')
		.select('id', 'name')
		.where('id', id)

		.then(([results]) => {
				if(results) {
					res.json(results);
				} else {
					next();
				}
		})
		.catch(err => next(err));
});



router.put('/:id', (req, res, next) => {
	const id = req.params.id;

	/***** Never trust users - validate input *****/
  const updateObj = {};
  const updateableField = ['name'];

  if(updateableField in req.body) {
    updateObj[updateableField] = req.body[updateableField];
  }

  /***** Never trust users - validate input *****/
  if (!updateObj.name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  knex('folders')
  	.update(updateObj)
  	.where('id', id)
  	.returning(updateableField)

  	.then(([results]) => {
  		if(results) {
  			res.json(results);
  		} else {
  			next();
  		}
  	})
  	.catch(err => next(err));
});



router.post('/', (req, res, next) => {
	const { name } = req.body;

	const newFolder = { name };
  /***** Never trust users - validate input *****/
  if (!newFolder.name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  knex('folders')
  	.insert(newFolder)
  	.returning([ 'id', 'name' ])

  	.then(([results]) => {
  		if(results) {
  			res.location(`http://${req.headers.host}/folders/${results.id}`).status(201).json(results);
  		}
  	})
  	.catch(err => next(err));
});



router.delete('/:id', (req, res, next) => {
	const id = req.params.id;

	knex('folders')
		.where('id', id)
		.del()

		.then(() => {
			res.sendStatus(204);
		})
		.catch(err => next(err));
});




module.exports = router;





