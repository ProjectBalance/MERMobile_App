import React, {Component} from 'react';
import {View, Text,Alert,Platform,WebView,StyleSheet,ScrollView,TouchableOpacity,TouchableHighlight,Modal} from 'react-native';

import { Toolbar } from 'react-native-material-ui';

import {referenceColor} from '../../../../Global/style.json';

import * as MapFactory from '../../../../Factory/MapFactory';
import * as GeneralFactory from '../../../../Factory/GeneralFactory';
import * as IndicatorFactory from '../../../../Factory/IndicatorFactory';

import { ListItem, Icon, Avatar } from 'react-native-elements';

import PartnerList from './PartnerList';

import FavIcon from '../Favourite/FavIcon';
import BottomBar from '../../../../Coms/BottomBar';

import RNPicker from 'react-native-picker-select';

import TabbedGroup from './TabbedGroup';
import HeatMap from './HeatMap';
import MapKey from './MapKey';

// import { map } from 'rsvp';

const isAndroid =  Platform.OS==='android'

export default class MapScreen extends Component{

    static navigationOptions = ({navigation}) => {
        return {
            title: navigation.getParam("title","National"),
            headerStyle: {
              backgroundColor: referenceColor,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerRight: <FavIcon onPress={() => navigation.navigate("Favourites")}/>,
            headerRightContainerStyle:{paddingRight:15}
        }
       
    };

    constructor(props){
        super(props);

        var s = this.props.navigation.getParam("selected",null);
        var p = this.props.navigation.getParam("parent",null);

        
        // var country = GeneralFactory.GetSelectedCountry();
        var level = this.props.navigation.getParam("level","1");
        var displayState = this.props.navigation.getParam("state","All");
        var selected = s =="" ? null : s;
        var parent = p == "" ? null : p;

        var bookmarked = MapFactory.GetBookmark(level,displayState,selected,parent);

        var d = MapFactory.GetDataList(GeneralFactory.GetSelectedCountry(),level,displayState);
        var mapDataID = "";
        var mapDataList = [];
        var mapDataTitle = "";

        if(d.length > 0)
        {

            mapDataID = d[0].id;
            mapDataTitle = d[0].info;

            d.forEach(md =>{
                mapDataList.push({
                    label:md.info,
                    value:md.id
                })
            })   
        }   

        var mapTitle = "";

        if(parent != null){
            var m = MapFactory.GetMap(parent);
            mapTitle = m[0].name;
        }
            
        

        if(selected != null){
            var m = MapFactory.GetMap(selected);
            
            mapTitle = m[0].name;
        }
            

        this.state={
            // html:MapFactory.GetHTML(country,level,selected,parent,displayState),
            html:"",
            mapInfo:"",
            level:level,
            displayState:displayState,
            selected:selected,
            parent:parent,
            mapDataID:mapDataID,
            mapDataTitle:mapDataTitle,
            mapDataList:mapDataList,
            mapData:<View></View>,
            bookmarked:bookmarked,
            modalVisible:false,
            mapTitle:mapTitle,
            keyData:[]
        }
    }


    onMessage = (event) =>{
        var data = event.nativeEvent.data;

        // alert(data);

        if(data != ""){

            if(data == "mapLoaded"){
                
            }
            else{
                var currentState = this.state.displayState;

                var ids = data.split("|");
                var m = ids[0].split(":");
    
                var p = null;
                if(ids[1] != null)
                {
                    var pl = ids[1].split(":");
                    var p = pl[1];
                }
    
                var drilldown = true;

                if(this.state.displayState != "All"){
                    if(this.state.selected != null){
                        if(this.state.selected != m[1]){
                            currentState = "All";
                        }
                    }
                }

                if(drilldown){
                    var map = MapFactory.GetMap(m[1]);
            
                    if(map.length > 0){
             
        
                        var nextState = currentState == "All" ? "Focused" : "All";
                        var nextLevel = currentState == "All" ? parseInt(this.state.level) : parseInt(this.state.level) + 1;
                        // var mapTitle = nextLevel == 1 ? "National" : map[0].name;
                        var mapTitle =  map[0].name;
        
                        var selected = currentState == "All" ? map[0].id : null;
                        var parent = currentState == "Focused" ? map[0].id : this.state.parent;
    
        
                        //Check if the map can drill down to the next level
                        var features = MapFactory.GetMapFeatures(GeneralFactory.GetSelectedCountry(),nextLevel,parent);
                        if(features.length > 0){
                            //Navigate to a new map page. 
                            this.props.navigation.push("MapScreen",{title:mapTitle,level:nextLevel,state:nextState,selected:selected, parent:parent});
                        }
                        
                    }
                }
            }
        }

        
      }
  
      sendMessage = ()=>{
        this.webViewRef.postMessage("Sent from RN!");
      }

      refresh(){
          this.webViewRef.reload();
      }


    bookmark(){
        var b = "star";
        var bookmarked = true;

        var name = this.props.navigation.getParam("title","National");

        if(this.state.bookmarked == "star"){
            b = "star-o";
            bookmarked = false
            Alert.alert(name,"Removed from favourites");
        }
        else{
            Alert.alert(name,"Added to favourites");
        }

        this.setState({
            bookmarked:b
        });

        MapFactory.SaveBookmark(name,bookmarked,this.state.level,this.state.displayState,this.state.selected,this.state.parent);
    }

    displayMapData(){
        var country = GeneralFactory.GetSelectedCountry();

        // var data = MapFactory.GetMapData(country,this.state.mapDataID);
        var config = MapFactory.GetMapConfig(country,this.state.level,this.state.parent,this.state.displayState,this.state.selected,this.state.mapDataID);
        
        if(config != null && JSON.stringify(config) != "{}"){
            
            
            var data = MapFactory.GetMapDataData(country,this.state.mapDataID);
            var mapFeatures = this.getMapFeatures(country);

            if(config.type == "heatmap")
                this.processHeatmap(config.mapping,data,mapFeatures);
    
            if(config.type == "tabbedGroup")
                this.processTabbedGroup(config.mapping,data,mapFeatures);
        }

    }

    processHeatmap(mapping,data,mapFeatures){


        var heatmap = 

        <HeatMap 
            data={data}
            maps={mapFeatures}
            mapping={mapping}
        />

        this.setState({
            mapData:heatmap
        })

    }

    processTabbedGroup(mapping,data,mapFeatures){

        var tabs = mapping.tabs;

        var tabbedGroup = 

        <TabbedGroup 
            tabs={tabs}
            data={data}
            maps={mapFeatures}
            mapping={mapping}
        />

        this.setState({
            mapData:tabbedGroup
        })
    }

    getMapFeatures(country){
        var mapFeatures = MapFactory.GetMapFeatures(country,this.state.level,this.state.parent);

        if(this.state.selected == null){
            return mapFeatures;
        }
        else
        {
            var maps = [];

            mapFeatures.forEach(mf=>{
                if(mf.id == this.state.selected)
                    maps.push(mf);
            });

            return maps;
        }
    }

    reloadMapData(id){
        var title = MapFactory.GetDataTitle(id);
        this.setState({
            mapDataID:id,
            mapDataTitle:title,
            mapData:[]
        },()=>{
            
            var country = GeneralFactory.GetSelectedCountry();

            if(MapFactory.HasHeatMap(country,this.state.level,this.state.parent,this.state.displayState,this.state.selected,this.state.mapDataID)){
                this.setKeyData(this.state.mapDataID);

                this.setState({
                    html:MapFactory.GetHTML(country,this.state.level,this.state.selected,this.state.parent,this.state.displayState,this.state.mapDataID),
                    
                });
               
            }
            
            this.displayMapData();
            
        })
    }

    setKeyData(mapDataID){
        var country = GeneralFactory.GetSelectedCountry();

        if(MapFactory.HasHeatMap(country,this.state.level,this.state.parent,this.state.displayState,this.state.selected,mapDataID)){
           var key = <MapKey
            country={country}
            level={this.state.level}
            parent={this.state.parent}
            state={this.state.displayState}
            selected={this.state.selected}
            mapDataID={mapDataID}
           />

           this.setState({
               keyData:key
           })
        }
    }
    
    componentDidMount(){


        this.displayMapData();

        var country = GeneralFactory.GetSelectedCountry();
        var mapDataID = this.state.mapDataID;

        //Check if the default selected Map Data has a heatmap
        if(!MapFactory.HasHeatMap(country,this.state.level,this.state.parent,this.state.displayState,this.state.selected,this.state.mapDataID)){
            var nextHeatMapID = MapFactory.GetNextHeapMap(country,this.state.level,this.state.parent,this.state.displayState,this.state.selected);
            
            if(nextHeatMapID != "")
                mapDataID = nextHeatMapID;
        }

        this.setKeyData(mapDataID);

        this.setState({
            html:MapFactory.GetHTML(country,this.state.level,this.state.selected,this.state.parent,this.state.displayState,mapDataID),
        });

    }

    setModalVisible(visible) {

        this.setState({modalVisible: visible});
    }

    render(){
        return(
            <View style={{flex:1}}>
                <View style={{height:50, backgroundColor:"#FFF"}}>
                    {this.state.keyData}
                </View>
                <View style={{flex:1, overflow:"hidden"}}>
                        <WebView
                            ref={(ref) => { this.webViewRef = ref }}
                            originWhitelist={['*']}
                            source={{html: this.state.html, baseUrl: isAndroid?'file:///android_asset/map.html':'./external/map.html'}}
                            javaScriptEnabled={true}
                            // injectedJavaScript={jsCode}
                            onMessage={this.onMessage}
                        />
                </View>
                <View >
                    <View style={{padding:5, backgroundColor:'#FFF'}}>
                        <Text>{this.state.mapTitle}</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <View style={{flex:1}}>
                        {/* <RNPicker 
                            // placeholder={{
                            //     label: "",
                            //     value: null
                            // }}
                            value={this.state.mapDataID}
                            items={this.state.mapDataList}
                            onValueChange={(value) => {
                               this.reloadMapData(value);
                            }}>
                        </RNPicker> */}
                            {/* <Text style={{fontWeight:'bold',padding:10}}>{this.state.mapInfo}</Text> */}
                        </View>
                        <View style={{padding:10}}>
                            <TouchableOpacity
                                onPress={() =>this.bookmark()}
                            >
                                <Icon 
                                    name={this.state.bookmarked}
                                    type="font-awesome"
                                    color="#696969"
                                    size={24}                            
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* {this.state.mapData} */}

                </View>
                <BottomBar 
                    color={referenceColor}
                    rightIcon={
                        <TouchableOpacity onPress={() => this.setModalVisible(!this.state.modalVisible)}>
                            <View style={{flexDirection:"row"}}>
                                <View style={{justifyContent:"center"}}>
                                    <Text style={{color:'#FFF', fontWeight:"bold"}}>
                                        Tap to View Data
                                    </Text>
                                </View>
                                <Avatar 
                                    size="medium"
                                    rounded 
                                    icon={{ name:"toggle-up", type:"font-awesome"}} 
                                    overlayContainerStyle={{backgroundColor:referenceColor}} 
                                    activeOpacity={0.7}
                                />
                            </View>
                        </TouchableOpacity>
                       
                    }
                    
                />

                <Modal
                 animationType="slide"
                 transparent={true}
                 visible={this.state.modalVisible}
                 onRequestClose={() => {
                    this.setModalVisible(!this.state.modalVisible);
                 }}
               >
                   <View style={{flex:1}}>
                        <View style={{flex:1}}>
                                <TouchableHighlight
                                style={{flex:1}}
                                                onPress={() => {
                                                this.setModalVisible(!this.state.modalVisible);
                                                }}>
                                                <View></View>
                                </TouchableHighlight>
                        </View>
                        <BottomBar 
                            color={referenceColor}
                            rightIcon={
                                    <TouchableOpacity onPress={() => this.setModalVisible(!this.state.modalVisible)}>
                                        <View style={{flexDirection:"row"}}>
                                            <View style={{justifyContent:"center"}}>
                                                <Text style={{color:'#FFF', fontWeight:"bold"}}>
                                                    Tap to Hide Data
                                                </Text>
                                            </View>
                                            <Avatar 
                                                size="medium"
                                                rounded 
                                                icon={{ name:"toggle-down", type:"font-awesome"}} 
                                                overlayContainerStyle={{backgroundColor:referenceColor}} 
                                                activeOpacity={0.7}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                
                            
                            }
                            
                        />
                        <View style={{backgroundColor:"#FFF"}}>
                            <RNPicker 
                                value={this.state.mapDataID}
                                items={this.state.mapDataList}
                                onValueChange={(value) => {
                                this.reloadMapData(value);
                                }}>
                            </RNPicker>
                        </View>
                        <View style={{backgroundColor:"#FFF", padding:5}}>
                                <Text>{this.state.mapDataTitle}</Text>
                        </View>
                        <View style={{flex:2, backgroundColor:"#FFF", paddingTop:5,paddingBottom:5, borderTopColor:"#3C3C3C", borderTopWidth:1}}>
                            {this.state.mapData}
                        </View>
                   </View>
               </Modal>
            </View>
        );
    }
}


  