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


#include "scriptlanguage.h"
#include <boost/tokenizer.hpp>
#include <fstream>


namespace qserver
{

ScriptLanguage::ScriptLanguage()
{

}

ScriptLanguage::~ScriptLanguage()
{
}




bool ScriptLanguage::load(const char* pLang, const char* pFname)
{

  if (!pLang || !pFname)
  {
	return false;
  }


  /// find language
  LanguagesMap::iterator lang_iter = mLanguages.find(pLang);
  if (lang_iter == mLanguages.end() )
  {
	Language templang;
	templang.id = pLang;

	//insert new language
	mLanguages.insert( LanguagesPair( std::string( pLang) , templang ));

	lang_iter = mLanguages.find(pLang);
	if (lang_iter == mLanguages.end() )
	{
	  return false;
	}
  }

  Language& lang = lang_iter->second;

  // open file
  std::fstream    file;

  file.open(pFname, std::fstream::in);
  if (file.is_open() == false)
  {
    return false;
  }

  typedef boost::tokenizer<boost::char_separator<char> > tokenizer;
  boost::char_separator<char> sep("\t");


  char buffer[16384];
  while (!file.eof())
  {
	LangString	data;
    file.getline( buffer , 1024);
	std::string strbuff(buffer);
	tokenizer tokens( strbuff , sep);
    // tokenize 
    tokenizer::iterator tok_iter = tokens.begin(); 
	if (tok_iter != tokens.end()) {
	  data.id = *tok_iter;
	}
	++tok_iter;
	if (tok_iter != tokens.end()) {
	  data.value = *tok_iter;
	}
	
	lang.strings.insert( LangStringsPair( data.id, data ));  
    buffer[0] = 0;
  }
  file.close();


  return true;
}

bool ScriptLanguage::append(const char* pLang, const char* pStrID, std::string& strout)
{
  LanguagesMap::iterator lang_iter = mLanguages.find(pLang);
  if (lang_iter == mLanguages.end() )
  {
    lang_iter = mLanguages.find("*");
    if (lang_iter == mLanguages.end() )
    {
	    return false;
    }
  }

  Language& lang = lang_iter->second;

  LangStringsMap::iterator str_iter = lang.strings.find( pStrID );
  if (str_iter == lang.strings.end() )
  {
	// don't have string in string table
	return false;
  }

  // add string 
  strout += str_iter->second.value;
  return true;
}

}  //namespace qserver
