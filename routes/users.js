'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex.js');
const bcrypt = require('bcrypt');

router.post('/users', (req, res, next) => {
  const newUser = req.body;

  if (!newUser.first_name || newUser.first_name.trim() === '') {
    return res
      .status(400)
      .set('Content-Type', 'text/plain')
      .send('first_name must not be blank');
  }

  if (!newUser.last_name || newUser.last_name.trim() === '') {
    return res
      .status(400)
      .set('Content-Type', 'text/plain')
      .send('last_name must not be blank');
  }

  if (!newUser.email || newUser.email.trim() === '') {
    return res
      .status(400)
      .set('Content-Type', 'text/plain')
      .send('Email must not be blank');
  }

  if (!newUser.password || newUser.password.trim() === '') {
    return res
      .status(400)
      .set('Content-Type', 'text/plain')
      .send('Password must not be blank');
  }

  knex('users')
    // this 1=1 results in equality check and doesn't need to go and grab all rows and does instead a t or f check
    // goes from all columns to just one for t/f
    // more performant
    .select(knex.raw('1=1'))
    .where('email', newUser.email)
    .first()
    .then((emailExists) => {
      if (emailExists) {
        return res
          .status(400)
          .set('Content-Type', 'text/plain')
          .send('Email already exists');
          //res.send doesn't end all proccesses so need return statement
      }

      bcrypt.hash(newUser.password, 12, (hashErr, hashed_password) => {
        if (hashErr) {
          return next(hashErr);
        }

        // cannot return this promise thus we need two seperate catches
        // can't return because bcrypt is not with promises
        knex('users')
          .insert({
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email,
            hashed_password: hashed_password
          })
          .then((user) => {
            res.sendStatus(200);
          })
          .catch((insertErr) => {
            next(insertErr);
          });
      });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
