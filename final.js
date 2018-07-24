// The WebGL object
var gl;

//Time for world
var time=0;

//Time step
var tstep=125;

//Show grid
var gridShow=true;

// The HTML canvas
var canvas;

var grid;    // The reference grid
var axes;    // The coordinate axes
var camera;  // The camera

//Planet View Modes
sunView = false;
mercuryView = false;
venusView = false;
earthView = false;
marsView = false;
jupiterView = false;
saturnView = false;
uranusView = false;
neptuneView = false;

// Uniform variable locations
var uni = {
    uModel: null,
    uView: null,
    uProj: null,
    uColor: null,
    uEmissive: null,
    uAmbient: null,
    uDiffuse: null,
    uSpecular: null,
    uShine: null,
    uLightPos: null,
    uLightIntensity: null,
    uAmbientLight: null,
};

//Variable used to track the location of the light source
var lightLoc = {
    x:0,
    y:3,
    z:0,
    distance:5, //distance from the y axis (world)
    lightMode:true, //variable used for local mode and camera mode
    theta:0 //variable for angle changes around y axis
};

var sunLoc = {
    distance:0,
    theta:0,
    phi:0
};

//Variable used to track location of Mercury
var mercuryLoc = {
    major:5.000419043,
    minor:4.893559133,
    theta:147.2223605*Math.PI/180,
    start:147.2223605*Math.PI/180,
    phi:0,
    year:1
};

var moonLoc = {
    major:0.7,
    minor:0.69896,
    theta:0,
    phi:0
};

//Variable used to track location of Venus
var venusLoc = {
    major:9.343709555,
    minor:9.343495301,
    theta:39.25314141*Math.PI/180,
    start:39.25314141*Math.PI/180,
    phi:0,
    year:1
};

//Variable used to track location of Earth
var earthLoc = {
    major:12.91771844,
    minor:12.91591515,
    theta:38.20345509*Math.PI/180,
    start:38.20345509*Math.PI/180,
    phi:0,
    year:1
};

//Variable used to track location of Mars
var marsLoc = {
    major:19.68244197,
    minor:19.59640344,
    theta:37.21446*Math.PI/180,
    start:37.21446*Math.PI/180,
    phi:0,
    year:1
};

//Variable used to track location of Jupiter
var jupiterLoc = {
    major:67.22915079,
    minor:67.14872317,
    theta:89.48291514*Math.PI/180,
    start:89.48291514*Math.PI/180,
    phi:0,
    year:1
};

var ioLoc = {
    major:6,
    minor:5.99994957,
    theta:0,
    phi:0
};

//Variable used to track location of Europa
var europaLoc = {
    major:9.546230437,
    minor:9.54584,
    theta:0,
    phi:0,
    year:1
};

//Variable used to track location of Ganymede
var ganymedeLoc = {
    major:15.22617354,
    minor:15.22616067,
    theta:0,
    phi:0,
    year:1
};

//Variable used to track location of Callisto
var callistoLoc = {
    major:26.98435275,
    minor:26.98361391,
    theta:0,
    phi:0,
    year:1
};

//Variable used to track location of Saturn
var saturnLoc = {
    major:123.7846366,
    minor:123.5869029,
    theta:29.77331101*Math.PI/180,
    start:29.77331101*Math.PI/180,
    phi:0,
    year:1
};

//Variable used to track location of Uranus
var uranusLoc = {
    major:248.2576273,
    minor:247.990458,
    theta:92.54740028*Math.PI/180,
    start:92.54740028*Math.PI/180,
    phi:0,
    year:1
};

//Variable used to track location of Neptune
var neptuneLoc = {
    major:388.9571053,
    minor:388.9397154,
    theta:43.37914757*Math.PI/180,
    start:43.37914757*Math.PI/180,
    phi:0,
    year:1
};


//Varible to play/pause animation
var pause = false;

/**
 * Initialize the WebGL context, load/compile shaders, and initialize our shapes.
 */
var init = function() {
    
    // Set up WebGL
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    // Set the viewport transformation
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Set the background color
    gl.clearColor(0, 0, 0, 1.0);
    
    // Enable the z-buffer
    gl.enable(gl.DEPTH_TEST);

    // Load and compile shaders
    program = Utils.loadShaderProgram(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Find the uniform variable locations
    uni.uModel = gl.getUniformLocation(program, "uModel");
    uni.uView = gl.getUniformLocation(program, "uView");
    uni.uProj = gl.getUniformLocation(program, "uProj");
    uni.uColor = gl.getUniformLocation(program, "uColor");
    uni.uEmissive = gl.getUniformLocation(program, "uEmissive");
    uni.uAmbient = gl.getUniformLocation(program, "uAmbient");
    uni.uDiffuse = gl.getUniformLocation(program, "uDiffuse");
    uni.uSpecular = gl.getUniformLocation(program, "uSpecular");
    uni.uShine = gl.getUniformLocation(program, "uShine");
    uni.uLightPos = gl.getUniformLocation(program, "uLightPos");
    uni.uLightIntensity = gl.getUniformLocation(program, "uLightIntensity");
    uni.uAmbientLight = gl.getUniformLocation(program, "uAmbientLight");
    uni.uHasDiffuseTex = gl.getUniformLocation(program, "uHasDiffuseTex");
    uni.uDiffuseTex = gl.getUniformLocation(program, "uDiffuseTex");
    uni.uNoMat = gl.getUniformLocation(program, "uNoMat");

    //Set uniforms that do not change often
    gl.uniform3fv(uni.uLightIntensity,vec3.fromValues(0.75, 0.75, 0.75));
    gl.uniform3fv(uni.uAmbientLight, vec3.fromValues(0.25, 0.25, 0.25));

    //Set uniform for texture value holder
    gl.uniform1i(uni.uDiffuseTex, 0);

    //Set uniform for NoMat 
    gl.uniform1f(uni.uNoMat, 0);

    // Initialize our shapes
    Shapes.init(gl);
    grid = new Grid(gl, 20.0, 20, Float32Array.from([0.7,0.7,0.7]));
    axes = new Axes(gl, 2.5, 0.05);

    // Initialize the camera
    camera = new Camera( canvas.width / canvas.height );

    setupEventHandlers();

    // Start the animation sequence
    Promise.all( [
            Utils.loadTexture(gl, "media/checker-32x32-1024x1024.png"), //Load checker pattern
            Utils.loadTexture(gl, "media/sun.jpg"),
            Utils.loadTexture(gl, "media/mercury.jpg"),
            Utils.loadTexture(gl, "media/venus.jpg"),
            Utils.loadTexture(gl, "media/earth.jpg"),
            Utils.loadTexture(gl, "media/mars.jpg"),
            Utils.loadTexture(gl, "media/jupiter.jpg"),
            Utils.loadTextureMip(gl, "media/stars.png"),
            Obj.load(gl, "media/saturn.obj"), //Load saturn obj file (Obtained through 3D warehouse)
            Utils.loadTexture(gl, "media/saturn-rings.png"), //From 3D warehouse
            Utils.loadTexture(gl, "media/material6.jpg"), //From 3D warehouse
            Utils.loadTexture(gl, "media/uranus.jpg"),
            Utils.loadTexture(gl, "media/neptune.jpg"),
            Utils.loadTexture(gl, "media/moon.jpg"),
            Utils.loadTexture(gl, "media/io.jpg"),
            Utils.loadTexture(gl, "media/europa.jpg"),
            Utils.loadTexture(gl, "media/ganymede.jpg"),
            Utils.loadTexture(gl, "media/callisto.jpg")

        ]).then( function(values) {
            //Store textures in Textures object
            Textures["checker-32x32-1024x1024.png"] = values[0];
            Textures["sun.jpg"] = values[1];
            Textures["mercury.jpg"] = values[2];
            Textures["venus.jpg"] = values[3];
            Textures["earth.jpg"] = values[4];
            Textures["mars.jpg"] = values[5];
            Textures["jupiter.jpg"] = values[6];
            Textures["stars.png"] = values[7];
            Shapes.saturn = values[8]; //From 3D warehouse
            Textures["saturn-rings.png"] = values[9];
            Textures["material6.jpg"] = values[10];
            Textures["uranus.jpg"] = values[11];
            Textures["neptune.jpg"] = values[12];
            Textures["moon.jpg"] = values[13];
            Textures["io.jpg"] = values[14];
            Textures["europa.jpg"] = values[15];
            Textures["ganymede.jpg"] = values[16];
            Textures["callisto.jpg"] = values[17];
            render();
        });
};

/**
 * Render the scene!
 */
var render = function() {
    // Request another draw
    window.requestAnimFrame(render, canvas);

    // Update camera when in fly mode
    updateCamera();

    // Clear the color and depth buffers
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Set projection and view matrices 
    gl.uniformMatrix4fv(uni.uView, false, camera.viewMatrix());
    gl.uniformMatrix4fv(uni.uProj, false, camera.projectionMatrix());

    //Draw Sky Box
    model=mat4.create();
    gl.uniform1f(uni.uNoMat, 1);
    mat4.identity(model);
    mat4.scale(model, model, vec3.fromValues(2000, 2000, 2000));
    gl.uniformMatrix4fv(uni.uModel,false,model);
    //Shapes.cube.material.emissive = vec3.fromValues(0.1, 0.1, 0); //Allow for slight emissive
    Shapes.cube.material.diffuseTexture = "stars.png";
    Shapes.cube.render(gl, uni, Shapes.cube.material);
    gl.uniform1f(uni.uNoMat, 0);

    //drawAxesAndGrid();
    if(pause==false){
        time+=tstep;
    }

    drawScene();

};

/**
 * Draw the objects in the scene.  
 */
var drawScene = function() {

    if(gridShow==true){
        //Draw Mercury orbit
        model1 = mat4.create();
        gl.uniformMatrix4fv(uni.uModel,false,model1);
        Shapes.orbit1.render(gl,uni,Shapes.orbit1.material);
    
        //Draw Venus orbit
        model1 = mat4.create();
        gl.uniformMatrix4fv(uni.uModel,false,model1);
        Shapes.orbit2.render(gl,uni,Shapes.orbit1.material);
    
        //Draw Earth orbit
        model1 = mat4.create();
        gl.uniformMatrix4fv(uni.uModel,false,model1);
        Shapes.orbit3.render(gl,uni,Shapes.orbit1.material);

        //Draw Moon orbit
        model1 = mat4.create();
        mat4.translate(model1,model1,vec3.fromValues(earthLoc.major*Math.cos(earthLoc.theta),0,earthLoc.minor*Math.sin(earthLoc.theta)));
        gl.uniformMatrix4fv(uni.uModel,false,model1);
        Shapes.orbit9.render(gl,uni,Shapes.orbit1.material);

        //Draw Mars orbit
        model1 = mat4.create();
        gl.uniformMatrix4fv(uni.uModel,false,model1);
        Shapes.orbit4.render(gl,uni,Shapes.orbit1.material);

        //Draw Jupiter orbit
        model1 = mat4.create();
        gl.uniformMatrix4fv(uni.uModel,false,model1);
        Shapes.orbit5.render(gl,uni,Shapes.orbit1.material);

        //Draw Io orbit
        model1 = mat4.create();
        mat4.translate(model1,model1,vec3.fromValues(jupiterLoc.major*Math.cos(jupiterLoc.theta),0,jupiterLoc.minor*Math.sin(jupiterLoc.theta)));
        gl.uniformMatrix4fv(uni.uModel,false,model1);
        Shapes.orbit10.render(gl,uni,Shapes.orbit1.material);
        
        //Draw europa orbit
        model1 = mat4.create();
        mat4.translate(model1,model1,vec3.fromValues(jupiterLoc.major*Math.cos(jupiterLoc.theta),0,jupiterLoc.minor*Math.sin(jupiterLoc.theta)));
        gl.uniformMatrix4fv(uni.uModel,false,model1);
        Shapes.orbit11.render(gl,uni,Shapes.orbit1.material);

        //Draw Ganymede orbit
        model1 = mat4.create();
        mat4.translate(model1,model1,vec3.fromValues(jupiterLoc.major*Math.cos(jupiterLoc.theta),0,jupiterLoc.minor*Math.sin(jupiterLoc.theta)));
        gl.uniformMatrix4fv(uni.uModel,false,model1);
        Shapes.orbit12.render(gl,uni,Shapes.orbit1.material);
        
        //Draw Callisto orbit
        model1 = mat4.create();
        mat4.translate(model1,model1,vec3.fromValues(jupiterLoc.major*Math.cos(jupiterLoc.theta),0,jupiterLoc.minor*Math.sin(jupiterLoc.theta)));
        gl.uniformMatrix4fv(uni.uModel,false,model1);
        Shapes.orbit13.render(gl,uni,Shapes.orbit1.material);

        //Draw Saturn orbit
        model1 = mat4.create();
        gl.uniformMatrix4fv(uni.uModel,false,model1);
        Shapes.orbit6.render(gl,uni,Shapes.orbit1.material);

        //Draw Uranus orbit
        model1 = mat4.create();
        gl.uniformMatrix4fv(uni.uModel,false,model1);
        Shapes.orbit7.render(gl,uni,Shapes.orbit1.material);

        //Draw Neptune orbit
        model1 = mat4.create();
        gl.uniformMatrix4fv(uni.uModel,false,model1);
        Shapes.orbit8.render(gl,uni,Shapes.orbit1.material);
    }

    //If not paused, rotate objects
    if(pause==false){

            //Orbital periods
            earthLoc.theta+=(Math.PI/2)*tstep/91250;
            mercuryLoc.theta+=(Math.PI/2)*tstep/22000;
            venusLoc.theta+=(Math.PI/2)*tstep/56250;
            marsLoc.theta+=(Math.PI/2)*tstep/171750;
            jupiterLoc.theta+=(Math.PI/2)*tstep/1083250;
            saturnLoc.theta+=(Math.PI/2)*tstep/2689750;
            uranusLoc.theta+=(Math.PI/2)*tstep/7671750;
            neptuneLoc.theta+=(Math.PI/2)*tstep/15047500;
            moonLoc.theta+=(Math.PI/2)*tstep/6830.5;
            ioLoc.theta+=(Math.PI/2)*tstep/450;
            europaLoc.theta+=(Math.PI/2)*tstep/875;
            ganymedeLoc.theta+=(Math.PI/2)*tstep/1885;
            callistoLoc.theta+=(Math.PI/2)*tstep/4172.25;

            //Days:
            sunLoc.phi += (Math.PI/2)*tstep/8500;
            earthLoc.phi +=(Math.PI/2)*tstep/250;
            mercuryLoc.phi +=(Math.PI/2)*tstep/14661.45833;
            venusLoc.phi -=(Math.PI/2)*tstep/29187.5;
            marsLoc.phi +=(Math.PI/2)*tstep/256.4236;
            jupiterLoc.phi +=(Math.PI/2)*tstep/103.472222;
            saturnLoc.phi +=(Math.PI/2)*tstep/111.458333;
            uranusLoc.phi +=(Math.PI/2)*tstep/179.5138888;
            neptuneLoc.phi +=(Math.PI/2)*tstep/167.7083333;
            moonLoc.phi -=(Math.PI/2)*tstep/6830.5;
            ioLoc.phi -=(Math.PI/2)*tstep/450;
            europaLoc.phi -=(Math.PI/2)*tstep/875;
            ganymedeLoc.phi -=(Math.PI/2)*tstep/1885;
            callistoLoc.phi -=(Math.PI/2)*tstep/4172.25;

    }

    //Update years
    //Earth:
    earthLoc.year=Math.floor(earthLoc.theta/(2*Math.PI));
    document.getElementById("Earth").innerHTML = "Earth Year: " + Math.floor(earthLoc.year+1);

    //Mercury:
    mercuryLoc.year=Math.floor(mercuryLoc.theta/(2*Math.PI));
    document.getElementById("Mercury").innerHTML = "Mercury Year: " + Math.floor(mercuryLoc.year+1);

    //Venus:
    venusLoc.year=Math.floor(venusLoc.theta/(2*Math.PI));
    document.getElementById("Venus").innerHTML = "Venus Year: " + Math.floor(venusLoc.year+1);

    //Mars:
    marsLoc.year=Math.floor(marsLoc.theta/(2*Math.PI));
    document.getElementById("Mars").innerHTML = "Mars Year: " + Math.floor(marsLoc.year+1);

    //Jupiter:
    jupiterLoc.year=Math.floor(jupiterLoc.theta/(2*Math.PI));
    document.getElementById("Jupiter").innerHTML = "Jupiter Year: " + Math.floor(jupiterLoc.year+1);

    //Saturn:
    saturnLoc.year=Math.floor(saturnLoc.theta/(2*Math.PI));
    document.getElementById("Saturn").innerHTML = "Saturn Year: " + Math.floor(saturnLoc.year+1);

    //Uranus:
    uranusLoc.year=Math.floor(uranusLoc.theta/(2*Math.PI));
    document.getElementById("Uranus").innerHTML = "Uranus Year: " + Math.floor(uranusLoc.year+1);

    //Neptune:
    neptuneLoc.year=Math.floor(neptuneLoc.theta/(2*Math.PI));
    document.getElementById("Neptune").innerHTML = "Neptune Year: " + Math.floor(neptuneLoc.year+1);

    
    //Start drawing shapes
    model = mat4.create();

    view = camera.viewMatrix();
    gl.uniform3fv(uni.uLightPos, vec3.fromValues(view[12], view[13], view[14]));

    //Move camera if Sun view is on
    if(sunView == true){
        pos = vec3.fromValues(-4,0,0);
        at = vec3.fromValues(0,0,0);
        up = vec3.fromValues(0,1,0);
        camera.lookAt(pos,at,up);
    }

    //Draw Yellow Sphere
    gl.uniform1f(uni.uNoMat, 1);
    mat4.identity(model);
    mat4.rotateY(model, model, sunLoc.phi);
    gl.uniformMatrix4fv(uni.uModel,false,model); 
    Shapes.sphere.material.diffuseTexture = "sun.jpg"; //Doesn't work because emissive component highest
    Shapes.sphere.render(gl, uni, Shapes.sphere.material);
    Shapes.sphere.material.diffuseTexture = null;
    gl.uniform1f(uni.uNoMat, 0);

    //Move camera if Mercury view is on
    if(mercuryView == true){
        distance1 = mercuryLoc.major - 1.0;
        distance2 = mercuryLoc.minor - 1.0;
        pos = vec3.fromValues(distance1*Math.cos(mercuryLoc.theta), 0, distance2*Math.sin(mercuryLoc.theta));
        at = vec3.fromValues(mercuryLoc.major*Math.cos(mercuryLoc.theta), 0, mercuryLoc.minor*Math.sin(mercuryLoc.theta));
        up = vec3.fromValues(0,1,0);
        camera.lookAt(pos,at,up);
    }

    //Draw Mercury
    mat4.identity(model);
    mat4.fromTranslation(model,vec3.fromValues(mercuryLoc.major*Math.cos(mercuryLoc.theta), 0, mercuryLoc.minor*Math.sin(mercuryLoc.theta)));
    mat4.rotateZ(model, model, 0.03*Math.PI/180);
    mat4.rotateY(model, model, mercuryLoc.phi);
    mat4.scale(model, model, vec3.fromValues(0.15, 0.15, 0.15));
    gl.uniformMatrix4fv(uni.uModel,false,model);
    gl.uniform3fv(uni.uColor, vec3.fromValues(0, 1, 0)); //Change color to yellow
    Shapes.sphere.material.diffuse = vec3.fromValues(0, 0.3, 0.3); //Allow for some color diffuse
    Shapes.sphere.material.emissive = vec3.fromValues(0.1, 0.1, 0); //Allow for slight emissive
    Shapes.sphere.material.diffuseTexture = "mercury.jpg";
    Shapes.sphere.render(gl, uni, Shapes.sphere.material);

    //Move camera if Venus view is on
    if(venusView == true){
        distance1 = venusLoc.major - 3;
        distance2 = venusLoc.minor - 3;
        pos = vec3.fromValues(distance1*Math.cos(venusLoc.theta), 0, distance2*Math.sin(venusLoc.theta));
        at = vec3.fromValues(venusLoc.major*Math.cos(venusLoc.theta), 0, venusLoc.minor*Math.sin(venusLoc.theta));
        up = vec3.fromValues(0,1,0);
        camera.lookAt(pos,at,up);
    }

    //Draw Venus
    mat4.identity(model);
    mat4.fromTranslation(model,vec3.fromValues(venusLoc.major*Math.cos(venusLoc.theta), 0, venusLoc.minor*Math.sin(venusLoc.theta)));
    mat4.rotateZ(model, model, 2.64*Math.PI/180);
    mat4.rotateY(model, model, venusLoc.phi);
    mat4.scale(model, model, vec3.fromValues(0.37, 0.37, 0.37));
    gl.uniformMatrix4fv(uni.uModel,false,model);
    gl.uniform3fv(uni.uColor, vec3.fromValues(0, 1, 0)); //Change color to yellow
    Shapes.sphere.material.diffuse = vec3.fromValues(0, 0.3, 0.3); //Allow for some color diffuse
    Shapes.sphere.material.emissive = vec3.fromValues(0.1, 0.1, 0); //Allow for slight emissive
    Shapes.sphere.material.diffuseTexture = "venus.jpg";
    Shapes.sphere.render(gl, uni, Shapes.sphere.material);

    //Move camera if Earth view is on
    if(earthView == true){
        distance1 = earthLoc.major - 3;
        distance2 = earthLoc.minor - 3;
        pos = vec3.fromValues(distance1*Math.cos(earthLoc.theta), 0, distance2*Math.sin(earthLoc.theta));
        at = vec3.fromValues(earthLoc.major*Math.cos(earthLoc.theta), 0, earthLoc.minor*Math.sin(earthLoc.theta));
        up = vec3.fromValues(0,1,0);
        camera.lookAt(pos,at,up);
    }

    //Draw Earth
    mat4.identity(model);
    mat4.fromTranslation(model,vec3.fromValues(earthLoc.major*Math.cos(earthLoc.theta), 0, earthLoc.minor*Math.sin(earthLoc.theta)));
    mat4.rotateZ(model, model, 23.4*Math.PI/180);
    mat4.rotateY(model, model, earthLoc.phi);
    mat4.scale(model, model, vec3.fromValues(0.39, 0.39, 0.39));
    gl.uniformMatrix4fv(uni.uModel,false,model);
    gl.uniform3fv(uni.uColor, vec3.fromValues(0, 1, 0)); //Change color to yellow
    Shapes.sphere.material.diffuse = vec3.fromValues(0, 0.3, 0.3); //Allow for some color diffuse
    Shapes.sphere.material.emissive = vec3.fromValues(0.1, 0.1, 0); //Allow for slight emissive
    Shapes.sphere.material.diffuseTexture = "earth.jpg";
    Shapes.sphere.render(gl, uni, Shapes.sphere.material);

    //Draw Earth's Moon
    var moonMatrix = mat4.create();
    mat4.translate(moonMatrix, moonMatrix, vec3.fromValues(moonLoc.major*Math.cos(moonLoc.theta),0,moonLoc.minor*Math.sin(moonLoc.theta)));
    mat4.translate(moonMatrix, moonMatrix, vec3.fromValues(earthLoc.major*Math.cos(earthLoc.theta),0,earthLoc.minor*Math.sin(earthLoc.theta)));
    mat4.scale(moonMatrix, moonMatrix, vec3.fromValues(0.106, 0.106, 0.106));
    mat4.rotateY(moonMatrix,moonMatrix, moonLoc.phi);
    gl.uniformMatrix4fv(uni.uModel, false, moonMatrix);
    Shapes.sphere.material.diffuseTexture = "moon.jpg";
    Shapes.sphere.render(gl, uni, Shapes.sphere.material);

    //Move camera if Mars view is on
    if(marsView == true){
        distance1 = marsLoc.major - 2;
        distance2 = marsLoc.minor - 2;
        pos = vec3.fromValues(distance1*Math.cos(marsLoc.theta), 0, distance2*Math.sin(marsLoc.theta));
        at = vec3.fromValues(marsLoc.major*Math.cos(marsLoc.theta), 0, marsLoc.minor*Math.sin(marsLoc.theta));
        up = vec3.fromValues(0,1,0);
        camera.lookAt(pos,at,up);
    }

    //Draw Mars
    mat4.identity(model);
    mat4.fromTranslation(model,vec3.fromValues(marsLoc.major*Math.cos(marsLoc.theta), 0, marsLoc.minor*Math.sin(marsLoc.theta)));
    mat4.rotateZ(model, model, 25.19*Math.PI/180);
    mat4.rotateY(model, model, marsLoc.phi);
    mat4.scale(model, model, vec3.fromValues(0.24, 0.24, 0.24));
    gl.uniformMatrix4fv(uni.uModel,false,model);
    gl.uniform3fv(uni.uColor, vec3.fromValues(0, 1, 0)); //Change color to yellow
    Shapes.sphere.material.diffuse = vec3.fromValues(0, 0.3, 0.3); //Allow for some color diffuse
    Shapes.sphere.material.emissive = vec3.fromValues(0.1, 0.1, 0); //Allow for slight emissive
    Shapes.sphere.material.diffuseTexture = "mars.jpg";
    Shapes.sphere.render(gl, uni, Shapes.sphere.material);

     //Move camera if Jupiter view is on
     if(jupiterView == true){
        distance1 = jupiterLoc.major - 16;
        distance2 = jupiterLoc.minor - 16;
        pos = vec3.fromValues(distance1*Math.cos(jupiterLoc.theta), 0, distance2*Math.sin(jupiterLoc.theta));
        at = vec3.fromValues(jupiterLoc.major*Math.cos(jupiterLoc.theta), 0, jupiterLoc.minor*Math.sin(jupiterLoc.theta));
        up = vec3.fromValues(0,1,0);
        camera.lookAt(pos,at,up);
    }

    //Draw Jupiter
     mat4.identity(model);
     mat4.fromTranslation(model,vec3.fromValues(jupiterLoc.major*Math.cos(jupiterLoc.theta), 0, jupiterLoc.minor*Math.sin(jupiterLoc.theta)));
     mat4.rotateZ(model, model, 3.13*Math.PI/180);
     mat4.rotateY(model, model, jupiterLoc.phi);
     mat4.scale(model, model, vec3.fromValues(4.3, 4.3, 4.3));
     gl.uniformMatrix4fv(uni.uModel,false,model);
     gl.uniform3fv(uni.uColor, vec3.fromValues(0, 1, 0)); //Change color to yellow
     Shapes.sphere.material.diffuse = vec3.fromValues(0, 0.3, 0.3); //Allow for some color diffuse
     Shapes.sphere.material.emissive = vec3.fromValues(0.1, 0.1, 0); //Allow for slight emissive
     Shapes.sphere.material.diffuseTexture = "jupiter.jpg";
     Shapes.sphere.render(gl, uni, Shapes.sphere.material);

    //Draw Io
    var moonMatrix = mat4.create();
    mat4.translate(moonMatrix, moonMatrix, vec3.fromValues(ioLoc.major*Math.cos(ioLoc.theta),0,ioLoc.minor*Math.sin(ioLoc.theta)));
    mat4.translate(moonMatrix, moonMatrix, vec3.fromValues(jupiterLoc.major*Math.cos(jupiterLoc.theta),0,jupiterLoc.minor*Math.sin(jupiterLoc.theta)));
    mat4.scale(moonMatrix, moonMatrix, vec3.fromValues(0.111, 0.111, 0.111));
    mat4.rotateY(moonMatrix,moonMatrix, moonLoc.phi);
    gl.uniformMatrix4fv(uni.uModel, false, moonMatrix);
    Shapes.sphere.material.diffuseTexture = "io.jpg";
    Shapes.sphere.render(gl, uni, Shapes.sphere.material);

    //Draw Europa
    var moonMatrix = mat4.create();
    mat4.translate(moonMatrix, moonMatrix, vec3.fromValues(europaLoc.major*Math.cos(europaLoc.theta),0,europaLoc.minor*Math.sin(europaLoc.theta)));
    mat4.translate(moonMatrix, moonMatrix, vec3.fromValues(jupiterLoc.major*Math.cos(jupiterLoc.theta),0,jupiterLoc.minor*Math.sin(jupiterLoc.theta)));
    mat4.scale(moonMatrix, moonMatrix, vec3.fromValues(0.095, 0.095, 0.095));
    mat4.rotateY(moonMatrix,moonMatrix, moonLoc.phi);
    gl.uniformMatrix4fv(uni.uModel, false, moonMatrix);
    Shapes.sphere.material.diffuseTexture = "europa.jpg";
    Shapes.sphere.render(gl, uni, Shapes.sphere.material);

    //Draw Ganymede
    var moonMatrix = mat4.create();
    mat4.translate(moonMatrix, moonMatrix, vec3.fromValues(ganymedeLoc.major*Math.cos(ganymedeLoc.theta),0,ganymedeLoc.minor*Math.sin(ganymedeLoc.theta)));
    mat4.translate(moonMatrix, moonMatrix, vec3.fromValues(jupiterLoc.major*Math.cos(jupiterLoc.theta),0,jupiterLoc.minor*Math.sin(jupiterLoc.theta)));
    mat4.scale(moonMatrix, moonMatrix, vec3.fromValues(0.16, 0.16, 0.16));
    mat4.rotateY(moonMatrix,moonMatrix, moonLoc.phi);
    gl.uniformMatrix4fv(uni.uModel, false, moonMatrix);
    Shapes.sphere.material.diffuseTexture = "ganymede.jpg";
    Shapes.sphere.render(gl, uni, Shapes.sphere.material);

    //Draw Ganymede
    var moonMatrix = mat4.create();
    mat4.translate(moonMatrix, moonMatrix, vec3.fromValues(callistoLoc.major*Math.cos(callistoLoc.theta),0,callistoLoc.minor*Math.sin(callistoLoc.theta)));
    mat4.translate(moonMatrix, moonMatrix, vec3.fromValues(jupiterLoc.major*Math.cos(jupiterLoc.theta),0,jupiterLoc.minor*Math.sin(jupiterLoc.theta)));
    mat4.scale(moonMatrix, moonMatrix, vec3.fromValues(0.146679, 0.146679, 0.146679));
    mat4.rotateY(moonMatrix,moonMatrix, moonLoc.phi);
    gl.uniformMatrix4fv(uni.uModel, false, moonMatrix);
    Shapes.sphere.material.diffuseTexture = "callisto.jpg";
    Shapes.sphere.render(gl, uni, Shapes.sphere.material);

    //Move camera if Saturn view is on
    if(saturnView == true){
        distance1 = saturnLoc.major - 10;
        distance2 = saturnLoc.minor - 10;
        pos = vec3.fromValues(distance1*Math.cos(saturnLoc.theta), 0, distance2*Math.sin(saturnLoc.theta));
        at = vec3.fromValues(saturnLoc.major*Math.cos(saturnLoc.theta), 0, saturnLoc.minor*Math.sin(saturnLoc.theta));
        up = vec3.fromValues(0,1,0);
        camera.lookAt(pos,at,up);
    }

    //Draw Saturn
    mat4.identity(model);
    mat4.fromTranslation(model,vec3.fromValues(saturnLoc.major*Math.cos(saturnLoc.theta), -1.5, saturnLoc.minor*Math.sin(saturnLoc.theta)));
    mat4.rotateZ(model, model, 26.73*Math.PI/180);
    mat4.rotateY(model, model, saturnLoc.phi);
    mat4.scale(model, model, vec3.fromValues(3.7, 3.7, 3.7));
    gl.uniformMatrix4fv(uni.uModel,false,model);
    Shapes.saturn.render(gl, uni, Shapes.sphere.material);

     //Move camera if Uranus view is on
     if(uranusView == true){
        distance1 = uranusLoc.major - 6;
        distance2 = uranusLoc.minor - 6;
        pos = vec3.fromValues(distance1*Math.cos(uranusLoc.theta), 0, distance2*Math.sin(uranusLoc.theta));
        at = vec3.fromValues(uranusLoc.major*Math.cos(uranusLoc.theta), 0, uranusLoc.minor*Math.sin(uranusLoc.theta));
        up = vec3.fromValues(0,1,0);
        camera.lookAt(pos,at,up);
    }

    //Draw Uranus
     mat4.identity(model);
     mat4.fromTranslation(model,vec3.fromValues(uranusLoc.major*Math.cos(uranusLoc.theta), 0, uranusLoc.minor*Math.sin(uranusLoc.theta)));
     mat4.rotateZ(model, model, 82.23*Math.PI/180);
     mat4.rotateY(model, model, uranusLoc.phi);
     mat4.scale(model, model, vec3.fromValues(1.57, 1.57, 1.57));
     gl.uniformMatrix4fv(uni.uModel,false,model);
     gl.uniform3fv(uni.uColor, vec3.fromValues(0, 1, 0)); //Change color to yellow
     Shapes.sphere.material.diffuse = vec3.fromValues(0, 0.3, 0.3); //Allow for some color diffuse
     Shapes.sphere.material.emissive = vec3.fromValues(0.1, 0.1, 0); //Allow for slight emissive
     Shapes.sphere.material.diffuseTexture = "uranus.jpg";
     Shapes.sphere.render(gl, uni, Shapes.sphere.material);

    //Move camera if Neptune view is on
    if(neptuneView == true){
        distance1 = neptuneLoc.major - 7;
        distance2 = neptuneLoc.minor - 7;
        pos = vec3.fromValues(distance1*Math.cos(neptuneLoc.theta), 0, distance2*Math.sin(neptuneLoc.theta));
        at = vec3.fromValues(neptuneLoc.major*Math.cos(neptuneLoc.theta), 0, neptuneLoc.minor*Math.sin(neptuneLoc.theta));
        up = vec3.fromValues(0,1,0);
        camera.lookAt(pos,at,up);
    }

    //Draw Neptune
    mat4.identity(model);
    mat4.fromTranslation(model,vec3.fromValues(neptuneLoc.major*Math.cos(neptuneLoc.theta), 0, neptuneLoc.minor*Math.sin(neptuneLoc.theta)));
    mat4.rotateZ(model, model, 28.32*Math.PI/180);
    mat4.rotateY(model, model, neptuneLoc.phi);
    mat4.scale(model, model, vec3.fromValues(1.53, 1.53, 1.53));
    gl.uniformMatrix4fv(uni.uModel,false,model);
    Shapes.sphere.material.diffuse = vec3.fromValues(0, 0.3, 0.3); //Allow for some color diffuse
    Shapes.sphere.material.emissive = vec3.fromValues(0.1, 0.1, 0); //Allow for slight emissive
    Shapes.sphere.material.diffuseTexture = "neptune.jpg";
    Shapes.sphere.render(gl, uni, Shapes.sphere.material);

};

/**
 * Draws the reference grid and coordinate axes.
 */
var drawAxesAndGrid = function() {
    // Set model matrix to identity
    gl.uniformMatrix4fv(uni.uModel, false, mat4.create());
    // Draw grid
    grid.render(gl,uni);
    // Draw Axes
    axes.render(gl,uni);
};

//////////////////////////////////////////////////
// Event handlers
//////////////////////////////////////////////////

/**
 * An object used to represent the current state of the mouse.
 */
mouseState = {
    prevX: 0,     // position at the most recent previous mouse motion event
    prevY: 0, 
    x: 0,          // Current position
    y: 0,      
    deltaX: 0,     // the change in the mouses x direction when dragging
    deltaY: 0,     // the change in the mouses y direction when dragging
    button: 0,     // Left = 0, middle = 1, right = 2
    down: false,   // Whether or not a button is down
    wheelDelta: 0  // How much the mouse wheel was moved
};
var cameraMode = 0;          // Mouse = 0, Fly = 1, Mercury = 2, Venus = 3, Earth = 4, Mars = 5, 
                             //Jupiter = 6, Saturn = 7, Uranus = 8, Neptune = 9
var downKeys = new Set();    // Keys currently pressed

var setupEventHandlers = function() {
    let modeSelect = document.getElementById("camera-mode-select"); //Camera mode selection
    let lightSelect = document.getElementById("light-mode-select"); //Light mode selection

    let gridSelect = document.getElementById("grid"); //Check box to show orbits 

    var slider = document.getElementById("myRange");
    var output = document.getElementById("test");
    output.innerHTML = (slider.value/1000)*24; // Display the default slider value
    // Update the current slider value (each time you drag the slider handle)
    slider.oninput = function() {
        output.innerHTML = ((this.value/1000)*24).toFixed(2);
        tstep = Number(this.value);
    };


    // Disable the context menu in the canvas in order to make use of
    // the right mouse button.
    canvas.addEventListener("contextmenu", function(e) {
        e.preventDefault();
    });

    gridSelect.addEventListener("change", 
    function(e) {
        gridShow=!gridShow;
    }
);

    //Event listener for camera mode (mouse or fly)
    modeSelect.addEventListener("change", 
        function(e) {
            let val = e.target.value;
            if( val === "0" ){
                cameraMode = 0;
                mercuryView = false;
                venusView = false;
                earthView = false;
                marsView = false;
                jupiterView = false;
                saturnView = false;
                uranusView = false;
                neptuneView = false;
                sunView = false;
            }
            else if( val === "1" ){ 
                cameraMode = 1;
                mercuryView = false;
                venusView = false;
                earthView = false;
                marsView = false;
                jupiterView = false;
                saturnView = false;
                uranusView = false;
                neptuneView = false;
                sunView = false;
            }
            else if( val === "2" ){
                cameraMode = 2;
                mercuryView = true;
                venusView = false;
                earthView = false;
                marsView = false;
                jupiterView = false;
                saturnView = false;
                uranusView = false;
                neptuneView = false;
                sunView = false;
            }   
            else if( val === "3" ){   
                cameraMode = 3;
                venusView = true;
                mercuryView = false;
                earthView = false;
                marsView = false;
                jupiterView = false;
                saturnView = false;
                uranusView = false;
                neptuneView = false;
                sunView = false;
            }
            else if( val === "4" ){   
                cameraMode = 4;
                earthView = true;
                mercuryView = false;
                venusView = false;
                marsView = false;
                jupiterView = false;
                saturnView = false;
                uranusView = false;
                neptuneView = false;
                sunView = false;
            }
            else if( val === "5" ){   
                cameraMode = 5;
                marsView = true;
                mercuryView = false;
                venusView = false;
                earthView = false;
                jupiterView = false;
                saturnView = false;
                uranusView = false;
                neptuneView = false;
                sunView = false;
            }
            else if( val === "6" ){   
                cameraMode = 6;
                jupiterView = true;
                mercuryView = false;
                venusView = false;
                earthView = false;
                marsView = false;
                saturnView = false;
                uranusView = false;
                neptuneView = false;
                sunView = false;
            }
            else if( val === "7" ){   
                cameraMode = 7;
                saturnView = true;
                mercuryView = false;
                venusView = false;
                earthView = false;
                marsView = false;
                jupiterView = false;
                uranusView = false;
                neptuneView = false;
                sunView = false;
            }
            else if( val === "8" ){   
                cameraMode = 8;
                uranusView = true;
                mercuryView = false;
                venusView = false;
                earthView = false;
                marsView = false;
                jupiterView = false;
                saturnView = false;
                neptuneView = false;
                sunView = false;
            }
            else if( val === "9" ){   
                cameraMode = 9;
                neptuneView = true;
                mercuryView = false;
                venusView = false;
                earthView = false;
                marsView = false;
                jupiterView = false;
                saturnView = false;
                uranusView = false;
                sunView = false;
            }
            else if( val === "10" ){   
                cameraMode = 10;
                sunView = true;
                neptuneView = false;
                mercuryView = false;
                venusView = false;
                earthView = false;
                marsView = false;
                jupiterView = false;
                saturnView = false;
                uranusView = false;
            }
        }
    );

    canvas.addEventListener("mousemove", 
        function(e) {
            if( mouseState.down ) {
                mouseState.x = e.pageX - this.offsetLeft;
                mouseState.y = e.pageY - this.offsetTop;
                mouseDrag();
                mouseState.prevX = mouseState.x;
                mouseState.prevY = mouseState.y;
            }
        });
    canvas.addEventListener("mousedown", function(e) {
        mouseState.x = e.pageX - this.offsetLeft;
        mouseState.y = e.pageY - this.offsetTop;    
        mouseState.down = true;
        mouseState.prevX = mouseState.x;
        mouseState.prevY = mouseState.y;
        mouseState.button = e.button;
    } );
    canvas.addEventListener("mouseup", function(e) {
        mouseState.x = e.pageX - this.offsetLeft;
        mouseState.y = e.pageY - this.offsetTop;
        mouseState.down = false;
        mouseState.prevX = 0;
        mouseState.prevY = 0;
    } );
    canvas.addEventListener("wheel", function(e) {
        e.preventDefault();
        mouseState.wheelDelta = e.deltaY;
        //Call the dolly function if in mouse mode and using scroll wheel:
        if(cameraMode==0){
        camera.dolly(mouseState.wheelDelta*0.005); //Multiplied by a very small number to get good speed
        }
    } );
    document.addEventListener("keydown", function(e) {
        downKeys.add(e.code);
        e.preventDefault();
    });
    document.addEventListener("keyup", function(e) {
        if(e.code == "Space"){
            camera.reset();
            sunView = false;
            mercuryView = false;
            venusView = false;
            earthView = false;
            marsView = false;
            jupiterView = false;
            saturnView = false;
            uranusView = false;
            neptuneView = false;
            document.getElementById("camera-mode-select").selectedIndex = 0;
            cameraMode = 0;
        }
        if(e.code == "KeyP")
            pause = !pause;
        downKeys.delete(e.code);
    });
};

/**
 * Check the list of keys that are currently pressed (downKeys) and
 * update the camera appropriately.  This function is called 
 * from render() every frame.
 */
var updateCamera = function() {

    //If in fly mode, call functions for each key relating to what they should do
    if(cameraMode==1){
        if(downKeys.has("KeyW"))
            camera.dolly((-10)*0.025);
        if(downKeys.has("KeyS"))
            camera.dolly((10)*0.025);
        if(downKeys.has("KeyD"))
            camera.track(5*0.045,0);
        if(downKeys.has("KeyA"))
            camera.track((-5)*0.045,0);
        if(downKeys.has("KeyQ"))
            camera.track(0,3*0.115);
        if(downKeys.has("KeyE"))
            camera.track(0,(-3)*0.115);
            
            //Note: Again, picked very small numbers for good speed
    }

};

/**
 * Called when a mouse motion event occurs and a mouse button is 
 * currently down.
 */
var mouseDrag = function () {
    mouseState.deltaX = mouseState.x - mouseState.prevX; //Calculate how much the mouse moved in the x
    mouseState.deltaY = mouseState.y - mouseState.prevY; //Calculate how much the mouse moved in the y

    //If in mouse mode, call functions for mouse buttons
    if(cameraMode==0){
        if(mouseState.button==2){
            camera.track(-(mouseState.deltaX*0.015), (mouseState.deltaY*0.015));
        }
        if(mouseState.button==0){
            camera.orbit(mouseState.deltaX*0.015, mouseState.deltaY*0.015);
        }
    }

    //If in fly mode, allow for turning using mouse
    if(cameraMode==1){
        if(mouseState.button==0){
            camera.turn(mouseState.deltaX*0.01, mouseState.deltaY*0.01);
        }
    }

    //Note: small numbers used in function calls for good speed
};

// When the HTML document is loaded, call the init function.
window.addEventListener("load", init);
