#ifndef SERVERKO_ODE_H
#define SERVERKO_ODE_H

#include <ode/ode.h>
#include <string>
#include <map>
#include <vector>
#include "odeobject.h"

namespace gameon {


  class ServerkoOde
  {

  public:
    ServerkoOde();
    ~ServerkoOde();

    void init(const std::string& g);
    void createSphere(const std::string& name, const std::string& mass, const std::string& rad);
    void createPlane(const std::string& name, const std::string& a, const std::string& b, const std::string& c, const std::string& d);
    void setBodyPosition(const std::string& name, const std::string& x, const std::string& y, const std::string& z);
  public:
    bool      mInit;

      dWorldID  mWorld;
      dSpaceID  mSpace;
      dJointGroupID mContactgroup;
      

      OdeObjectMap  mObjectsMap;
      std::vector<OdeObject*>  mObjectsVec;
  };


} // namespace gameon

#endif // HTTP_CONNECTION_H


