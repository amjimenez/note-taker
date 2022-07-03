const express = require('express')
const fs = require('fs');
const path = require('path')
const app = express()
const port = process.env.PORT || 3001
const dbFilePath = './db/db.json'

app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(express.json()) // allows for "Content-Type: application/json" header

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/notes', (req, res) => {
    res.render('notes')
})

app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, dbFilePath))
})

app.post('/api/notes', (req, res) => {
    let id;
    let newNote = req.body;

    fs.readFile(dbFilePath, 'utf8', (err, data) => {
        if (err) {
            console.log(`Failed to read ${dbFilePath}: ${err}`)
        } else {
            let existingNotes = JSON.parse(data)
            if (existingNotes.length > 0) {
                id = existingNotes[existingNotes.length - 1].id;
                id++;
            } else {
                id = 1;
            }
            newNote.id = id;
            existingNotes.push(newNote)
            let content = JSON.stringify(existingNotes)

            fs.writeFile(dbFilePath, content, err => {
                if (err) {
                    console.log(`Failed to write ${dbFilePath}: ${err}`)
                }

                res.json()
            });
        }   
    });
})

app.delete('/api/notes/:id', (req, res) => {
    // delete notes from db.json
    fs.readFile(dbFilePath, 'utf8', (err, data) => {
        if (err) {
            console.log(`Failed to read ${dbFilePath}: ${err}`)
        } else {
            let existingNotes = JSON.parse(data)
            existingNotes = existingNotes.filter(note => note.id != req.params.id)
            let content = JSON.stringify(existingNotes)

            fs.writeFile(dbFilePath, content, err => {
                if (err) {
                    console.log(`Failed to write ${dbFilePath}: ${err}`)
                }

                res.json()
            });
        }
    });
})

app.listen(port, () => {
  console.log(`Applistening on port ${port}`)
  // Ensure db.json file exists
  if (!fs.existsSync(dbFilePath)) {
    fs.writeFile(dbFilePath, '[]', err => {
        if (err) {
            console.log(`Failed to write ${dbFilePath}: ${err}`)
        }
    });
}
})
