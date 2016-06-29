'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex.js');

router.get('/books', (_req, res, next) => {
  knex('books')
    .orderBy('id')
    .then((books) => {
      res.send(books);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/books/:id', (req, res, next) => {
  const id = Number.parseInt(req.params.id);

  if (Number.isNaN(id)) {
    return next();
  }

  knex('books')
    .where('id', id)
    .first()
    .then((book) => {
      if (!book) {
        return next();
      }
      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/books', (req, res, next) => {
  const newBook = req.body;

  if (!newBook.title || newBook.title.trim() === ''){
      return res
        .status(400)
        .set('Content-Type', 'text/plain')
        .send('title must not be blank');
  }

  if (!newBook.genre || newBook.genre.trim() === ''){
      return res
        .status(400)
        .set('Content-Type', 'text/plain')
        .send('genre must not be blank');
  }

  if (!newBook.description || newBook.description.trim() === ''){
      return res
        .status(400)
        .set('Content-Type', 'text/plain')
        .send('discription must not be blank');
  }

  if (!newBook.cover_url || newBook.cover_url.trim() === ''){
      return res
        .status(400)
        .set('Content-Type', 'text/plain')
        .send('cover_url must not be blank');
  }

  const authorId = Number.parseInt(newBook.author_id);

  if (Number.isNaN(authorId)) {
    return res
      .status(400)
      .set('Content-Type', 'text/plain')
      .send('author_id must be an integer');
  }

  knex('authors')
    .where('id', authorId)
    .first()
    .then((author) => {
      if (!author) {
        return res
          .status(400)
          .set('Content-Type', 'text/plain')
          .send('author_id does not exsist');
      }
      return knex('books')
        .insert(newBook, '*')
        .then((results) => {
          res.send(results[0]);
        });
    })
    .catch((err) => {
      next(err);
    });
});

router.patch('/books/:id', (req, res, next) => {
  const id = Number.parseInt(req.params.id);

  if (Number.isNaN(id)) {
    return next();
  }

  knex('books')
    .where('id', req.params.id)
    .first()
    .then((book) => {
      if (!book) {
        return next();
      }

      const bookChanges = req.body;

      if (bookChanges.title) {
        book.title = bookChanges.title;
      }

      if (bookChanges.description) {
        book.description = bookChanges.description;
      }

      if (bookChanges.cover_url) {
        book.cover_url = bookChanges.cover_ul;
      }

      if (bookChanges.genre) {
        book.genre = bookChanges.genre;
      }

      const authorId = Number.parseInt(bookChanges.author_id);

      if (!Number.isNaN(authorId)) {
        book.author_id = authorId;
      }

      return knex('authors')
        .where('id', authorId)
        .first()
        .then((author) => {
          if (!author) {
            return res
              .status(400)
              .set('Content-Type', 'text/plain')
              .send('author_id does not exsist');
          }

          knex('books')
            .update(book, '*')
            .where('id', id)
            .then((results) => {
              res.send(results[0]);
            });
        })
        .catch((err) => {
          next(err);
        });
});

router.delete('/books/:id', (req, res, next) => {
  const id = Number.parseInt(req.params.id);

  if (Number.isNaN(id)) {
    return next();
  }

  knex('books')
    .where('id', id)
    .first()
    .then((book) => {
      if (!book) {
        return next();
      }

      return knex('books')
        .del()
        .where('id', id)
        .then(() => {
          delete book.id;
          res.send(book);
        });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
