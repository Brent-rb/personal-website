// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default
precision mediump float;

varying lowp vec3 v_color;
uniform float u_red;

void main() {
	// gl_FragColor is a special variable a fragment shader
	// is responsible for setting
	gl_FragColor = vec4(u_red, v_color.g, v_color.b, 1); // return reddish-purple
}