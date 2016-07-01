'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const bcrypt = require('bcrypt');

router.post('/session', (req, res, next) => {
  knex('users')
    .where('email', req.body.email)
    .first()
    .then((user) => {
      if (!user) {
        return res.sendStatus(401);
      }

      const hashed_password = user.hashed_password;

      bcrypt.compare(req.body.password, hashed_password, (err, isMatch) => {
        if (err) {
          next(err);
        }

        if (!isMatch) {
          // User password was incorrect
          return res.sendStatus(401);
        }

        // User is authenticated
        // all we want to send and save in cookie is the user id and not everything about the user
        // http only cookie - can't access via javascript (for secuirty)
        req.session.userId = user.id;
        // takes the req.session and uses it in another seperate cookie later
        // above line not related to below line
        res.cookie('loggedIn', true);
        res.sendStatus(200);
      });
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/session', (req, res, next) => {
  req.session = null;
  res.clearCookie('loggedIn');
  res.sendStatus(200);
});

module.exports = router;
