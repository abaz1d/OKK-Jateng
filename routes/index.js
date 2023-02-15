const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const router = express.Router();
const jwt = require('jsonwebtoken');

const path = require('path');
const { isLoggedIn, Response } = require('../helpers/util')

/* GET home page. */
module.exports = function (db) {
  router.get('/', function (req, res) {
    res.json(new Response({ message: "OKK JATENG API" }, true))
  });
  router.post('/auth', async function (req, res) {
    try {
      const { email_user, password } = req.body
      db.query('SELECT * FROM users WHERE email_user = $1', [email_user], (err, data) => {
        if (err) {
          throw new Error(err)
        }

        if (data.rows.length == 0) {
          return res.json(new Response({ message: "unregistered e-mail" }, false))
        }

        bcrypt.compare(password, data.rows[0].password, async function (err, result) {
          if (err) throw new Error(err)

          if (!result) {
            return res.json(new Response({ message: "password doesn't match" }, false))
          }

          //crete token 
          var token = jwt.sign({
            userid: data.rows[0].id_users,
            email: data.rows[0].email_user,
          }, process.env.SECRETKEY);
          const { rows } = await db.query(`WITH updated AS (UPDATE public.users SET token = $1 WHERE id_users = $2 RETURNING *) SELECT * FROM updated LEFT JOIN outlet ON updated.id_outlet = outlet.id_outlet;`, [token, data.rows[0].id_users])
          res.json(new Response({
            // userid: rows[0].id_users,
            // email: rows[0].email_user,
            // username: rows[0].username,
            // role: rows[0].role,

            // id_outlet: rows[0].id_outlet,
            // nama_outlet: rows[0].nama_outlet,
            // alamat_outlet: rows[0].alamat_outlet,
            // kontak_outlet: rows[0].kontak_outlet,
            // token: rows[0].token
          }))
        });
      })
    } catch (error) {
      res.status(500).json(new Response(error, false))
    }
  });

  router.get('/logout', async function (req, res) {
    const token = req.headers.authorization;
    if (token && token.split(' ')[1]) {
      const pureToken = token.split(' ')[1]
      try {
        const result = jwt.verify(pureToken, process.env.SECRETKEY)
        const { rows } = await db.query(`SELECT * FROM public.users WHERE id_users = ${result.userid} ORDER BY id_users ASC`)
        const user = rows[0]
        var tokenNow = null
        const { data } = await db.query(`UPDATE public.users SET token = $1 WHERE id_users = $2 RETURNING *;`, [tokenNow, user.id_users])
        res.json(new Response({ message: "sign out success" }, true))
      } catch (e) {
        res.json(new Response({ message: 'token invalid' }, false))
      }
    } else {
      res.json(new Response({ message: 'token invalid' }, false))
    }
  });
  return router;
}