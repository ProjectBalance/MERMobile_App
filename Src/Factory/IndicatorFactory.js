import React, {Component} from 'react'

import * as DataFactory from './DataFactory';
import * as GeneralFactory from './GeneralFactory';
import * as TextFactory from './TextFactory';

import {ListItem} from 'react-native-elements';

export function GetIndicator(id){
    var realm = DataFactory.GetDB();
    var indicator = realm.objects("Indicator").filtered('id = $0',id);

    return indicator[0];
}

export function GetGroupColor(id){
    var realm = DataFactory.GetDB();

    var indicator = realm.objects("Indicator").filtered('id = "' + id + '"');
    var group = realm.objects("Group").filtered('name = "'+ indicator[0].group + '"');

    var data = JSON.parse(group[0].data);
    var color = "";
    var txtColor = "";

    if(data.color != null){
        color = data.color[TextFactory.GetLanguage()];
    }

    if(data.textColor != null){
        txtColor = data.textColor[TextFactory.GetLanguage()];
    }

    var ct = {
        bgColor:color,
        textColor:txtColor
    }

    return ct;
}

export function SaveBookmark(id,name,bookmarked){
    var realm = DataFactory.GetDB();
    var bookmarks = realm.objects("Bookmark").filtered('onHome = true');

    var onHome = false;

    //Automatically place a bookmark on the home screen if there is less than 5
    if(bookmarks.length < 5)
        onHome = true;

    realm.write(()=>{
        if(bookmarked)
        {
            realm.create("Bookmark",{
                id:id,
                name:name,
                onHome:onHome
            },
            true);
        }
       else
       {
           var bm = realm.objects("Bookmark").filtered('id = "'+ id +'"')
           realm.delete(bm);
       }
    });
}

export function GetHomeBookmarks(){
    var realm = DataFactory.GetDB();
    var bookmarks = realm.objects("Bookmark").filtered('onHome = true');

    return bookmarks;
}

export function GetGroupIcon(type){

    switch(type){
        case "Prevention":
            return require('../Images/Icons/prevention.png');
        case "Treatment":
            return require('../Images/Icons/treatment.png');
        case "Testing":
            return require('../Images/Icons/testing.png');
        case "Viral Suppression":
            return require('../Images/Icons/vs.png');
        case "Health Systems":
            return require('../Images/Icons/hs.png');
        case "Host Country":
            return require('../Images/Icons/hc.png');
        default:
            return null;
    }
}

export function GetBookmark(id){
    var realm = DataFactory.GetDB();
    var bmList = realm.objects("Bookmark").filtered('id = $0',id);

    var bookmark = "star-o";

    if(bmList.length > 0)
    bookmark = "star";
        
    return bookmark;
}

export function Search(text,onPress){
    var country = GeneralFactory.GetSelectedCountry();

    var realm = DataFactory.GetDB();
    var indicatorList = realm.objects("Indicator").filtered('country = $0',country);

    var results = [];

    indicatorList.forEach(i =>{
        var searchData = i.data.toLowerCase();
            
        if(searchData.includes(text.toLowerCase(),0)){

            var data = JSON.parse(i.data);
            var reportingFrequency = realm.objects("ReportingFrequency").filtered('name = "' + data.reportingFrequency + '" and country = "' + country + '"');
            var color = "#FFF";
            var gColor = "#FFF";
            var group = "Indicator Detail";

            if(reportingFrequency != "")
                color = reportingFrequency[0].color;

            var group = realm.objects("Group").filtered('type = $0 and country = $1',i.group,country);
            if(group != ""){
                var gData = JSON.parse(group[0].data);

                gColor = gData.color;
                group = group[0].name;
            }

            results.push(
                <ListItem
                    key={results.length + 1}
                    title = {i.code}
                    chevron
                    containerStyle={{backgroundColor:color,borderBottomWidth:1,borderBottomColor:'#C3C3C3'}}
                    onPress={() => onPress(i.id,i.code,group,gColor,color)}
                />
            );
        }
    });

    return results;
}

export function GetNavOptions(id){
    var realm = DataFactory.GetDB();
    var country = GeneralFactory.GetSelectedCountry();

    var ind = realm.objects("Indicator").filtered('id = $0',id);
    var i = ind[0];

    var data = JSON.parse(i.data);
    var reportingFrequency = realm.objects("ReportingFrequency").filtered('name = "' + data.reportingFrequency + '" and country = "' + country + '"');
    var color = "#FFF";
    var gColor = "#FFF";
    var group = "Indicator Detail";

    if(reportingFrequency != "")
        color = reportingFrequency[0].color;

    var group = realm.objects("Group").filtered('type = $0 and country = $1',i.group,country);
    if(group != ""){
        var gData = JSON.parse(group[0].data);

        gColor = gData.color;
        group = group[0].name;
    }

    var iOptions = {
        id:id,
        name:i.code,
        group:group,
        gColor:gColor,
        color:color
    }

    return iOptions;
}