function color_get(name)
{
    name = name.toLowerCase();
    var ret = colors.color[name];
    if (ret == undefined)
    {
        return "000000";
    }
    return ret;
    
}


function Colors()
{
    this.color = new Array();
    this.color['aliceblue']                ="F0F8FF";
    this.color['antiquewhite']             ="FAEBD7";
    this.color['aqua']                     ="00FFFF";
    this.color['aquamarine']               ="7FFFD4";
    this.color['azure']                    ="F0FFFF";
    this.color['beige']                    ="F5F5DC";
    this.color['bisque']                   ="FFE4C4";
    this.color['black']                    ="000000";
    this.color['blanchedalmond']           ="FFEBCD";
    this.color['blue']                     ="0000FF";
    this.color['blueviolet']               ="8A2BE2";
    this.color['brown']                    ="A52A2A";
    this.color['burlywood']                ="DEB887";
    this.color['cadetblue']                ="5F9EA0";
    this.color['chartreuse']               ="7FFF00";
    this.color['chocolate']                ="D2691E";
    this.color['coral']                    ="FF7F50";
    this.color['cornflowerblue']           ="6495ED";
    this.color['cornsilk']                 ="FFF8DC";
    this.color['crimson']                  ="DC143C";
    this.color['cyan']                     ="00FFFF";
    this.color['darkblue']                ="00008B";
    this.color['darkcyan']                ="008B8B";
    this.color['darkgoldenrod']            ="B8860B";
    this.color['darkgray']                     ="A9A9A9";
    this.color['darkgreen']                    ="006400";
    this.color['darkkhaki']                    ="BDB76B";
    this.color['darkmagenta']              ="8B008B";
    this.color['darkolivegreen']           ="556B2F";
    this.color['darkorange']                ="FF8C00";
    this.color['darkorchid']                ="9932CC";
    this.color['darkred']                  ="8B0000";
    this.color['darksalmon']                   ="E9967A";
    this.color['darkseagreen']             ="8FBC8F";
    this.color['darkslateblue']            ="483D8B";
    this.color['darkslategray']            ="2F4F4F";
    this.color['darkturquoise']            ="00CED1";
    this.color['darkviolet']               ="9400D3";
    this.color['deeppink']                 ="FF1493";
    this.color['deepskyblue']              ="00BFFF";
    this.color['dimgray']                  ="696969";
    this.color['dodgerblue']               ="1E90FF";
    this.color['firebrick']                ="B22222";
    this.color['floralwhite']            ="FFFAF0";
    this.color['forestgreen']            ="228B22";
    this.color['fuchsia']                  ="FF00FF";
    this.color['gainsboro']                ="DCDCDC";
    this.color['ghostwhite']            ="F8F8FF";
    this.color['gold']                     ="FFD700";
    this.color['goldenrod']                ="DAA520";
    this.color['gray']                     ="808080";
    this.color['green']                    ="008000";
    this.color['greenyellow']            ="ADFF2F";
    this.color['honeydew']                 ="F0FFF0";
    this.color['hotpink']                  ="FF69B4";
    this.color['indianred ']           ="CD5C5C";
    this.color['indigo ']              ="4B0082";
    this.color['ivory']                ="FFFFF0";
    this.color['khaki']                ="F0E68C";
    this.color['lavender']                 ="E6E6FA";
    this.color['lavenderblush']            ="FFF0F5";
    this.color['lawngreen']                ="7CFC00";
    this.color['lemonchiffon']         ="FFFACD";
    this.color['lightblue']            ="ADD8E6";
    this.color['lightcoral']           ="F08080";
    this.color['lightcyan']            ="E0FFFF";
    this.color['lightgoldenrodyellow']="FAFAD2";
    this.color['lightgrey']            ="D3D3D3";
    this.color['lightgreen']           ="90EE90";
    this.color['lightpink']            ="FFB6C1";
    this.color['lightsalmon']          ="FFA07A";
    this.color['lightseagreen']        ="20B2AA";
    this.color['lightskyblue']         ="87CEFA";
    this.color['lightslategray']       ="778899";
    this.color['lightsteelblue']       ="B0C4DE";
    this.color['lightyellow']=         "FFFFE0";
    this.color['lime']                 ="00FF00";
    this.color['limegreen']            ="32CD32";
    this.color['linen']                ="FAF0E6";
    this.color['magenta']                  ="FF00FF";
    this.color['maroon']               ="800000";
    this.color['mediumaquamarine']     ="66CDAA";
    this.color['mediumblue']           ="0000CD";
    this.color['mediumorchid']        ="BA55D3";
    this.color['mediumpurple']        ="9370D8";
    this.color['mediumseagreen']           ="3CB371";
    this.color['mediumslateblue']          ="7B68EE";
    this.color['mediumspringgreen']        ="00FA9A";
    this.color['mediumturquoise']        ="48D1CC";
    this.color['mediumvioletred']        ="C71585";
    this.color['midnightblue']            ="191970";
    this.color['mintcream']                ="F5FFFA";
    this.color['mistyrose']                ="FFE4E1";
    this.color['moccasin']                 ="FFE4B5";
    this.color['navajowhite']          ="FFDEAD";
    this.color['navy']                 ="000080";
    this.color['oldlace']              ="FDF5E6";
    this.color['olive']                ="808000";
    this.color['olivedrab']            ="6B8E23";
    this.color['orange']               ="FFA500";
    this.color['orangered']            ="FF4500";
    this.color['orchid']               ="DA70D6";
    this.color['palegoldenrod']        ="EEE8AA";
    this.color['palegreen']            ="98FB98";
    this.color['paleturquoise']        ="AFEEEE";
    this.color['palevioletred']        ="D87093";
    this.color['papayawhip']           ="FFEFD5";
    this.color['peachpuff']            ="FFDAB9";
    this.color['peru']                ="CD853F";
    this.color['pink']                ="FFC0CB";
    this.color['plum']                ="DDA0DD";
    this.color['powderblue']           ="B0E0E6";
    this.color['purple']               ="800080";
    this.color['red']                  ="FF0000";
    this.color['rosybrown']            ="BC8F8F";
    this.color['royalblue']            ="4169E1";
    this.color['saddlebrown']          ="8B4513";
    this.color['salmon']               ="FA8072";
    this.color['sandybrown']            ="F4A460";
    this.color['seagreen']              ="2E8B57";
    this.color['seashell']                 ="FFF5EE";
    this.color['sienna']                ="A0522D";
    this.color['silver']                ="C0C0C0";
    this.color['skyblue']              ="87CEEB";
    this.color['slateblue']            ="6A5ACD";
    this.color['slategray']            ="708090";
    this.color['snow']                 ="FFFAFA";
    this.color['springgreen']          ="00FF7F";
    this.color['steelblue']            ="4682B4";
    this.color['tan']                  ="D2B48C";
    this.color['teal']                 ="008080";
    this.color['thistle']              ="D8BFD8";
    this.color['tomato']               ="FF6347";
    this.color['turquoise']            ="40E0D0";
    this.color['violet']               ="EE82EE";
    this.color['wheat']                ="F5DEB3";
    this.color['white']                ="FFFFFF";
    this.color['whitesmoke']           ="F5F5F5";
    this.color['yellow']               ="FFFF00";
    this.color['yellowgreen']          ="9ACD32";

    this.get = color_get;
}

var colors = new Colors();

//print("JS:colors start "  );  


