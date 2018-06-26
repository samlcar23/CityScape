/**
 * Created by Hans Dulimarta on 2/1/17.
 */
class Sphere extends Object3D {
    /**
     * Create a 3D sphere with tip at the Z+ axis and base on the XY plane
     * @param {Object} gl      the current WebGL context
     * @param {Number} radius  radius of the sphere
     * @param {Number} subDiv number of recursive subdivisions
     * @param {vec3}   [col1]    color #1 to use
     */
    constructor (gl, RADIUS, subDiv, col1) {
        super(gl);
        /* if colors are undefined, generate random colors */
        //if (typeof col1 === "undefined") col1 = vec3.fromValues(Math.random(), Math.random(), Math.random());

        col1 = vec3.fromValues(Math.random(), Math.random(), Math.random());

        this.RADIUS = RADIUS;
        let seedA = vec3.fromValues(1, 1, 1);
        vec3.normalize(seedA, seedA);
        vec3.scale (seedA, seedA, RADIUS);
        let seedB = vec3.fromValues(-1, -1, 1);
        vec3.normalize(seedB, seedB);
        vec3.scale (seedB, seedB, RADIUS);
        let seedC = vec3.fromValues(-1, 1, -1);
        vec3.normalize(seedC, seedC);
        vec3.scale (seedC, seedC, RADIUS);
        let seedD = vec3.fromValues(1, -1, -1);
        vec3.normalize(seedD, seedD);
        vec3.scale (seedD, seedD, RADIUS);

        /* TODO: complete the rest of the code here */
        var vertexArr = [], indexArr = [], colors = [];


        createSphere(seedA, seedB, seedC, seedD, RADIUS, subDiv, vertexArr, indexArr);
        // vertexArr.push(seedA, seedB, seedC, seedD);
        // indexArr.push(seedA[0]);
        // indexArr.push(seedA[1]);
        // indexArr.push(seedA[2]);
        // indexArr.push(seedB[0]);
        // indexArr.push(seedB[1]);
        // indexArr.push(seedB[2]);
        // indexArr.push(seedC[0]);
        // indexArr.push(seedC[1]);
        // indexArr.push(seedC[2]);
        // indexArr.push(seedD[0]);
        // indexArr.push(seedD[1]);
        // indexArr.push(seedD[2]);
        // colors.push(col1[0]);
        // colors.push(col1[1]);
        // colors.push(col1[2]);
        // colors.push(col1[0]);
        // colors.push(col1[1]);
        // colors.push(col1[2]);
        // colors.push(col1[0]);
        // colors.push(col1[1]);
        // colors.push(col1[2]);
        // colors.push(col1[0]);
        // colors.push(col1[1]);
        // colors.push(col1[2]);


        /* copy the (x,y,z,r,g,b) sixtuplet into GPU buffer */
       // this.vertexBuff = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuff);
        gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(vertexArr), gl.STATIC_DRAW);

        this.colorBuff = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuff);
        gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(colors), gl.STATIC_DRAW);

        let buff = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buff);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint16Array.from(indexArr), gl.STATIC_DRAW);
        this.primitives.push({type: gl.TRIANGLES, buffer: buff, numPoints: indexArr.length});


    }
}


function createSphere(A, B, C, D, rad, sDiv, vArr, iArr){

    vArr.push(A, B, C, D);
    iArr.push(A[0]);
    console.log(A[0]);
    iArr.push(A[1]);
    console.log(A[1]);
    iArr.push(A[2]);
    console.log(A[2]);
    iArr.push(B[0]);
    iArr.push(B[1]);
    iArr.push(B[2]);
    iArr.push(C[0]);
    iArr.push(C[1]);
    iArr.push(C[2]);
    iArr.push(D[0]);
    iArr.push(D[1]);
    iArr.push(D[2]);
    colors.push(col1[0]);
    colors.push(col1[1]);
    colors.push(col1[2]);
    colors.push(col1[0]);
    colors.push(col1[1]);
    colors.push(col1[2]);
    colors.push(col1[0]);
    colors.push(col1[1]);
    colors.push(col1[2]);
    colors.push(col1[0]);
    colors.push(col1[1]);
    colors.push(col1[2]);


}

function findMid(a, b){
    var middle = (a + b)/2;
    return middle;
}