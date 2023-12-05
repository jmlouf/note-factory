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

notes.get('/:note_id', (req, res) => {
    const noteId = req.params.note_id;

    readFromFile('./db/notes.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            const resultNote = json.filter((note) => note.note_id === noteId);
            return resultNote
                ? res.json(resultNote)
                : res.json('No notes with that ID.');
        })
});

// DELETE Route for a specific note.
notes.delete('/:note_id', (req, res) => {
    const noteId = req.params.note_id;

    readFromFile('./db/notes.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            // Make a new array of all notes except the one with the ID provided in the URL.
            const updatedNotes = json.filter((note) => note.note_id !== noteId);

            // Save that array to the filesystem.
            writeToFile('./db/notes.json', updatedNotes);
            return updatedNotes
                ? res.json(updatedNotes)
                : res.json('Could not update notes.');
        })
});

notes.post('/', (req, res) => {
    const { title, text } = req.body;

    if (req.body) {
        const newNote = {
            title,
            text,
            note_id: uuidv4(),
        };

        readAndAppend(newNote, './db/notes.json');
        res.json(`${newNote} added successfully.`);

    } else {
        res.error('Error in posting note.');
    }
});

module.exports = notes;