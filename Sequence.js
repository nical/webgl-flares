function Sequence(data) {
	this.data = data
	this.currentItem = 0
	this.itemTime = 0.0
}

Sequence.prototype.update = function(dt) {
	this.itemTime += dt
	if (this.itemTime > this.data[this.currentItem].duration)
	{
		this.itemTime -= this.data[this.currentItem].duration
		this.currentItem++

		if (this.currentItem >= this.data.length)
			this.currentItem = 0
	}
}

Sequence.prototype.draw = function(mvpMatrix, beat) {
	var item = this.data[this.currentItem]

	item.shader.bind()

	var positionAttribute = item.shader.getAttribute("pos1");
	gl.enableVertexAttribArray(positionAttribute)

	var positionAttribute2 = item.shader.getAttribute("pos2");
	gl.enableVertexAttribArray(positionAttribute2)

	/*var colorAttribute = item.shader.getAttribute("color");
	if ("color" in item)
		gl.enableVertexAttribArray(colorAttribute)
	else
		gl.disableVertexAttribArray(colorAttribute)*/

	var mvpUniform = item.shader.getUniform("mvpMatrix")
	gl.uniformMatrix4fv(mvpUniform, false, mvpMatrix);

	var localTime = this.itemTime / item.duration;
	var timeUniform = item.shader.getUniform("time")
	gl.uniform1f(timeUniform, localTime);

	var size = Math.min(item.mesh1.vbo.itemSize, item.mesh2.vbo.itemSize);
	gl.bindBuffer(gl.ARRAY_BUFFER, item.mesh1.vbo);
	gl.vertexAttribPointer(positionAttribute, size, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, item.mesh2.vbo);
	gl.vertexAttribPointer(positionAttribute2, size, gl.FLOAT, false, 0, 0);
	/*if ("color" in item)
	{
		gl.bindBuffer(gl.ARRAY_BUFFER, item.color.vbo);
		gl.vertexAttribPointer(colorAttribute, item.color.vbo.itemSize, gl.FLOAT, false, 0, 0);
	}*/

	for(var i = 0; i < 32; i++) {
		var v = undefined;
    if(onFirefox){
      v = vu.getLevel(i);
    }
		//console.log("band " + i + ": " + v);
		var fftUniform = item.shader.getUniform("fft[" + i + "]");
		if (v != undefined)
			gl.uniform1f(fftUniform, v);
		else
			gl.uniform1f(fftUniform, 1.0);
	}

	gl.drawArrays(gl.POINTS, 0, item.mesh1.vbo.numItems);
}

/*data = {
	{12, mesh1, mesh2, shader}
}*/
