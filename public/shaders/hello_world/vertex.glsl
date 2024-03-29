// an attribute will receive data from a buffer
attribute vec2 a_position;
attribute vec3 a_color;

uniform vec2 u_resolution;

varying lowp vec3 v_color;

// all shaders have a main function
void main() {
	vec2 half_resolution = u_resolution / 2.0;
	vec2 scaled_position = (a_position - half_resolution) / half_resolution;
	// gl_Position is a special variable a vertex shader
	// is responsible for setting

	v_color = a_color;
	gl_Position = vec4(scaled_position, 0.0, 1.0);
}