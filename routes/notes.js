const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const {
    readFromFile,
    readAndAppend,
    writeToFile,
} = require('../helpers/fsUtils');

// GET route for retrieving all notes from db.
notes.get('/', (req, res) => {
    readFromFile('./db/notes.json')
        .then((data) => res.json(JSON.parse(data)));
});

notes.post('/', (req, res) => {
    const { noteTitle, noteText } = req.body;

    if (noteTitle && noteText) {
        const newNote = {
            noteTitle,
            noteText,
            // note_id: uuidv4(),
        };

        readAndAppend(newNote, './db/notes.json');

        const response = {
            status: 'success',
            body: newNote,
        };

        res.json(response);
    } else {
        res.json('Error in posting note.');
    }
});

module.exports = notes;
