'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');

const checkAuth = function(req, res, next) {
  if (!req.session.userId) {
    return res.sendStatus(401);
  }

  next();
}

router.get('/users/books', checkAuth, (req, res, next) => {
  const userId = req.session.userId;

  knex('users_books')
    .innerJoin('books', 'users_books.book_id', 'books.id')
    .where('users_books.user_id', userId)
    .then((books) => {
      if (!books) {
        return next();
      }

      res.send(books);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/users/books/:bookId', checkAuth, (req, res, next) => {
  const userId = req.session.userId;
  const bookId = Number.parseInt(req.params.bookId);

  if (Number.isNaN(bookId)) {
    return next();
  }
  knex('books')
    .innerJoin('users_books', 'users_books.book_id', 'books.id')
    .where({
      'users_books.user_id': userId,
      'users_books.book_id': bookId
    })
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

router.post('/users/books/:bookId', checkAuth, (req, res, next) => {
  const userId = req.session.userId;
  const bookId = Number.parseInt(req.params.bookId);

  if (Number.isNaN(bookId)) {
    return next();
  }
  knex('books')
    .where('id', bookId)
    .first()
    .then((book) => {
      if (!book) {
        return next();
      }

      return knex('users_books')
        .insert({
          user_id: userId,
          book_id: bookId
        }, '*')
        .then((results) => {
          res.send(results[0]);
        });
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/users/books/:bookId', checkAuth, (req, res, next) => {
  const userId = req.session.userId;
  const bookId = Number.parseInt(req.params.bookId);

  if (Number.isNaN(bookId)) {
    return next();
  }

  knex('users_books')
    .where({
      user_id: userId,
      book_id: bookId
    })
    .first()
    .then((userBook) => {
      if (!userBook) {
        return next();
      }

      return knex('users_books')
        .del()
        .where({
          user_id: userId,
          book_id: bookId
        })
        .then(() => {
          delete userBook.id;
          res.send(userBook);
        });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
