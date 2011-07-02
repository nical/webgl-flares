function MeshBuffer(array) {
	this.vbo = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
	gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);
	this.vbo.itemSize = 3;
	this.vbo.numItems = array.length / 3;
}
