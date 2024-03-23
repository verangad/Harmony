import { Renderer, Stave, Formatter, StaveNote } from 'vexflow';

export function simplifyStaves(staves){
    console.log("efore", staves)
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
            console.log("SFHSJKFJKS")
            selectedNotes.push({"keys": staves[i].notes[j].keys, "duration": staves[i].notes[j].duration, "notetype": staves[i].notes[j].notetype})
        }

        simplifiedStaves.push({"stave": simplifiedStave, "notes": selectedNotes})
    }
    console.log(simplifiedStaves)
    return simplifiedStaves
}

function createNoteObject(note){
    let keys = note.keys
    let duration = note.duration
    return new StaveNote({ keys: keys, duration: duration })
}

function createStaveObject(stave){

    let clef = stave.clef
    let x = stave.x
    let y = stave.y
    let width = stave.width
    let timeSignature = stave.timeSignature

    let staveObj = new Stave(x, y, width);

    staveObj.addClef(clef)
    staveObj.addTimeSignature(timeSignature)
    
    return staveObj
}

export function rehydrateStaves(staves){
    console.log("staves: ", staves)
    let rehydratedStaves = []
    for(let i = 0; i < staves.length; i++)
    {
        let rehydratedStave = createStaveObject(staves[i].stave)
        let rehydratedNotes = []
        for(let j = 0; j < staves[i].notes.length; j++){
            rehydratedNotes.push(createNoteObject(staves[i].notes[j]))
        }
        rehydratedStaves.push({"staves": rehydratedStave, "notes": rehydratedNotes})
    }
    return rehydratedStaves
}