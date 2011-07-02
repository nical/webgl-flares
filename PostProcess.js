function PostProcess() {
	this.mesh = meshes.quad
	this.shader = new ShaderProgram("postprocess-vs", "postprocess-fs")
	this.time = 0.0
}

PostProcess.prototype.update = function(dt) {
	this.time += dt
}

PostProcess.prototype.draw = function(screenRatio) {
	this.shader.bind()
	
	var positionAttribute = this.shader.getAttribute("pos");
	gl.enableVertexAttribArray(positionAttribute)
	
	var timeUniform = this.shader.getUniform("time")
	gl.uniform1f(timeUniform, this.time);
	
	var ratioUniform = this.shader.getUniform("screenRatio")
	gl.uniform1f(ratioUniform, screenRatio);
	
	var texUniform = this.shader.getUniform("sceneTexture")
	gl.uniform1i(texUniform, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vbo);
	gl.vertexAttribPointer(positionAttribute, 2, gl.FLOAT, false, 0, 0);
	gl.drawArrays(gl.TRIANGLES, 0, 6);
}
