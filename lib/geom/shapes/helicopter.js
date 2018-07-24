/*
Name: Justin deMattos
Assignment: pa3
Course/Semester: CS 412 - Spring 2018
Instructor: Dr. Wolff
Sources consulted: https://stackoverflow.com/questions/8916620/disable-arrow-key-scrolling-in-users-browser
*/

var Helicopter = function(r1angle, r2angle, r3angle, x, y, z, r4angle, r5angle, r6angle){
    this.a1 = r1angle; //Rotation angle for 1st top propeller
    this.a2 = r2angle; //Rotation angle for 2nd top propeller
    this.a3 = r3angle; //Rotation angle for 3rd top propeller
    this.b1 = r4angle; //Rotation angle for 1st back propeller
    this.b2 = r5angle; //Rotation angle for 2nd back propeller
    this.b3 = r6angle; //Rotation angle for 3rd back propeller
    this.x = x; //x translation value
    this.y = y; //y translation value
    this.z = z; //z translation value
    this.s = new MatrixStack(); //Matrix stack to stor matrices for building shapes
}

Helicopter.prototype.render=function(gl,uni){
    //Base cylinder
    mat4.fromTranslation(model, vec3.fromValues(0,0.75,0));
    mat4.translate(this.s.peek(),model,vec3.fromValues(0,0,0));
    mat4.scale(this.s.peek(), this.s.peek(), vec3.fromValues(1.5, 1.5, 1.5));
    mat4.translate(this.s.peek(),this.s.peek(),vec3.fromValues(this.x,this.y,this.z));
    gl.uniformMatrix4fv(uni.uModel, false, this.s.peek());
    Shapes.cylinder.render(gl, uni, Float32Array.from([0.7,0.7,0.7]));

    //Disk in y axis
    this.s.push();
    mat4.scale(this.s.peek(), this.s.peek(), vec3.fromValues(0.5, 0.5, 0.5));
    gl.uniformMatrix4fv(uni.uModel, false, this.s.peek());
    Shapes.disk.render(gl,uni,Float32Array.from([0.7,0.7,0.7]));

    //Disk away from y axis
    this.s.push();
    mat4.translate(this.s.peek(), this.s.peek(), vec3.fromValues(0,0,1.0));
    gl.uniformMatrix4fv(uni.uModel, false, this.s.peek());
    Shapes.disk.render(gl, uni, Float32Array.from([0.7,0.7,0.7]));
    this.s.pop();
    this.s.pop();

    this.renderTopRotor(gl,uni); //Render the rotor for the top
    this.renderBackBody(gl,uni); //Render the back part of helicopter (cone, rotor base)
    this.renderBackRotor(gl,uni); //Render back rotor
    this.s.clear(); //Clear the matrix stack of all matrices when done
}

Helicopter.prototype.renderTopRotor = function(gl,uni){
    //Rotor base cylinder
    this.s.push();
    mat4.scale(this.s.peek(), this.s.peek(), vec3.fromValues(0.125, 0.125, 0.125)); 
    mat4.translate(this.s.peek(), this.s.peek(), vec3.fromValues(0,4.5,2));
    mat4.rotateX(this.s.peek(),this.s.peek(), Math.PI/2);
    gl.uniformMatrix4fv(uni.uModel, false, this.s.peek());
    Shapes.cylinder.render(gl, uni, Float32Array.from([0,0,0]));

    //Rotor Blades
    mat4.translate(this.s.peek(), this.s.peek(), vec3.fromValues(0,0,0.25));
    this.s.push();
    mat4.rotateZ(this.s.peek(),this.s.peek(), this.a1);
    mat4.rotateY(this.s.peek(),this.s.peek(), Math.PI/2);
    mat4.scale(this.s.peek(), this.s.peek(), vec3.fromValues(0.5, 0.5, 17))
    gl.uniformMatrix4fv(uni.uModel, false, this.s.peek());
    Shapes.cylinder.render(gl,uni,Float32Array.from([0,0,0]));
    this.s.pop();

    this.s.push();
    mat4.rotateZ(this.s.peek(),this.s.peek(), this.a2);
    mat4.rotateY(this.s.peek(),this.s.peek(), Math.PI/2);
    mat4.scale(this.s.peek(), this.s.peek(), vec3.fromValues(0.5, 0.5, 17));
    gl.uniformMatrix4fv(uni.uModel, false, this.s.peek());
    Shapes.cylinder.render(gl,uni,Float32Array.from([0,0,0]));
    this.s.pop();
    
    this.s.push();
    mat4.rotateZ(this.s.peek(),this.s.peek(), this.a3);
    mat4.rotateY(this.s.peek(),this.s.peek(), Math.PI/2);
    mat4.scale(this.s.peek(), this.s.peek(), vec3.fromValues(0.5, 0.5, 17));
    gl.uniformMatrix4fv(uni.uModel, false, this.s.peek());
    Shapes.cylinder.render(gl,uni,Float32Array.from([0,0,0]));

    //Pop twice to get back to base
    this.s.pop(); 
    this.s.pop();
}

Helicopter.prototype.renderBackBody = function(gl,uni){
     //Cone
     this.s.push();
     mat4.translate(this.s.peek(), this.s.peek(), vec3.fromValues(0,0,0));
     this.s.push();
     mat4.translate(this.s.peek(), this.s.peek(), vec3.fromValues(1.75,0,0.25));
     this.s.push();
     mat4.scale(this.s.peek(), this.s.peek(), vec3.fromValues(1.5, 0.25, 0.25));
     this.s.push();
     mat4.rotateY(this.s.peek(),this.s.peek(), -(Math.PI/2));
     gl.uniformMatrix4fv(uni.uModel, false, this.s.peek());
     Shapes.cone.render(gl,uni,Float32Array.from([0.7,0.7,0.7]));
     this.s.pop();
     this.s.pop();
 
     //Back rotor base cylinder
     this.s.push();
     mat4.scale(this.s.peek(), this.s.peek(), vec3.fromValues(0.25, 0.25, 0.25));
     mat4.translate(this.s.peek(), this.s.peek(), vec3.fromValues(0,0,-0.25));
     gl.uniformMatrix4fv(uni.uModel, false, this.s.peek());
     Shapes.cylinder.render(gl,uni,Float32Array.from([0.7,0.7,0.7]));
 
     //Back rotor disk on y axis plane
     this.s.push();
     mat4.scale(this.s.peek(), this.s.peek(), vec3.fromValues(0.5, 0.5, 0.5));
     gl.uniformMatrix4fv(uni.uModel, false, this.s.peek());
     Shapes.disk.render(gl,uni,Float32Array.from([0.7,0.7,0.7]));
 
     //Back rotor disk away from axis plane
     this.s.push();
     mat4.translate(this.s.peek(), this.s.peek(), vec3.fromValues(0,0,1));
     gl.uniformMatrix4fv(uni.uModel, false, this.s.peek());
     Shapes.disk.render(gl,uni,Float32Array.from([0.7,0.7,0.7]));
}

Helicopter.prototype.renderBackRotor = function(gl,uni){
    //Cylinder for back propellers
    this.s.push();
    mat4.scale(this.s.peek(), this.s.peek(), vec3.fromValues(0.75, 0.75, 0.75));
    gl.uniformMatrix4fv(uni.uModel, false, this.s.peek());
    Shapes.cylinder.render(gl,uni,Float32Array.from([0,0,0]));

    //Disk for cylinder for back propellers
    this.s.push();
    mat4.translate(this.s.peek(), this.s.peek(), vec3.fromValues(0,0,0.5));
    mat4.scale(this.s.peek(), this.s.peek(), vec3.fromValues(0.5, 0.5, 0.5));
    gl.uniformMatrix4fv(uni.uModel, false, this.s.peek());
    Shapes.disk.render(gl,uni,Float32Array.from([0,0,0]));

    //Cylinders for propellers
    this.s.push();
    mat4.translate(this.s.peek(), this.s.peek(), vec3.fromValues(0,0,0.25));
    this.s.push();
    mat4.rotateZ(this.s.peek(),this.s.peek(), this.b1);
    mat4.rotateY(this.s.peek(),this.s.peek(), Math.PI/2);
    mat4.scale(this.s.peek(), this.s.peek(), vec3.fromValues(0.5, 0.5, 9))
    gl.uniformMatrix4fv(uni.uModel, false, this.s.peek());
    Shapes.cylinder.render(gl,uni,Float32Array.from([0,0,0]));
    this.s.pop();

    this.s.push();
    mat4.rotateZ(this.s.peek(),this.s.peek(), this.b2);
    mat4.rotateY(this.s.peek(),this.s.peek(), Math.PI/2);
    mat4.scale(this.s.peek(), this.s.peek(), vec3.fromValues(0.5, 0.5, 9));
    gl.uniformMatrix4fv(uni.uModel, false, this.s.peek());
    Shapes.cylinder.render(gl,uni,Float32Array.from([0,0,0]));
    this.s.pop();
    
    this.s.push();
    mat4.rotateZ(this.s.peek(),this.s.peek(), this.b3);
    mat4.rotateY(this.s.peek(),this.s.peek(), Math.PI/2);
    mat4.scale(this.s.peek(), this.s.peek(), vec3.fromValues(0.5, 0.5, 9));
    gl.uniformMatrix4fv(uni.uModel, false, this.s.peek());
    Shapes.cylinder.render(gl,uni,Float32Array.from([0,0,0]));
}

    
