#version 300 es
layout(location=0) in vec4 vPosition;
layout(location=1) in vec3 vNormal;

uniform mat4 uModel;  // Object to world
uniform mat4 uView;   // World to camera
uniform mat4 uProj;   // Projection matrix

// Material Properties
uniform vec3 uEmissive;  // Emitted intensity
uniform vec3 uAmbient;   // Ambient 
uniform vec3 uDiffuse;   // Diffuse reflectivity (Kd)
uniform vec3 uSpecular;  // Specular reflectivity (Ks)
uniform float uShine;    // Specular exponent (f)

// Light properties
uniform vec3 uLightPos;        // Light position (camera coords)
uniform vec3 uLightIntensity;  // Light intensity
uniform vec3 uAmbientLight;    // Intensity of ambient light

// Output to the fragment shader
out vec3 fColor;

void main() {
    mat4 mv = uView * uModel;

    // Compute position in camera coordinates
    vec3 posCam = (mv * vPosition).xyz;

    // Transform normal into camera coordinates.  Note that this is not correct in all cases.  This
    // only transforms the normal correctly when mv contains uniform scalings.  The correct
    // transformation is the inverse transpose of mv.  For now, we'll just avoid non-uniform
    // scalings.  Note: we add 0 as the 4th component of the normal.
    vec3 normCam = normalize( (mv * vec4(vNormal,0)).xyz );

    // Direction towards light (camera coords)
    vec3 lightDir = normalize( (uLightPos - posCam).xyz );
    // Cosine of the angle between normal and lightDir
    float lDotN = max( dot( lightDir, normCam ), 0.0 );
    vec3 diffuse = uDiffuse * lDotN, 
         specular = vec3(0,0,0);
    if( lDotN > 0.0 ) {
        // Direction towards the camera
        vec3 vDir = normalize( -posCam );
        // "Halfway" vector
        vec3 h = normalize( lightDir + vDir );
        float hDotN = max( dot(h, normCam), 0.0 );
        specular = uSpecular * pow(hDotN, uShine);
    }
    
    // Final color (send to fragment shader)
    fColor = uEmissive + 
             uAmbientLight * uAmbient + 
             uLightIntensity * (diffuse + specular);

    // Convert position to clip coordinates
    gl_Position = uProj * mv * vPosition;
}
