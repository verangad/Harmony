import {Accidental, Stave, StaveNote} from 'vexflow';

// Given a Stave object, simplify it to be able to be sent and stored into the database
export function simplifyStaves(staves){
    let simplifiedStaves = []

    // Loop through each stave
    for (let i = 0; i < staves.length; i++){

        // Get all needed data from the stave
        let selectedStave = staves[i].stave
        let clef = selectedStave.clef
        let x = selectedStave.x
        let y = selectedStave.y
        let width = selectedStave.width
        let timeSignature = selectedStave.timeSignature
        let simplifiedStave = {"clef": clef, "x": x, "y": y, "width": width, "timeSignature": timeSignature}

        let selectedNotes = []

        // Store all data in the new smaller Stave object
        for (let j = 0; j < staves[i].notes.length; j++){
            selectedNotes.push({"keys": staves[i].notes[j].keys, "duration": staves[i].notes[j].duration, "noteType": staves[i].notes[j].noteType})
        }

        simplifiedStaves.push({"stave": simplifiedStave, "notes": selectedNotes})
    }
    return simplifiedStaves
}

// Create an empty Stave object filled with quarted note rests and return it
export function createStave(clef, timeSignature, firstInBar) {
    let notes = []
    let stave = new Stave(0, 0, 400);

    // If stave is the first in the line, add a clef and time signature
    if(firstInBar){
        stave.addClef(clef)
        stave.addTimeSignature(timeSignature)
    }

    // Add all rest notes
    for(let i = 0; i < 4; i++){
        notes.push(new StaveNote({ keys: ["b/4"], duration: "qr" }))
    }

    return {"stave": stave, "notes": notes}
}

// Create a Note object and return it
function createNoteObject(note){
    // Get data and return note
    let keys = note.keys
    let duration = note.duration
    let noteType = note.noteType
    let accidentals = []

    for(let i = 0; i < keys.length; i++){
        if(keys[i].charAt(1) === "#" || keys[i].charAt(1) === "b") {
            accidentals.push(keys[i].charAt(1))
        }
        else {
            accidentals.push("")
        }
    }
    let newNote = new StaveNote({ keys: keys, duration: duration.concat(noteType) })
    for(let j = 0; j < accidentals.length; j++) {
        if(accidentals[j] !== "" && noteType !== "r") {
            newNote.addModifier(new Accidental(accidentals[j]), j)
        }
    }

    return newNote
}

// Create an empty Stave object and return it
function createStaveObject(stave){

    // Data
    let clef = stave.clef
    let x = stave.x
    let y = stave.y
    let width = stave.width

    let staveObj = new Stave(x, y, width);

    // Add clef and time signature
    staveObj.addClef(clef)
    staveObj.addTimeSignature("4/4")

    return staveObj
}

// Given a list of simplified staves, rehydrate them into full stave objects to be rendered
export function rehydrateStaves(staves){
    let rehydratedStaves = []

    // Loop through and convert each simple stave
    for(let i = 0; i < staves.length; i++)
    {
        let rehydratedStave = createStaveObject(staves[i].stave)
        let rehydratedNotes = []

        // Create each note
        for(let j = 0; j < staves[i].notes.length; j++){
            rehydratedNotes.push(createNoteObject(staves[i].notes[j]))
        }

        rehydratedStaves.push({"stave": rehydratedStave, "notes": rehydratedNotes})
    }

    return rehydratedStaves
}