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

#import "GMath.h"
#import "GameonModelRef.h"

@implementation GMath

@end

#include <math.h>
#include <OpenGLES/ES1/gl.h>

/*
 ** Make m an identity matrix
 */

static float tmpV1[3];
static float tmpV2[3];
static float tmpV3[3];
//static float tmpV4[3];
//static float tmp[3];
static float tmpW0[3];

static void __gluMakeIdentityf(GLfloat m[16])
{
    m[0+4*0] = 1; m[0+4*1] = 0; m[0+4*2] = 0; m[0+4*3] = 0;
    m[1+4*0] = 0; m[1+4*1] = 1; m[1+4*2] = 0; m[1+4*3] = 0;
    m[2+4*0] = 0; m[2+4*1] = 0; m[2+4*2] = 1; m[2+4*3] = 0;
    m[3+4*0] = 0; m[3+4*1] = 0; m[3+4*2] = 0; m[3+4*3] = 1;
}

#define __glPi 3.14159265358979323846

static void normalize(float v[3])
{
    float r;
    
    r = sqrt( v[0]*v[0] + v[1]*v[1] + v[2]*v[2] );
    if (r == 0.0) return;
    
    v[0] /= r;
    v[1] /= r;
    v[2] /= r;
}

static void cross(float v1[3], float v2[3], float result[3])
{
    result[0] = v1[1]*v2[2] - v1[2]*v2[1];
    result[1] = v1[2]*v2[0] - v1[0]*v2[2];
    result[2] = v1[0]*v2[1] - v1[1]*v2[0];
}

void 
gluLookAt(GLfloat eyex, GLfloat eyey, GLfloat eyez, GLfloat centerx,
          GLfloat centery, GLfloat centerz, GLfloat upx, GLfloat upy,
          GLfloat upz)
{
    float forward[3], side[3], up[3];
    GLfloat m[4][4];
    
    forward[0] = centerx - eyex;
    forward[1] = centery - eyey;
    forward[2] = centerz - eyez;
    
    up[0] = upx;
    up[1] = upy;
    up[2] = upz;
    
    normalize(forward);
    
    /* Side = forward x up */
    cross(forward, up, side);
    normalize(side);
    
    /* Recompute up as: up = side x forward */
    cross(side, forward, up);
    
    __gluMakeIdentityf(&m[0][0]);
    m[0][0] = side[0];
    m[1][0] = side[1];
    m[2][0] = side[2];
    
    m[0][1] = up[0];
    m[1][1] = up[1];
    m[2][1] = up[2];
    
    m[0][2] = -forward[0];
    m[1][2] = -forward[1];
    m[2][2] = -forward[2];
    
    glMultMatrixf(&m[0][0]);
    glTranslatef(-eyex, -eyey, -eyez);
}

static void __gluMultMatrixVecd(const GLfloat matrix[16], const GLfloat in[4],
                                GLfloat out[4])
{
    int i;
    
    for (i=0; i<4; i++) {
        out[i] = 
	    in[0] * matrix[0*4+i] +
	    in[1] * matrix[1*4+i] +
	    in[2] * matrix[2*4+i] +
	    in[3] * matrix[3*4+i];
    }
}

/*
 ** Invert 4x4 matrix.
 ** Contributed by David Moore (See Mesa bug #6748)
 */
static int __gluInvertMatrixd(const GLfloat m[16], GLfloat invOut[16])
{
    float inv[16], det;
    int i;
    
    inv[0] =   m[5]*m[10]*m[15] - m[5]*m[11]*m[14] - m[9]*m[6]*m[15]
    + m[9]*m[7]*m[14] + m[13]*m[6]*m[11] - m[13]*m[7]*m[10];
    inv[4] =  -m[4]*m[10]*m[15] + m[4]*m[11]*m[14] + m[8]*m[6]*m[15]
    - m[8]*m[7]*m[14] - m[12]*m[6]*m[11] + m[12]*m[7]*m[10];
    inv[8] =   m[4]*m[9]*m[15] - m[4]*m[11]*m[13] - m[8]*m[5]*m[15]
    + m[8]*m[7]*m[13] + m[12]*m[5]*m[11] - m[12]*m[7]*m[9];
    inv[12] = -m[4]*m[9]*m[14] + m[4]*m[10]*m[13] + m[8]*m[5]*m[14]
    - m[8]*m[6]*m[13] - m[12]*m[5]*m[10] + m[12]*m[6]*m[9];
    inv[1] =  -m[1]*m[10]*m[15] + m[1]*m[11]*m[14] + m[9]*m[2]*m[15]
    - m[9]*m[3]*m[14] - m[13]*m[2]*m[11] + m[13]*m[3]*m[10];
    inv[5] =   m[0]*m[10]*m[15] - m[0]*m[11]*m[14] - m[8]*m[2]*m[15]
    + m[8]*m[3]*m[14] + m[12]*m[2]*m[11] - m[12]*m[3]*m[10];
    inv[9] =  -m[0]*m[9]*m[15] + m[0]*m[11]*m[13] + m[8]*m[1]*m[15]
    - m[8]*m[3]*m[13] - m[12]*m[1]*m[11] + m[12]*m[3]*m[9];
    inv[13] =  m[0]*m[9]*m[14] - m[0]*m[10]*m[13] - m[8]*m[1]*m[14]
    + m[8]*m[2]*m[13] + m[12]*m[1]*m[10] - m[12]*m[2]*m[9];
    inv[2] =   m[1]*m[6]*m[15] - m[1]*m[7]*m[14] - m[5]*m[2]*m[15]
    + m[5]*m[3]*m[14] + m[13]*m[2]*m[7] - m[13]*m[3]*m[6];
    inv[6] =  -m[0]*m[6]*m[15] + m[0]*m[7]*m[14] + m[4]*m[2]*m[15]
    - m[4]*m[3]*m[14] - m[12]*m[2]*m[7] + m[12]*m[3]*m[6];
    inv[10] =  m[0]*m[5]*m[15] - m[0]*m[7]*m[13] - m[4]*m[1]*m[15]
    + m[4]*m[3]*m[13] + m[12]*m[1]*m[7] - m[12]*m[3]*m[5];
    inv[14] = -m[0]*m[5]*m[14] + m[0]*m[6]*m[13] + m[4]*m[1]*m[14]
    - m[4]*m[2]*m[13] - m[12]*m[1]*m[6] + m[12]*m[2]*m[5];
    inv[3] =  -m[1]*m[6]*m[11] + m[1]*m[7]*m[10] + m[5]*m[2]*m[11]
    - m[5]*m[3]*m[10] - m[9]*m[2]*m[7] + m[9]*m[3]*m[6];
    inv[7] =   m[0]*m[6]*m[11] - m[0]*m[7]*m[10] - m[4]*m[2]*m[11]
    + m[4]*m[3]*m[10] + m[8]*m[2]*m[7] - m[8]*m[3]*m[6];
    inv[11] = -m[0]*m[5]*m[11] + m[0]*m[7]*m[9] + m[4]*m[1]*m[11]
    - m[4]*m[3]*m[9] - m[8]*m[1]*m[7] + m[8]*m[3]*m[5];
    inv[15] =  m[0]*m[5]*m[10] - m[0]*m[6]*m[9] - m[4]*m[1]*m[10]
    + m[4]*m[2]*m[9] + m[8]*m[1]*m[6] - m[8]*m[2]*m[5];
    
    det = m[0]*inv[0] + m[1]*inv[4] + m[2]*inv[8] + m[3]*inv[12];
    if (det == 0)
        return GL_FALSE;
    
    det = 1.0 / det;
    
    for (i = 0; i < 16; i++)
        invOut[i] = inv[i] * det;
    
    return GL_TRUE;
}

static void __gluMultMatricesd(const GLfloat a[16], const GLfloat b[16],
                               GLfloat r[16])
{
    int i, j;
    
    for (i = 0; i < 4; i++) {
        for (j = 0; j < 4; j++) {
            r[i*4+j] = 
            a[i*4+0]*b[0*4+j] +
            a[i*4+1]*b[1*4+j] +
            a[i*4+2]*b[2*4+j] +
            a[i*4+3]*b[3*4+j];
        }
    }
}

/*
GLint 
gluProject__(GLfloat objx, GLfloat objy, GLfloat objz, 
           const GLfloat modelMatrix[16], 
           const GLfloat projMatrix[16],
           const GLint viewport[4],
           GLfloat *winx, GLfloat *winy, GLfloat *winz)
{
    float in[4];
    float out[4];
    
    in[0]=objx;
    in[1]=objy;
    in[2]=objz;
    in[3]=1.0;
    __gluMultMatrixVecd(modelMatrix, in, out);
    __gluMultMatrixVecd(projMatrix, out, in);
    if (in[3] == 0.0) return(GL_FALSE);
    in[0] /= in[3];
    in[1] /= in[3];
    in[2] /= in[3];
    in[0] = in[0] * 0.5 + 0.5;
    in[1] = in[1] * 0.5 + 0.5;
    in[2] = in[2] * 0.5 + 0.5;
    
    in[0] = in[0] * viewport[2] + viewport[0];
    in[1] = in[1] * viewport[3] + viewport[1];
    
    *winx=in[0];
    *winy=in[1];
    *winz=in[2];
    return(GL_TRUE);
}

GLint 
gluUnProject__(GLfloat winx, GLfloat winy, GLfloat winz,
             const GLfloat modelMatrix[16], 
             const GLfloat projMatrix[16],
             const GLint viewport[4],
             GLfloat *objx, GLfloat *objy, GLfloat *objz)
{
    float finalMatrix[16];
    float in[4];
    float out[4];
    
    __gluMultMatricesd(modelMatrix, projMatrix, finalMatrix);
    if (!__gluInvertMatrixd(finalMatrix, finalMatrix)) return(GL_FALSE);
    
    in[0]=winx;
    in[1]=winy;
    in[2]=winz;
    in[3]=1.0;
    
    in[0] = (in[0] - viewport[0]) / viewport[2];
    in[1] = (in[1] - viewport[1]) / viewport[3];
    
    in[0] = in[0] * 2 - 1;
    in[1] = in[1] * 2 - 1;
    in[2] = in[2] * 2 - 1;
    
    __gluMultMatrixVecd(finalMatrix, in, out);
    if (out[3] == 0.0) return(GL_FALSE);
    out[0] /= out[3];
    out[1] /= out[3];
    out[2] /= out[3];
    *objx = out[0];
    *objy = out[1];
    *objz = out[2];
    return(GL_TRUE);
}
*/

////////

/*
 * Transform a point (column vector) by a 4x4 matrix.  I.e.  out = m * in
 * Input:  m - the 4x4 matrix
 *         in - the 4x1 vector
 * Output:  out - the resulting 4x1 vector.
 */
static void
transform_point(float out[4], const float m[16], const float in[4])
{
#define M(row,col)  m[col*4+row]
    out[0] =
    M(0, 0) * in[0] + M(0, 1) * in[1] + M(0, 2) * in[2] + M(0, 3) * in[3];
    out[1] =
    M(1, 0) * in[0] + M(1, 1) * in[1] + M(1, 2) * in[2] + M(1, 3) * in[3];
    out[2] =
    M(2, 0) * in[0] + M(2, 1) * in[1] + M(2, 2) * in[2] + M(2, 3) * in[3];
    out[3] =
    M(3, 0) * in[0] + M(3, 1) * in[1] + M(3, 2) * in[2] + M(3, 3) * in[3];
#undef M
}




/*
 * Perform a 4x4 matrix multiplication  (product = a x b).
 * Input:  a, b - matrices to multiply
 * Output:  product - product of a and b
 */
static void
matmul(float * product, const float * a, const float * b)
{
    /* This matmul was contributed by Thomas Malik */
    float temp[16];
    GLint i;
    
#define A(row,col)  a[(col<<2)+row]
#define B(row,col)  b[(col<<2)+row]
#define T(row,col)  temp[(col<<2)+row]
    
    /* i-te Zeile */
    for (i = 0; i < 4; i++) {
        T(i, 0) =
        A(i, 0) * B(0, 0) + A(i, 1) * B(1, 0) + A(i, 2) * B(2, 0) + A(i,
                                                                      3) *
        B(3, 0);
        T(i, 1) =
        A(i, 0) * B(0, 1) + A(i, 1) * B(1, 1) + A(i, 2) * B(2, 1) + A(i,
                                                                      3) *
        B(3, 1);
        T(i, 2) =
        A(i, 0) * B(0, 2) + A(i, 1) * B(1, 2) + A(i, 2) * B(2, 2) + A(i,
                                                                      3) *
        B(3, 2);
        T(i, 3) =
        A(i, 0) * B(0, 3) + A(i, 1) * B(1, 3) + A(i, 2) * B(2, 3) + A(i,
                                                                      3) *
        B(3, 3);
    }
    
#undef A
#undef B
#undef T
    memcpy(product, temp, 16 * sizeof(float));
}



/*
 * Compute inverse of 4x4 transformation matrix.
 * Code contributed by Jacques Leroy jle@star.be
 * Return GL_TRUE for success, GL_FALSE for failure (singular matrix)
 */
static GLboolean
invert_matrix(const float * m, float * out)
{
    /* NB. OpenGL Matrices are COLUMN major. */
#define SWAP_ROWS(a, b) { float *_tmp = a; (a)=(b); (b)=_tmp; }
#define MAT(m,r,c) (m)[(c)*4+(r)]
    
    float wtmp[4][8];
    float m0, m1, m2, m3, s;
    float *r0, *r1, *r2, *r3;
    
    r0 = wtmp[0], r1 = wtmp[1], r2 = wtmp[2], r3 = wtmp[3];
    
    r0[0] = MAT(m, 0, 0), r0[1] = MAT(m, 0, 1),
    r0[2] = MAT(m, 0, 2), r0[3] = MAT(m, 0, 3),
    r0[4] = 1.0, r0[5] = r0[6] = r0[7] = 0.0,
    r1[0] = MAT(m, 1, 0), r1[1] = MAT(m, 1, 1),
    r1[2] = MAT(m, 1, 2), r1[3] = MAT(m, 1, 3),
    r1[5] = 1.0, r1[4] = r1[6] = r1[7] = 0.0,
    r2[0] = MAT(m, 2, 0), r2[1] = MAT(m, 2, 1),
    r2[2] = MAT(m, 2, 2), r2[3] = MAT(m, 2, 3),
    r2[6] = 1.0, r2[4] = r2[5] = r2[7] = 0.0,
    r3[0] = MAT(m, 3, 0), r3[1] = MAT(m, 3, 1),
    r3[2] = MAT(m, 3, 2), r3[3] = MAT(m, 3, 3),
    r3[7] = 1.0, r3[4] = r3[5] = r3[6] = 0.0;
    
    /* choose pivot - or die */
    if (fabs(r3[0]) > fabs(r2[0]))
        SWAP_ROWS(r3, r2);
    if (fabs(r2[0]) > fabs(r1[0]))
        SWAP_ROWS(r2, r1);
    if (fabs(r1[0]) > fabs(r0[0]))
        SWAP_ROWS(r1, r0);
    if (0.0 == r0[0])
        return GL_FALSE;
    
    /* eliminate first variable     */
    m1 = r1[0] / r0[0];
    m2 = r2[0] / r0[0];
    m3 = r3[0] / r0[0];
    s = r0[1];
    r1[1] -= m1 * s;
    r2[1] -= m2 * s;
    r3[1] -= m3 * s;
    s = r0[2];
    r1[2] -= m1 * s;
    r2[2] -= m2 * s;
    r3[2] -= m3 * s;
    s = r0[3];
    r1[3] -= m1 * s;
    r2[3] -= m2 * s;
    r3[3] -= m3 * s;
    s = r0[4];
    if (s != 0.0) {
        r1[4] -= m1 * s;
        r2[4] -= m2 * s;
        r3[4] -= m3 * s;
    }
    s = r0[5];
    if (s != 0.0) {
        r1[5] -= m1 * s;
        r2[5] -= m2 * s;
        r3[5] -= m3 * s;
    }
    s = r0[6];
    if (s != 0.0) {
        r1[6] -= m1 * s;
        r2[6] -= m2 * s;
        r3[6] -= m3 * s;
    }
    s = r0[7];
    if (s != 0.0) {
        r1[7] -= m1 * s;
        r2[7] -= m2 * s;
        r3[7] -= m3 * s;
    }
    
    /* choose pivot - or die */
    if (fabs(r3[1]) > fabs(r2[1]))
        SWAP_ROWS(r3, r2);
    if (fabs(r2[1]) > fabs(r1[1]))
        SWAP_ROWS(r2, r1);
    if (0.0 == r1[1])
        return GL_FALSE;
    
    /* eliminate second variable */
    m2 = r2[1] / r1[1];
    m3 = r3[1] / r1[1];
    r2[2] -= m2 * r1[2];
    r3[2] -= m3 * r1[2];
    r2[3] -= m2 * r1[3];
    r3[3] -= m3 * r1[3];
    s = r1[4];
    if (0.0 != s) {
        r2[4] -= m2 * s;
        r3[4] -= m3 * s;
    }
    s = r1[5];
    if (0.0 != s) {
        r2[5] -= m2 * s;
        r3[5] -= m3 * s;
    }
    s = r1[6];
    if (0.0 != s) {
        r2[6] -= m2 * s;
        r3[6] -= m3 * s;
    }
    s = r1[7];
    if (0.0 != s) {
        r2[7] -= m2 * s;
        r3[7] -= m3 * s;
    }
    
    /* choose pivot - or die */
    if (fabs(r3[2]) > fabs(r2[2]))
        SWAP_ROWS(r3, r2);
    if (0.0 == r2[2])
        return GL_FALSE;
    
    /* eliminate third variable */
    m3 = r3[2] / r2[2];
    r3[3] -= m3 * r2[3], r3[4] -= m3 * r2[4],
    r3[5] -= m3 * r2[5], r3[6] -= m3 * r2[6], r3[7] -= m3 * r2[7];
    
    /* last check */
    if (0.0 == r3[3])
        return GL_FALSE;
    
    s = 1.0 / r3[3];		/* now back substitute row 3 */
    r3[4] *= s;
    r3[5] *= s;
    r3[6] *= s;
    r3[7] *= s;
    
    m2 = r2[3];			/* now back substitute row 2 */
    s = 1.0 / r2[2];
    r2[4] = s * (r2[4] - r3[4] * m2), r2[5] = s * (r2[5] - r3[5] * m2),
    r2[6] = s * (r2[6] - r3[6] * m2), r2[7] = s * (r2[7] - r3[7] * m2);
    m1 = r1[3];
    r1[4] -= r3[4] * m1, r1[5] -= r3[5] * m1,
    r1[6] -= r3[6] * m1, r1[7] -= r3[7] * m1;
    m0 = r0[3];
    r0[4] -= r3[4] * m0, r0[5] -= r3[5] * m0,
    r0[6] -= r3[6] * m0, r0[7] -= r3[7] * m0;
    
    m1 = r1[2];			/* now back substitute row 1 */
    s = 1.0 / r1[1];
    r1[4] = s * (r1[4] - r2[4] * m1), r1[5] = s * (r1[5] - r2[5] * m1),
    r1[6] = s * (r1[6] - r2[6] * m1), r1[7] = s * (r1[7] - r2[7] * m1);
    m0 = r0[2];
    r0[4] -= r2[4] * m0, r0[5] -= r2[5] * m0,
    r0[6] -= r2[6] * m0, r0[7] -= r2[7] * m0;
    
    m0 = r0[1];			/* now back substitute row 0 */
    s = 1.0 / r0[0];
    r0[4] = s * (r0[4] - r1[4] * m0), r0[5] = s * (r0[5] - r1[5] * m0),
    r0[6] = s * (r0[6] - r1[6] * m0), r0[7] = s * (r0[7] - r1[7] * m0);
    
    MAT(out, 0, 0) = r0[4];
    MAT(out, 0, 1) = r0[5], MAT(out, 0, 2) = r0[6];
    MAT(out, 0, 3) = r0[7], MAT(out, 1, 0) = r1[4];
    MAT(out, 1, 1) = r1[5], MAT(out, 1, 2) = r1[6];
    MAT(out, 1, 3) = r1[7], MAT(out, 2, 0) = r2[4];
    MAT(out, 2, 1) = r2[5], MAT(out, 2, 2) = r2[6];
    MAT(out, 2, 3) = r2[7], MAT(out, 3, 0) = r3[4];
    MAT(out, 3, 1) = r3[5], MAT(out, 3, 2) = r3[6];
    MAT(out, 3, 3) = r3[7];
    
    return GL_TRUE;
    
#undef MAT
#undef SWAP_ROWS
}



/* projection du point (objx,objy,obz) sur l'ecran (winx,winy,winz) */
GLint 
gluProject(float objx, float objy, float objz,
           const float model[16], const float proj[16],
           const GLint viewport[4],
           float * winx, float * winy, float * winz)
{
    /* matrice de transformation */
    float in[4], out[4];
    
    /* initilise la matrice et le vecteur a transformer */
    in[0] = objx;
    in[1] = objy;
    in[2] = objz;
    in[3] = 1.0;
    transform_point(out, model, in);
    transform_point(in, proj, out);
    
    /* d'ou le resultat normalise entre -1 et 1 */
    if (in[3] == 0.0)
        return GL_FALSE;
    
    in[0] /= in[3];
    in[1] /= in[3];
    in[2] /= in[3];
    
    /* en coordonnees ecran */
    *winx = viewport[0] + (1 + in[0]) * viewport[2] / 2;
    *winy = viewport[1] + (1 + in[1]) * viewport[3] / 2;
    /* entre 0 et 1 suivant z */
    *winz = (1 + in[2]) / 2;
    return GL_TRUE;
}



/* transformation du point ecran (winx,winy,winz) en point objet */
GLint 
gluUnProject(float winx, float winy, float winz,
             const float model[16], const float proj[16],
             const GLint viewport[4],
             float * objx, float * objy, float * objz)
{
    float m[16], A[16];
    float in[4], out[4];
    
    in[0] = (winx - viewport[0]) * 2 / viewport[2] - 1.0;
    in[1] = (winy - viewport[1]) * 2 / viewport[3] - 1.0;
    in[2] = 2 * winz - 1.0;
    in[3] = 1.0;
    
    matmul(A, proj, model);
    invert_matrix(A, m);
    
    transform_point(out, m, in);
    if (out[3] == 0.0)
        return GL_FALSE;
    *objx = out[0] / out[3];
    *objy = out[1] / out[3];
    *objz = out[2] / out[3];
    return GL_TRUE;
}





//////
/*
GLint 
gluUnProject4(GLfloat winx, GLfloat winy, GLfloat winz, GLfloat clipw,
              const GLfloat modelMatrix[16], 
              const GLfloat projMatrix[16],
              const GLint viewport[4],
              GLfloat nearVal, GLfloat farVal,		    
              GLfloat *objx, GLfloat *objy, GLfloat *objz,
              GLfloat *objw)
{
    float finalMatrix[16];
    float in[4];
    float out[4];
    
    __gluMultMatricesd(modelMatrix, projMatrix, finalMatrix);
    if (!__gluInvertMatrixd(finalMatrix, finalMatrix)) return(GL_FALSE);
    
    in[0]=winx;
    in[1]=winy;
    in[2]=winz;
    in[3]=clipw;
    
    in[0] = (in[0] - viewport[0]) / viewport[2];
    in[1] = (in[1] - viewport[1]) / viewport[3];
    in[2] = (in[2] - nearVal) / (farVal - nearVal);
    
    in[0] = in[0] * 2 - 1;
    in[1] = in[1] * 2 - 1;
    in[2] = in[2] * 2 - 1;
    
    __gluMultMatrixVecd(finalMatrix, in, out);
    if (out[3] == 0.0) return(GL_FALSE);
    *objx = out[0];
    *objy = out[1];
    *objz = out[2];
    *objw = out[3];
    return(GL_TRUE);
}
*/
/*
void 
gluPickMatrix(GLfloat x, GLfloat y, GLfloat deltax, GLfloat deltay,
              GLint viewport[4])
{
    if (deltax <= 0 || deltay <= 0) { 
        return;
    }
    
    glTranslatef((viewport[2] - 2 * (x - viewport[0])) / deltax,
                 (viewport[3] - 2 * (y - viewport[1])) / deltay, 0);
    glScalef(viewport[2] / deltax, viewport[3] / deltay, 1.0);
}
*/

//static float mth_fPI = 3.14159265f;
/*
static float mth_vNul3f[] = {0.0f, 0.0f, 0.0f};
static float mth_vX3f[] = {1.0f, 0.0f, 0.0f};
static float mth_vY3f[] = {0.0f, 1.0f, 0.0f};
static float mth_vZ3f[] = {0.0f, 0.0f, 1.0f};
static float mth_mIdentity44f[] = 
{1.0f, 0.0f, 0.0f, 0.0f,
    0.0f, 1.0f, 0.0f, 0.0f,
    0.0f, 0.0f, 1.0f, 0.0f,
    0.0f, 0.0f, 0.0f, 1.0f};
*/

float mTempGluUnProjectData[40]; 
int     mTemp_m   = 0; 
int     mTemp_A   = 16; 
int     mTemp_in  = 32; 
int     mTemp_out = 36; 


int gluUnProjectD(float winx, float winy, float winz, 
                               float* model, int offsetM, 
                               float* proj, int offsetP, 
                               int* viewport, int offsetV, 
                               float* xyz, int offset) 
{ 
    /* Transformation matrices */ 
    //   float[] m = new float[16], A = new float[16]; 
    //   float[] in = new float[4], out = new float[4]; 
    /* Normalize between -1 and 1 */ 


    mTempGluUnProjectData[mTemp_in]   = (winx - viewport[offsetV]) * 
    2 / (float)viewport[offsetV+2] - 1.0f; 
    mTempGluUnProjectData[mTemp_in+1] = (winy - viewport[offsetV+1]) * 
    2 / (float)viewport[offsetV+3] - 1.0f; 
    mTempGluUnProjectData[mTemp_in+2] = 2 * winz - 1.0f; 
    mTempGluUnProjectData[mTemp_in+3] = 1.0f; 
 
 
    /* Get the inverse */ 
    
    __gluMultMatricesd(&proj[offsetP ], &model[offsetM] , 
                      &mTempGluUnProjectData[mTemp_A]); 
    
    __gluInvertMatrixd(&mTempGluUnProjectData[mTemp_A ],
                       &mTempGluUnProjectData[mTemp_m]); 
    
    __gluMultMatrixVecd(&mTempGluUnProjectData[mTemp_m],
                      &mTempGluUnProjectData[mTemp_in],
                        &mTempGluUnProjectData[mTemp_out]); 
    

    if (mTempGluUnProjectData[mTemp_out+3] == 0.0) 
        return 0; 
    
    xyz[offset]  =  mTempGluUnProjectData[mTemp_out  ] / mTempGluUnProjectData[mTemp_out+3]; 
    xyz[offset+1] = mTempGluUnProjectData[mTemp_out+1] / mTempGluUnProjectData[mTemp_out+3]; 
    xyz[offset+2] = mTempGluUnProjectData[mTemp_out+2] / mTempGluUnProjectData[mTemp_out+3]; 
    return 1; 
} 

 /*
void NormalizeVector(float vect[]) {
    float len = vect[0] * vect[0] + vect[1] * vect[1] + vect[2] * vect[2];
    len = (float)sqrt(len);
    vect[0]/=len;
    vect[1]/=len;
    vect[2]/=len;
    
}



void ComputeNormalOfPlane(float* a, float* b,
                                        float* c) {
    a[0] = b[1] * c[2] - c[1] * b[2]; 
    a[1] = b[2] * c[0] - c[2] * b[0];
    a[2] = b[0] * c[1] - c[0] * b[1];		
}
void gluTranslateM(float* matrix, float x, float y, float z)
{
    float transl[16] = { 1,0,0,0, 0,1,0,0, 0,0,1,0, x,y,z,1};
    //__gluMakeIdentityf(transl);
    float A[16]; 
    memcpy( A, matrix, sizeof(float)*16);
    
    __gluMultMatricesd(transl , A, matrix);
}

void glhLookAtf2(float* matrix , float* eyePosition3D float* center3D float* upVector3D)
{
    float forward[3] = { 0,0,0};
    float side[3] = { 0,0,0};
    float up[3] = {0,0,0};
    //------------------
    forward[0] = center3D[0] - eyePosition3D[0];
    forward[1] = center3D[1] - eyePosition3D[1];
    forward[2] = center3D[2] - eyePosition3D[2];
    
    NormalizeVector(forward);
    //------------------
    //Side = forward x up
    
    ComputeNormalOfPlane(side, forward, upVector3D);
    NormalizeVector(side);
    //------------------
    //Recompute up as: up = side x forward
    ComputeNormalOfPlane(up, side, forward);
    //------------------
    matrix[0] = side[0];
    matrix[4] = side[1];
    matrix[8] = side[2];
    matrix[12] = 0.0f;
    //------------------
    matrix[1] = up[0];
    matrix[5] = up[1];
    matrix[9] = up[2];
    matrix[13] = 0.0f;
    //------------------
    matrix[2] = -forward[0];
    matrix[6] = -forward[1];
    matrix[10] = -forward[2];
    matrix[14] = 0.0f;
    //------------------
    matrix[3] = matrix[7] = matrix[11] = 0.0f;
    matrix[15] = 1.0f;
    //------------------

    gluTranslateM(matrix,-eyePosition3D[0], -eyePosition3D[1], -eyePosition3D[2]);
    //Matrix.translateM(matrix, 0,-eyePosition3D[0], -eyePosition3D[1], -eyePosition3D[2]);
    //------------------
}    

*/
const float mPI = 3.14159265f;

const float mIdentity[16] = {
     1.0f, 0.0f, 0.0f, 0.0f,
     0.0f, 1.0f, 0.0f, 0.0f,
     0.0f, 0.0f, 1.0f, 0.0f,
     0.0f, 0.0f, 0.0f, 1.0f};

void normalizeVector(float* vect) {
    float len = vect[0] * vect[0] + vect[1] * vect[1] + vect[2] * vect[2];
    len = (float)sqrt(len);
    vect[0]/=len;
    vect[1]/=len;
    vect[2]/=len;
    
}


void normalOfPlane(float* a, float* b,float* c) 
{
    a[0] = b[1] * c[2] - c[1] * b[2]; 
    a[1] = b[2] * c[0] - c[2] * b[0];
    a[2] = b[0] * c[1] - c[0] * b[1];		
}

void matricesMultiply(float* a, float* b,float* c)
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



void lookAtf(float* matrix, float* eyePosition, float* center, float* upVector)
{
   float forward[3] = { 0,0,0};
   float side[3] = { 0,0,0};
   float up[3] = {0,0,0};

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

void matrixRotate(float* m, float angle, float x, float y, float z)
{
    int a;
    angle *= (float) (mPI / 180.0f);

    float c = (float)cos(angle);
    float s = (float)sin(angle);
    float _c = 1.0f - c;

    float v[4];
    v[0] = x; v[1] = y; v[2] = z;
    normalizeVector(v);
    x = v[0]; y = v[1]; z = v[2];

    float mat[16];

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

    float res[16];
    matricesMultiply(mat, m, res);
    for (a=0; a< 16; a++)
    {
    m[a] = res[a];
    }
    
}

void matrixTranslate(float* m, float x, float y, float z)
{
    float transl[16];
    transl[0]=1;
    transl[1]=0;
    transl[2]=0;
    transl[3]=0;
    transl[4]=0;
    transl[5]=1;
    transl[6]=0;
    transl[7]=0;
    transl[8]=0;
    transl[9]=0;
    transl[10]=1;
    transl[11]=0; 
    transl[12]=x;
    transl[13]=y;
    transl[14]=z;
    transl[15]=1;
    //__gluMakeIdentityf(transl);
    float A[16];
    for (int a=0; a< 16;a++)
    {
        A[a] = m[a];
    }

    matricesMultiply(transl , A, m);
    
}

void matrixScale(float* m, float x, float y, float z)
{
    float scale[16];
    int a;
    scale[0] = x;
    scale[1] = 0;
    scale[2] = 0;
    scale[3] = 0;
    scale[4] = 0;
    scale[5] = y;
    scale[6] = 0;
    scale[7] = 0; 
    scale[8] = 0;
    scale[9] = 0;
    scale[10] = z;
    scale[11] = 0; 
    scale[12] = 0;
    scale[13] = 0;
    scale[14] = 0;
    scale[15] = 1;
    
    float A[16];
    for (a=0; a< 16;a++)
    {
        A[a] = m[a];
    }

    matricesMultiply(scale , A, m);
    
}

void matrixIdentity(float*m)
{
    for (int a=0; a< 16; a++)
    {
        m[a] = mIdentity[a];
    }
}

void matrixNullify(float* m)
{
    for (int a=0; a< 16; a++)
    {
        m[a] = 0;
    }
}

float vecDot2(float* u, float* v)
{
    return (u[0] * v[0] + u[1] * v[1] + u[2] * v[2]);
}

float vecDot(float ux,float uy,float uz ,float vx,float vy,float vz)
{
    return (ux * vx + uy * vy + uz * vz);
}

void vecCross1(float ux,float uy,float uz ,float vx,float vy,float vz , float* res)
{
    res[0] = (uy * vz - vy * uz);
    res[1] = (uz * vx - vz * ux);
    res[2] = (ux * vy - vx * uy);
}

void vecCross2(float* u,float*v , float* res)
{
    res[0] = (u[1] * v[2] - v[1] * u[2]);
    res[1] = (u[2] * v[0] - v[2] * u[0]);
    res[2] = (u[0] * v[1] - v[0] * u[1]);
}


void vecSub(float* u,float* v , float* res)
{
    res[0] = u[0] - v[0];
    res[1] = u[1] - v[1];
    res[2] = u[2] - v[2];
}

void vecSub2(float* u, int ui, float*v , int vi, float* res)
{
    res[0] = u[0+ui] - v[0+vi];
    res[1] = u[1+ui] - v[1+vi];
    res[2] = u[2+ui] - v[2+vi];
}

bool vecNull(float* v)
{
    return v[0] == 0 && v[1] == 0 && v[2] == 0;
}	

float rayIntersectsBounds(float* eye , float* ray, float* bounds , float* loc )
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

float rayIntersectsTriangle(float* eye , float* ray, float* bounds , float* loc , int i0,int i1,int i2)
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
    
    if (fabs(b) < 1e-7f) {     // ray is parallel to triangle plane
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
    return (float)sqrt( (loc[0]-eye[0])*(loc[0]-eye[0]) + 
            (loc[1]-eye[1])*(loc[1]-eye[1]) + 
            (loc[2]-eye[2])*(loc[2]-eye[2])) ;
    
}


float distRefs(GameonModelRef* ref0, GameonModelRef* ref) {
    float* matrix = [ref0 matrix];
    float* matrix2 = [ref matrix];
    float x1 = matrix[12];
    float y1 = matrix[13];
    float z1 = matrix[14];
    float x2 = matrix2[12];
    float y2 = matrix2[13];
    float z2 = matrix2[14];		
    return (float)sqrt( (x1-x2)*(x1-x2)+ (y1-y2)*(y1-y2)+ (z1-z2)*(z1-z2));
}	

void matrixVecMultiply2(float* a, float* b, int bi, float* c , int ci)
{
    int i, k ;//, d;
    
    for (i = 0; i < 4; i++)
    {
        c[i+ci] = 0.0f;
        for (k = 0; k < 4; k++) 
        {
            c[i+ci] += a[4 * k + i] * b[k + bi];
        }
    }
    
}

void frustrumMat(float left, float right,
			float bottom, float top,
			float znear, float zfar , float* projection)
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
