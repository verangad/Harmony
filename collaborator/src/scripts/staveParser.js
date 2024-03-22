
export function simplifyStaves(staves){
    let simplifiedStaves = []
    for (let i = 0; i < staves.length; i++){
        let selectedStave = staves[i].stave
        let clef = selectedStave.clef
        let x = selectedStave.x
        let y = selectedStave.y
        let width = selectedStave.width
        let simplifiedStave = {"clef": clef, "x": x, "y": y, "width": width}

        simplifiedStaves.push({"stave": simplifiedStave, "notes": staves[i].notes})
    }

    return simplifiedStaves
}