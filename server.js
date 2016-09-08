console.log('Sistema ABC')
const express = require('express')
const app = express()
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient
//BODY PARSER
app.use(bodyParser.urlencoded({extended: true}))

//PUBLIC FOLDER PARA PUBLIC
app.use(express.static('public'))

//VIEW ENGINE EMBEDDED JAVASCRIPT
app.set('view engine', 'ejs')

//USAR JSON
app.use(bodyParser.json())

//CONECTAR BDD
var db
MongoClient.connect('mongodb://bastida:password1@ds019936.mlab.com:19936/iconos', (err, database) => {
  if (err) return console.log(err)
	  db=database
	  app.listen(3000, () => {
  console.log('listening on 3000')
  })
	})

//HANDLERS:

app.post('/quotes', (req, res) => {
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('Agregado a BDD')
    res.redirect('/')
  })
})

app.get('/', (req, res) => {
   db.collection('quotes').find().toArray((err, result) => { 
    if (err) return console.log(err)
 // render de index.ejs
    res.render('index.ejs', {quotes: result})
	console.log(result)
	})
})

app.put('/quotes', (req, res) => {
  db.collection('quotes')
  .findOneAndUpdate({genero: 'Genero'}, {
    $set: {
      genero: req.body.genero,
      pelicula: req.body.pelicula
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/quotes', (req, res) => {
   db.collection('quotes').findOneAndDelete({genero: req.body.genero}, 
  (err, result) => {
    if (err) return res.send(500, err)
    res.send('Borrado')
  })
})