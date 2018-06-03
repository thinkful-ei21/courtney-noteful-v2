'use strict';

const express = require('express');

// Create an router instance (aka "mini-app")
const router = express.Router();

// TEMP: Simple In-Memory Database
// const data = require('../db/notes');
// const simDB = require('../db/simDB');
// const notes = simDB.initialize(data);
const knex = require('../knex');
const hydrateNotes = require('../utils/hydrateNotes');


// Get All (and search by query)
router.get('/', (req, res, next) => {
  const searchTerm = req.query.searchTerm;
  const folderId = req.query.folderId;
  const tagId = req.query.tagId;
  
  //notes.filter(id)...
  knex('notes')
    .select('notes.id', 'title', 'content', 'folders_id as folderId', 'folders.name as folderName', 'tags.id as tagId', 'tags.name as tagName')
    .leftJoin('folders', 'notes.folder_id', 'folders.id')
    .leftJoin('notes_tags', 'notes.id', 'notes_tags.note_id')
    .leftJoin('tags', 'tags.id', 'notes_tags.tag_id')
    .modify(queryBuilder => {
      if (searchTerm) {
        queryBuilder.where('title', 'like', `%${searchTerm}%`);
      }
    })
    .modify(function (queryBuilder) {
      if(folderId) {
        queryBuilder.where('folder_id', folderId);
      }
    })
    .modify(function (queryBuilder) {
      if(tagId) {
        queryBuilder.where('tag_id', tagId);
      }
    })
    .orderBy('notes.id')
    .then(results => {
      const hydrated = hydrateNotes(results);
      res.json(hydrated);
    })
    .catch(err => {
      next(err);
    });
});


// Get a single item
router.get('/:id', (req, res, next) => {
  const id = req.params.id;

  //notes.find(id)
  knex('notes')
    .first('notes.id', 'content', 'title', 'folders_id as folderId', 'folders.name as folderName', 'tags.id as tagId', 'tags.name as tagName')
    .leftJoin('folders', 'notes.folder_id', 'folders.id')
    .leftJoin('notes_tags', 'notes.id', 'notes_tags.note_id')
    .leftJoin('tags', 'tags.id', 'notes_tags.tag_id')
    .where('notes.id', id)
    .then(result => {
      if (result) {
        const hydrated = hydrateNotes(result);
        res.json(hydrated);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

// Put update an item
router.put('/:id', (req, res, next) => {
  const id = req.params.id;
  const { title, content, folderId, tags = [] } = req.body;

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateableFields = ['title', 'content', 'folder_id'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  /***** Never trust users - validate input *****/
  if (!updateObj.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  knex('notes')
    .update(updateObj)
    .where('id', id)
    .returning(['id'])
      .then(() => {
        return knex('notes_tags')
          .del()
          .where('note_id', id);
      })
      .then(() => {
        const tagsInsert = tags.map(tagId => ({note_id: id, tag_id: tagId}));
        return knex.insert(tagsInsert).into('notes_tags');
      })
      .then(() => {
        return knex('notes')
          .select('notes.id', 'title', 'content', 'folder_id as folderId', 'folders.name as folderName', 'tags.id as tagId', 'tags.name as tagName')
          .leftJoin('folders', 'notes.folder_id', 'folders.id')
          .leftJoin('notes_tags', 'notes.id', 'notes_tags.note_id')
          .leftJoin('tags', 'tags.id', 'notes_tags.tag_id')
          .where('notes.id', id)
      })
      .then(result => {
        if (result) {
          const [hydrated] = hydrateNotes(result);
          res.json(hydrated);
        } else {
          next();
        }
      })
      .catch(err => {
        next(err);
      });
});

// Post (insert) an item
router.post('/', (req, res, next) => {
  const { title, content, folderId, tags = [] } = req.body;

  /***** Never trust users - validate input *****/
  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  const newItem = {
   title: title, 
   content: content, 
   folder_id: (folderId) ? folderId : null 
  };

  // notes.create(newItem)
  knex('notes')
    .insert(newItem)
    .returning('id')
    .then(([id]) => {
      const tagsInsert = tags.map(tagId => ({note_id: id, tag_id: tagId}));
      return knex.insert(tagsInsert).into('notes_tags');
    })
    .then( () => {
      return knex('notes')
        .select('notes.id', 'title', 'content', 'folder_id as folderId', 'folders.name as folderName', 'tags.id as tagId', 'tags.name as tagName')
        .leftJoin('folders', 'notes.folder_id', 'folders.id')
        .leftJoin('notes_tags', 'notes.id', 'notes_tags.note_id')
        .leftJoin('tags', 'tags.id', 'notes_tags.tag_id')
        .where('notes.id', id);
    })
    .then(result => {
      if(result) {
        const hydrated = hydrateNotes(result)[0];
        res.location(`${req.originalUrl}/${hydrated.id}`).status(201).json(hydrated);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

// Delete an item
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;

  // notes.delete(id)
  knex('notes')
    .del()
    .where('id', id)
    .then(() => {
      res.sendStatus(204).end();
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;




