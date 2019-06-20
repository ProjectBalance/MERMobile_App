import React, {Component} from 'react';
import {View,ScrollView, Text,StyleSheet, Button, Modal, TouchableHighlight} from 'react-native';
import IndicatorItem from '../../../../Coms/Indicator/IndicatorItem';


import Collapsible from 'react-native-collapsible';

import * as DataFactory from '../../../../Factory/DataFactory';
import * as GeneralFactory from '../../../../Factory/GeneralFactory';
import * as MapFactory from '../../../../Factory/MapFactory';

import {referenceColor} from '../../../../Global/style.json';
import {ListItem, Icon, CheckBox, Avatar } from 'react-native-elements';

import BottomBar from '../../../../Coms/BottomBar';

export default class FavouriteMap extends Component{

    static navigationOptions = ({navigation}) => {
        return {
            title: "Maps",
            headerStyle: {
                backgroundColor: referenceColor,
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                fontWeight: 'bold',
                },
            };
        };

    constructor(props){
        super(props);
        
        this.state ={
            maps:[]

        }
    }

    loadMaps(){
        var realm = DataFactory.GetDB();

        var country = GeneralFactory.GetSelectedCountry();

        var maps = realm.objects("BookmarkMap").filtered("country = $0",country);

        var list = [];

        maps.forEach(m=>{
            var title = m.name;

            // if(m.selected != "")
            // {
            //     var map = MapFactory.GetMap(m.selected)[0];
            //     title += " - " + map.name;
            // }

            list.push(
                <ListItem 
                    key={list.length + 1}
                    chevron
                    title={title}
                    titleStyle={{color:referenceColor, fontWeight:'bold'}}
                    containerStyle={{backgroundColor:'#FFFFFF',borderBottomColor:"#C3C3C3", borderBottomWidth:1}}
                    onPress={() => this.props.navigation.push("MapScreen",{title:m.name,level:m.level,state:m.state,selected:m.selected, parent:m.parent})}
                />
            )
        })

        this.setState({
            maps:[]
        },()=>{
            this.setState({
                maps:list
            })
        })
    }

    
    componentDidMount(){
        this.focusListener = this.props.navigation.addListener("didFocus", () => {
            this.loadMaps();
        });
      
    }

    componentWillUnmount() {
        // Remove the event listener
        this.focusListener.remove();
    }
  

    render(){

        return(
            <View style={{flex:1}}>
                <View style={{flex:1}}>
                    <ScrollView>
                        {this.state.maps}
                    </ScrollView>
                </View>
                <BottomBar color={referenceColor}/>
            </View>
        );
    }
}
