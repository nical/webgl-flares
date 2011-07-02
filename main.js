var seq;
var back;
var post;
/*var sceneBuffer;
var sceneTexture;
var sceneDepth;*/

var globalTime = 0
var time = new Date().getTime();

var bd;
var kick_det;
var vu;
var m_BeatTimer = 0;
var m_BeatCounter = 0;
var canvas_w,canvas_h;
var aspect = 1.0;
var clearClr = [0,0,1];
var ftimer = 0;
var light_test;

var bufferSize = 0;
var signal = new Float32Array(bufferSize);
var channels = 0;   
var rate = 0;   
var frameBufferLength = 0;
var fft = null;

function initDemo() {
	var audioElement = document.getElementById("music")
	audioElement.play()
	
	initContext();
	
	// create GL buffers
	for (meshName in meshArrays)
	{
		meshes[meshName] = new MeshBuffer(meshArrays[meshName])
	}
	
	// offscreen render target
	/*sceneBuffer = gl.createFramebuffer()
	gl.bindFramebuffer(gl.FRAMEBUFFER, sceneBuffer)
	sceneBuffer.width = gl.viewportWidth
	sceneBuffer.height = gl.viewportHeight
	
	sceneTexture = gl.createTexture()
	gl.bindTexture(gl.TEXTURE_2D, sceneTexture)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, sceneBuffer.width, sceneBuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHEMENT0, gl.TEXTURE_2D, sceneTexture, 0)
	gl.bindTexture(gl.TEXTURE_2D, null)
	
	sceneDepth = gl.createRenderbuffer()
	gl.bindRenderbuffer(gl.RENDERBUFFER, sceneDepth)
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, sceneDepth, sceneBuffer.width, sceneBuffer.height)
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHEMENT, gl.RENDERBUFFER, sceneDepth)
	gl.bindRenderbuffer(gl.RENDERBUFFER, null)*/
	
	// main particle sequence
	var sequenceData = [
		{
			duration: 16000,
			mesh1: meshes.plane,
			mesh2: meshes.plane,
			shader: new ShaderProgram("vs", "fs")
		},
		{
			duration: 4000,
			mesh1: meshes.plane,
			mesh2: meshes.monkey,
			shader: new ShaderProgram("vs", "fs")
		},
		{
			duration: 4000,
			mesh2: meshes.monkey,
			mesh1: meshes.wtfMonkey,
			shader: new ShaderProgram("vs", "fs")
		},
		{
			duration: 10000,
			mesh1: meshes.wtfMonkey,
			mesh2: meshes.angryMonkey,
			shader: new ShaderProgram("vs", "fs")
		},
		{
			duration: 10000,
			mesh1: meshes.angryMonkey,
			mesh2: meshes.sadMonkey,
			shader: new ShaderProgram("vs", "fs")
		},
		{
			duration: 4000,
			mesh2: meshes.sadMonkey,
			mesh1: meshes.sadMonkey,
			shader: new ShaderProgram("gravity-vs", "gravity-fs")
		},
		{
			duration: 12000,
			mesh1: meshes.demojs,
			mesh2: meshes.demojs,
			shader: new ShaderProgram("vs", "fs")
		},
		{
			duration: 10000,
			mesh1: meshes.demojs,
			mesh2: meshes.angryMonkey,
			shader: new ShaderProgram("explode-vs", "explode-fs")
		},
		{
			duration: 10000,
			mesh1: meshes.angryMonkey,
			mesh2: meshes.demojs,
			shader: new ShaderProgram("explode-vs", "explode-fs")
		},
		
		// 1:20	
		{
			duration: 26000,
			mesh1: meshes.credits,
			mesh2: meshes.credits,
			shader: new ShaderProgram("vs", "fs")
		},
		{
			duration: 4000,
			mesh1: meshes.credits,
			mesh2: meshes.credits,
			shader: new ShaderProgram("gravity-vs", "gravity-fs")
		},
		
		// 1:50
		{
			duration: 2000,
			mesh1: meshes.wtfMonkey,
			mesh2: meshes.wtfMonkey,
			shader: new ShaderProgram("explode-vs", "explode-fs")
		},
		{
			duration: 2000,
			mesh1: meshes.wtfMonkey,
			mesh2: meshes.plane,
			shader: new ShaderProgram("explode-vs", "explode-fs")
		},
		{
			duration: 2000,
			mesh1: meshes.plane,
			mesh2: meshes.angryMonkey,
			shader: new ShaderProgram("explode-vs", "explode-fs")
		},
		{
			duration: 2000,
			mesh1: meshes.angryMonkey,
			mesh2: meshes.wtfMonkey,
			shader: new ShaderProgram("vs", "fs")
		},
		{
			duration: 2000,
			mesh1: meshes.wtfMonkey,
			mesh2: meshes.wtfMonkey,
			shader: new ShaderProgram("explode-vs", "explode-fs")
		},
		
		// 2:00
		{
			duration: 16000,
			mesh1: meshes.plane,
			mesh2: meshes.plane,
			shader: new ShaderProgram("vs", "fs")
		},
		{
			duration: 4000,
			mesh1: meshes.plane,
			mesh2: meshes.monkey,
			shader: new ShaderProgram("vs", "fs")
		},
		{
			duration: 4000,
			mesh2: meshes.monkey,
			mesh1: meshes.wtfMonkey,
			shader: new ShaderProgram("vs", "fs")
		},
		{
			duration: 10000,
			mesh1: meshes.wtfMonkey,
			mesh2: meshes.angryMonkey,
			shader: new ShaderProgram("vs", "fs")
		},
		{
			duration: 10000,
			mesh1: meshes.angryMonkey,
			mesh2: meshes.sadMonkey,
			shader: new ShaderProgram("vs", "fs")
		},
		
		// 2:44
		{
			duration: 40000,
			mesh2: meshes.sadMonkey,
			mesh1: meshes.sadMonkey,
			shader: new ShaderProgram("gravity-vs", "gravity-fs")
		},
	]
	
	back = new Background()
	
	// create initial sequences
	seq = new Sequence(sequenceData)
	
	// post processor
	post = new PostProcess()
	
	// start rendering
	requestAnimFrame(render)
}

function initGL(canvas) {
	try {
	  function throwOnGLError(err, funcName, args) {
		throw WebGLDebugUtils.glEnumToString(err) + " was caused by call to" + funcName;
	  };
	  //gl = WebGLDebugUtils.makeDebugContext(canvas.getContext("experimental-webgl"),throwOnGLError);
	  canvas.width = window.innerWidth;
	  canvas.height = window.innerHeight;
	  gl = canvas.getContext("experimental-webgl");
	  gl.viewportWidth = canvas.width;
	  gl.viewportHeight = canvas.height;
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry :-(");
	}
}

function initContext() {
	var canvas = document.getElementById("renderCanvas");
	initGL(canvas);
	
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	//gl.enable(gl.DEPTH_TEST);
	
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.ONE, gl.ONE);
}

function onLoadedMetadata()
{
	console.log("audioloaded");
	var audio = document.getElementById('music');
	channels      = audio.mozChannels;
	rate              = audio.mozSampleRate;
	frameBufferLength = audio.mozFrameBufferLength;

	bufferSize = frameBufferLength/channels;

	fft = new FFT(bufferSize, rate);
	signal = new Float32Array(bufferSize);

	audio.addEventListener("MozAudioAvailable",audioWritten,false);				
	bd = new BeatDetektor(80, 159);
	kick_det = new BeatDetektor.modules.vis.BassKick();    
	vu = new BeatDetektor.modules.vis.VU();
}

function audioWritten(event) 
{
	if (fft == null) return;

	var fb = event.frameBuffer;

	for (var i = 0, fbl = bufferSize; i < fbl; i++ ) {
		// Assuming interlaced stereo channels,
		// need to split and merge into a stero-mix mono signal
		signal[i] = (fb[2*i] + fb[2*i+1]) / 2;
	}
	fft.forward(signal);

	timestamp = event.time;

	bd.process( timestamp, fft.spectrum );

	// Bass Kick detection
	kick_det.process(bd);
	vu.process(bd);

	if (bd.win_bpm_int_lo)
	{
		m_BeatTimer += bd.last_update;

		if (m_BeatTimer > (60.0/bd.win_bpm_int_lo))
		{
			m_BeatTimer -= (60.0/bd.win_bpm_int_lo);
			clearClr[0] = 0.5+Math.random()/2;
			clearClr[1] = 0.5+Math.random()/2;
			clearClr[2] = 0.5+Math.random()/2;
			m_BeatCounter++;
		}
	}
	for(var i = 0; i < 32; i++) {
		//var v = fft.spectrum[i];
		//console.log(v);
		//document.getElementById(i).style.width = 400 * v + "px";
		//document.getElementById(i).style.backgroundColor = "rgba(0,0,0,"+v+")";
	}
	if (kick_det.isKick) {
		//document.getElementById("kick").innerHTML = "Kick!";
		//console.log("kick")
	} else {
		//document.getElementById("kick").innerHTML = "";
	}
}

function render()
{
	var currentTime = new Date().getTime()
	
	var dt = currentTime - time;
	time = currentTime
	globalTime += dt
	if (dt > 500)
		dt = 500
	
	back.update(dt)
	seq.update(dt)
	post.update(dt)
	
	// offscreen pass
	/*gl.bindTexture(gl.TEXTURE_2D, null)
	gl.bindFramebuffer(gl.FRAMEBUFFER, sceneBuffer)
	alert(gl.checkFramebufferStatus(gl.FRAMEBUFFER))*/
	
	gl.clearColor(0.0, 0.0, 0.0, 1.0)
	gl.clear(gl.COLOR_BUFFER_BIT)
	
	gl.disable(gl.BLEND);
	
	var magic = 0.0;
	if (globalTime < 16000)
		magic = globalTime / 16000.0;
	else if (globalTime < 17000)
		magic = 3.0 - 0.002 * (globalTime - 16000.0);
	else if (globalTime < 48000)
		magic = 1.0;
	else if (globalTime < 80000)
		magic = vu.getLevel(5);
	else if (globalTime < 110000)
		magic = vu.getLevel(8) * 3.0;
	back.draw(gl.viewportWidth / gl.viewportHeight, magic)
	
	gl.enable(gl.BLEND);
	
	var mvMatrix = mat4.create()
	var pMatrix = mat4.create()
	var mvpMatrix = mat4.create()
	mat4.identity(mvMatrix);
	
	if (globalTime < 16000)
		mat4.lookAt([0,15, 10],[0,0,0],[0,0,1], mvMatrix);
	else if (globalTime < 48000)
		mat4.lookAt([10.0 + 20.0*Math.cos(globalTime * 0.001),15 + 1.0*Math.sin(globalTime * 0.0001), 10+Math.sin(0.0001*globalTime) * 1],[0,0,0],[0,0,1], mvMatrix);
	else if (globalTime < 144000)
		mat4.lookAt([20.0*Math.cos(globalTime * 0.001),20.0*Math.sin(globalTime * 0.0001), 10 * Math.sin(0.0001*globalTime) + 2],[0,0,2],[0,0,1], mvMatrix);
	else
		mat4.lookAt([20.0*Math.cos(globalTime * 0.00008),20.0*Math.sin(globalTime * 0.0001), 10 * Math.sin(0.0001*globalTime) + 2],[0,0,2],[0,0,1], mvMatrix);
	
	//mat4.lookAt([10*Math.cos(time * 0.0001),15*Math.sin(time * 0.0001), 10+Math.sin(0.0001*time) * 1],[0,0,0],[0,0,1], mvMatrix);
	//mat4.lookAt([5*Math.cos(0),5*Math.sin(0), 1+Math.sin(0.0001*time) * 3],[0,0,0],[0,0,1], mvMatrix);
	mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
	mat4.multiply(pMatrix, mvMatrix, mvpMatrix)
	
	//var beat = Math.exp(Math.sin(time))
	var beat = 0.0;
	if (globalTime > 16000)
	{
		seq.draw(mvpMatrix, beat)
	}
	
	if (globalTime > 195000)
		alert("Thanks for watching!");
	
	// post processing
	/*gl.bindFramebuffer(gl.FRAMEBUFFER, null)
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, sceneTexture)
	
	gl.disable(gl.BLEND)
	post.draw(gl.viewportWidth / gl.viewporteight)*/
	
	requestAnimFrame(render)
}

/**
 * Provides requestAnimationFrame in a cross browser way.
 * This function has been directly taken from https://cvs.khronos.org/svn/repos/registry/trunk/public/webgl/sdk/demos/common/webgl-utils.js
 */
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
           window.setTimeout(callback, 1000/60);
         };
})();
