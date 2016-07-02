/**
 * Created by haokai on 4/13/16.
 */
var grobjects = grobjects || [];

// allow the two constructors to be "leaked" out
var Cloud = undefined;

// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
    "use strict";

    // i will use this function's scope for things that will be shared
    // across all cubes - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined;
    var buffers = undefined;

    // constructor for Cubes
    Cloud = function Cloud(position, size, color) {
        this.name = 'Cloud_group';
        this.position = position || [0,0,0];
        this.size = size || 0.5;
        this.color = color || [1,1,1];
        this.r = 0;
    }
    Cloud.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        // create the shaders once - for all cubes
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["cube-vs", "cube-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos : { numComponents: 3, data: [
                    .4,.4,.4,  .4,.4,-.4,  -.4,.4,-.4,  -.4,.4,.4,
                    .6,.1,.6,  .6,.1,-.6,  -.6,.1,-.6,  -.6,.1,.6,
                    -.8,0,-.4,  -.8,0,.4, 1.2,0,0,
                    .6,-.1,.6,  .6,-.1,-.6,  -.6,-.1,-.6,  -.6,-.1,.6,
                    .4,-.4,.4,  .4,-.4,-.4,  -.4,-.4,-.4,  -.4,-.4,.4,

                ] },
                vnormal : {numComponents:3, data: [
                    0,1,0, 0,1,0, 0,1,0, 0,1,0,
                    1,1,1, 1,1,-1, -1,1,-1, -1,1,1,
                    -1,1,-1, -1,1,1, 1,1,0,
                    1,-1,1, 1,-1,-1, -1,-1,-1, -1,-1,1,
                    0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0,
                ]},
                indices : [0,1,2, 0,2,3, 15,16,17, 15,17,18,
                           1,5,6, 1,6,2, 16,12,13, 16,17,13,
                           2,6,8, 2,8,9, 3,2,9, 3,9,7,
                           17,13,8, 17,8,9, 18,17,9, 18,9,14,
                           3,7,4, 3,0,4, 18,14,11, 18,15,11,
                           1,5,10, 1,0,10, 0,4,10,
                           16,12,10, 16,15,10, 15,11,10,
                           4,10,11, 5,12,10, 7,14,9, 6,13,8,
                           7,4,11, 7,11,14, 5,12,13, 5,6,13
                            ]
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }

    };
    Cloud.prototype.draw = function(drawingState) {
        // we make a model matrix to place the cube in the world
        this.position[0] = this.position[0]-0.01;
        if(this.position[0] < -21) {this.position[0] = 21};
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        var shift = twgl.m4.translation(this.position);
        //shift = twgl.m4.multiply(twgl.m4.translation([-this.r,0,0]), shift);
        twgl.m4.multiply(shift, modelM, modelM);
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            cubecolor:this.color, model: modelM });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    Cloud.prototype.center = function(drawingState) {
        return this.position;
    }

})();

// put some objects into the scene
// normally, this would happen in a "scene description" file
// but I am putting it here, so that if you want to get
// rid of cubes, just don't load this file.
grobjects.push(new Cloud([-20,9,10],1) );
grobjects.push(new Cloud([-15,8,2],1.2) );
grobjects.push(new Cloud([-10,9,9],0.8) );
grobjects.push(new Cloud([-5,10,-10],1.5) );
grobjects.push(new Cloud([0,9,-5],1) );
grobjects.push(new Cloud([5,11,5],1.1) );
grobjects.push(new Cloud([10,10,-10],0.9) );
grobjects.push(new Cloud([15,9,10],0.5) );
grobjects.push(new Cloud([20,9,-2],1) );
