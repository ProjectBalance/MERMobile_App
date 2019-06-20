import React, {Component} from 'react';
import {View, Text} from 'react-native';

import { Toolbar } from 'react-native-material-ui';

export default class SettingsScreen extends Component{


    render(){
        return(
            <View>
                  <Toolbar
                    leftElement="menu"
                    centerElement="Settings"
                    onLeftElementPress={() => {this.props.navigation.toggleDrawer()}}
                    />
                <Text>This is the Settings Screen</Text>
            </View>
        );
    }
}