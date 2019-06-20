import React, {Component} from 'react';
import {View,ScrollView,Text, StyleSheet,TouchableHighlight,NetInfo,ActivityIndicator} from 'react-native';
import {Button} from 'react-native-elements';
import { Toolbar } from 'react-native-material-ui';

import {orientationColor,defaultFont} from '../../../Global/style.json';

import * as DateFactory from '../../../Factory/DateFactory';
import * as DataFactory from '../../../Factory/DataFactory';
import * as GeneralFactory from '../../../Factory/GeneralFactory';

import AboutItem from '../../../Coms/AboutItem';

export default class Orientation extends Component{
    static navigationOptions = ({navigation}) => {
    return {
        title: navigation.getParam("title","Details"),
        headerStyle: {
            backgroundColor: orientationColor,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
            fontWeight: 'bold',
            },
        };
    };

    constructor(props){
        super(props);
  
        var country = GeneralFactory.GetSelectedCountry();
        this.state={
            description:<Text></Text>,
            definitions:GeneralFactory.GetDefinitions(country)
        }
        
    }

    componentDidMount(){
        var realm = DataFactory.GetDB();
        var o = realm.objects("Resource").filtered('id= "' + this.props.navigation.getParam("id","") + '"');

        var desc = <AboutItem text={o[0].description} definitions={this.state.definitions}/>
        this.setState({
            description:desc
        })
    }

    render(){
        return(
            <ScrollView style={{backgroundColor:'#FFF'}}>

                {this.state.description}

            </ScrollView>
        );
    }

}