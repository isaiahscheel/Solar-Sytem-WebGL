var generateSphereData = function(radius, longBands, latBands) {

    var vertexPositionData = [];
    var normalData = [];
    var textureCoordData = [];

    //Set the radius, height, and number of slices (half the number of triangles)
    var r = radius;
    var s = longBands;
    var d = latBands;

    //Array to hold points
    let p=[];

    //Fill point array with needed points on both circles
    for(let latNumber=0; latNumber<=d; latNumber++){
        var theta = latNumber*Math.PI/d;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        for(let longNumber=0; longNumber<=s; longNumber++){
            var phi = longNumber*2*Math.PI/s;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);

            var x = cosPhi*sinTheta;
            var y = cosTheta;
            var z = sinPhi*sinTheta
            var u = 1-(longNumber/s);
            var v = 1-(latNumber/d);

            normalData.push(x);
            normalData.push(y);
            normalData.push(z);
            textureCoordData.push(u);
            textureCoordData.push(v);
            p.push(radius*x);
            p.push(radius*y);
            p.push(radius*z);
        }
    }

    //Array for normals
    let n=[];

    //Fill normal array with 0s
    for(let i=0; i<p.length; i++){
        n.push(0.0);
    }

    //Index array
    let idx=[];
    //Placeholder 1
    let p1=0;
    //Placeholder 2
    let p2=1;
    //Need number of slices multiplied by 2. Store in variable so it is easier
    let double = s*2;

    //Loop through index array adding points
    for(var latNumber=0; latNumber<d; latNumber++){
        for(var longNumber = 0; longNumber<s; longNumber++){
            var first = (latNumber*(s+1))+longNumber;
            var second = first+s+1;
            idx.push(first);
            idx.push(second);
            idx.push(first+1);

            idx.push(second);
            idx.push(second+1);
            idx.push(first+1);
        }
    }

    return {
        index: idx,
        normal: normalData,
        position: p,
        texCoord: textureCoordData
    };
};