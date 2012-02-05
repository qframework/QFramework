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



#ifndef HTTP_REQUEST_PARSER_H
#define HTTP_REQUEST_PARSER_H


#include "boost/logic/tribool.hpp"
#include "boost/tuple/tuple.hpp"
#include <istream>

namespace qserver {

  extern void system_traceOut(const char* str);
struct HttpRequest;

/** 
 * Http request parser
 */
class HttpRequestParser
{

public:

  /**
   * Default constructor
   */
  HttpRequestParser();

  /**
   * reset to initial state
   */
  void reset();

  bool parse(HttpRequest& req, std::string& s, int& count, int len) {
    reset();
	char val;
	boost::tribool result;
	
	std::string debugout("");
  int strlen = (int)s.length() ;
  while (count < len && count < strlen)
	{
	  val = s[count];
	  count ++;

	  char cc[2] = {0,0};
	  cc[0] = val;
	  debugout += cc[0];
	  result = consume(req, val);
	  if (result == false)
	  {
		system_traceOut("PARSE ERROR");
		system_traceOut(debugout.c_str());
		return false;
	  } else if (result)
	  { 
		break;
	  }
	}
  //system_traceOut(debugout.c_str());
	return true;
  }


  bool parse(HttpRequest& req, std::istream& is, int len) {
    reset();
	char val;
	boost::tribool result;
	
	std::string debugout("");
	int count = 0;
	while (count < len && !is.eof() )
	{
    count ++;

	  is >> val;
	  char cc[2] = {0,0};
	  cc[0] = val;
	  debugout += cc[0];
	  result = consume(req, val);
	  if (result == false)
	  {
      char stop = val;
      while (!is.eof() )
      {
        is >> val;
      	cc[0] = val;
	      debugout += cc[0];
      }

      system_traceOut(debugout.c_str());
		  return false;
	  } else if (result)
    { 
      break;
    }
	}
  system_traceOut(debugout.c_str());
	return true;
  }


  /**
   * Parse data
   * Parse some data. The tribool return value is true when a complete request
   * has been parsed, false if the data is invalid, indeterminate when more
   * data is required. The InputIterator return value indicates how much of the
   * input has been consumed.
   */
  template <typename InputIterator>
  boost::tuple<boost::tribool, InputIterator> parse(HttpRequest& req,
      InputIterator begin, InputIterator end)
  {
    while (begin != end)
    {
      if (*begin != 0 && *begin != 255)
      {
        boost::tribool result = consume(req, *begin++);
        if (!result)
        {
          begin--;
        }
        if (result || !result)
          return boost::make_tuple(result, begin);
      }else
      {
        begin++;
      }
    }
    boost::tribool result = boost::indeterminate;
    return boost::make_tuple(result, begin);
  }

private:

  /**
   * Handle the next character of input
   * @param req a input/output request 
   * @param input an input char
   */
  boost::tribool consume(HttpRequest& req, char input);

  /**
    * Check if a byte is an HTTP character.
    * @param c a char to check
    */
  static bool is_char(int c);

  /**
    * Check if a byte is an HTTP control character.
    * @param c a char to check
    */
  static bool is_ctl(int c);

  /**
    * Check if a byte is defined as an HTTP tspecial character.
    * @param c a char to check
    */
  static bool is_tspecial(int c);

  /**
    * Check if a byte is a digit.
    * @param c a char to check
    */
  static bool is_digit(int c);

  /**
    * The current state of the parser.
    */
  enum state
  {
    method_start,
    method,
    uri_start,
    uri,
    http_version_h,
    http_version_t_1,
    http_version_t_2,
    http_version_p,
    http_version_slash,
    http_version_major_start,
    http_version_major,
    http_version_minor_start,
    http_version_minor,
    expecting_newline_1,
    header_line_start,
    header_lws,
    header_name,
    space_before_header_value,
    header_value,
    expecting_newline_2,
    expecting_newline_3
  } state_;
};

} // namespace qserver

#endif // HTTP_REQUEST_PARSER_H
