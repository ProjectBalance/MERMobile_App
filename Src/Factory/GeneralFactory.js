import React,{Component} from 'react';

import * as DataFactory from './DataFactory';

export function GetAbout(){
    var realm = DataFactory.GetDB();

    var aboutList = realm.objects("About").sorted("order");

    return aboutList;
}

export function GetDefinitions(selectedCountry){
    var realm = DataFactory.GetDB();
    var defList = [];
    // var defList = realm.objects("Definition").filtered('country = "' + selectedCountry + '"');

    var res = realm.objects("Resource").filtered('type = $0 and country= $1',"Definition",GetSelectedCountry()).sorted("title");

    res.forEach(r=> {
        defList.push({
            key:r.title,
            definition:r.description
        });
    });

    return defList;
}

export function GetResources(){
    var realm = DataFactory.GetDB();

    var resourceList = realm.objects("Resource");

    return resourceList;
}



export function GetSelectedCountry(){
    var realm = DataFactory.GetDB();
    var sc = realm.objects("Settings").filtered('key = "selectedCountry"');

    if(sc == null || sc == "")
        return "";
    else
        return sc[0].value;
}

export function GetLastUpdated(selectedCountry){
    var realm = DataFactory.GetDB();
    var lu = realm.objects("Settings").filtered('key = "lastUpdated - ' + selectedCountry + '"');

    if(lu == null || lu == "")
        return "1900-01-01";
    else
        return lu[0].value;
}

export function GetContentVersion(selectedCountry){
    var realm = DataFactory.GetDB();
    var cv = realm.objects("Settings").filtered('key = "version - ' + selectedCountry + '"');

    if(cv == null || cv == "")
        return "N/A";
    else
        return cv[0].value;
}

export function CheckURL(url){

    if(url.startsWith("www"))
        url = "http://" + url;

    return url;
}

export function BlendColor(color,shade)
{
    const pSBC=(p,c0,c1,l)=>{
        let r,g,b,P,f,t,h,i=parseInt,m=Math.round,a=typeof(c1)=="string";
        if(typeof(p)!="number"||p<-1||p>1||typeof(c0)!="string"||(c0[0]!='r'&&c0[0]!='#')||(c1&&!a))return null;
         let pSBCr=(d)=>{
            let n=d.length,x={};
            if(n>9){
                [r,g,b,a]=d=d.split(","),n=d.length;
                if(n<3||n>4)return null;
                x.r=i(r[3]=="a"?r.slice(5):r.slice(4)),x.g=i(g),x.b=i(b),x.a=a?parseFloat(a):-1
            }else{
                if(n==8||n==6||n<4)return null;
                if(n<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(n>4?d[4]+d[4]:"");
                d=i(d.slice(1),16);
                if(n==9||n==5)x.r=d>>24&255,x.g=d>>16&255,x.b=d>>8&255,x.a=m((d&255)/0.255)/1000;
                else x.r=d>>16,x.g=d>>8&255,x.b=d&255,x.a=-1
            }return x};
        h=c0.length>9,h=a?c1.length>9?true:c1=="c"?!h:false:h,f=pSBCr(c0),P=p<0,t=c1&&c1!="c"?pSBCr(c1):P?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},p=P?p*-1:p,P=1-p;
        if(!f||!t)return null;
        if(l)r=m(P*f.r+p*t.r),g=m(P*f.g+p*t.g),b=m(P*f.b+p*t.b);
        else r=m((P*f.r**2+p*t.r**2)**0.5),g=m((P*f.g**2+p*t.g**2)**0.5),b=m((P*f.b**2+p*t.b**2)**0.5);
        a=f.a,t=t.a,f=a>=0||t>=0,a=f?a<0?t:t<0?a:a*P+t*p:0;
        if(h)return"rgb"+(f?"a(":"(")+r+","+g+","+b+(f?","+m(a*1000)/1000:"")+")";
        else return"#"+(4294967296+r*16777216+g*65536+b*256+(f?m(a*255):0)).toString(16).slice(1,f?undefined:-2)
    }

    return pSBC(shade,color);
}

export function sortList(list,sortBy){
    var sortedList = [];
    var prev = "";
    
    for (let i = 0; i < sortBy.length; i++) {
        var s = sortBy[i];

        if(prev == ""){
            sortedList = sort(list,s.by,s.ascDesc);

        }
        else{
            var dist = distinct(sortedList,prev);

            var filteredSortedList = [];
            for (let d = 0; d < dist.length; d++) {
                var distVal = dist[d];

                var filtered = filter(sortedList,prev,distVal);

                filtered.forEach(f=>{
                    filteredSortedList.push(f);
                })
                
            }

            sortedList = filteredSortedList;
        }

        prev = s.by;
    }

    return sortedList;
}

export function sort(list,sortBy,ascDesc){

    if(ascDesc == "asc"){
        list.sort(function(a,b){
            if(a[sortBy] < b[sortBy]) { return -1; }
            if(a[sortBy] > b[sortBy]) { return 1; }
            return 0;
        });
    }
    else{
        list.sort(function(a,b){
            if(a[sortBy] < b[sortBy]) { return 1; }
            if(a[sortBy] > b[sortBy]) { return -1; }
            return 0;
        });
    }

    return list;
}

export function distinct(list,distinctBy){
    var distinctList = [];
    list.forEach(d=>{
        if(!distinctList.includes(d[distinctBy]))
            distinctList.push(d[distinctBy]);

    });

    return distinctList;
}

export function filter(list,filterBy, value){
    var filteredList = [];
    list.forEach(f =>{
        if(f[filterBy] == value)
        filteredList.push(f);
    });

    return filteredList;
}