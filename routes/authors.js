'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex.js');

router.get('/authors', (_req, res, next) => {
  knex('authors')
    .orderBy('id')
    .then((authors) => {
      res.send(authors);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/authors/:id', (req, res, next) => {
  knex('authors')
    .where('id', req.params.id)
    .first()
    .then((author) => {
      if (!author) {
        return next();
      }

      res.send(author);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/authors', (req, res, next) => {
  knex('authors')
    .insert(req.body, '*')
    .then((results) => {
      res.send(results[0]);
    })
    .catch((err) => {
      next(err);
    });
});

router.patch('/authors/:id', (req, res, next) => {
  knex('authors')
    .where('id', req.params.id)
    .first()
    .then((author) => {
      if (!author) {
        return next();
      }

      return knex('authors')
        .update(req.body, '*')
        .where('id', req.params.id)
        .then((results) => {
          res.send(results[0]);
        });
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/authors/:id', (req, res, next) => {
  knex('authors')
    .where('id', req.params.id)
    .first()
    .then((author) => {
      if (!author) {
        return next();
      }

      knex('authors')
        .where('id',req.params.id)
        .del()
        .then(() => {
          delete author.id;
          res.send(author);
        });
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/authors/:id/books', (req, res, next) => {
  knex('books')
    .orderBy('id')
    .where('author_id', req.params.id)
    .then((books) => {
      res.send(books);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
