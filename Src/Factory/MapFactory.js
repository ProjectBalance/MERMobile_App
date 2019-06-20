import React, {Component} from 'react'
import * as DataFactory from './DataFactory';
import * as GeneralFactory from './GeneralFactory';

export function GetMapFeatures(country,level,parent){
    var realm = DataFactory.GetDB();

    if(parent != null) //Get all maps belonging to the parent
    {
        var maps = GetSubLevels(parent);
        return maps
    }
    else //Get all maps at the given level
    {
        var maps = realm.objects("Map").filtered('country == "' + country + '" && level=' + level).sorted("name");

        return maps
    }
}

export function GetMap(id){
    var realm = DataFactory.GetDB();

    var maps = realm.objects("Map").filtered('id == "' + id + '"');

    return maps
}

export function GetSubLevels(parentID){

    var maps = GetMap(parentID);

    if(maps.length > 0){
        if(maps[0].sublevel != null){
            var subs = JSON.parse(maps[0].sublevel);
            var subMaps = [];

            subs.forEach(s => {
                var sm = GetMap(s.sys.id);
                subMaps.push(sm[0]);
            });

            return subMaps;
        }
    }

    return [];
}

export function GetParent(id){
    var maps =GetMap(id);
    if(maps.length > 0){
        var m = map[0];

        if(m.level != 1){
            var realm = DataFactory.GetDB();
            var parentMaps = realm.objects("Map").filtered('level == '+ m.level - 1 +' && country == "' + m.country + '"');
        }
        else //Level 1 is the top most level and won't have a parent
        {
            return null
        }
    }
}

export function SaveBookmark(name,bookmarked,level,state,selected,parent){
    var realm = DataFactory.GetDB();

    var country = GeneralFactory.GetSelectedCountry();
    var s = selected == null ? "" : selected;
    var p = parent == null ? "" : parent;

    realm.write(()=>{
        if(bookmarked)
        {
            

            realm.create("BookmarkMap",{
                country:country,
                name:name,
                level:level.toString(),
                state:state,
                selected:s,
                parent:p
            },
            true);
        }
       else
       {
           var bm = realm.objects("BookmarkMap").filtered('level = $0 and state = $1 and selected = $2 and parent = $3 and country = $4',level.toString(),state,s,p,country);
           realm.delete(bm);
       }
    });
}

export function GetBookmark(level,state,selected,parent){
    var realm = DataFactory.GetDB();
    
    var country = GeneralFactory.GetSelectedCountry();

    var s = selected == null ? "" : selected;
    var p = parent == null ? "" : parent;

    // var test = {
    //     level:level,
    //     state:state,
    //     selected:s,
    //     parent:p
    // }

    // alert(JSON.stringify(test));

    var bmList = realm.objects("BookmarkMap").filtered('level = $0 and state = $1 and selected = $2 and parent = $3 and country = $4',level.toString(),state,s,p,country);

    var bookmark = "star-o";

    if(bmList.length > 0)
    bookmark = "star";
        
    return bookmark;
}


export function GetNextHeapMap(country,level,parent,state,selected){
    var realm = DataFactory.GetDB();
    var mapData = realm.objects("MapData").filtered('country = $0', country);
    var mapDataID = "";
    var config = {};
    
    mapData.forEach(md => {
        var data = JSON.parse(md.data);

        //Find the configuration that matches the level and state
        //Level 0 means for all levels
        data.config.forEach(c =>{
            if((c.level == parseInt(level) || parseInt(level) == 0) && c.display == state.toLowerCase())
                config = c;
        });

        if(config.type == "heatmap"){
            mapDataID = md.id;
        }

    });

    return mapDataID;
}
//Determine which configuration the map is displaying
export function GetMapConfig(country,level,parent,state,selected,mapDataID){
    var realm = DataFactory.GetDB();
    var mapData = realm.objects("MapData").filtered('country = $0 and id = $1', country,mapDataID);
    var config= {};

    mapData.forEach(md => {
        var data = JSON.parse(md.data);

        //Find the configuration that matches the level and state
        //Level 0 means for all levels
        data.config.forEach(c =>{
            if((c.level == parseInt(level) || parseInt(level) == 0) && c.display == state.toLowerCase())
                config = c;
        });

    });

    return config;
}

export function GetDataTitle(mapDataID){
    var realm = DataFactory.GetDB();
    var mapData = realm.objects("MapData").filtered('id = $0', mapDataID);

    if(mapData.length > 0){
        var d = JSON.parse(mapData[0].data);
        return d.info;
    }
        

    return "";
}

export function GetDataList(country,level,state){
    var realm = DataFactory.GetDB();
    var mapData = realm.objects("MapData").filtered('country = $0', country);
    var list = [];
    mapData.forEach(md => {
       
        if(md.data != null && md.data != "")
        {
            var d = JSON.parse(md.data);
            var hasConfig = false;

            //Check if there is a config for the level and state
            d.config.forEach(c=>{
                if((c.level == parseInt(level) || parseInt(level) == 0) && c.display == state.toLowerCase()){
                    hasConfig = true;
                }
            })

            if(hasConfig){
                list.push({
                    id:md.id,
                    info:d.info
                });
            }
        }
        
    });

    return list;
}

export function GetMapData(country,mapDataID){
    var realm = DataFactory.GetDB();
    var mapData = realm.objects("MapData").filtered('country = $0 and id = $1', country, mapDataID);

    if(mapData.length > 0)
        return mapData[0];
    else    
        return null;
}

//Get the data associated with the mapDataID
export function GetMapDataData(country,mapDataID){
    var realm = DataFactory.GetDB();
    var mapData = realm.objects("MapData").filtered('country = $0 and id = $1', country, mapDataID);

    var data = [];
    
    mapData.forEach(md => {

        if(md.data != "" && md.data != null){

            var d = JSON.parse(md.data);
            data = d.data;
        }
        

    });

    return data;
}
export function GetHeatMapColor(map,mapping,data){
    var m = mapping.map;
    var dataList = [];

    //Get the data associated with the map item
    data.forEach(d =>{
        if(d[m] == map.name){
            dataList.push(d);
        }
    })

    var result;

    if(mapping.calculation == "formula"){
        var total = 0;
        var actual = 0;

        

        dataList.forEach(d => {
            total += parseInt(d[mapping.total]);
            actual += parseInt(d[mapping.actual]);
        });

        switch (mapping.format) {
            case "percentage":
                result = Math.round(actual / total * 100);
            break;
            case "addition":
                result = actual + total;
            break;
            case "difference":
                result = total - actual;
            break;
            default:
                result = 0;
            break;
        }
    }
    else{
        dataList.forEach(d => {
            result = d[mapping.value];
        });
    }
        

    var keys = mapping.key;
    var color = "#C3C3C3";

    if(mapping.format == "value"){
        keys.forEach(k =>{
            if(result == k.value)
                color = k.color;
        });
        
    }
    else{
        keys.forEach(k =>{
            var min = parseInt(k.min);

            //If max is blank or null, we assume there is an infinite max range, 
            if(k.max == "" || k.max == null){
                if(result >= min)
                    color = k.color;
            }
            else{
                var max = parseInt(k.max);

                if(result >= min && result <= max)
                    color = k.color;
            }
            
        });
    }
   

    return color;
}

export function HasHeatMap(country,level,parent,state,selected,mapDataID){
    var config = GetMapConfig(country,level,parent,state,selected,mapDataID);
    if(config.type == "heatmap")
        return true;

    
    return false;        
}

export function LoadMapFeatures(country,level,parent,state,selected,mapDataID){
    var maps = GetMapFeatures(country,level,parent);
    var data = GetMapDataData(country,mapDataID);
    var config = GetMapConfig(country,level,parent,state,selected,mapDataID);
    
    var mapFeatures = {type:"FeatureCollection",features:[]};

    maps.forEach(map => {
        var geo = JSON.parse(map.geojson);
        var feature = geo.features[0];
        feature["mapID"] = map.id;
        feature["mapName"] = map.label;

        if(parent != null)
        feature["parentID"] = parent;

        if(state != "All"){
            if(selected == map.id){
                if(config.type == "heatmap")
                    feature["color"] = GetHeatMapColor(map,config.mapping,data);
                else
                feature["color"] = "#4D7FBB";
            }
            else{
                feature["color"] = "#C3C3C3";
            }
        }
        else{
            // feature["color"] = GetAgencyColor(map.id);
            if(config.type == "heatmap")
                feature["color"] = GetHeatMapColor(map,config.mapping,data);
            else
                feature["color"] = "#C3C3C3";       
        }
        

        mapFeatures.features.push(feature);
    });

    return JSON.stringify(mapFeatures);
}

export function GetAgencyColor(mapID){
    var realm = DataFactory.GetDB();

    var mapDetail = realm.objects("MapDetail").filtered('type = "Agency" and country = $0', GeneralFactory.GetSelectedCountry());

    var color = "#C3C3C3";

    mapDetail.forEach(m=>{
        var mapItems = JSON.parse(m.mapItem);

        if(mapItems != null){
            //Check if the agency is linked to one of the Map Items in the current level
            mapItems.forEach(mi => {
                if(mi.sys.id == mapID)
                color = m.color;
            });
        }
    });

    return color;
}

export function GetHTML(country,level,selected,parent,state,mapDataID){
    var scale = 200;
    if(level == 1)
        scale = 200;
    
    if(level == 2)
        scale = 550;

    var html = `
        <!DOCTYPE html>
        <html>
        <script src="./d3.min.js"></script>
        <style>

            html, body {
                margin: 0;
                height: 100%;
            }
            
            .background {
            fill: #FFF;
            pointer-events: all;
            }

            .map-layer {
            fill: #C3C3C3;
            stroke: #787878;
            }

    </style>

        <body>
            <svg></svg>
        </body>

       
        
        <script type="text/javascript">
    
            var mapData = `+ LoadMapFeatures(country,level,parent,state,selected,mapDataID) + `

            // Load map data
            var features = mapData.features;
            
            var width = document.body.offsetWidth,
            height = document.body.offsetHeight,
            centered;
            

            var center = d3.geo.centroid(mapData);
            var scale  = 360;
            // var scale  = (360 * width / (center[0] - center[1]));
            var offset = [width/2, height/2];

            var projection = d3.geo.mercator()
            .scale(scale)
            .center(center)
            .translate(offset);

            var path = d3.geo.path()
            .projection(projection);

            var bounds  = path.bounds(mapData);
            var boundDiff = bounds[1][0] - bounds[0][0];
            
            var adjustment = 200;
            
            if(boundDiff <= 50)
                adjustment = 550;

            if(boundDiff <= 15)
                adjustment = 2000;


            var hscale  = (scale*width  / (bounds[1][0] - bounds[0][0])) - adjustment ;
            var vscale  = (scale*height / (bounds[1][1] - bounds[0][1])) - adjustment;
            var scale   = (hscale < vscale) ? hscale : vscale;
            var offset  = [width - (bounds[0][0] + bounds[1][0])/2,
                              height - (bounds[0][1] + bounds[1][1])/2];
      
            // new projection
            projection = d3.geo.mercator().center(center)
              .scale(scale).translate(offset);
            path = path.projection(projection);

            // Set svg width & height
            var svg = d3.select('svg')
            .attr('width', width)
            .attr('height', height);

            // Add background
            svg.append('rect')
            .attr('class', 'background')
            .attr('width', width)
            .attr('height', height)
            .on('click', clicked);


            var g = svg.append('g');


            var mapLayer = g.append('g')
            .classed('map-layer', true);
            
            

            document.addEventListener("message", function(data) {
            alert(data.data);
            });

            function waitForBridge() {

                //the react native postMessage has only 1 parameter
                //while the default one has 2, so check the signature
                //of the function
            
                if (window.postMessage.length !== 1){
                    setTimeout(waitForBridge, 2000);
                }
                else {
                    
                }
            }
        
            window.onload = waitForBridge;


            window.load = init();
            function init(){
               
                var zoom = d3.behavior.zoom()
                .translate(projection.translate())
                .scale(projection.scale())
                .on("zoom", zoomed);
    
                
                
                
                // Update color scale domain based on data
                //color.domain([0, d3.max(features, nameLength)]);
                
                
                // Draw each province as a path
                mapLayer.selectAll('path')
                  .data(features)
                .enter().append('path')
                  .attr('d', path)
                  .attr('vector-effect', 'non-scaling-stroke')
                  .style('fill', fillFn)
                  .on('click', clicked)
                  .call(zoom);

                mapLayer.selectAll("text")
                .data(features)
                .enter()
                .append("text")
                .text(function(d){
                    return d.mapName;
                })
                .attr("x", function(d){
                    return path.centroid(d)[0];
                })
                .attr("y", function(d){
                    return  path.centroid(d)[1];
                })
                .attr("text-anchor","middle")
                .attr("font-family","arial")
                .attr('font-size','11px')
                .attr('stroke','black')
                .attr('fill','black');

                window.postMessage("mapLoaded");
            }

            
            
            function runFromInjected(){
                alert("this code is run from injected");
            }

            // Get province name
            function nameFn(d){
                return d && d.properties ? d.properties.name : null;
            }

            // Get province name length
            function nameLength(d){
                var n = nameFn(d);
                return n ? n.length : 0;
            }

            // Get province color
            function fillFn(d){
                //return color(nameLength(d));
                return d.color;
            }

            function clicked(d){

                if (d && centered !== d) {
                    var id = "m:" + d.mapID.toString() + "|";
                    if(d.parentID != null)
                        id += "p:" + d.parentID.toString();
                        
                    window.postMessage(id);
                    //centered = d;
                } else {
                    window.postMessage("");
                    //centered = null;
                }

                // Highlight the clicked province
                // mapLayer.selectAll('path')
                //     .style('fill', function(d){return centered && d===centered ? '#D5708B' : fillFn(d);});

            }

            // When clicked, zoom in
            function clicked_old(d) {


                

                var x, y, k;

                // Compute centroid of the selected path
                if (d && centered !== d) {
                    var centroid = path.centroid(d);
                    x = centroid[0];
                    y = centroid[1];
                    k = 2;
                    centered = d;
                } else {
                    x = width / 2;
                    y = height / 2;
                    k = 1;
                    centered = null;
                }

                // Highlight the clicked province
                mapLayer.selectAll('path')
                    .style('fill', function(d){return centered && d===centered ? '#D5708B' : fillFn(d);});

                // Zoom
                g.transition()
                    .duration(750)
                    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')scale(' + k + ')translate(' + -x + ',' + -y + ')');
            }

            function zoomed() {
                //projection.translate(d3.event.translate).scale(d3.event.scale);
                //g.selectAll("path").attr("d", path)
            }

        </script>
        </html>
    `;

  
    return html;
}