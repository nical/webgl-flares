function Background() {
	this.mesh = meshes.quad
	this.shader = new ShaderProgram("background-vs", "background-fs")
	this.time = 0.0
  this.ballPositions = new Float32Array([
     0.0,  0.0,
    -0.5,  0.2,
     0.3, -0.3,
    -0.7, -0.3,
     0.7, -0.5
  ]); 
  this.nBalls = Math.floor(this.ballPositions.length/2)
  this.ballWeights = new Float32Array([1.3, 1.0, -0.8, -1, 1.0])
}

Background.prototype.update = function(dt) {
	this.time += dt
  //this.blink = time/100 % 5;
  this.blink = 5 - (Math.floor(this.time / 500.0) % 5);
  //this.blink2 = 20 - (Math.floor(this.time / 120.0) % 20);
  this.blink2 = 20 - ((this.time / 120.0) % 20);
  //if(time % 1000 < 10 ) this.blink = this.blink+1 % 6;
  this.ballPositions[0] =        0.0;
  this.ballPositions[1] =        Math.sin(this.time*0.001);
  this.ballPositions[2] = -0.5 * Math.cos(this.time*0.001)*Math.cos(this.time*0.00001);
  this.ballPositions[3] = -0.5 * Math.sin(this.time*0.002)*0.3;
  this.ballPositions[4] = -0.3 * Math.cos(this.time*0.001)*0.4;
  this.ballPositions[5] = -0.3 * Math.sin(this.time*0.0012)*0.3;
  this.ballPositions[6] =  0.8 * Math.cos(this.time*0.001) * 1.0;
  this.ballPositions[7] = -0.8 * Math.sin(this.time*0.001) * 1.0;
  this.ballPositions[8] =  0.7 * Math.cos(this.time*0.0001) * 1.0;
  this.ballPositions[9] =  0.7 * Math.sin(this.time*0.0001) * 1.0;

  this.ballWeights[0] =  2.3 + Math.cos(this.time*0.000005) + Math.cos(this.time*0.0000001);
  this.ballWeights[1] =  2.0 + Math.sin(this.time*0.0001)  * Math.cos(this.time*0.001);
  this.ballWeights[2] = -0.4 + Math.cos(this.time*0.0005)   * 1.5;
  this.ballWeights[3] = -1.3 + Math.cos(this.time*0.000001) * 1.6;
  this.ballWeights[4] =   1  + Math.sin(this.time*0.0001) * 0.3;
}

Background.prototype.draw = function(screenRatio, magic) {
	this.shader.bind()
	
	var positionAttribute = this.shader.getAttribute("pos");
	gl.enableVertexAttribArray(positionAttribute)
	
	var timeUniform = this.shader.getUniform("time")
	gl.uniform1f(timeUniform, this.time);

	var blinkUniform = this.shader.getUniform("blink")
		gl.uniform1f(blinkUniform, this.blink);
	
	var blink2Uniform = this.shader.getUniform("blink2")
		gl.uniform1f(blink2Uniform, this.blink2);
	
	var ratioUniform = this.shader.getUniform("screenRatio")
	gl.uniform1f(ratioUniform, screenRatio);
	
	var magicUniform = this.shader.getUniform("magic")
	gl.uniform1f(magicUniform, magic);

  for(var i = 0; i < this.nBalls; ++i){
    gl.uniform2f(this.shader.getUniform("mBallPos["+i+"]")
      , this.ballPositions[2*i],this.ballPositions[2*i+1]);
    gl.uniform1f(this.shader.getUniform("mBallWeights["+i+"]"), this.ballWeights[i]);  
  }
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vbo);
	gl.vertexAttribPointer(positionAttribute, 2, gl.FLOAT, false, 0, 0);
	gl.drawArrays(gl.TRIANGLES, 0, 6);
}
