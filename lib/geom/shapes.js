
/**
 * This single object is designed to be a "library" of primitive shapes that we can use.
 * Initially, this object has only one property (the init function).  After the init
 * function is called, it will have a property for each of the primitive shapes.  The
 * init function should be called only once.
 */
var Shapes = {
    /**
     * This function initializes all primitive shapes and makes them available.
     * 
     * @param{WebGL2RenderingContext} gl
     */
    init: function(gl) {
        if( this.initialized ) return;

        // Cube
        this.cube = new TriangleMesh(gl, generateCubeData());
        this.cube.material = new Material(); //Create new material object for cube

        // Initialize other shapes here....
        //this.helicopter = new Helicopter(2*Math.PI,2*Math.PI/3,4*Math.PI/3,0,0,0,2*Math.PI,2*Math.PI/3,4*Math.PI/3);

        this.cone = new TriangleMesh(gl, generateConeData(0.5,2,25));
        this.cone.material = new Material();

        this.cylinder = new TriangleMesh(gl, generateCylinderData(0.5, 2.0, 40));
        this.cylinder.material = new Material(); //Create new material object for cylinder

        this.disk = new TriangleMesh(gl, generateDiskData(1,25,1));
        this.disk.material = new Material(); //Create new material object for disk

        this.sphere = new TriangleMesh(gl, generateSphereData(1, 100, 100));
        this.sphere.material = new Material();

        //Set up Mercury Orbit Line
        this.orbit1 = new OrbitMesh(gl, generateTrackData(mercuryLoc.major, mercuryLoc.minor, 500));
        this.orbit1.material = new Material();
        this.orbit1.material.emissive = vec3.fromValues(1,1,1);

        //Set up Venus Orbit Line
        this.orbit2 = new OrbitMesh(gl, generateTrackData(venusLoc.major, venusLoc.minor, 500));

        //Set up Earth Orbit Line
        this.orbit3 = new OrbitMesh(gl, generateTrackData(earthLoc.major, earthLoc.minor, 500));

        //Set up Moon Orbit Line
        this.orbit9 = new OrbitMesh(gl, generateTrackData(moonLoc.major, moonLoc.minor, 500));

        //Set up Mars Orbit Line
        this.orbit4 = new OrbitMesh(gl, generateTrackData(marsLoc.major, marsLoc.minor, 500));

        //Set up Jupiter Orbit Line
        this.orbit5 = new OrbitMesh(gl, generateTrackData(jupiterLoc.major, jupiterLoc.minor, 500));

        //Set up Io Orbit Line
        this.orbit10 = new OrbitMesh(gl, generateTrackData(ioLoc.major, ioLoc.minor, 500));

        //Set up Europa Orbit Line
        this.orbit11 = new OrbitMesh(gl, generateTrackData(europaLoc.major, europaLoc.minor, 500));

        //Set up Ganymede Orbit Line
        this.orbit12 = new OrbitMesh(gl, generateTrackData(ganymedeLoc.major, ganymedeLoc.minor, 500));

        //Set up Callisto Orbit Line
        this.orbit13 = new OrbitMesh(gl, generateTrackData(callistoLoc.major, callistoLoc.minor, 500));

        //Set up Saturn Orbit Line
        this.orbit6 = new OrbitMesh(gl, generateTrackData(saturnLoc.major, saturnLoc.minor, 500));

        //Set up Uranus Orbit Line
        this.orbit7 = new OrbitMesh(gl, generateTrackData(saturnLoc.major, saturnLoc.minor, 500));

        //Set up Neptune Orbit Line
        this.orbit8 = new OrbitMesh(gl, generateTrackData(neptuneLoc.major, neptuneLoc.minor, 500));

        

        this.initialized = true;
    },
    initialized: false
};