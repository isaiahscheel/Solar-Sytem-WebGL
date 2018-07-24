/*
Name: Justin deMattos
Assignment: pa6
Course/Semester: CS 412 - Spring 2018
Instructor: Dr. Wolff
Sources consulted: Dr. Wolff
Known Bugs: Server seems to have trouble loading everything sometimes
*/

var generateDiskData = function(radius, slices, numTex) {

    //Set the radius and number of slices (triangles)
    var r = radius;
    var s = slices;

    //Array to hold points
    let p=[];

    let n=[];

    //Fill the point array with all needed points
    for(let i=0; i<s; i++){
        let angle = (2*Math.PI*i)/s;
        let x = r*Math.cos(angle);
        let y = r*Math.sin(angle);
        let z = 0;
        n.push(0, 0, 1); //Push normals for each point
        p.push(x,y,z);
    }

    p.push(0,0,0);
    n.push(0,0,1);

    var tc = [];
    for(let i=0; i<s; i++){
        let angle = (2*Math.PI*i)/s;
        let X = (0.5*numTex)+(0.5*numTex)*Math.cos(angle);
        let Y = (0.5*numTex)+(0.5*numTex)*Math.sin(angle);
        tc.push(X,Y);
    }
    tc.push((0.5*numTex), (0.5*numTex));

    //Array to hold index values
    let idx=[];

    //Fill index array
    for(let i=0; i<s; i++){
        idx.push(s,i,(i+1)%s);

    }

    return {
        index: idx,
        normal: n,
        position: p,
        texCoord: tc
    };
};