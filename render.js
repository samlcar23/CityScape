/**
 * Created by Hans Dulimarta.
 */
let canvas
let gl;
let allObjs = [];

var animEnabled = false;


function main() {
  canvas = document.getElementById("my-canvas");

  setupListeners();

  /* setup window resize listener */
  window.addEventListener('resize', resizeWindow);

  gl = WebGLUtils.create3DContext(canvas, null);
  ShaderUtils.loadFromFile(gl, "vshader.glsl", "fshader.glsl")
  .then (prog => {

    /* put all one-time initialization logic here */
    gl.useProgram (prog);
    gl.clearColor (0, 0, 0, 1);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.cullFace(gl.BACK);

    /* the vertex shader defines TWO attribute vars and ONE uniform var */
    let posAttr = gl.getAttribLocation (prog, "vertexPos");
    let colAttr = gl.getAttribLocation (prog, "vertexCol");
    Object3D.linkShaderAttrib({
      positionAttr: posAttr,
      colorAttr: colAttr
    });
    let modelUnif = gl.getUniformLocation (prog, "modelCF");
    projUnif = gl.getUniformLocation (prog, "projection");
    viewUnif = gl.getUniformLocation (prog, "view");
    Object3D.linkShaderUniform({
      projection: projUnif,
      view: viewUnif,
      model: modelUnif
    });
    gl.enableVertexAttribArray (posAttr);
    gl.enableVertexAttribArray (colAttr);
    projMat = mat4.create();
    gl.uniformMatrix4fv (projUnif, false, projMat);
    viewMat = mat4.lookAt(mat4.create(),
      vec3.fromValues (-2, -2, 3),  // eye coord
      vec3.fromValues (1, 1, 1),  // gaze point
      vec3.fromValues (0, 0, 1)   // Z is up
    );
    gl.uniformMatrix4fv (viewUnif, false, viewMat);

    /* recalculate new viewport */
    resizeWindow();

    createObject();

    /* initiate the render request */
    window.requestAnimFrame(drawScene);
  });
}

function drawScene() {
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

    /* in the following three cases we rotate the coordinate frame by 1 degree */
    for (var k = 0; k < allObjs.length; k++)
        allObjs[k].draw(gl);

}


function createObject() {

    // let sphere = new Sphere(gl, .4, 5, vec3.fromValues(0,1,0));
    // mat4.translate(sphere.coordFrame, sphere.coordFrame, vec3.fromValues(1, 1, 0));
    // allObjs.push(sphere);


    for (var i = 0; i < 10; i++){
        for (var j = 0; j < 10; j++)
        {
            var height = getRandomArbitrary(.2, 2);
            var topRad = getRandomArbitrary(0.05, 0.4);
            let obj = new PolygonalPrism(gl,
                {
                    topRadius: topRad,
                    bottomRadius: getRandomArbitrary(0.1, 0.4),
                    numSides: getRandomInt(5, 10),
                    height: height,
                    //topColor: vec3.fromValues(1,0,0),
                    //bottomColor: vec3.fromValues(1,1,1)
                });
            let cone = new Cone(gl, {
                radius: topRad + .1,
                height: getRandomArbitrary(0.05, 0.5)
            });
            let yard = new PolygonalPrism(gl,
                {
                    topRadius: 0.8,
                    bottomRadius: 0.8,
                    numSides: 4,
                    height: 0,
                    topColor: vec3.fromValues(0,1,0)
                });
            mat4.translate(obj.coordFrame, obj.coordFrame, vec3.fromValues(i*1.5, j*1.5, 0));
            mat4.translate(cone.coordFrame, cone.coordFrame, vec3.fromValues(i*1.5, j*1.5, height));
            mat4.translate(yard.coordFrame, yard.coordFrame, vec3.fromValues(i*1.5, j*1.5, 0));
            mat4.rotate(yard.coordFrame, yard.coordFrame, 0.78, vec3.fromValues(0, 0, 1));
            allObjs.push(obj, cone, yard);
        }
    }
}

function setupListeners(){
    //keydown control
    window.addEventListener('keydown', event => {
       var key = String.fromCharCode(event.keyCode);

       var temp = mat4.create();

       switch (key) {
           case 'W':
               //Pitch down
               mat4.fromXRotation(temp, 0.1);
               mat4.multiply(viewMat, temp, viewMat);
               break;
           case 'A':
               //Bank left
               mat4.fromZRotation(temp, -0.1);
               mat4.multiply(viewMat, temp, viewMat);
               break;
           case 'S':
               //Pitch up
               mat4.fromXRotation(temp, -0.1);
               mat4.multiply(viewMat, temp, viewMat);
               break;
           case 'D':
               //Bank right
               mat4.fromZRotation(temp, 0.1);
               mat4.multiply(viewMat, temp, viewMat);
               break;
           case 'Q':
               //Yaw left
               mat4.fromYRotation(temp, -0.1);
               mat4.multiply(viewMat, temp, viewMat);
               break;
           case 'E':
               //Yaw right
               mat4.fromYRotation(temp, 0.1);
               mat4.multiply(viewMat, temp, viewMat);
               break;
           case '&':
               //forward
               translation = vec3.fromValues(0, 0, .1);
               mat4.fromTranslation(temp, translation);
               mat4.multiply(viewMat, temp, viewMat);
               break;
           case '(':
               //reverse
               translation = vec3.fromValues(0, 0, -.1);
               mat4.fromTranslation(temp, translation);
               mat4.multiply(viewMat, temp, viewMat);
               break;
           case '%':
               //left
               translation = vec3.fromValues(.1, 0, 0);
               mat4.fromTranslation(temp, translation);
               mat4.multiply(viewMat, temp, viewMat);
               break;
           case "'":
               //right
               translation = vec3.fromValues(-.1, 0, 0);
               mat4.fromTranslation(temp, translation);
               mat4.multiply(viewMat, temp, viewMat);
               break;
           case ' ':
               //spacebar
               if (animEnabled){
                   animEnabled = false;
                   console.log(animEnabled);
               } else{
                   animEnabled = true;
                   console.log(animEnabled);
               }

               break;
       }
        gl.uniformMatrix4fv (viewUnif, false, viewMat);
        window.requestAnimFrame(drawScene);
    });
}

/************************************************************
 * citation for getRandomArbitrary() and getRandomInt()
 *
 * https://stackoverflow.com/questions/1527803/
 * generating-random-whole-numbers-in-javascript-in-a-specific-range
 ***********************************************************/

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function resizeWindow() {
  let w = window.innerWidth - 16;
  let h = 0.75 * window.innerHeight;
  canvas.width = w;
  canvas.height = h;
  mat4.perspective (projMat, glMatrix.toRadian(60), w/h, 0.05, 20);
  gl.uniformMatrix4fv (projUnif, false, projMat);
  gl.viewport(0, 0, w, h);
}
