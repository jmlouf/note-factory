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

notes.get('/:id', (req, res) => {
    const noteId = req.params.id;

    readFromFile('./db/notes.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            const activeNote = json.filter((note) => note.id === noteId);
            return activeNote.length > 0
                ? res.json(activeNote)
                : res.json('No notes with that ID.');
        })
});

// DELETE Route for a specific note.
notes.delete('/:noteId', (req, res) => {
    const noteId = req.params.noteId;

    readFromFile('./db/notes.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            // Make a new array of all notes except the one with the ID provided in the URL.
            const updatedNotes = json.filter((note) => note.id !== noteId);

            // Save that array to the filesystem.
            writeToFile('./db/notes.json', updatedNotes);

            // Respond to the DELETE request.
            res.json(updatedNotes);
        });
});

notes.post('/', (req, res) => {
    const { title, text } = req.body;

    if (req.body) {
        const newNote = {
            title,
            text,
            id: uuidv4(),
        };

        readAndAppend(newNote, './db/notes.json');
        res.json('Note added successfully.');

    } else {
        res.error('Error in posting note.');
    }
});

module.exports = notes;