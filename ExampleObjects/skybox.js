/**
 * Created by haokai on 4/13/16.
 */
var grobjects = grobjects || [];

// allow the two constructors to be "leaked" out
var Skybox = undefined;

// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
    "use strict";

    // i will use this function's scope for things that will be shared
    // across all cubes - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined;
    var buffers = undefined;



    // constructor for Cubes
    Skybox = function Skybox(position, size, color) {
        this.name = 'Skybox';
        this.position = position || [0,0,0];
        this.size = size || 500;
        this.angle = Math.PI;
    }
    Skybox.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        // create the shaders once - for all cubes
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["skybox-vs", "skybox-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos : { numComponents: 3, data: [
                    1, 1, 1,  -1, 1, 1,  -1,-1, 1,   1,-1, 1,
                   1, 1, 1,   1,-1, 1,   1,-1,-1,   1, 1,-1,
                   1, 1, 1,   1, 1,-1,  -1, 1,-1,  -1, 1, 1,
                  -1, 1, 1,  -1, 1,-1,  -1,-1,-1,  -1,-1, 1,
                  -1,-1,-1,   1,-1,-1,   1,-1, 1,  -1,-1, 1,
                   1,-1,-1,  -1,-1,-1,  -1, 1,-1,   1, 1,-1 
                ] },
                vTexCoord : {numComponents:2, data: [
                    0.5, 0.33,   0.25, 0.33,   0.25, 0.66,   0.5, 0.66,
                    0.5, 0.34,   0.5, 0.66,   0.75, 0.66,   0.75, 0.34,
                    0.49, 0.33,   0.49, 0,   0.26, 0,   0.26, 0.33,
                    0.25, 0.34,   0.01, 0.34,   0.01, 0.66,   0.25, 0.66,
                    0.26, 1,   0.49, 1,   0.49, 0.67,   0.25, 0.67,
                    0.75, 0.66,   0.99, 0.66,   0.99, 0.34,   0.75, 0.34 
                ]},
                indices : [0, 1, 2,   0, 2, 3,    // front
                           4, 5, 6,   4, 6, 7,    // right
                           8, 9,10,   8,10,11,    // top
                          12,13,14,  12,14,15,    // left
                          16,17,18,  16,18,19,    // bottom
                          20,21,22,  20,22,23 ]
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }
        //shaderProgram.texSampler = gl.getUniformLocation(shaderProgram, "texSampler");
        gl.uniform1i(shaderProgram.texSampler, 0);

        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        var image = new Image();
        image.onload = function LoadTexture(){
              gl.bindTexture(gl.TEXTURE_2D, texture);
              gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

              // Option 1 : Use mipmap, select interpolation mode
              //gl.generateMipmap(gl.TEXTURE_2D);
              //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

              // Option 2: At least use linear filters
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

              // Optional ... if your shader & texture coordinates go outside the [0,1] range
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }    
        image.crossOrigin = "anonymous";
        image.src = "https://lh3.googleusercontent.com/4s4Qv1tPh1CxEj4njNAygBealuFgIa-jgmwT0dwuejRgVTjfvNmK8-AJtebQ6pF0rzr1fzL8ofSVIn5G_-I92gB22POBdG-GSdFfQ112X9csetv0i3Rj0cTkcYn7EHEH6WTeZusVJEWD78QvAyhnMMwJS_8ZuY711UV7NCuJrvxbUmvWXc3U4rF1gilo-fk1YAiNkrTbobLIP0eMpZr2nceGwPDAU06Fy8C776YLnJC3aAqYmPWZrDOy2y_bD3TXg1t6YbCcNZKV4cfsv87qbPf8BLHr5cJdWT3Ci2NaEWt6yTcfoWQF-iuxjAt9ofTHZvv-TUhyyySWVz3qjzUkeORXVCSRi5HCSp5qwYcyyekhZ2ccnRwD6AS_rB9SgeetGtLLZOE0XrIus1aSwjwN9bIT9UzEWsqTzKPTMgwFAeKkQ-htaHnmXgoaF-DAu7kMk0ByKDzzMjroCE_AAxOmm5kUlS8_GA6-3MOfUSuVpWaXPjm_ov109QwWxt4WsH1ePym1qgWX8m7jnByOiqOJoueK-0xF8dzauk4WptHHFoAidk76OjGP8L48dLlFpqaTjXM=w1201-h900-no";
    };
    Skybox.prototype.draw = function(drawingState) {
        // we make a model matrix to place the cube in the world
        this.angle+=0.000;
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        modelM = twgl.m4.multiply(twgl.m4.rotationY(this.angle),modelM);
        twgl.m4.setTranslation(modelM, [0,-50,0], modelM);
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            model: modelM });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    Skybox.prototype.center = function(drawingState) {
        return this.position;
    }

})();

// put some objects into the scene
// normally, this would happen in a "scene description" file
// but I am putting it here, so that if you want to get
// rid of cubes, just don't load this file.
grobjects.push(new Skybox());

