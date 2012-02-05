#include "serverkoode.h"
#include "boost/lexical_cast.hpp"

namespace gameon {


  ServerkoOde::ServerkoOde() :
    mInit(false)
  {
    
  }

  ServerkoOde::~ServerkoOde()
  {
    if (mInit)
    {
      dJointGroupDestroy (mContactgroup);
      dSpaceDestroy (mSpace);
      dWorldDestroy (mWorld);
      dCloseODE();
    }
  }

  void ServerkoOde::init(const std::string& g)
  {
    if (!mInit)
    {
      mInit = true;
      dInitODE ();

    // create world
      mWorld = dWorldCreate ();
      mSpace = dHashSpaceCreate (0);
      dWorldSetGravity (mWorld,0,0,  boost::lexical_cast<float>(g));
      dWorldSetCFM (mWorld,(dReal)1e-5);
      mContactgroup = dJointGroupCreate (0);
    }
  }

  void ServerkoOde::createSphere(const std::string& name, const std::string& mass, const std::string& rad)
  {

    OdeObjectMap::iterator iter = mObjectsMap.find(name);
    if (iter != mObjectsMap.end() )
    {
      return;
    }

    OdeObject* obj = new OdeObject();
    obj->mID = name;
    float fmass = boost::lexical_cast<float>(mass);
    float frad = boost::lexical_cast<float>(rad);

    obj->mBody = dBodyCreate (mWorld);
    obj->mGeom = dCreateSphere (mSpace,frad);
    dMassSetSphere (&obj->mMass,1,fmass);
    dBodySetMass (obj->mBody,&obj->mMass);
    dGeomSetBody (obj->mGeom,obj->mBody);

    mObjectsMap.insert( OdeObjectPair( name, obj) );
    mObjectsVec.push_back(obj);
  }

  void ServerkoOde::createPlane(const std::string& name, const std::string& a, const std::string& b, const std::string& c, const std::string& d)
  {
    OdeObjectMap::iterator iter = mObjectsMap.find(name);
    if (iter != mObjectsMap.end() )
    {
      return;
    }

    OdeObject* obj = new OdeObject();
    obj->mID = name;
    float fa = boost::lexical_cast<float>(a);
    float fb = boost::lexical_cast<float>(b);
    float fc = boost::lexical_cast<float>(c);
    float fd = boost::lexical_cast<float>(d);

    obj->mGeom = dCreatePlane  (mSpace,fa,fb,fc,fd);

    mObjectsMap.insert( OdeObjectPair( name, obj) );
    mObjectsVec.push_back(obj);
  }

  void ServerkoOde::setBodyPosition(const std::string& name, const std::string& x, const std::string& y, const std::string& z)
  {
    OdeObjectMap::iterator iter = mObjectsMap.find(name);
    if (iter == mObjectsMap.end() )
    {
      return;
    }

    float fx = boost::lexical_cast<float>(x);
    float fy = boost::lexical_cast<float>(y);
    float fz = boost::lexical_cast<float>(z);


    //dBodySetPosition (iter->second->mBody,x,y,z);
  }

  // create object repo
  // hash 
  // create timer event in script session
  // fire ode event handler 
} // namespace gameon
