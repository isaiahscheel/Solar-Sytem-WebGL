/*
Name: Justin deMattos
Assignment: pa6
Course/Semester: CS 412 - Spring 2018
Instructor: Dr. Wolff
Sources consulted: Dr. Wolff
*/

var generateCylinderData = function(radius, height, slices) {
    var nFaces = slices;  // Quadrilateral faces
    var nVerts = slices * 2;

    var verts = [], normals = [], el = [];

    // Generate the points
    var x, y, z;
    var sliceFac = 2.0 * Math.PI / slices;
    var angle = 0.0;
    for( var i = 0; i <= 1 ; i++ ) {
        z = i * height;
        for( var j = 0; j <= slices; j++ ) {
            angle = sliceFac * j;
            x = Math.cos(angle);
            y = Math.sin(angle);
            x *= radius;
            y *= radius;
            verts.push(x, y, 0);
            position = vec3.fromValues(x,y,0); //Create vector for normals
            vec3.normalize(position,position); //Normalize normal vector
            normals.push(position[0], position[1], position[2]); //Push normal values into normal array
        }
    }

    let tc = [];
    for(let i=0; i<=nFaces; i++){
        let angle = i/nFaces;
        tc.push(angle,0);
    }

    for(let i=0; i<=nFaces; i++){
        let angle = i/nFaces;
        tc.push(angle,1);
    }

    // Generate the element indexes for triangles
    var topStart = slices;
    for( var j = 0; j <= slices; j++ ) {
        // Triangle 1
        el.push(j);
        el.push(topStart + ((j+1)));
        el.push(topStart + j);
        // Triangle 2
        el.push(j);
        el.push((j+1));
        el.push(topStart + ((j+1)));
    }

    return {
        index: el,
        position: verts,
        normal: normals,
        texCoord: tc
    };
};