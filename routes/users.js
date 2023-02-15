var express = require('express');
var router = express.Router();
const fs = require('fs');
var path = require('path');
const { isLoggedIn, Response } = require('../helpers/util')

module.exports = function (db) {
  /* GET users listing. */
  router.get('/', async function (req, res, next) {
    try {
      sql = 'SELECT users.id_users, users.email_user, users.username, users.password, users.role, users.id_outlet, users.notepad, outlet.nama_outlet FROM public.users LEFT JOIN outlet ON users.id_outlet = outlet.id_outlet ORDER BY id_users ASC';

      const outlet = await db.query(`SELECT id_outlet, nama_outlet FROM public.outlet ORDER BY id_outlet ASC `)
      const { rows } = await db.query(sql);

      res.json(new Response({
        rows,
        outlet: outlet.rows,
      }))
    } catch (e) {
      res.status(500).json(new Response(e.toString(), false))
    }
  });

  return router;
}
