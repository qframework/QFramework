#include "SQLHelper.h"
//#include "../servermanager/HandlerSQLL.h"
#include <stdio.h> 
#include <stdarg.h> 

ServerOutCallback SQLHelper::mpFunc = NULL;

bool SQLHelper::get(std::vector<std::string>& retVals,
                        const char* pTable, 
                        const char* pField,  
                        const char* pFilter, 
                        const char* pFilterVal)
{
  if (pTable == NULL || pField == NULL)
  {
    return false;
  }
  
  // SELECT pField FROM pTable WHERE pFilter = pFilterVal;

  //HandlerSQLL hsql;
  std::string sqlstr;
  sqlstr =  "SELECT ";
  sqlstr += pField;
  sqlstr += " FROM ";
  sqlstr += pTable;
  if (pFilter && pFilterVal)
  {
    sqlstr +=" WHERE ";
    sqlstr += pFilter;
    sqlstr +=" = '";
    sqlstr += pFilterVal;
    sqlstr +="';";
  }
  else
  {
    sqlstr += ";";
  }


  return false; //hsql.execSQL( sqlstr, &retVals );;
}

bool SQLHelper::get(std::string& retVal,
                        const char* pTable, 
                        const char* pField,  
                        const char* pFilter, 
                        const char* pFilterVal)
{
  if (pTable == NULL || pField == NULL)
  {
    return false;
  }
  
  // SELECT pField FROM pTable WHERE pFilter = pFilterVal;
  std::vector<std::string> in;

  //HandlerSQLL hsql;
  std::string sqlstr;
  sqlstr =  "SELECT ";
  sqlstr += pField;
  sqlstr += " FROM ";
  sqlstr += pTable;
  if (pFilter && pFilterVal)
  {
    sqlstr +=" WHERE ";
    sqlstr += pFilter;
    sqlstr +=" = '";
    sqlstr += pFilterVal;
    sqlstr +="';";
  }
  else
  {
    sqlstr += ";";
  }

  bool res = false;//hsql.execSQL( sqlstr, &in );
  if (res && in.size() )
  {
    retVal = in[0];
  }
  else
  {
    trace("SQLError: %s", sqlstr.c_str() );
    if (in.size() )
    {
      trace("SQLError: %s", in[0].c_str() );
    }
    return false;
  }

  return true;
}

bool SQLHelper::update(const char* pTable,
                      const std::string& data,
                      const char* pFilter, 
                      const char* pFilterVal)
{
  std::string sqlstr;
  sqlstr = "UPDATE " + std::string(pTable);
  sqlstr += " SET ";
  sqlstr += data;
  if (pFilter && pFilterVal)
  {
    sqlstr +=" WHERE ";
    sqlstr += pFilter;
    sqlstr +=" = '";
    sqlstr += pFilterVal;
    sqlstr +="';";
  }
  else
  {
    sqlstr += ";";
  }

  //HandlerSQLL hsql;
  std::vector<std::string> res;
  bool rez = false;//hsql.execSQL( sqlstr, &res );
  // TODO fix - there is no error
  if (rez == false || (res.size() && res[0] == "ERROR") )
  {
    trace("SQLError: %s", sqlstr.c_str() );
    if (res.size() )
    {
      trace("SQLError: %s", res[0].c_str() );
    }
    return false;
  }
  else
  {
    return true;
  }

}
bool SQLHelper::insert(const char* pTable,
                      const std::string& data)
{
  std::string sqlstr;
  sqlstr = "INSERT INTO " + std::string(pTable);
  sqlstr += " VALUES (";
  sqlstr += data;
  sqlstr += ");";

  //HandlerSQLL hsql;
  std::vector<std::string> res;
  bool rez = false;//hsql.execSQL( sqlstr, &res );
  if (rez == false || (res.size() && res[0] == "ERROR") )
  {
    // TRACE OUT TO CONSOLE
    trace("SQLError: %s", sqlstr.c_str() );
    if (res.size() )
    {
      trace("SQLError: %s", res[0].c_str() );
    }
    return false;
  }
  else
  {
    return true;
  }

}

/*
void SQLHelper::format(bool newvalue, std::string& out, const char* pVal, const tdBBox& bbox)
{
  if (newvalue)
  {
    out += " '";
  }
  else
  {
    out += std::string(pVal);
    out += " = '";
  }
  char buff[512];
  sprintf(buff, "%f, %f, %f, %f, %f, %f", 
            bbox.mMin.mX, bbox.mMin.mY, bbox.mMin.mZ,
            bbox.mMax.mX, bbox.mMax.mY, bbox.mMax.mZ);
  out += buff;
  out += "' ";
}
*/
/*
void SQLHelper::format(bool newvalue, std::string& out, const char* pVal, const tdVector& pos)
{
  if (newvalue)
  {
    out += " '";
  }
  else
  {
    out += std::string(pVal);
    out += " = '";
  }
  char buff[512];
  sprintf(buff, "%f, %f, %f", 
            pos.mX, pos.mY, pos.mZ);
  out += buff;
  out += "' ";
}

*/
void SQLHelper::format(bool newvalue,std::string& out, const char* pVal, long val)
{
  if (newvalue)
  {
    out += " '";
  }
  else
  {
    out += std::string(pVal);
    out += " = '";
  }
  char buff[512];
  sprintf(buff, "%d",val);
  out += buff;
  out += "' ";
}

void SQLHelper::format(bool newvalue,std::string& out, const char* pVal, float val)
{
  if (newvalue)
  {
    out += " '";
  }
  else
  {
    out += std::string(pVal);
    out += " = '";
  }
  char buff[512];
  sprintf(buff, "%f",val);
  out += buff;
  out += "' ";
}


void SQLHelper::format(bool newvalue,std::string& out, const char* pVal, const std::string& val)
{
  if (newvalue)
  {
    out += " '";
  }
  else
  {
    out += std::string(pVal);
    out += " = '";
  }
  out += val;
  out += "' ";
}

void SQLHelper::format(bool newvalue,std::string& out, const char* pVal, long* vals, int num)
{
  if (newvalue)
  {
    out += " '";
  }
  else
  {
    out += std::string(pVal);
    out += " = '";
  }
  char buff[16];
  for (int a=0; a<num; a++)
  {
    sprintf(buff, "%d",vals[a]);
    out += buff;
    if ( a < num-1)
    {
      out += ",";
    }
  }
  out += "' ";
}

SQLDataTkn SQLHelper::getToken(const std::string& str, unsigned int& pos)
{
  int a = (int)str.find('\t');
  if (a < 1 || a >= (int)str.size())
  {
    return SQL_TKN_UNKN;
  }

  pos = a;

  std::string strtkn;
  strtkn = str.substr( 0 ,  a);
  if (strtkn == "ID")return SQL_TKN_ID;
  if (strtkn == "SIZE")return SQL_TKN_SIZE;
  if (strtkn == "MAXIDLETIME")return SQL_TKN_MAXIDLETIME;
  if (strtkn == "NAME")return SQL_TKN_NAME;
  if (strtkn == "UPDATETIME")return SQL_TKN_UPDATETIME;
  if (strtkn == "MESSAGE")return SQL_TKN_MESSAGE;
  if (strtkn == "FLAGS")return SQL_TKN_FLAGS;
  if (strtkn == "LOGIN")return SQL_TKN_LOGIN;
  if (strtkn == "POSITION") return SQL_TKN_POSITION;
  if (strtkn == "OBJECTS") return SQL_TKN_OBJECTS;
  return SQL_TKN_UNKN;
}

/*
void SQLHelper::parse(const std::string& str, unsigned int pos, tdBBox& value)
{
  value.mMin.mX = getFloat( str, pos);
  value.mMin.mY = getFloat( str, pos);
  value.mMin.mZ = getFloat( str, pos);

  value.mMax.mX = getFloat( str, pos);
  value.mMax.mY = getFloat( str, pos);
  value.mMax.mZ = getFloat( str, pos);

}
*/
/*
void SQLHelper::parse(const std::string& str, unsigned int pos, tdVector& value)
{
  value.mX = getFloat( str, pos);
  value.mY = getFloat( str, pos);
  value.mZ = getFloat( str, pos);

}
*/

void SQLHelper::parse(const std::string& str, unsigned int pos, long& value)
{
  value = getLong( str, pos);
}

void SQLHelper::parse(const std::string& str, unsigned int pos, float& value)
{
  value = getFloat( str, pos);
}

void SQLHelper::parse(const std::string& str, unsigned int pos, std::string& value)
{
  unsigned int len = (int)str.length();
  while ( str[pos] == '\t')
  {
    pos++;
  }
  std::string tmp = str.substr( pos , len - pos);
  value = tmp;
}

void SQLHelper::parse(const std::string& str, unsigned int pos, long* pVal, unsigned int len)
{
  for (unsigned int a=0; a< len; a++)
  {
    pVal[a] = getLong( str, pos);
  }
}

float SQLHelper::getFloat(const std::string& in, unsigned int& pos)
{
  unsigned int start = pos;
  while ( in[pos] != ',' && in[pos] != ';' && pos < in.length() )
  {
    pos ++;
  }
  std::string ret = in.substr( start, pos - start);
  pos ++;
  return (float)atof( ret.c_str() );
}

long SQLHelper::getLong(const std::string& in, unsigned int& pos)
{
  unsigned int start = pos;
  while ( in[pos] != ',' && in[pos] != ';' && pos < in.length() )
  {
    pos ++;
  }
  std::string ret = in.substr( start, pos - start);
  return atol( ret.c_str() );
}


int SQLHelper::getToken(const std::string& str, unsigned int& pos, 
                        const std::vector<WorldDOMVar*>& vars)
{

  int a = (int)str.find('\t');
  if (a < 1 || a >= (int)str.size() )
  {
    return SQL_TKN_UNKN;
  }

  pos = a;
  std::string strtkn;
  strtkn = str.substr( 0 ,  a);
  
  for (unsigned int b=0; b < vars.size() ; b++)
  {
    //if (vars[b] && vars[b]->equalsSQLname( str.c_str(), pos ) )
    {
      return b;
    }
  }
  return -1;
}


void SQLHelper::setOutFunc(ServerOutCallback pFunc)
{
  mpFunc = pFunc;
}

// TODO - move trace in separate facility
void SQLHelper::trace(const char* pFormat, ... )
{
  
  static char tracebuff[16384];
  va_list list;
  va_start(list, pFormat);
  int len = vsprintf( tracebuff ,pFormat,list); // two for CRLF and one for 0
  va_end(list);
  if (len && mpFunc)
  {
    mpFunc( tracebuff );
  }
}



// postaviti osnovne resourse
// povecavati kolicinu osnovnih resoursa
// postavljanje na mapi raznih podrucja za resourse.....
// hexagone koriste - gradjevine - reljef - likovi idu - kontinuirano

// napraviti XML format reljefa

// postavljanje prve jedinice
// za sada sve hardcoded -razmisliti za poslije da to dizu "skripte"..



