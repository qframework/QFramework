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

#import <Foundation/Foundation.h>
#import <OpenGLES/EAGL.h>
#import <OpenGLES/ES1/gl.h>
#import <OpenGLES/ES1/glext.h>
@class GameonModelRef;

void gluLookAt(GLfloat eyex, GLfloat eyey, GLfloat eyez,
               GLfloat centerx, GLfloat centery, GLfloat centerz,
               GLfloat upx, GLfloat upy, GLfloat upz);
GLint 
gluUnProject(GLfloat winx, GLfloat winy, GLfloat winz,
             const GLfloat modelMatrix[16], 
             const GLfloat projMatrix[16],
             const GLint viewport[4],
             GLfloat *objx, GLfloat *objy, GLfloat *objz);


int gluUnProjectD(float winx, float winy, float winz, 
                  float* model, int offsetM, 
                  float* proj, int offsetP, 
                  int* viewport, int offsetV, 
                  float* xyz, int offset);

//void glhLookAtf2(float matrix[], float eyePosition3D[], float center3D[], float upVector3D[]);

GLint 
gluProject(float objx, float objy, float objz,
           const float model[16], const float proj[16],
           const GLint viewport[4],
           float * winx, float * winy, float * winz);

void matrixIdentity(float*m);
void matrixScale(float* m, float x, float y, float z);
void matrixTranslate(float* m, float x, float y, float z);
void matrixRotate(float* m, float angle, float x, float y, float z);
void lookAtf(float* matrix, float* eyePosition, float* center, float* upVector);
void matricesMultiply(float* a, float* b,float* c);
void normalOfPlane(float* a, float* b,float* c);
void normalizeVector(float* vect);
float sgnf(float x);
float distRefs(GameonModelRef* ref0, GameonModelRef* ref);
float rayIntersectsBounds(float* eye , float* ray, float* bounds , float* loc );
float rayIntersectsTriangle(float* eye , float* ray, float* bounds , float* loc , int i0,int i1,int i2);
void matrixVecMultiply2(float* a, float* b, int bi, float* c , int ci);
void matrixNullify(float* m);
float vecDot2(float* u, float* v);
void vecCross1(float ux,float uy,float uz ,float vx,float vy,float vz , float* res);
void vecCross2(float* u,float*v , float* res);
void vecSub(float* u,float* v , float* res);
float vecDot(float ux,float uy,float uz ,float vx,float vy,float vz);
void vecSub2(float* u, int ui, float*v , int vi, float* res);
bool vecNull(float* v);
void frustrumMat(float left, float right,
			float bottom, float top,
			float znear, float zfar , float* projection);

@interface GMath : NSObject {

}

@end
