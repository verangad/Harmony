import { Renderer, Stave, Formatter, StaveNote } from 'vexflow';

export function simplifyStaves(staves){
    let simplifiedStaves = []
    for (let i = 0; i < staves.length; i++){
        let selectedStave = staves[i].stave
        let clef = selectedStave.clef
        let x = selectedStave.x
        let y = selectedStave.y
        let width = selectedStave.width
        let timeSignature = selectedStave.timeSignature
        let simplifiedStave = {"clef": clef, "x": x, "y": y, "width": width, "timeSignature": timeSignature}

        let selectedNotes = []

        for (let j = 0; j < staves[i].notes.length; j++){
            selectedNotes.push({"keys": staves[i].notes[j].keys, "duration": staves[i].notes[j].duration, "noteType": staves[i].notes[j].noteType})
        }

        simplifiedStaves.push({"stave": simplifiedStave, "notes": selectedNotes})
    }
    return simplifiedStaves
}

function createNoteObject(note){
    let keys = note.keys
    let duration = note.duration
    let noteType = note.noteType
    return new StaveNote({ keys: keys, duration: duration.concat(noteType) })
}

function createStaveObject(stave, context){

    let clef = stave.clef
    let x = stave.x
    let y = stave.y
    let width = stave.width
    let timeSignature = stave.timeSignature

    let staveObj = new Stave(x, y, width);

    staveObj.addClef(clef)
    staveObj.addTimeSignature("4/4")


    return staveObj
}

export function rehydrateStaves(staves, context){
    console.log("staves: ", staves)
    let rehydratedStaves = []
    for(let i = 0; i < staves.length; i++)
    {
        let rehydratedStave = createStaveObject(staves[i].stave, context)
        let rehydratedNotes = []
        for(let j = 0; j < staves[i].notes.length; j++){
            rehydratedNotes.push(createNoteObject(staves[i].notes[j]))
        }
        rehydratedStaves.push({"stave": rehydratedStave, "notes": rehydratedNotes})
    }
    return rehydratedStaves
}