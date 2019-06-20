import React, {Component} from 'react';
import {View,Text, Button, StyleSheet,TouchableHighlight} from 'react-native';
import { Toolbar } from 'react-native-material-ui';

export default class Resultcreen extends Component{

    render(){
        return(
            <View>
                  <Toolbar
                    leftElement="arrow-back"
                    centerElement="Search Results"
                    onLeftElementPress={() => {this.props.navigation.popToTop()}}
                    />
                <Text>Search results go here</Text>
            </View>
        );
    }

}