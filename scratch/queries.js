'use strict';

const knex = require('../knex');

let searchTerm = 'Cats';
let searchId = 1002;
let updateObj = {
  title: 'Dogs',
  content: 'Mans best friend'
};

let createNewNote = {
  title: 'Hot Diggity Dog',
  content: 'Mans best friend'
};


//GET ALL NOTES
// knex
//   .select('notes.id', 'title', 'content')
//   .from('notes')
//   .modify(queryBuilder => {
//     if (searchTerm) {
//       queryBuilder.where('title', 'like', `%${searchTerm}%`);
//     }
//   })
//   .orderBy('notes.id')
//   .then(results => {
//     console.log(JSON.stringify(results, null, 2));
//   })
//   .catch(err => {
//     console.error(err);
//   });

//GET NOTE BY ID
  // knex('notes')
  //   .first('id')
  //   .where('id', `${searchId}`)
  //   .then(results => {
  //     console.log(JSON.stringify(results, null, 2));
  //   })
  //   .catch(err => {
  //     console.error(err);
  //   });


// UPDATING NOTE WITH NEW INFO
// knex('notes')
//   .returning(['title', 'content'])
//   .select('id')
//   .where('id', `${searchId}`)
//   .update(updateObj)
//   .then(results => {
//     console.log(JSON.stringify(results[0], null, 2));
//   })
//   .catch(err => {
//     console.error(err);
//   });


//CREATING NEW NOTE
// knex('notes')
//   .returning(['id', 'title', 'content'])
//   .insert(createNewNote)
//   .then(results => {
//     console.log(JSON.stringify(results[0], null, 2));
//   })
//   .catch(err => {
//     console.error(err);
//   });


//DELETE NOTE
// knex('notes')
//   .where('id', `${searchId}`)
//   .del()
//   .then(results => {
//     console.log(JSON.stringify(results[0], null, 2));
//   })
//   .catch(err => {
//     console.error(err);
//   });






