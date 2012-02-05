#ifndef ODE_OBJECT_H
#define ODE_OBJECT_H

#include <ode/ode.h>
#include <string>
#include <map>

namespace gameon {


  class OdeObject
  {

  public:
    OdeObject();
    ~OdeObject();

    std::string mID;
      dBodyID   mBody;	
      dGeomID   mGeom;	
      dMass     mMass;
  };


  typedef std::map<std::string, OdeObject*> OdeObjectMap;
  typedef std::pair<std::string, OdeObject*> OdeObjectPair;
} // namespace gameon

#endif // HTTP_CONNECTION_H


