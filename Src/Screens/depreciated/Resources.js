import React, {Component} from 'react';
import {View, Text} from 'react-native';

import { Toolbar } from 'react-native-material-ui';

export default class ResourceScreen extends Component{


    render(){
        return(
            <View>
                  <Toolbar
                    leftElement="menu"
                    centerElement="Resources"
                    onLeftElementPress={() => {this.props.navigation.toggleDrawer()}}
                    />
                <Text>This is the Resource Screen</Text>
            </View>
        );
    }
}