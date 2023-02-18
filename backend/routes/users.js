const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { isTokenValid, Response } = require('../helpers/util')

/* GET home page. */
module.exports = function (db) {

  router.get('/', async function (req, res, next) {
    try {
      const id_region = req.query.id_region ? req.query.id_region : '';
      let reqSQL
      let argumentSQL

      reqSQL = 'SELECT * FROM regions ORDER BY id_region ASC'
      argumentSQL = ''

      let regions = []
      const data = await db.query(reqSQL, argumentSQL)
      regions = data.rows
      if (id_region == '') {
        reqSQL = 'SELECT users.id_user, users.email_user, users.username, users.password, users.role, users.id_region, regions.nama_region FROM public.users LEFT JOIN regions ON users.id_region = regions.id_region ORDER BY users.id_user ASC';
        argumentSQL = ''
      } else {
        reqSQL = 'SELECT users.id_user, users.email_user, users.username, users.password, users.role, users.id_region, regions.nama_region FROM public.users LEFT JOIN regions ON users.id_region = regions.id_region WHERE users.id_region = $1 ORDER BY users.id_user ASC';
        argumentSQL = [id_region]
      }
      const { rows } = await db.query(reqSQL, argumentSQL);
      res.json(new Response({rows, regions}))
    } catch (e) {
      console.error(e)
      res.status(500).json(new Response(e, false))
    }
  });
  router.post('/add', async function (req, res, next) {
    //id_region- token
    try {
      const { email_user, username, password, role, id_region } = req.body
      let reqSQL
      let argumentSQL
      db.query('SELECT * FROM users WHERE email_user = $1', [email_user], (err, email) => {
        if (err) return res.json(new Response({ message: "failed compare emaile" }, false))
        if (email.rows.length > 0) return res.json(new Response({ message: "e-mail has been registered" }, false))

        db.query('SELECT * FROM users WHERE username = $1', [username], (err, user) => {
          if (err) return res.json(new Response({ message: "failed compare emaile" }, false))
          if (user.rows.length > 0) return res.json(new Response({ message: "username has been registered" }, false))

          bcrypt.hash(password, saltRounds, async function (err, hash) {
            if (err) return res.json(new Response({ message: "failed hash" }, false))
            if (id_region !== "id_region") {
              reqSQL = `WITH inserted AS (INSERT INTO users(email_user,username,password,role,id_region) VALUES ($1, $2, $3, $4, $5) RETURNING *) SELECT * FROM inserted LEFT JOIN regions ON inserted.id_region = regions.id_region;`
              argumentSQL = [email_user, username, hash, role, id_region]
            } else {
              reqSQL = 'WITH inserted AS (INSERT INTO users(email_user,username,password,role) VALUES ($1, $2, $3, $4) RETURNING *) SELECT * FROM inserted LEFT JOIN regions ON inserted.id_region = regions.id_region;'
              argumentSQL = [email_user, username, hash, role]
            }
            const { rows } = await db.query(reqSQL, argumentSQL)
            if (err) return res.json(new Response({ message: "failed insert" }, false))
            res.json(new Response({
              data: rows[0]
            }))
          })
        })
      })
    } catch (error) {
      res.json(new Response({ message: "failed add user" }, false))
    }
  });
  router.put('/edit/:id', async function (req, res, next) {
    try {
      
      if (Object.keys(req.body).length > 4) {
        console.log("password Baru")
        const { email_user, username, password, role, id_region } = req.body
        const email_terpakai = await db.query('SELECT * FROM users WHERE email_user = $1 AND id_user != $2', [email_user, req.params.id]);
        if (email_terpakai.rows.length > 0) return res.json(new Response({ message: "e-mail has been registered" }, false))
        const username_terpakai = await db.query('SELECT * FROM users WHERE username = $1 AND id_user != $2', [username, req.params.id]);
        if (username_terpakai.rows.length > 0) return res.json(new Response({ message: "username has been registered" }, false))
  
        bcrypt.hash(password, saltRounds, async function (err, hash) {
          if (err) return res.json(new Response({ message: "failed hash" }, false))
          const { rows } = await db.query(`WITH updated AS (UPDATE users SET 
          email_user = $1,
          username = $2,
          password = $3,
          role = $4,
          id_region = $5
          WHERE id_user = $6 RETURNING *) SELECT * FROM updated LEFT JOIN regions ON updated.id_region = regions.id_region;`, [email_user, username, hash, role, id_region, req.params.id])
          res.json(new Response({
            data: rows[0]
          }))
        })
      } else {
        console.log("Password Lama");
        const { email_user, username, role, id_region } = req.body
        const email_terpakai = await db.query('SELECT * FROM users WHERE email_user = $1 AND id_user != $2', [email_user, req.params.id]);
        if (email_terpakai.rows.length > 0) return res.json(new Response({ message: "e-mail has been registered" }, false))
        const username_terpakai = await db.query('SELECT * FROM users WHERE username = $1 AND id_user != $2', [username, req.params.id]);
        if (username_terpakai.rows.length > 0) return res.json(new Response({ message: "username has been registered" }, false))

        const { rows } = await db.query(`WITH updated AS (UPDATE users SET 
        email_user = $1,
        username = $2,
        role = $3,
        id_region = $4
        WHERE id_user = $5 RETURNING *) SELECT * FROM updated LEFT JOIN regions ON updated.id_region = regions.id_region;`, [email_user, username, role, id_region, req.params.id])
        res.json(new Response({
          data: rows[0]
        }))
      }
    } catch (e) {
      console.error(e)
      res.json(new Response({ message: "failed edit user" + e.toString() }, false))
    }
  });
  router.delete('/delete/:id', async function (req, res, next) {
    try {
      const { rows } = await db.query('DELETE FROM users WHERE id_user = $1', [req.params.id])
      res.json(new Response({ message: "Berhasil menghapus User" }, true))
    } catch (e) {
      res.json(new Response({ message: "failed add user" + e.toString() }, false))
    }
  });

  return router;
}