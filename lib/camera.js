/*
Name: Justin deMattos
Assignment: pa4
Course/Semester: CS 412 - Spring 2018
Instructor: Dr. Wolff
Sources consulted: Dr. Wolff
Known Bugs: N/A
*/

/**
 * A constructor function for a Camera object.  Sets a default
 * camera frustum, position and orientation.
 * 
 * @param {Number} aspect camera's (viewport's) aspect ratio
 */
var Camera = function(aspect) {
    //
    // Parameters for the perspective frustum
    //
    this.fov = Math.PI / 3.0;     // The field of view
    this.near = 0.25;              // The distance to the near plane
    this.far = 9000.0;             // The distance to the far plane
    this.aspect = aspect;         // The aspect ratio

    //
    // Parameters for the camera's position and orientation
    //
    this.eye = vec3.create();          // The camera's position

    // The camera's orientation as a rotation matrix.  This rotation should contain
    // the camera's u, v and n vectors in world space.  Should they be the first 
    // three rows or columns of this matrix? Rows!   
    this.rotation = mat4.create();

    // Defaults for when the camera is reset (reset method)
    this.lookAt( vec3.fromValues(-15,10,0), vec3.fromValues(0,0,0), vec3.fromValues(0,1,0) );
    this.defaultEye = vec3.clone( this.eye );
    this.defaultRotation = mat4.clone( this.rotation );
};

/**
 * Resets this camera to the default position and orientation.
 */
Camera.prototype.reset = function() {
    vec3.copy( this.eye, this.defaultEye );
    mat4.copy( this.rotation, this.defaultRotation );
};

/**
 * Set the position and orientation of this camera based on the
 * given parameters.  This method should only modify this.eye and
 * this.rotation.
 * 
 * @param {vec3} pos camera position
 * @param {vec3} at point that the camera is facing toward
 * @param {vec3} up the general upward direction for the camera 
 */
Camera.prototype.lookAt = function( pos, at, up ) {
    
    //Create camera axes (u,v,n)
    vec3.copy(this.eye,pos);

    let n = vec3.create();
    let u = vec3.create();
    let v = vec3.create();

    vec3.sub(n,pos,at);
    vec3.cross(u,up,n);
    vec3.cross(v,n,u);

    vec3.normalize(u,u);
    vec3.normalize(v,v);
    vec3.normalize(n,n);

    this.setRotation(u,v,n);
};

/**
 * Sets this camera's rotation matrix based on the camera's axes in 
 * world coordinates.
 * 
 * @param {vec3} u camera's u/x axis
 * @param {vec3} v camera's v/y axis
 * @param {vec3} n camera's n/z axis
 */
Camera.prototype.setRotation = function(u, v, n) {
    //Place u, v, and n vectors into rotation matrix by row (u is 1st row, v is 2nd row, n is 3rd row)
    this.rotation[0] = u[0];
    this.rotation[4] = u[1];
    this.rotation[8] = u[2];

    this.rotation[1] = v[0];
    this.rotation[5] = v[1];
    this.rotation[9] = v[2];

    this.rotation[2] = n[0];
    this.rotation[6] = n[1];
    this.rotation[10] = n[2];

    this.viewMatrix();


};

/**
 * Computes and returns the view matrix for this camera.  
 * Essentially the product of this.rotation and an appropriate
 * translation based on this.eye.
 * 
 * @returns {mat4} the view matrix for this camera
 */
Camera.prototype.viewMatrix = function() {

    //create translation matrix with opposite values of this.eye
    let trans = mat4.fromTranslation(mat4.create(), vec3.fromValues(-this.eye[0], -this.eye[1], -this.eye[2]));

    //multiply the translation matrix by this.rotation
    let m = mat4.multiply(mat4.create(),this.rotation,trans);

    //return the view matrix
    return m;
};

/**
 * Computes and returns the projection matrix based on this camera.
 * @returns {mat4} the projection matrix.
 */
Camera.prototype.projectionMatrix = function() {
    return mat4.perspective(mat4.create(), this.fov, this.aspect, this.near, this.far);
};

/**
 * Orbits this camera object by changing this.eye and this.rotation.  
 * The mouse's delta x corresponds to a rotation around the world y axis, 
 * and the mouse's delta y corresponds to a rotation round the camera's 
 * x axis through the origin.
 * 
 * @param {Number} dx the change in the mouse's x coordinate
 * @param {Number} dy the change in the mouse's y coordinate
 */
Camera.prototype.orbit = function(dx, dy) {
    
    let rMatrix = mat4.create();  //A rotation matrix
    let newView = mat4.create();  //The new view matrix
    let newTranslation = mat4.create();  //The new translation matrix

    //Create rotation matrix around U axis
    mat4.rotate(rMatrix,rMatrix,dy*Math.PI/12,vec3.fromValues(this.rotation[0],this.rotation[4],this.rotation[8]));
    
    //Multiplying rotation around U by rotation around Y
    mat4.rotateY(rMatrix, rMatrix, dx*Math.PI/12);

    //Multiply the rotation matrix by the view matrix
    mat4.multiply(newView, this.viewMatrix(), rMatrix);

    //Fill in this.rotation with the new values (3x3) in the view matrix
    this.rotation[0] = newView[0]
    this.rotation[4] = newView[4];
    this.rotation[8] = newView[8];

    this.rotation[1] = newView[1];
    this.rotation[5] = newView[5];
    this.rotation[9] = newView[9];

    this.rotation[2] = newView[2];
    this.rotation[6] = newView[6];
    this.rotation[10] = newView[10];

    //Transpose the new this.rotation matrix
    mat4.transpose(rMatrix,this.rotation);

    //Multiply the transpose of the rotation matrix by the new view matrix
    mat4.multiply(newTranslation, rMatrix, newView);

    //Extract the values in the last column for the this.eye vector
    this.eye[0] = -newTranslation[12];
    this.eye[1] = -newTranslation[13];
    this.eye[2] = -newTranslation[14];
};

/**
 * Moves this camera along it's z/n axis.  Updates this.eye 
 * 
 * @param {Number} delta the mouse wheel's delta
 */
Camera.prototype.dolly = function(delta) {

    this.eye[0] = this.eye[0] + delta * this.rotation[2];
    this.eye[1] = this.eye[1] + delta * this.rotation[6];
    this.eye[2] = this.eye[2] + delta * this.rotation[10];
};

/**
 * Moves this camera along it's x/y axes.  Updates this.eye 
 * 
 * @param {Number} dx the change in the mouse's x coordinate
 * @param {Number} dy the change in the mouse's y coordinate
 */
Camera.prototype.track = function(dx, dy) {
    
    this.eye[0] = this.eye[0] + (dx * this.rotation[0]) + (dy * this.rotation[1]);
    this.eye[1] = this.eye[1] + (dx * this.rotation[4]) + (dy * this.rotation[5]);
    this.eye[2] = this.eye[2] + (dx * this.rotation[8]) + (dy * this.rotation[9]);

    
};

/**
 * Update this camera by changing rotating the camera's three axes.
 * The mouse's delta x corresponds to a rotation around the 
 * world y axis (0,1,0), the mouse's delta y corresponds to a rotation
 * around the camera's u/x axis.
 * 
 * @param {Number} dx the change in the mouse's x coordinate
 * @param {Number} dy the change in the mouse's y coordinate
 */
Camera.prototype.turn = function( dx, dy ) {

    mat4.rotateY(this.rotation, this.rotation, dx*Math.PI/4);
    mat4.rotate(this.rotation,this.rotation,dy*Math.PI/4,vec3.fromValues(this.rotation[0],this.rotation[4],this.rotation[8]));
};
