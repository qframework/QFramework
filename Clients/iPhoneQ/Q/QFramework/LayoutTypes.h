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

typedef enum  {
    
    LAT_NONE,
    //
    LAT_TEXT,
    LAT_LABEL,
    LAT_TABLE,
    LAT_LAYOUT,
    LAT_CARDS
} LayoutAreaType;

typedef enum  {
    
    LAS_NONE,
    LAS_VISIBLE,
    LAS_HIDDEN
} LayoutAreaState;

typedef enum  {
    
    LAL_NONE,
    LAL_HORIZONTAL,
    LAL_VERTICAL,
    LAL_NORTH_WEST,
    LAL_NORTH_EAST,
    LAL_SOUTH_WEST,
    LAL_SOUTH_EAST,
    LAL_DIAMOND,
    LAL_CIRCLE,
    LAL_SQUARE,
    LAL_NORTH_SOUTH,
    LAL_EAST_WEST,
    LAL_SOUTH_NORTH,
    LAL_WEST_EAST
}   LayoutArea_Layout;

typedef enum  {
    
    LATA_NONE,
    LATA_NORTH,
    LATA_SOUTH,
    LATA_WEST,
    LATA_EAST,
    LATA_NORTH_WEST,
    LATA_NORTH_EAST,
    LATA_SOUTH_WEST,
    LATA_SOUTH_EAST,
    LATA_CENTER
}   LayoutAreaTextAlign;


typedef enum  {
    
    LABT_NONE,
    LABT_THINRECT
}   LayoutAreaBorderType;

typedef enum  {
    
    LAFIT_ITEM,
    LAFIT_TEXT,
    LAFIT_TEXTH    
}   LayoutAreaFieldItemType;


typedef enum  {
    
    LFT_NONE,
    LFT_CARD,
    LFT_TEXT,
    LFT_FIGURE
} LayoutFieldType;


typedef enum  {
    
    LFFT_NONE,
    LFFT_PLAYER_START,
    LFFT_PLAYER_END,
    LFFT_NORM_FIELD,
    LFFT_PLAY_FIELD,
    LFFT_CHESS_WHITE,
    LFFT_CHESS_BLACK,
    LFFT_BUTTON,
    LFFT_PLAYER_EMPTY,
    LFFT_PLAYER_EMPTY2    
} LayoutFieldFieldType;


typedef enum
{
    GWLOC_WORLD,
    GWLOC_HUD
} GameonWorld_Location;


typedef enum  GameonModelData_Type {
    GMODEL_NONE,
    GMODEL_CUBE,
    GMODEL_BACKGROUND,
    GMODEL_BACKIMAGE,    
    GMODEL_SPHERE,    
    GMODEL_CARD52,
    GMODEL_CYLYNDER
} GameonModelData_Type;


typedef enum AnimData_Type
{
	ADT_NONE,
	ADT_REF,
	ADT_COLOR,
	ADT_SCROLLER
} AnimData_Type;
