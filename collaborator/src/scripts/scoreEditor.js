import {Stave, StaveNote} from "vexflow";

export function createStave(clef, timeSignature, level, firstInBar, x, y) {
    let notes = []
    let stave = new Stave(x, y, 400);

    if(firstInBar || x === 0){
        stave.addClef(clef)
        stave.addTimeSignature(timeSignature)
    }

    for(let i = 0; i < 4; i++){
        notes.push(new StaveNote({ keys: ["b/4"], duration: "qr" }))
    }

    return {"stave": stave, "notes": notes}
}