var express = require('express');
var router = express.Router();
const fs = require('fs');
var path = require('path');
const multer = require('multer');
const { isLoggedIn, Response } = require('../helpers/util')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, path.join(__dirname, '..', 'public', 'gambar_kantor'))
    } else {
      cb(null, path.join(__dirname, '..', 'public', 'file_sk'))
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + Date.now() + path.extname(file.originalname)) //Appending extension
  }
})
const upload = multer({ storage: storage }).any();
const multi_upload = multer({
  storage,
  // limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "application/pdf") {
      cb(null, true);
    } else {
      cb(null, false);
      const err = new Error('Only .png, .jpg, .pdf and .jpeg format allowed!')
      err.name = 'ExtensionError'
      return cb(err);
    }
  },
}).any()
module.exports = function (db) {
  router.get('/', async function (req, res) {
    try {
      let id_region = req.query.id_region ? req.query.id_region : '';
      const date_select = new Date(req.query.date_select) ? new Date(req.query.date_select) : '';

      let reqSQL
      let argumentSQL

      reqSQL = 'SELECT * FROM regions ORDER BY LENGTH(id_region), id_region'
      argumentSQL = ''

      let regions = []
      // if (id_region == '') {
      const { rows } = await db.query(reqSQL, argumentSQL)
      regions = rows
      //   id_region = regions[0].id_region
      //   console.log("region list", regions[0].id_region)
      // }
      reqSQL = 'SELECT * FROM data_utama du LEFT JOIN regions r ON du.id_region = r.id_region WHERE du.id_region = $1 ORDER BY du.id_utama ASC'
      argumentSQL = [id_region]
      db.query(reqSQL, argumentSQL, (err, data) => {
        if (err) throw new Error(err)
        let mainData
        mainData = data.rows

        let id_utama
        if (data.rows.length > 0) {
          id_utama = data.rows[0].id_utama ? data.rows[0].id_utama : '';
        } else {
          id_utama = ''
        }
        reqSQL = `SELECT ta.*, r.* FROM tabel_anggota ta LEFT JOIN data_utama du ON ta.id_utama = du.id_utama LEFT JOIN regions r ON du.id_region = r.id_region WHERE ta.id_utama=$1 AND EXTRACT('MONTH' FROM  ta.periode_bulanan) = $2 AND EXTRACT('YEAR' FROM  ta.periode_bulanan) = $3;`
        argumentSQL = [id_utama, date_select.getMonth() + 1, date_select.getFullYear()]
        db.query(reqSQL, argumentSQL, (err, data2) => {
          if (err) throw new Error(err)
          let childData = data2.rows
          db.query(`SELECT SUM(jumlah_anggota) as total_anggota FROM tabel_anggota ta WHERE EXTRACT('MONTH' FROM  ta.periode_bulanan) = $1 AND EXTRACT('YEAR' FROM  ta.periode_bulanan) = $2`, [date_select.getMonth() + 1, date_select.getFullYear()], (err, rows) => {
            if (err) throw new Error(err)
            let total = rows.rows[0]
            db.query(`SELECT id_utama, jumlah_anggota FROM tabel_anggota WHERE id_utama=$1 ORDER BY periode_bulanan DESC LIMIT 1`, [id_utama], (err, arr) => {
              if (err) throw new Error(err)
              let final = []
              if (mainData.length > 0) {
                final = [mainData.concat(arr.rows).reduce(function (result, current) {
                  return Object.assign(result, current);
                }, {})]
              } 

              res.json(new Response({ mainData: final, childData, regions, total }));
            })
          })
        })
      })
    } catch (error) {
      console.log(error)
      res.status(500).json(new Response(error.toString(), false))
    }
  })
  router.get('/main-data', async function (req, res) {
    try {
      let id_region = req.query.id_region ? req.query.id_region : '';
      let reqSQL
      let argumentSQL
      reqSQL = 'SELECT * FROM data_utama du LEFT JOIN regions r ON du.id_region = r.id_region WHERE du.id_region = $1 ORDER BY du.id_utama ASC'
      argumentSQL = [id_region]
      db.query(reqSQL, argumentSQL, (err, data) => {
        if (err) throw new Error(err)
        let mainData
        mainData = data.rows
        res.json(new Response(mainData));
      })
    } catch (error) {
      console.log(error)
      res.status(500).json(new Response(error.toString(), false))
    }
  })
  router.get('/child-data', async function (req, res) {
    try {
      let id_utama = req.query.id_utama ? req.query.id_utama : '';
      const date_select = new Date(req.query.date_select) ? new Date(req.query.date_select) : '';

      let reqSQL
      let argumentSQL
      reqSQL = `SELECT ta.*, r.* FROM tabel_anggota ta LEFT JOIN data_utama du ON ta.id_utama = du.id_utama LEFT JOIN regions r ON du.id_region = r.id_region WHERE ta.id_utama=$1 AND EXTRACT('MONTH' FROM  ta.periode_bulanan) = $2 AND EXTRACT('YEAR' FROM  ta.periode_bulanan) = $3;`
      argumentSQL = [id_utama, date_select.getMonth() + 1, date_select.getFullYear()]
      db.query(reqSQL, argumentSQL, (err, data2) => {
        if (err) throw new Error(err)
        let childData = data2.rows
        //console.log("date", )
        res.json(new Response(childData));
      })
    } catch (error) {
      console.log(error)
      res.status(500).json(new Response(error.toString(), false))
    }
  })
  router.post('/data/add', async function (req, res, next) {
    try {
      multi_upload(req, res, function (err) {
        const { id_region, alamat, no_telepon, periode_mulai, periode_selesai, nama_web, nama_fb, nama_ig } = req.body
        if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          res.status(500).send({ error: { message: `Multer uploading error: ${err.message}` } }).end();
          return;
        } else if (err) {
          // An unknown error occurred when uploading.
          if (err.name == 'ExtensionError') {
            res.status(413).send({ error: { message: err.message } }).end();
          } else {
            res.status(500).send({ error: { message: `unknown uploading error: ${err.message}` } }).end();
          }
          return;
        }
        db.query(`WITH inserted AS (INSERT INTO data_utama(id_region, alamat, no_telepon, gambar, file_sk, periode, medsos, create_date, update_date) VALUES ($1, $2, $3, ARRAY [$4::bytea, $5::bytea, $6::bytea], $7, ARRAY [$8::date, $9::date], ARRAY [$10, $11, $12], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *) SELECT * FROM inserted LEFT JOIN regions ON inserted.id_region = regions.id_region`, [id_region, alamat, no_telepon, req.files[0].filename, req.files[1].filename, req.files[2].filename, req.files[3].filename, periode_mulai, periode_selesai, nama_web, nama_fb, nama_ig], (err, rows) => {
          if (err) throw new Error(err)
          let data = rows.rows
          res.json(new Response(data));
        })
      })
    } catch (error) {
      res.status(500).json(new Response(error.toString(), false))
    }
  })
  router.put('/data/edit/:id', async function (req, res, next) {
    try {
      multi_upload(req, res, function (err) {
        const { id_region, alamat, no_telepon, periode_mulai, periode_selesai, nama_web, nama_fb, nama_ig } = req.body
        if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          res.status(500).send({ error: { message: `Multer uploading error: ${err.message}` } }).end();
          return;
        } else if (err) {
          // An unknown error occurred when uploading.
          if (err.name == 'ExtensionError') {
            res.status(413).send({ error: { message: err.message } }).end();
          } else {
            res.status(500).send({ error: { message: `unknown uploading error: ${err.message}` } }).end();
          }
          return;
        }
        if (req.files.length === 0) {
          console.log("upddata0")
          db.query(`WITH updated AS (UPDATE public.data_utama SET id_region=$1, alamat=$2, no_telepon=$3, periode=ARRAY [$4::date, $5::date], medsos=ARRAY [$6, $7, $8], update_date=CURRENT_TIMESTAMP WHERE id_utama=$9  RETURNING *) SELECT * FROM updated LEFT JOIN regions ON updated.id_region = regions.id_region;`, [id_region, alamat, no_telepon, periode_mulai, periode_selesai, nama_web, nama_fb, nama_ig, req.params.id], (err, rows) => {
            if (err) throw new Error(err)
            let data = rows.rows
            res.json(new Response(data));
          })
        } else if (req.files.length === 1) {
          console.log("upddata1")
          db.query(`WITH updated AS (UPDATE public.data_utama SET id_region=$1, alamat=$2, no_telepon=$3, file_sk=$4, periode=ARRAY [$5::date, $6::date], medsos=ARRAY [$7, $8, $9], update_date=CURRENT_TIMESTAMP WHERE id_utama=$10  RETURNING *) SELECT * FROM updated LEFT JOIN regions ON updated.id_region = regions.id_region;`, [id_region, alamat, no_telepon, req.files[0].filename, periode_mulai, periode_selesai, nama_web, nama_fb, nama_ig, req.params.id], (err, rows) => {
            if (err) throw new Error(err)
            let data = rows.rows
            res.json(new Response(data));
          })
        } else if (req.files.length === 3) {
          console.log("upddata3")
          db.query(`WITH updated AS (UPDATE public.data_utama SET id_region=$1, alamat=$2, no_telepon=$3, gambar=ARRAY [$4::bytea, $5::bytea, $6::bytea], periode=ARRAY [$7::date, $8::date], medsos=ARRAY [$9, $10, $11], update_date=CURRENT_TIMESTAMP WHERE id_utama=$12  RETURNING *) SELECT * FROM updated LEFT JOIN regions ON updated.id_region = regions.id_region;`, [id_region, alamat, no_telepon, req.files[0].filename, req.files[1].filename, req.files[2].filename, periode_mulai, periode_selesai, nama_web, nama_fb, nama_ig, req.params.id], (err, rows) => {
            if (err) throw new Error(err)
            let data = rows.rows
            res.json(new Response(data));
          })
        } else if (req.files.length === 4) {
          console.log("upddata4")
          db.query(`WITH updated AS (UPDATE public.data_utama SET id_region=$1, alamat=$2, no_telepon=$3, gambar=ARRAY [$4::bytea, $5::bytea, $6::bytea], file_sk=$7, periode=ARRAY [$8::date, $9::date], medsos=ARRAY [$10, $11, $12], update_date=CURRENT_TIMESTAMP WHERE id_utama=$13  RETURNING *) SELECT * FROM updated LEFT JOIN regions ON updated.id_region = regions.id_region;`, [id_region, alamat, no_telepon, req.files[0].filename, req.files[1].filename, req.files[2].filename, req.files[3].filename, periode_mulai, periode_selesai, nama_web, nama_fb, nama_ig, req.params.id], (err, rows) => {
            if (err) throw new Error(err)
            let data = rows.rows
            res.json(new Response(data));
          })
        }

      })
    } catch (error) {
      res.status(500).json(new Response(error.toString(), false))
    }
  })
  router.delete('/data/delete/:id', async function (req, res, next) {
    try {
      console.log("delete_data", req.params.id)
      // const { gambar_lama } = req.body
      // const { data } = await db.query('DELETE FROM data_utama WHERE id_utama = $1', [req.params.id])
      // const { rows } = await db.query('DELETE FROM tabel_anggota WHERE id_utama = $1', [req.params.id])
      res.json(new Response({ message: "delete tabel success" }, true))
      // deletePath = path.join(__dirname, '..', 'public', 'gambar', gambar_lama);
      // fs.unlink(deletePath, (err) => {
      //   if (err) throw new Error(err)
      //   res.json(new Response({ message: "delete varian success" }, true))
      // })
    } catch (e) {
      console.error(e)
      res.status(500).json(new Response(e.toString(), false))
    }
  })
  router.post('/child/add', async function (req, res, next) {
    const { periode_bulanan, jumlah_anggota, id_utama } = req.body
    console.log(req.body)
    try {
      const { rows } = await db.query(`WITH inserted AS (INSERT INTO tabel_anggota(jumlah_anggota, periode_bulanan, id_utama)VALUES ($1, $2::date, $3) RETURNING *) SELECT inserted.*, r.* FROM inserted LEFT JOIN data_utama du ON inserted.id_utama = du.id_utama LEFT JOIN regions r ON du.id_region = r.id_region`, [jumlah_anggota, periode_bulanan, id_utama])
      let data = rows
      res.json(new Response(data));
    } catch (e) {
      console.log("e", e)
      res.status(500).json(new Response(e.toString(), false))
    }
  })
  router.put('/child/edit/:id', async function (req, res, next) {
    const { periode_bulanan, jumlah_anggota } = req.body
    try {
      const { rows } = await db.query(`WITH updated AS (UPDATE tabel_anggota SET jumlah_anggota=$1, periode_bulanan=$2::date, tanggal_update=CURRENT_TIMESTAMP WHERE id_tabel_anggota=$3 RETURNING *) SELECT updated.*, r.* FROM updated LEFT JOIN data_utama du ON updated.id_utama = du.id_utama LEFT JOIN regions r ON du.id_region = r.id_region;`, [jumlah_anggota, periode_bulanan, req.params.id])
      let data = rows
      res.json(new Response(data));
    } catch (e) {
      console.log("e", e)
      res.status(500).json(new Response(e.toString(), false))
    }
  })
  router.delete('/child/delete/:id', async function (req, res, next) {
    //console.log('gambar', req.params.gambar_delete)
    try {
      const { rows } = await db.query('DELETE FROM tabel_anggota WHERE id_tabel_anggota = $1', [req.params.id])
      res.json(new Response({ message: "delete detail success" }, true))
    } catch (e) {
      res.status(500).json(new Response(e.toString(), false))
    }
  })
  return router;
}
