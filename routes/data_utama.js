var express = require('express');
var router = express.Router();
const fs = require('fs');
var path = require('path');
const { isLoggedIn, Response } = require('../helpers/util')

module.exports = function (db) {
  router.get('/', async function (req, res) {
    try {
      const id_region = req.query.id_region ? req.query.id_region : '';
      let reqSQL
      let argumentSQL
      if (id_region == '') {
        reqSQL = 'SELECT * FROM public.data_utama ORDER BY id_utama ASC'
        argumentSQL = ''
      } else {
        reqSQL = 'SELECT * FROM public.data_utama WHERE id_region = $1 ORDER BY id_utama ASC'
        argumentSQL = [id_region]
      }
      db.query(reqSQL, argumentSQL, (err, data) => {
        if (err) throw new Error(err)
        res.json(new Response(data.rows[0]));
      })
    } catch (error) {
      console.log(error)
      res.status(500).json(new Response(error.toString(), false))
    }
  })

  return router;
}
