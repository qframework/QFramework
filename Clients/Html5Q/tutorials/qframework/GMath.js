/*
   Copyright 2012, Telum Slavonski Brod, Croatia.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
   
   This file is part of QFramework project, and can be used only as part of project.
   Should be used for peace, not war :)   
*/

function GMath() {
}


GMath.tmpV1=new Array(3);
GMath.tmpV2=new Array(3);
GMath.tmpV3=new Array(3);
GMath.tmpV4=new Array(3);
GMath.tmpW=new Array(3);
GMath.tmpW0=new Array(3);

GMath.mPi = 3.14159265;
GMath.mIdentity = new Array(
	1.0, 0.0, 0.0, 0.0,
	 0.0, 1.0, 0.0, 0.0,
	 0.0, 0.0, 1.0, 0.0,
	 0.0, 0.0, 0.0, 1.0);

GMath.multMatrixVec = function(matrix, inp, out) {
	for (var i = 0; i < 4; i = i + 1) {
		out[i] =
			inp[0] * matrix[0 * 4 + i] +
			inp[1] * matrix[1 * 4 + i] +
			inp[2] * matrix[2 * 4 + i] +
			inp[3] * matrix[3 * 4 + i];
	}
};


GMath.matricesMultiply = function(a, b, c) 
{
	var i, j , k;
	for (i = 0; i < 4; i++)
	  for (j = 0; j < 4; j++) 
	  {
		var d = 4 * i + j;
		c[d] = 0.0;
		for (k = 0; k < 4; k++) 
		{
		  c[d] += a[4 * i + k] * b[4 * k + j];
		}
	  }
	
}

GMath.matrixVecMultiply = function(a, b,c)
{
	var i, j , k;
	
	for (i = 0; i < 4; i++)
	  for (j = 0; j < 1; j++) {
		var d = 4 * i + j;
		c[d] = 0.0;
		for (k = 0; k < 4; k++) {
		  c[d] += a[4 * i + k] * b[4 * k + j];
		}
	  }
	
}


GMath.matrixVecMultiply2 = function(a, b, bi,c , ci)
{
	var i, k , d;
	
	for (i = 0; i < 4; i++)
	{
		c[i+ci] = 0.0;
		for (k = 0; k < 4; k++) 
		{
		  c[i+ci] += a[4 * k + i] * b[k + bi];
		}
	}
	
}

GMath.invertMatrix = function(m, invOut) {
	var inv = [];

	inv[0] = m[5] * m[10] * m[15] - m[5] * m[11] * m[14] - m[9] * m[6] * m[15] +
		m[9] * m[7] * m[14] + m[13] * m[6] * m[11] - m[13] * m[7] * m[10];
	inv[4] = -m[4] * m[10] * m[15] + m[4] * m[11] * m[14] + m[8] * m[6] * m[15] -
		m[8] * m[7] * m[14] - m[12] * m[6] * m[11] + m[12] * m[7] * m[10];
	inv[8] = m[4] * m[9] * m[15] - m[4] * m[11] * m[13] - m[8] * m[5] * m[15] +
		m[8] * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9];
	inv[12] = -m[4] * m[9] * m[14] + m[4] * m[10] * m[13] + m[8] * m[5] * m[14] -
		m[8] * m[6] * m[13] - m[12] * m[5] * m[10] + m[12] * m[6] * m[9];
	inv[1] = -m[1] * m[10] * m[15] + m[1] * m[11] * m[14] + m[9] * m[2] * m[15] -
		m[9] * m[3] * m[14] - m[13] * m[2] * m[11] + m[13] * m[3] * m[10];
	inv[5] = m[0] * m[10] * m[15] - m[0] * m[11] * m[14] - m[8] * m[2] * m[15] +
		m[8] * m[3] * m[14] + m[12] * m[2] * m[11] - m[12] * m[3] * m[10];
	inv[9] = -m[0] * m[9] * m[15] + m[0] * m[11] * m[13] + m[8] * m[1] * m[15] -
		m[8] * m[3] * m[13] - m[12] * m[1] * m[11] + m[12] * m[3] * m[9];
	inv[13] = m[0] * m[9] * m[14] - m[0] * m[10] * m[13] - m[8] * m[1] * m[14] +
		m[8] * m[2] * m[13] + m[12] * m[1] * m[10] - m[12] * m[2] * m[9];
	inv[2] = m[1] * m[6] * m[15] - m[1] * m[7] * m[14] - m[5] * m[2] * m[15] +
		m[5] * m[3] * m[14] + m[13] * m[2] * m[7] - m[13] * m[3] * m[6];
	inv[6] = -m[0] * m[6] * m[15] + m[0] * m[7] * m[14] + m[4] * m[2] * m[15] -
		m[4] * m[3] * m[14] - m[12] * m[2] * m[7] + m[12] * m[3] * m[6];
	inv[10] = m[0] * m[5] * m[15] - m[0] * m[7] * m[13] - m[4] * m[1] * m[15] +
		m[4] * m[3] * m[13] + m[12] * m[1] * m[7] - m[12] * m[3] * m[5];
	inv[14] = -m[0] * m[5] * m[14] + m[0] * m[6] * m[13] + m[4] * m[1] * m[14] -
		m[4] * m[2] * m[13] - m[12] * m[1] * m[6] + m[12] * m[2] * m[5];
	inv[3] = -m[1] * m[6] * m[11] + m[1] * m[7] * m[10] + m[5] * m[2] * m[11] -
		m[5] * m[3] * m[10] - m[9] * m[2] * m[7] + m[9] * m[3] * m[6];
	inv[7] = m[0] * m[6] * m[11] - m[0] * m[7] * m[10] - m[4] * m[2] * m[11] +
		m[4] * m[3] * m[10] + m[8] * m[2] * m[7] - m[8] * m[3] * m[6];
	inv[11] = -m[0] * m[5] * m[11] + m[0] * m[7] * m[9] + m[4] * m[1] * m[11] -
		m[4] * m[3] * m[9] - m[8] * m[1] * m[7] + m[8] * m[3] * m[5];
	inv[15] = m[0] * m[5] * m[10] - m[0] * m[6] * m[9] - m[4] * m[1] * m[10] +
		m[4] * m[2] * m[9] + m[8] * m[1] * m[6] - m[8] * m[2] * m[5];

	var det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];

	if (det === 0) {
		return false;
	}

	det = 1.0 / det;

	for (var i = 0; i < 16; i = i + 1) {
		invOut[i] = inv[i] * det;
	}

	return true;
}
	
GMath.unProject = function(winX, winY, winZ, model, proj, view, objPos) {

	var inp = [winX,winY,winZ,1.0];
	var finalMatrix = [];

	GMath.matricesMultiply(model, proj, finalMatrix);
	if (!GMath.invertMatrix(finalMatrix, finalMatrix)) {
		return (false);
	}

	inp[0] = (inp[0] - view[0]) / view[2];
	inp[1] = (inp[1] - view[1]) / view[3];

	inp[0] = inp[0] * 2 - 1;
	inp[1] = inp[1] * 2 - 1;
	inp[2] = inp[2] * 2 - 1;

	var out = [];

	GMath.multMatrixVec(finalMatrix, inp, out);

	if (out[3] === 0.0) {
		return false;
	}

	out[0] /= out[3];
	out[1] /= out[3];
	out[2] /= out[3];

	objPos[0] = out[0];
	objPos[1] = out[1];
	objPos[2] = out[2];

	return true;
}

GMath.normalizeVector = function(vect) 
{
	var len = vect[0] * vect[0] + vect[1] * vect[1] + vect[2] * vect[2];
	len = Math.sqrt(len);
	vect[0]/=len;
	vect[1]/=len;
	vect[2]/=len;
}

GMath.normalOfPlane = function(a, b, c) 
{
	a[0] = b[1] * c[2] - c[1] * b[2]; 
	a[1] = b[2] * c[0] - c[2] * b[0];
	a[2] = b[0] * c[1] - c[0] * b[1];		
}

GMath.matrixTranslate = function(matrix, x, y, z)
{
	var transl = [ 1,0,0,0, 0,1,0,0, 0,0,1,0, x,y,z,1];

	var mt = new Array(16);
	for (var a=0; a< 16;a++)
	{
		mt[a] = matrix[a];
	}

	GMath.matricesMultiply(transl , mt, matrix);
}

GMath.project = function(objx, objy, objz, modelview, projection, viewport, windowCoordinate)
{
      //Transformation vectors
      var fTempo = new Array(8);
      //Modelview transform
      fTempo[0]=modelview[0]*objx+modelview[4]*objy+modelview[8]*objz+modelview[12];  //w is always 1
      fTempo[1]=modelview[1]*objx+modelview[5]*objy+modelview[9]*objz+modelview[13];
      fTempo[2]=modelview[2]*objx+modelview[6]*objy+modelview[10]*objz+modelview[14];
      fTempo[3]=modelview[3]*objx+modelview[7]*objy+modelview[11]*objz+modelview[15];
      //Projection transform, the final row of projection matrix is always [0 0 -1 0]
      //so we optimize for that.
      fTempo[4]=projection[0]*fTempo[0]+projection[4]*fTempo[1]+projection[8]*fTempo[2]+projection[12]*fTempo[3];
      fTempo[5]=projection[1]*fTempo[0]+projection[5]*fTempo[1]+projection[9]*fTempo[2]+projection[13]*fTempo[3];
      fTempo[6]=projection[2]*fTempo[0]+projection[6]*fTempo[1]+projection[10]*fTempo[2]+projection[14]*fTempo[3];
      fTempo[7]=-fTempo[2];
      //The result normalizes between -1 and 1
      if(fTempo[7]==0.0)	//The w value
         return 0;
      fTempo[7]=1.0/fTempo[7];
      //Perspective division
      fTempo[4]*=fTempo[7];
      fTempo[5]*=fTempo[7];
      fTempo[6]*=fTempo[7];
      //Window coordinates
      //Map x, y to range 0-1
      windowCoordinate[0]=(fTempo[4]*0.5+0.5)*viewport[2]+viewport[0];
      windowCoordinate[1]=(fTempo[5]*0.5+0.5)*viewport[3]+viewport[1];
      //This is only correct when glDepthRange(0.0, 1.0)
      windowCoordinate[2]=(1.0+fTempo[6])*0.5;	//Between 0 and 1
      return 1;
}
  
  
GMath.frustrum = function(left, right,
                    bottom, top,
                    znear, zfar)
{
	var X = 2*znear/(right-left);
	var Y = 2*znear/(top-bottom);
	var A = (right+left)/(right-left);
	var B = (top+bottom)/(top-bottom);
	var C = -(zfar+znear)/(zfar-znear);
	var D = -2*zfar*znear/(zfar-znear);

	return [ X, 0, A, 0,
			 0, Y, B, 0,
			 0, 0, C, -1,
			 0, 0, D, 0];
}
			
GMath.lookAt = function(matrix, eyePosition3D, center3D, upVector3D)
{
   var forward = new Array( 0,0,0);
   var side = new Array(  0,0,0);
   var up = new Array( 0,0,0);
   var matrix2 = new Array(16);
   var resultMatrix = new Array(16);
   
   forward[0] = center3D[0] - eyePosition3D[0];
   forward[1] = center3D[1] - eyePosition3D[1];
   forward[2] = center3D[2] - eyePosition3D[2];
   
   GMath.normalizeVector(forward);
   
   GMath.normalOfPlane(side, forward, upVector3D);
   GMath.normalizeVector(side);

   GMath.normalOfPlane(up, side, forward);
   //------------------
   matrix[0] = side[0];
   matrix[4] = side[1];
   matrix[8] = side[2];
   matrix[12] = 0.0;
   //------------------
   matrix[1] = up[0];
   matrix[5] = up[1];
   matrix[9] = up[2];
   matrix[13] = 0.0;
   //------------------
   matrix[2] = -forward[0];
   matrix[6] = -forward[1];
   matrix[10] = -forward[2];
   matrix[14] = 0.0;
   //------------------
   matrix[3] = matrix[7] = matrix[11] = 0.0;
   matrix[15] = 1.0;

   GMath.matrixTranslate(matrix,-eyePosition3D[0], -eyePosition3D[1], -eyePosition3D[2]);
}    


GMath.matrixNullify = function(m)
{
	for (var a=0; a< 16; a++)
	{
		m[a] = 0;
	}
}

GMath.vecDot2= function(u,  v)
{
	return (u[0] * v[0] + u[1] * v[1] + u[2] * v[2]);
}

GMath.vecDot= function(ux, uy, uz , vx, vy, vz)
{
	return (ux * vx + uy * vy + uz * vz);
}

GMath.vecCross1= function(ux, uy, uz , vx, vy, vz ,  res)
{
	res[0] = (uy * vz - vy * uz);
	res[1] = (uz * vx - vz * ux);
	res[2] = (ux * vy - vx * uy);
}

GMath.vecCross2= function( u,v ,  res)
{
	res[0] = (u[1] * v[2] - v[1] * u[2]);
	res[1] = (u[2] * v[0] - v[2] * u[0]);
	res[2] = (u[0] * v[1] - v[0] * u[1]);
}


GMath.vecSub= function( u,v ,  res)
{
	res[0] = u[0] - v[0];
	res[1] = u[1] - v[1];
	res[2] = u[2] - v[2];
}

GMath.vecSub2= function( u, ui, v , vi,  res)
{
	res[0] = u[0+ui] - v[0+vi];
	res[1] = u[1+ui] - v[1+vi];
	res[2] = u[2+ui] - v[2+vi];
}

GMath.vecNull= function( v)
{
	return v[0] == 0 && v[1] == 0 && v[2] == 0;
}


GMath.rayIntersectsBounds= function(eye , ray,  bounds ,  loc )
{
	var dist = GMath.rayIntersectsTriangle(eye, ray, bounds, loc, 0,4,8);
	
	if (dist >= 0)
	{
		return dist;
	}
	dist = GMath.rayIntersectsTriangle(eye, ray, bounds, loc, 12,4,8);
	
	return dist;
}

GMath.rayIntersectsTriangle= function(eye , ray,  bounds ,  loc , i0, i1, i2)
{
	// u = GMath.tmpV1
	// v = GMath.tmpV2
	// n = GMath.tmpV3
	
	
	//Vector    u, v, n;             // triangle vectors
	//Vector    dir, w0, w;          // ray vectors
	var     r, a, b;             // params to calc ray-plane intersect
	// get triangle edge vectors and plane normal
	// i0 , 0 , 4 , 8
	GMath.vecSub2(bounds,i1 , bounds,i0 , GMath.tmpV1);
	GMath.vecSub2(bounds,i2 , bounds,i0 , GMath.tmpV2);
	
	//u = T.V1 - T.V0;
	//v = T.V2 - T.V0;
	//n = u * v;             // cross product
	GMath.vecCross2(GMath.tmpV1,GMath.tmpV2,GMath.tmpV3);
	
	if ( GMath.vecNull(GMath.tmpV3))            // triangle is degenerate
		return -1;                 // do not deal with this case

	//dir = R.P1 - R.P0;             // ray direction vector
	// dir == ray
	
	//w0 = R.P0 - T.V0;
	GMath.vecSub2(eye,0,bounds,i0, GMath.tmpW0);

  //a = -dot(n,w0);
	a = -GMath.vecDot2( GMath.tmpV3, GMath.tmpW0);
	//b = dot(n,dir);
	b = GMath.vecDot2( GMath.tmpV3, ray);
	
	if (Math.abs(b) < 1e-7) {     // ray is parallel to triangle plane
		if (a == 0)                // ray lies in triangle plane
			return -1;
		else return -1;             // ray disjoint from plane
	}

	// get intersect point of ray with triangle plane
	r = a / b;
	if (r < 0.0)                   // ray goes away from triangle
		return -1;                  // => no intersect
	// for a segment, also test if (r > 1.0) => no intersect

	loc[0] = eye[0] + r * ray[0];
	loc[1] = eye[1] + r * ray[1];
	loc[2] = eye[2] + r * ray[2];
	
	//*I = R.P0 + r * dir;           // intersect point of ray and plane

	// is I inside T?
	var    uu, uv, vv, wu, wv, D;
	
	uu = GMath.vecDot2(GMath.tmpV1,GMath.tmpV1);
	uv = GMath.vecDot2(GMath.tmpV1,GMath.tmpV2);
	vv = GMath.vecDot2(GMath.tmpV2,GMath.tmpV2);

	//w = *I - T.V0;        
	GMath.tmpV3[0] = loc[0] - bounds[i0+0];
	GMath.tmpV3[1] = loc[1] - bounds[i0+1];
	GMath.tmpV3[2] = loc[2] - bounds[i0+2];

	
	wu = GMath.vecDot2(GMath.tmpV3,GMath.tmpV1);
	wv = GMath.vecDot2(GMath.tmpV3,GMath.tmpV2);
	
	D = uv * uv - uu * vv;

	// get and test parametric coords
	var s, t;
	s = (uv * wv - vv * wu) / D;
	if (s < 0.0 || s > 1.0)        // I is outside T
		return -1;
	t = (uv * wu - uu * wv) / D;
	if (t < 0.0 || (s + t) > 1.0)  // I is outside T
		return -1;

	return Math.sqrt( (loc[0]-eye[0])*(loc[0]-eye[0]) + 
			(loc[1]-eye[1])*(loc[1]-eye[1]) + 
			(loc[2]-eye[2])*(loc[2]-eye[2])) ;

	
}


GMath.dist = function(ref0, ref) 
{
	var mat0 = ref0.matrix().getAsArray();
	var mat = ref.matrix().getAsArray();
	
	var x1 = mat0[12];
	var y1 = mat0[13];
	var z1 = mat0[14];
	var x2 = mat[12];
	var y2 = mat[13];
	var z2 = mat[14];		
	return Math.sqrt( (x1-x2)*(x1-x2)+ (y1-y2)*(y1-y2)+ (z1-z2)*(z1-z2));
}
