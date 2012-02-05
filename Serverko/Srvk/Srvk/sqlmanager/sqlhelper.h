#ifndef _SQL_HELPER_H_
#define _SQL_HELPER_H_

#include <vector>
#include <string>


class WorldDOMVar;

typedef enum
{
  SQL_TKN_UNKN,
  SQL_TKN_SIZE,
  SQL_TKN_MAXIDLETIME,
  SQL_TKN_NAME,
  SQL_TKN_UPDATETIME,
  SQL_TKN_MESSAGE,
  SQL_TKN_FLAGS,
  SQL_TKN_LOGIN,
  SQL_TKN_POSITION,
  SQL_TKN_OBJECTS,
  SQL_TKN_ID
} SQLDataTkn;

typedef void (*ServerOutCallback)( char* pData);

class SQLHelper
{

public:
  SQLHelper();
  ~SQLHelper();

  static SQLDataTkn getToken(const std::string& str, unsigned int& pos);
  static int getToken(const std::string& str, unsigned int& pos, const std::vector<WorldDOMVar*>& vars);

  
  static bool get(std::vector<std::string>& retVals,
                      const char* pTable, 
                      const char* pField,  
                      const char* pFilter = NULL, 
                      const char* pFilterVal = NULL);

  static bool get(std::string& retVal,
                      const char* pTable, 
                      const char* pField,  
                      const char* pFilter = NULL, 
                      const char* pFilterVal = NULL);

  static bool update(const char* pTable,
                      const std::string& data ,
                      const char* pFilter = NULL, 
                      const char* pFilterVal = NULL);

  static bool insert(const char* pTable,
                      const std::string& data);

  
  //static void format(bool newvalue, std::string& out, const char* pVal, const tdBBox& bbox);
  //static void format(bool newvalue, std::string& out, const char* pVal, const tdVector& pos);
  static void format(bool newvalue, std::string& out, const char* pVal, long val);
  static void format(bool newvalue, std::string& out, const char* pVal, long* vals, int num);  
  static void format(bool newvalue, std::string& out, const char* pVal, const std::string& str);
  static void format(bool newvalue, std::string& out, const char* pVal, float val);

  //static void parse(const std::string& str, unsigned int pos, tdBBox& value);
  //static void parse(const std::string& str, unsigned int pos, tdVector& value);
  static void parse(const std::string& str, unsigned int pos, long& value);
  static void parse(const std::string& str, unsigned int pos, float& value);
  static void parse(const std::string& str, unsigned int pos, std::string& value);
  static void parse(const std::string& str, unsigned int pos, long* pVal, unsigned int len);

  static float getFloat(const std::string& in, unsigned int& pos);
  static long getLong(const std::string& in, unsigned int& pos);

  static void setOutFunc(ServerOutCallback pFunc);

//protected:
  static void trace(const char* pFormat, ... );

protected:
  static  ServerOutCallback     mpFunc;
};

#endif //_SQL_HELPER_H_
