const socket = io();


let ownObj = true



var canvas = new fabric.Canvas('my_canvas');

// create a rectangle object
var rect = new fabric.Rect({
    left: 100,
    top: 100,
    fill: 'red',
    width: 20,
    height: 20
});

// "add" rectangle onto canvas
canvas.add(rect);
canvas.isDrawingMode = true; //For free hand drawing




canvas.on('object:added', function(options) {

    if(options.target && ownObj)
    {
        let object = options.target
        //console.log(object)
        socket.emit('draw',  object)
    }
    ownObj = true

})

socket.on('initialize', (obj) => {
    console.log(obj)
    console.log("NITI")

    fabric.util.enlivenObjects(obj, function(objects) {
        var origRenderOnAddRemove = canvas.renderOnAddRemove;
        canvas.renderOnAddRemove = false;

        objects.forEach(function(o) {
            ownObj = false
            canvas.add(o);
        });

        canvas.renderOnAddRemove = origRenderOnAddRemove;
        canvas.renderAll();
    });
    //canvas.add(new fabric.Path(obj));
})

socket.on('drawclient', (obj) => {
    console.log(obj)
    console.log("HEYHEY")

    fabric.util.enlivenObjects([obj], function(objects) {
        var origRenderOnAddRemove = canvas.renderOnAddRemove;
        canvas.renderOnAddRemove = false;

        objects.forEach(function(o) {
            ownObj = false
            canvas.add(o);
        });

        canvas.renderOnAddRemove = origRenderOnAddRemove;
        canvas.renderAll();
    });
    //canvas.add(new fabric.Path(obj));
})

document.getElementById('color_picker').onchange = function() {
    var brush = canvas.freeDrawingBrush;
    brush.color = this.value;
    if (brush.getPatternSrc) {
        brush.source = brush.getPatternSrc.call(brush);
    }
}

document.getElementById('size_slider').onchange = function() {
    var brush = canvas.freeDrawingBrush;
    brush.width = parseInt(this.value);
}

function enc()
{
    console.log("HH")
}
