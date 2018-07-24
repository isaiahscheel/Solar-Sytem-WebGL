#version 300 es
precision highp float;

out vec4 fragColor;

// The color from the vertex shader, interpolated across the triangle.
in vec3 fColor;

void main() {
    // Just output the interpolated color.
    fragColor = vec4(fColor,1);
}