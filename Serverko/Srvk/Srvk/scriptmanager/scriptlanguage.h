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


#ifndef SCRIPT_LANGUAGE_H
#define SCRIPT_LANGUAGE_H

#include <string>
#include <vector>
#include <map>

namespace qserver
{


  typedef struct _LangString
  {
	std::string id;
	std::string value;
  } LangString;

  typedef std::map<std::string, LangString> LangStringsMap;
  typedef std::pair<std::string, LangString> LangStringsPair;

  typedef struct _Language
  {
	std::string		id;
	LangStringsMap	strings;
  }Language;

  typedef std::map<std::string, Language> LanguagesMap;
  typedef std::pair<std::string, Language> LanguagesPair;

/** 
* Script class
* Extends scripts - this is base class
*/
class ScriptLanguage
{
public:

  /** 
   * Constructor
   */
  ScriptLanguage();

  /** 
   * Destructor
   */
  virtual ~ScriptLanguage();

  bool	load(const char* pLang, const char* pFname);

  bool append(const char* pLang, const char* pStrID, std::string& strout);

protected:
  LanguagesMap	mLanguages;
};

}  //namespace qserver

#endif ///SCRIPT_LANGUAGE_H


