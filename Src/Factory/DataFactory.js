import React, {Component} from 'react';
import {url,spaceID,accessToken, version} from '../../app.json';
import Realm from 'realm';
import * as Schema from '../Model/Schema';

import * as GeneralFactory from './GeneralFactory';

export function CurrentAppVersion(){
    return version;
}

export function GetDB(){
    const realm = new Realm({schema:Schema.allSchema,schemaVersion:15});

    return realm;
}

export function GetData(theUrl){

    const apiUrl =  theUrl; 

    let data = {}; 
    
    return fetch(apiUrl)
      .then((response) => response.json())

      .catch((error) =>{

        return "error";
    });
    
};

//Meta Data Methods
//---------------------------------------------------------------------------------------------------------------------------------------------------

//Get Meta data used to filter sync data
//This is needed to pull any kind of data from the server
export function GetMetaData(){
    const apiUrl =  url + spaceID +  "/entries?access_token=" + accessToken + "&content_type=_system&fields.type=Country+-+Language"; 

    //First get a list of countries
    return GetData(apiUrl).then((data) => {
       
        if(data == "error")
        {
            return "error";
        }
        else
        {
            var realm = GetDB();
            realm.write(() =>{
                data.items.forEach(item => {
                    if(item.sys.type == "Entry"){
                        var type = item.sys.contentType.sys.id ;
        
                        switch(type){
                            case "_system":
    
                            realm.create("Country",{
                                key:item.fields.value,
                            },
                            true);
    
                            break;
                            default:
                            break;
                        }
                    }

                    
                });
            });

            //Then get the Indicator Model data. This is used for dynamic building of indicator fields
            return GetContentData().then((data) => {
                if(data =="error")
                    return "error";

                SaveContentData(data);

                return "success";
            });
        }
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

//---------------------------------------------------------------------------------------------------------------------------------------------------

export function GetAppVersion(){
    var selectedCountry = GeneralFactory.GetSelectedCountry();
    const apiUrl =  url + spaceID +  "/entries?access_token=" + accessToken + "&content_type=_system&fields.type=AppVersion";

    
    return GetData(apiUrl).then((data) => {
       
        if(data == "error")
        {
            return "error";
        }
        else
        {
            if(data.items.length > 0)
                return data.items[0].fields.value;
            return "N/A";
        }
    })
}

//Get the content version for a specific country
export function GetContentVersion(){
    var selectedCountry = GeneralFactory.GetSelectedCountry();
    const apiUrl =  url + spaceID +  "/entries?access_token=" + accessToken + "&content_type=_system&fields.type=Version&fields.country=" + selectedCountry; 

    
    return GetData(apiUrl).then((data) => {
       
        if(data == "error")
        {
            return "error";
        }
        else
        {
            if(data.items.length > 0)
                return data.items[0].fields.value;
            return "N/A";
        }
    })
}

//Perform a full sync of all data by Country-Language and last sync date
export function SyncData(){

    var realm = GetDB();
    
    var selectedCountry = GeneralFactory.GetSelectedCountry();
    var lastUpdated = GeneralFactory.GetLastUpdated(selectedCountry);

    var contentType = NextContent(0);
    var apiUrl = url + spaceID +  "/entries?access_token=" + accessToken + "&content_type=" + contentType + "&fields.country=" + selectedCountry + "&sys.updatedAt[gte]=" + lastUpdated + "T00:00:00.000Z&limit=1000"; 
    
    return GetContentVersion().then((result) =>{
        if(result == "error")
            return "error";
        else{
            var version = result;
          

            return GetEntryData(apiUrl,0,lastUpdated,selectedCountry).then((result) =>{
                if(result == "error")
                    return "error";
                else{
                    return GetMetaData().then((result) =>{

                        if(result == "error")
                            return "error";
                        else{
                            var delUrl = url + spaceID;

                            //Check if we are doing an initial sync or the next sync check
                            var del = realm.objects("Settings").filtered('key = "nextDelSync"');

                            if(del.length == 0 || del == null)
                                delUrl = delUrl + "/sync?access_token=" + accessToken + "&initial=true&type=Deletion";
                            else 
                                delUrl = del[0].value + "&access_token=" + accessToken;
        
                    
                            return CheckDeleted(delUrl,selectedCountry,version);
                        }
                    });
                }
            });
        }
    }).catch((error)=> {
        // alert(contentType + " - " + error.message);
        return "error";
    });
    

}

//Get data entries by Country - Language, Content Model and when it was last updated
export function GetEntryData(apiUrl,index,lastUpdated,selectedCountry){

    return GetData(apiUrl).then((data) =>{

        if(data == "error")
        {
            return "error";
        }
        else
        {

            return SaveData(data.items).then((sucess) =>{

                // var limit = data.limit;
                // //Check if there is still more data to pull
                // if(data.total > limit){
                //     var skip = data.skip;

                //     if(data.skip + limit < data.total){
                //         skip += limit;

                //         var nextAPIUrl = "";
                //         if(apiUrl.indexOf("&skip=") == -1)    
                //             nextAPIUrl = apiUrl + "&skip=" + skip;
                //         else{
                //             nextAPIUrl = apiUrl.substring(0,apiUrl.indexOf("&skip=")) + "&skip=" + skip;
                //         }

                //         return  GetEntryData(nextAPIUrl,index,lastUpdated,selectedCountry);
                //     }
                //     else
                //         return "success";
                // }

                if(sucess){

                    index += 1;
                    var contentType = NextContent(index);
                    
                    //Check if we are at the end
                    if(contentType != "-END-"){
                        apiUrl = url + spaceID +  "/entries?access_token=" + accessToken + "&content_type=" + contentType + "&fields.country=" + selectedCountry + "&sys.updatedAt[gt]=" + lastUpdated + "T00:00:00.000Z&include=0&limit=1000"; 
                    
                        return GetEntryData(apiUrl,index,lastUpdated,selectedCountry);
                    }
                    else
                        return "success";
                    
                }
                else
                    return "error";

            });


        }
    });

}




export function SaveData(data){
    return new Promise(function(resolve,reject){
  
      var realm = GetDB();
  
          realm.write(() =>{
              data.forEach(item => {
                  if(item.sys.type == "Entry"){
                      var type = item.sys.contentType.sys.id ;
       
                      switch(type){
                          case "events":
     
                             realm.create("Event",{
                                 id:item.sys.id,
                                 country:item.fields.country,
                                 startdate:item.fields.startDate,
                                 enddate:item.fields.endDate,
                                 name:item.fields.name,
                                 description: item.fields.description,
                                 location:item.fields.location != null ? item.fields.location : "",
                                 data:JSON.stringify(item.fields)
                             },
                             true);
     
                          break;
                          case "indicator":
                             realm.create("Indicator",{
                                 id:item.sys.id,
                                 code:item.fields.code,
                                 group: item.fields.group,
                                 country:item.fields.country,
                                 displayOrder:item.fields.displayorder,
                                 data:JSON.stringify(item.fields)
                             },
                             true);
                          break;
                          case "groups":
                             realm.create("Group",{
                                 id:item.sys.id,
                                 country:item.fields.country,
                                 name:item.fields.name,
                                 type:item.fields.type,
                                 sort:item.fields.id,
                                 data:JSON.stringify(item.fields)
                             },
                             true);
                          break;
                          case "reportingFrequency":
                          realm.create("ReportingFrequency",{
                              id:item.sys.id,
                              country:item.fields.country,
                              name:item.fields.name,
                              description:item.fields.description != null ? item.fields.description : "",
                              color:item.fields.color,
                              data:JSON.stringify(item.fields)
                          },
                          true);
                       break;
                          case "about":
                              realm.create("About",{
                                  id:item.sys.id,
                                  description:item.fields.description,
                                  order:item.fields.order
                              },
                              true);
                          break;
                          case "definition":
                              realm.create("Definition",{
                                  id:item.sys.id,
                                  key:item.fields.key,
                                  definition:item.fields.definition,
                                  country:item.fields.country
                              },
                              true);
                          break;
                          case "resource":
                              realm.create("Resource",{
                                  id:item.sys.id,
                                  title:item.fields.title,
                                  link:item.fields.link != null ? item.fields.link : "",
                                  country:item.fields.country,
                                  type:item.fields.type,
                                  description:item.fields.description != null ? item.fields.description : "",
                                  order:item.fields.order != null ? item.fields.order : 0,
                              },
                              true);
                          break;
                          case "map":
                              realm.create("Map",{
                                  id:item.sys.id,
                                  country:item.fields.country,
                                  name:item.fields.name,
                                  label:item.fields.label != null ? item.fields.label : "",
                                  level:item.fields.level,
                                  geojson:item.fields.geojson != null ? JSON.stringify(item.fields.geojson) : null,
                                  sublevel:item.fields.sublevel != null ? JSON.stringify(item.fields.sublevel) : null,
                              },
                              true);
                          break;
                          case "mapDetail":
                          realm.create("MapDetail",{
                              id:item.sys.id,
                              country:item.fields.country,
                              name:item.fields.name,
                              type:item.fields.type,
                              description:item.fields.description != null ? item.fields.description : "",
                              color:item.fields.color != null ? item.fields.color : "",
                              mapItem:item.fields.mapItem != null ? JSON.stringify(item.fields.mapItem) : null,
                              indicator:item.fields.indicator != null ? JSON.stringify(item.fields.indicator) : null,
                              data:JSON.stringify(item.fields)
                          },
                          true);
                          break;
                          case "partnerMap":

                          realm.create("PartnerMap",{
                              id:item.sys.id,
                              country:item.fields.country,
                              partnerID:item.fields.partner != null ? item.fields.partner.sys.id : "",
                              mapItem:item.fields.mapItem != null ? item.fields.mapItem.sys.id : "",
                              data:JSON.stringify(item.fields)
                          },
                          true);
                          break;
                          case "mapData":

                            realm.create("MapData",{
                                id:item.sys.id,
                                country:item.fields.country,
                                data:item.fields.data != null ? JSON.stringify(item.fields.data) : ""
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


export function NextContent(index){
    switch(index){
        case 0:
            return "indicator";
        case 1:
            return "groups";
        case 2:
            return "events";
        case 3:
            return "map";
        case 4:
            return "resource";
        case 5:
            return "reportingFrequency";
        case 6:
            return "mapData";
        default:
        return "-END-";
    }
}

export function CheckDeleted(delUrl,selectedCountry,version){

    return GetData(delUrl).then((data) =>{


        if(data == "error")
        {
            return "error";
        }
        else
        {

            var realm = GetDB();
            var items = data.items;

            if(items != null) {

                realm.write(() =>{
                    items.forEach(item => {
                    if(item.sys.type == "DeletedEntry")
                    {
                        //Data has been deleted on the server side. Remove from local DB
    
                        //Since only the ID is given, we need to check each schema for a match
                        DeleteItem(realm,"Indicator",item.sys.id); 
                        DeleteItem(realm,"Bookmark",item.sys.id); 
                        DeleteItem(realm,"Group",item.sys.id);
                        DeleteItem(realm,"Event",item.sys.id);
                        DeleteItem(realm,"Map",item.sys.id);
                        DeleteItem(realm,"MapDetail",item.sys.id);
                        DeleteItem(realm,"MapData",item.sys.id);
                        DeleteItem(realm,"Resource",item.sys.id);
                        DeleteItem(realm,"ReportingFrequency",item.sys.id);
                        DeleteItem(realm,"Definition",item.sys.id);
                        DeleteItem(realm,"PartnerMap",item.sys.id);
                    }
                    });
                });

            }

            //Results limited to 100 a page. Check if there is another page
            if(data.nextPageUrl != null){
               
                var delUrl = data.nextPageUrl + "&access_token=" + accessToken;
    
                return CheckDeleted(delUrl,selectedCountry,version);
            }
            else{
                realm.write(()=>{
                    realm.create("Settings",
                    {
                        key:"nextDelSync",
                        value:data.nextSyncUrl
                    },
                    true);
                });
    
            
                realm.write(() =>{
    
                    realm.create("Settings",{
                        key:"version - " + selectedCountry,
                        value:version
                    },
                    true);
    
                });
            
    
                return "success";
            }
            
        }
    });
}

export function DeleteItem(realm,schema,id){
        var del = realm.objects(schema).filtered('id = $0',id);
            
        if(del.length > 0)
            realm.delete(del);
    
}

//---------------------------------------------------------------------------------------------------------------------------------

// export function GetData(theUrl){

//     const apiUrl =  theUrl; 

//     let data = {}; 
    
//     return fetch(apiUrl)
//       .then((response) => response.json())

//       .catch((error) =>{

//         return "error";
//     });
    
// };


// export function InitialSync(){
//     return InitialSyncData().then((data)=>{
//         if(data == "error")
//         {
//             return "error";
//         }
//         else
//         {
//             var realm = GetDB();

//             if(realm.objects("Settings").length == 0){
//                 realm.write(()=>{
//                     realm.create("Settings",
//                     {
//                         key:"nextSyncURL",
//                         value:data.nextSyncUrl
//                     });
//                 });

//                 return GetContentData().then((cData) =>{

//                     SaveContentData(cData);

//                     SaveData(data.items).then((sucess) =>{

//                         if(sucess){

//                             return "success";
                            
//                         }
//                     });

//                 });         

//             }
//         }
//     })
// }

// export function Sync(){
//     return GetContentData().then((cData)=>{

//         //Check for a problem
//         if(cData =="error")
//             return "error";

//         SaveContentData(cData);

//         return SyncData().then((data)=>{

//             var realm = GetDB();

//             //Save the next sync URL
//             realm.write(()=>{
//                 realm.create("Settings",
//                 {
//                     key:"nextSyncURL",
//                     value:data.nextSyncUrl
//                 },
//                 true);
//             });

//             //Check if any updates were found
//             if(data.items.length == 0)
//                 return "noData"

//             return SaveData(data.items).then((sucess) =>{

//                 if(sucess){

//                     return "success";
                    
//                 }
//             });

//         });
//     });
// }

// export function InitialSyncData(){
//     const apiUrl =  url + spaceID +  "/sync?access_token=" + accessToken + "&initial=true"; 

    
//     return fetch(apiUrl)
//       .then((response) => response.json())

//       .catch((error) =>{

//         return "error";
//     });
// }



// export function GetContentData(){
//     const apiUrl =  url + spaceID +  "/content_types/indicator?access_token=" + accessToken + ""; 

//     let data = {}; 
    
//     return fetch(apiUrl)
//       .then((response) => response.json())

//       .catch((error) =>{

//         return "error";
//     });
// }



// export function SaveContentData(data){
//     var realm = GetDB();

//     realm.write(() =>{

//         realm.create("Model",{
//             id:data.sys.id,
//             data:JSON.stringify(data)
//         },
//         true);

//     });

// }

// export function DeleteItem(realm,schema,id){
//     var del = realm.objects(schema).filtered('id = "'+ id +'"');
        
//     if(del.length > 0)
//         realm.delete(del);

// }

