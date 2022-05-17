const express = require('express')
const fs = require('fs');
const path = require('path')
const app = express()
const port = 3000

app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(express.json()) // allows for application/json content type

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/notes', (req, res) => {
    res.render('notes')
})

app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/db', 'db.json'))
})

app.post('/api/notes', (req, res) => {
    // save notes to db.json
    let newNote = req.body;
    let fileName = './db/db.json'

    fs.readFile(fileName, 'utf8', (err, data) => {
        if (err) {
            console.log(`Failed to load db.json: ${err}`)
        } else {
            let existingNotes = JSON.parse(data)
            existingNotes.push(newNote)
            let content = JSON.stringify(existingNotes)

            fs.writeFile(fileName, content, err => {
                if (err) {
                    console.error(err)
                }
            });
        }   
    });
})

// extra
app.delete('/api/notes/:id', (req, res) => {
    // delete notes from db.json
})

app.listen(port, () => {
  console.log(`Applistening on port ${port}`)
})
