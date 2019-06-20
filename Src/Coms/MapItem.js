import React, {Component} from 'react'
import {Platform,WebView,StyleSheet,View,ScrollView,Text,TouchableOpacity} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome';

import * as MapFactory from '../Factory/MapFactory';
import * as GeneralFactory from '../Factory/GeneralFactory';

const isAndroid =  Platform.OS==='android'

export default class MapItem extends Component{

    constructor(props){
        super(props);

        var country = GeneralFactory.GetSelectedCountry();

        this.state={
            html:MapFactory.GetHTML(country,this.props.level),
            mapInfo:"",
            selected:null,
            drillDownStack:[],
            stackIndex:-1
        }
    }

    displayMapInfo (map){
        var mapinfo = map.name;

        var subs = MapFactory.GetSubLevels(map.id);

        if(subs.length > 0){
            mapinfo += "\nSub Levels: \n";

            subs.forEach(s => {
                mapinfo += "\n " + s.name;
            });

        }
        


        this.setState({
            mapInfo:mapinfo,
        });
    }

    onMessage = (event) =>{
        var data = event.nativeEvent.data;

        if(data != ""){
            var ids = data.split("|");
            var m = ids[0].split(":");

            var p = null;
            if(ids[1] != null)
            {
                var pl = ids[1].split(":");
                var p = pl[1];
            }


            var map = MapFactory.GetMap(m[1]);
        
            if(map.length > 0){
                // var mapinfo = map[0].name;

                // var subs = MapFactory.GetSubLevels(map[0].id);

                // if(subs.length > 0){
                //     mapinfo += "\nSub Levels: \n";

                //     subs.forEach(s => {
                //         mapinfo += "\n " + s.name;
                //     });

                // }
              
                this.displayMapInfo(map[0]);


                this.setState({
                    // mapInfo:mapinfo,
                    selected:map[0].id
                })
            }
            else{
                this.setState({
                    mapInfo:"",
                    selected:null
                })
            }
        }
        else{
            if(this.state.drillDownStack.length > 0){
                var stack = this.state.drillDownStack;
                var parent = stack[stack.length - 1];
                var map = MapFactory.GetMap(parent);
                this.displayMapInfo(map[0]);
            }
            else{
                this.setState({
                    mapInfo:"",
                    selected:null
                })
            }
            
        }
        
      }
  
      sendMessage = ()=>{
        this.webViewRef.postMessage("Sent from RN!");
      }

      refresh(){
          this.webViewRef.reload();
      }
    
      drillDown(){

        if(this.state.selected != null){
            var stack = this.state.drillDownStack;
            stack.push(this.state.selected);
    
            this.setState({
                html:MapFactory.GetHTML(this.props.country,this.props.level,this.state.selected),
                selected:null,
                stackIndex: this.state.stackIndex + 1,
                drillDownStack:stack
            });
        }
        

        // if(this.state.currentMap != null){
        //     this.setState({
        //         html:MapFactory.GetHTML(this.props.country,this.props.level,this.state.currentMap),
        //         currentMap:null
        //     });
        // }
           
      }

      drillUp(){
        if(this.state.drillDownStack.length > 0){
            var stack = this.state.drillDownStack;
            var parent = stack.pop();

            if(stack.length > 0)
            {
                parent = stack[stack.length - 1];
                var map = MapFactory.GetMap(parent);
                this.displayMapInfo(map[0]);
            }
            else
            {
                parent = null;
                this.setState({
                    mapInfo:""
                });
            }

            this.setState({

                html:MapFactory.GetHTML(this.props.country,this.props.level,parent),
                selected:null,
                stackIndex: this.state.stackIndex + 1,
                drillDownStack:stack
             });
        }
        
   }

    render(){

        return(
            <View style={{flex:1}}>
                <View style={{flex:1}}>
                    <WebView
                        ref={(ref) => { this.webViewRef = ref }}
                        originWhitelist={['*']}
                        source={{html: this.state.html, baseUrl: isAndroid?'file:///android_asset/map.html':'./external/map.html'}}
                        javaScriptEnabled={true}
                        // injectedJavaScript={jsCode}
                        onMessage={this.onMessage}
                    />
                </View>
                <View style={{flex:1}}>
                    <View style={{height:40,padding:5, backgroundColor:"#D3D5D4", flexDirection:"row"}}>
                        {/* <TouchableOpacity onPress={() => this.refresh()}>
                            <Icon name={"refresh"} size={30}/>
                        </TouchableOpacity> */}
                        <TouchableOpacity onPress={() => this.drillUp()}>
                            <Icon name={"arrow-circle-o-up"} size={30}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.drillDown()}>
                            <Icon name={"arrow-circle-o-down"} size={30}/>
                        </TouchableOpacity>
                    </View>
                    <ScrollView >
                        <Text style={{fontSize:20, fontWeight:"bold"}}>{this.state.mapInfo}</Text>
                    </ScrollView>
                </View>
                
            </View>
        );
    }

}
