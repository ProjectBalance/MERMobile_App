import React, {Component} from 'react';
import {url,spaceID,accessToken} from '../../app.json';
import Realm from 'realm';
import * as Schema from '../Model/Schema';

export function GetDB(){
    const realm = new Realm({schema:Schema.allSchema,schemaVersion:1});

        return realm;
}

export function GetData(){

    const apiUrl =  url + spaceID +  "/entries?access_token=" + accessToken; 

    let data = {}; 
    
    return fetch(apiUrl)
      .then((response) => response.json())

      .catch((error) =>{

        return "error";
    });
    
};

export function GetCountries(){

    const apiUrl =  url + spaceID +  "/entries?access_token=" + accessToken; 

    let data = {}; 
    
    return fetch(apiUrl)
      .then((response) => response.json())

      .catch((error) =>{

        return "error";
    });
    
};

export function InitialSync(){
    return InitialSyncData().then((data)=>{
        if(data == "error")
        {
            return "error";
        }
        else
        {
            var realm = GetDB();

            if(realm.objects("Settings").length == 0){
                realm.write(()=>{
                    realm.create("Settings",
                    {
                        key:"nextSyncURL",
                        value:data.nextSyncUrl
                    });
                });

                return GetContentData().then((cData) =>{

                    SaveContentData(cData);

                    SaveData(data.items).then((sucess) =>{

                        if(sucess){

                            return "success";
                            
                        }
                    });

                });         

            }
        }
    })
}

export function Sync(){
    return GetContentData().then((cData)=>{

        //Check for a problem
        if(cData =="error")
            return "error";

        SaveContentData(cData);

        return SyncData().then((data)=>{

            var realm = GetDB();

            //Save the next sync URL
            realm.write(()=>{
                realm.create("Settings",
                {
                    key:"nextSyncURL",
                    value:data.nextSyncUrl
                },
                true);
            });

            //Check if any updates were found
            if(data.items.length == 0)
                return "noData"

            return SaveData(data.items).then((sucess) =>{

                if(sucess){

                    return "success";
                    
                }
            });

        });
    });
}

export function InitialSyncData(){
    const apiUrl =  url + spaceID +  "/sync?access_token=" + accessToken + "&initial=true"; 

    
    return fetch(apiUrl)
      .then((response) => response.json())

      .catch((error) =>{

        return "error";
    });
}

export function SyncData(){

    var realm = GetDB();

    var obj = realm.objects("Settings").filtered('key = "nextSyncURL"');


    const apiUrl =  obj[0].value + "&access_token=" + accessToken; 

    
    return fetch(apiUrl)
      .then((response) => response.json())

      .catch((error) =>{

        return "error";
    });
}

export function GetContentData(){
    const apiUrl =  url + spaceID +  "/content_types/indicator?access_token=" + accessToken + ""; 

    let data = {}; 
    
    return fetch(apiUrl)
      .then((response) => response.json())

      .catch((error) =>{

        return "error";
    });
}


export function SaveData(data){
  return new Promise(function(resolve,reject){

    var realm = GetDB();

        var lang = "en-US";

        realm.write(() =>{
            data.forEach(item => {
                if(item.sys.type == "Entry"){
                    var type = item.sys.contentType.sys.id ;
     
                    switch(type){
                        case "events":
   
                           realm.create("Event",{
                               id:item.sys.id,
                               date:item.fields.eventDate[lang],
                               name:item.fields.name[lang],
                               description: item.fields.description[lang],
                               location:item.fields.location[lang],
                               data:JSON.stringify(item.fields)
                           },
                           true);
   
                        break;
                        case "indicator":
                           realm.create("Indicator",{
                               id:item.sys.id,
                               code:item.fields.code[lang],
                               group: item.fields.group[lang],
                               country:item.fields.country[lang],
                               data:JSON.stringify(item.fields)
                           },
                           true);
                        break;
                        case "groups":
                           realm.create("Group",{
                               id:item.fields.id[lang],
                               name:item.fields.name[lang],
                               data:JSON.stringify(item.fields)
                           },
                           true);
                        break;
                        case "about":
                            realm.create("About",{
                                id:item.sys.id,
                                description:item.fields.description[lang],
                                order:item.fields.order[lang]
                            },
                            true);
                        break;
                        case "definition":
                            realm.create("Definition",{
                                id:item.sys.id,
                                key:item.fields.key[lang],
                                definition:item.fields.definition[lang]
                            },
                            true);
                        break;
                        case "resource":
                            realm.create("Resource",{
                                id:item.sys.id,
                                title:item.fields.title[lang],
                                link:item.fields.link[lang]

                            },
                            true);
                        break;
                        case "map":
                            realm.create("Map",{
                                id:item.sys.id,
                                country:item.fields.country[lang],
                                name:item.fields.name[lang],
                                level:item.fields.level[lang],
                                geojson:item.fields.geojson != null ? JSON.stringify(item.fields.geojson[lang]) : null,
                                sublevel:item.fields.sublevel != null ? JSON.stringify(item.fields.sublevel[lang]) : null,
                            },
                            true);
                        break;
                        default:
                        break;
                    }
                }
                else if(item.sys.type == "DeletedEntry")
                {
                    //Data has been deleted on the server side. Remove from local DB

                    //Since only the ID is given, we need to check each schema for a match
                    DeleteItem(realm,"Indicator",item.sys.id); 
                    DeleteItem(realm,"Group",item.sys.id);
                    DeleteItem(realm,"Event",item.sys.id);
                }
                
             });
        });
       

        resolve(true);
  });
}

export function SaveContentData(data){
    var realm = GetDB();

    realm.write(() =>{

        realm.create("Model",{
            id:data.sys.id,
            data:JSON.stringify(data)
        },
        true);

    });

}

export function DeleteItem(realm,schema,id){
    var del = realm.objects(schema).filtered('id = "'+ id +'"');
        
    if(del.length > 0)
        realm.delete(del);

}

