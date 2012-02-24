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

package com.qframework.core;

import java.lang.Math;

public class GMath {


	static float[] tmpV1=new float[3];
	static float[] tmpV2=new float[3];
	static float[] tmpV3=new float[3];
	static float[] tmpV4=new float[3];
	static float[] tmpW=new float[3];
	static float[] tmpW0=new float[3];
	
	static public float mPI = 3.14159265f;

	static float mIdentity[] = {
		 1.0f, 0.0f, 0.0f, 0.0f,
		 0.0f, 1.0f, 0.0f, 0.0f,
		 0.0f, 0.0f, 1.0f, 0.0f,
		 0.0f, 0.0f, 0.0f, 1.0f};
 
    public static void normalizeVector(float vect[]) {
    	float len = vect[0] * vect[0] + vect[1] * vect[1] + vect[2] * vect[2];
    	len = (float)Math.sqrt(len);
    	vect[0]/=len;
    	vect[1]/=len;
    	vect[2]/=len;
    	
    }
    
    
    public static void normalOfPlane(float[] a, float[] b,
			float[] c) {
		a[0] = b[1] * c[2] - c[1] * b[2]; 
		a[1] = b[2] * c[0] - c[2] * b[0];
		a[2] = b[0] * c[1] - c[0] * b[1];		
	}

    static void matricesMultiply(float[] a, float[] b,
    		float[] c)
    {
        int i, j , k;
        for (i = 0; i < 4; i++)
          for (j = 0; j < 4; j++) {
            int d = 4 * i + j;
            c[d] = 0.0f;
            for (k = 0; k < 4; k++) {
              c[d] += a[4 * i + k] * b[4 * k + j];
            }
          }
        
    }
  
    static void matrixVecMultiply(float[] a, float[] b,
    		float[] c)
    {
        int i, j , k;
        
        for (i = 0; i < 4; i++)
          for (j = 0; j < 1; j++) {
            int d = 4 * i + j;
            c[d] = 0.0f;
            for (k = 0; k < 4; k++) {
              c[d] += a[4 * i + k] * b[4 * k + j];
            }
          }
        
    }
    
    
    static void matrixVecMultiply2(float[] a, float[] b, int bi,
    		float[] c , int ci)
    {
        int i, k , d;
        
        for (i = 0; i < 4; i++)
        {
            c[i+ci] = 0.0f;
            for (k = 0; k < 4; k++) 
            {
              c[i+ci] += a[4 * k + i] * b[k + bi];
            }
        }
        
    }
    
    
    
    public static void frustrum(float left, float right,
    		float bottom, float top,
    		float znear, float zfar , float[] projection)
    {
    	float X = 2*znear/(right-left);
    	float Y = 2*znear/(top-bottom);
    	float A = (right+left)/(right-left);
    	float B = (top+bottom)/(top-bottom);
    	float C = -(zfar+znear)/(zfar-znear);
    	float D = -2*zfar*znear/(zfar-znear);

    	projection[0] = X;
    	projection[1] = 0;
    	projection[2] = A;
    	projection[3] = 0;
    	
    	projection[4] = 0;
    	projection[5] = Y;
    	projection[6] = B;
    	projection[7] = 0;
    	
    	projection[8] = 0;
    	projection[9] = 0;
    	projection[10] = C;
    	projection[11] = -1;
    	
    	projection[12] = 0;
    	projection[13] = 0;
    	projection[14] = D;
    	projection[15] = 0;

    }

    public static void lookAtf(float matrix[], float eyePosition[], float center[], float upVector[])
    {
       float forward[] = { 0,0,0};
       float side[] = { 0,0,0};
       float up[] = {0,0,0};

       forward[0] = center[0] - eyePosition[0];
       forward[1] = center[1] - eyePosition[1];
       forward[2] = center[2] - eyePosition[2];
       
       normalizeVector(forward);
       
       normalOfPlane(side, forward, upVector);
       normalizeVector(side);

       normalOfPlane(up, side, forward);

       matrix[0] = side[0];
       matrix[4] = side[1];
       matrix[8] = side[2];
       matrix[12] = 0.0f;

       matrix[1] = up[0];
       matrix[5] = up[1];
       matrix[9] = up[2];
       matrix[13] = 0.0f;

       matrix[2] = -forward[0];
       matrix[6] = -forward[1];
       matrix[10] = -forward[2];
       matrix[14] = 0.0f;
       //------------------
       matrix[3] = matrix[7] = matrix[11] = 0.0f;
       matrix[15] = 1.0f;


       matrixTranslate(matrix,-eyePosition[0], -eyePosition[1], -eyePosition[2]);
       
    }    
	
    static public void matrixRotate(float[] m, float angle, float x, float y, float z)
    {
    	
	  angle *= (float) (Math.PI / 180.0f);

	  float c = (float)Math.cos(angle);
	  float s = (float)Math.sin(angle);
	  float _c = 1.0f - c;

	  float[] v = new float[4];
	  v[0] = x; v[1] = y; v[2] = z;
	  normalizeVector(v);
	  x = v[0]; y = v[1]; z = v[2];

	  float[] mat = new float[16];

	  mat[0] = x * x * _c + c;
	  mat[4] = x * y * _c - z * s;
	  mat[8] = x * z * _c + y * s;
	  mat[12] = 0.0f;

	  mat[1] = y * x * _c + z * s;
	  mat[5] = y * y * _c + c;
	  mat[9] = y * z * _c - x * s;
	  mat[13] = 0.0f;

	  mat[2] = z * x * _c - y * s;
	  mat[6] = z * y * _c + x * s;
	  mat[10] = z * z * _c + c;
	  mat[14] = 0.0f;

	  mat[3] = 0.0f;
	  mat[7] = 0.0f;
	  mat[11] = 0.0f;
	  mat[15] = 1.0f;

      float res[] = new float[16];
      matricesMultiply(mat, m, res);
      for (int a=0; a< 16; a++)
      {
      	m[a] = res[a];
      }
    	
    }
    static public void matrixTranslate(float[] m, float x, float y, float z)
    {
    	
    	float[] transl = { 1,0,0,0, 0,1,0,0, 0,0,1,0, x,y,z,1};
        //__gluMakeIdentityf(transl);
    	float[] A = new float[16];
        for (int a=0; a< 16;a++)
        {
            A[a] = m[a];
        }

        matricesMultiply(transl , A, m);
    	/*
    	m[12] += x;
    	m[13] += y;
    	m[14] += z;
        int n=0;
        */
    }
    
    static public void matrixScale(float[] m, float x, float y, float z)
    {
    	
    	float[] scale = { x,0,0,0, 0,y,0,0, 0,0,z,0, 0,0,0,1};
    	float[] A = new float[16];
        for (int a=0; a< 16;a++)
        {
            A[a] = m[a];
        }

        matricesMultiply(scale , A, m);
    	/*
    	m[0] *= x;
    	m[5] *= y;
    	m[10] *= z;
    	*/
    }
    
    static public void matrixIdentity(float []m)
    {
    	for (int a=0; a< 16; a++)
    	{
    		m[a] = mIdentity[a];
    	}
    }
    
    static public void matrixNullify(float []m)
    {
    	for (int a=0; a< 16; a++)
    	{
    		m[a] = 0;
    	}
    }

    static float vecDot2(float[]u, float[] v)
    {
    	return (u[0] * v[0] + u[1] * v[1] + u[2] * v[2]);
    }
    
    static float vecDot(float ux,float uy,float uz ,float vx,float vy,float vz)
    {
    	return (ux * vx + uy * vy + uz * vz);
    }

    static void vecCross1(float ux,float uy,float uz ,float vx,float vy,float vz , float[] res)
    {
    	res[0] = (uy * vz - vy * uz);
    	res[1] = (uz * vx - vz * ux);
    	res[2] = (ux * vy - vx * uy);
    }

    static void vecCross2(float[] u,float[]v , float[] res)
    {
    	res[0] = (u[1] * v[2] - v[1] * u[2]);
    	res[1] = (u[2] * v[0] - v[2] * u[0]);
    	res[2] = (u[0] * v[1] - v[0] * u[1]);
    }

    
    static void vecSub(float[] u,float[]v , float[] res)
    {
    	res[0] = u[0] - v[0];
    	res[1] = u[1] - v[1];
    	res[2] = u[2] - v[2];
    }

    static void vecSub2(float[] u, int ui, float[]v , int vi, float[] res)
    {
    	res[0] = u[0+ui] - v[0+vi];
    	res[1] = u[1+ui] - v[1+vi];
    	res[2] = u[2+ui] - v[2+vi];
    }
    
    static boolean vecNull(float[] v)
    {
    	return v[0] == 0 && v[1] == 0 && v[2] == 0;
    }
    
    
    static float rayIntersectsBounds(float eye[] , float[]ray, float[] bounds , float[] loc )
    {
    	float dist = -1;
    	dist = rayIntersectsTriangle(eye, ray, bounds, loc, 0,4,8);
    	if (dist >= 0)
		{
    		return dist;
		}
		
		dist = rayIntersectsTriangle(eye, ray, bounds, loc, 12,4,8);
		return dist;
    }
    
    static float rayIntersectsTriangle(float eye[] , float[]ray, float[] bounds , float[] loc , int i0,int i1,int i2)
    {
    	// u = tmpv1
    	// v = tmpv2
    	// n = tmpv3
    	
    	
    	//Vector    u, v, n;             // triangle vectors
        //Vector    dir, w0, w;          // ray vectors
        float     r, a, b;             // params to calc ray-plane intersect
        // get triangle edge vectors and plane normal
        // i0 , 0 , 4 , 8
        vecSub2(bounds,i1 , bounds,i0 , tmpV1);
        vecSub2(bounds,i2 , bounds,i0 , tmpV2);
        
        //u = T.V1 - T.V0;
        //v = T.V2 - T.V0;
        //n = u * v;             // cross product
        vecCross2(tmpV1,tmpV2,tmpV3);
        
        if ( vecNull(tmpV3))            // triangle is degenerate
            return -1;                 // do not deal with this case

        //dir = R.P1 - R.P0;             // ray direction vector
        // dir == ray
        
        //w0 = R.P0 - T.V0;
        vecSub2(eye,0,bounds,i0, tmpW0);

      //a = -dot(n,w0);
        a = -vecDot2( tmpV3, tmpW0);
        //b = dot(n,dir);
        b = vecDot2( tmpV3, ray);
        
        if (Math.abs(b) < 1e-7f) {     // ray is parallel to triangle plane
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
        float    uu, uv, vv, wu, wv, D;
        
        uu = vecDot2(tmpV1,tmpV1);
        uv = vecDot2(tmpV1,tmpV2);
        vv = vecDot2(tmpV2,tmpV2);

        //w = *I - T.V0;        
        tmpV3[0] = loc[0] - bounds[i0+0];
        tmpV3[1] = loc[1] - bounds[i0+1];
        tmpV3[2] = loc[2] - bounds[i0+2];

        
        wu = vecDot2(tmpV3,tmpV1);
        wv = vecDot2(tmpV3,tmpV2);
        
        D = uv * uv - uu * vv;

        // get and test parametric coords
        float s, t;
        s = (uv * wv - vv * wu) / D;
        if (s < 0.0 || s > 1.0)        // I is outside T
            return -1;
        t = (uv * wu - uu * wv) / D;
        if (t < 0.0 || (s + t) > 1.0)  // I is outside T
            return -1;

        // calculate dist
        return (float)Math.sqrt( (loc[0]-eye[0])*(loc[0]-eye[0]) + 
        		(loc[1]-eye[1])*(loc[1]-eye[1]) + 
        		(loc[2]-eye[2])*(loc[2]-eye[2])) ;
        
    }


	public static float dist(GameonModelRef ref0, GameonModelRef ref) {
		float[] matrix = ref0.matrix();
		float[] matrix2 = ref.matrix();
		float x1 = matrix[12];
		float y1 = matrix[13];
		float z1 = matrix[14];
		float x2 = matrix2[12];
		float y2 = matrix2[13];
		float z2 = matrix2[14];		
		return (float)Math.sqrt( (x1-x2)*(x1-x2)+ (y1-y2)*(y1-y2)+ (z1-z2)*(z1-z2));
	}
}
