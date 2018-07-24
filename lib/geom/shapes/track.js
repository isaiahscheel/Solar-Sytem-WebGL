var generateTrackData = function(major, minor , slices) {

    //Set the radius and number of slices (triangles)
    var s = slices;

    //Array to hold points
    let p=[];

    let n=[];

    //Fill the point array with all needed points
    for(let i=0; i<s; i++){
        let angle = (2*Math.PI/s)*i;
        let x = major * Math.cos(angle);
        let z = minor * Math.sin(angle);
        p.push(x,0,z);
        n.push(0,1,0);
    }

    //Array to hold index values
    let idx=[];

    //Fill index array
    for(let i=0; i<s; i++){
        idx.push(i);
    }
    idx.push(0);

    return {
        index: idx,
        normal: n,
        position: p
    };
};