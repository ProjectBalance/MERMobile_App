import React, {Component} from 'react';
import {View, Text} from 'react-native';

import { Toolbar } from 'react-native-material-ui';

import MapItem from '../Coms/MapItem';

export default class MapScreen extends Component{


    render(){
        return(
            <View style={{flex:1}}>
                  <Toolbar
                    leftElement="menu"
                    centerElement="Maps"
                    onLeftElementPress={() => {this.props.navigation.toggleDrawer()}}
                    />
                <View style={{flex:1}}>
                    <MapItem country={"South Africa"} level={1}/>
                </View>
                
            </View>
        );
    }
}