/**
 * Created by haokai on 4/13/16.
 */
var grobjects = grobjects || [];

var Rocket = undefined;

/* this file defines a helicopter object and a helipad object

the helicopter is pretty ugly, and the rotor doesn't spin - but
it is intentionally simply. it's ugly so that students can make
it nicer!

it does give an example of index face sets

read a simpler object first.


the helipad is a simple object for the helicopter to land on.
there needs to be at least two helipads for the helicopter to work..


the behavior of the helicopter is at the end of the file. it is
an example of a more complex/richer behavior.
 */

(function () {
    "use strict";

    // i will use this function's scope for things that will be shared
    // across all cubes - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined;
    var rocketBuffers = undefined;
    var rocketNumber = 0;

    // constructor for Helicopter
    Rocket = function Rocket(name) {
        this.name = "Rocket"+rocketNumber++;
        this.position = [0,0,0];    // will be set in init
        this.color = [.8,.8,.8];
        // about the Y axis - it's the facing direction
        this.orientation = 0;
    }
    Rocket.prototype.init = function(drawingState) {
        var gl=drawingState.gl;

        // create the shaders once - for all cubes
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["cube-vs", "cube-fs"]);
        }
        if (!rocketBuffers) {
            var arrays = {
                vpos : { numComponents: 3, data: [
                    .5, 0, 0,  0,0,-.5,  -.5,0,0,  0,0, .5, 
                    .5, 3, 0,  0,3,-.5,  -.5,3,0,  0,3, .5,  
                    0,4,0,
                    .5, 0.5, 0,  0,0.5,-.5,  -.5,0.5,0,  0,0.5, .5, 
                    .7, 0, 0,  0,0,-.7,  -.7,0,0,  0,0, .7, 
                ] },
                vnormal : {numComponents:3, data: [
                    1,0,0,  0,0,-1,  -1,0,0,  0,0,1, 
                    1,0.5,0,  0,0.5,-1,  -1,0.5,0,  0,0.5,1,  
                    0,1,0,
                    1,0,0,  0,0,-1,  -1,0,0,  0,0,1,
                    1,0,0,  0,0,-1,  -1,0,0,  0,0,1,
                ]},
                indices : [0,1,2, 0,2,3, 0,1,5, 0,4,5, 0,3,7, 0,4,7, 2,3,7, 2,6,7,
                           1,2,6, 1,5,6, 5,6,8, 4,5,8, 4,7,8, 6,7,8,
                           0,9,13, 1,10,14, 2,11,15, 3,12,16
                            ]
            };
            rocketBuffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }

    };
    Rocket.prototype.draw = function(drawingState) {
        // we make a model matrix to place the cube in the world
        var modelM = twgl.m4.rotationY(this.orientation);
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            cubecolor:this.color, model: modelM });
        twgl.setBuffersAndAttributes(gl,shaderProgram,rocketBuffers);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, rocketBuffers);
    };
    Rocket.prototype.center = function(drawingState) {
        return this.position;
    }
})();
grobjects.push(new Rocket());

