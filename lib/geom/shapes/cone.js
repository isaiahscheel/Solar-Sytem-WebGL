/*
Name: Justin deMattos
Assignment: pa5
Course/Semester: CS 412 - Spring Semester
Instructor: Dr. Wolff
Sources Consulted: Dr. Wolff
*/

var generateConeData = function(radius, height, slices) {

    //Set radius, height, and the amount of triangle slices
    var r = radius;
    var s = slices;
    var h = height;

    //Array holding the points for the cone
    let p=[];

    let n=[];

    //Fill points array 
    for(let i=0; i<s; i++){
        let angle = (2*Math.PI*i)/s;
        let x = r*Math.cos(angle);
        let y = r*Math.sin(angle);
        let z=0;
        let orVector = vec3.fromValues(x,y,z);
        let hVector = vec3.fromValues(0-x, 0-y, 0-h);
        let tanVector = vec3.cross(vec3.create(),hVector,orVector);
        let nVector = vec3.cross(vec3.create(), hVector, tanVector);
        vec3.normalize(nVector,nVector);
        n.push(-nVector[0], -nVector[1], -nVector[2]);
        p.push(x,y,z);
    }

    //Push the last point (the tip) onto the points array
    p.push(0,0,h);
    n.push(0,0,1);

    //Array to store index values
    let idx=[];

    //Fill the index array
    for(let i=0; i<s; i++){
        idx.push((i+1)%s,i,s);
    }

    return {
        index: idx,
        normal: n,
        position: p
    };
};