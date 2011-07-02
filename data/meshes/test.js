function createFilledCube(w,h,d){
  vec = new Float32Array(w*h*d*3);
  for(x = 0; x < w; ++x){
    for(y = 0; y < h; ++y){
      for(z = 0; z < d; ++z){
        pos = 3*x + 3*y*w + 3*z*w*h;
        vec[pos] = (x - w * 0.5) * 0.1;
        vec[pos+1] = (y - h * 0.5) * 0.1;
        vec[pos+2] = (z - d * 0.5) * 0.1;
      }
    }
  }
  return vec;
}

meshArrays.test = createFilledCube(220, 5, 7)
