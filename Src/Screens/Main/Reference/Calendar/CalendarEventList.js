import React, {Component} from 'react';
import {View,Text, ScrollView,Button, StyleSheet,TouchableHighlight} from 'react-native';

import * as EventFactory from '../../../../Factory/EventFactory';
import { Icon } from 'react-native-elements';

import {referenceColor} from '../../../../Global/style.json';


export default class CalendarEventList extends Component{

    static navigationOptions = {
        title: 'Calendar Events',
        headerStyle: {
          backgroundColor: referenceColor,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
    };

    constructor(props){
        super(props);
        var day = this.props.navigation.getParam("day","");

        this.state = {
            events:EventFactory.GetEvents(day.dateString,this.viewDetails),
            eventDay:day.dateString
        }
    }

    viewDetails = (id) =>{
        this.props.navigation.navigate('CalendarDetail',{id:id});
    }

    render(){
        return(
            <View 
                    style={{
                        flex:1
                    }}
                >
                <View style={{flex:1,                        
                        paddingTop:10,
                        paddingLeft:5,
                        paddingRight:5,}}>
                    <Text
                        style={{
                            fontSize:15,
                            fontWeight:"bold",
                            marginBottom:10
                        }}
                    >Events on: {this.state.eventDay}</Text>
                    <ScrollView>
                        {this.state.events}
                    </ScrollView>
                </View>
                
                
                
            </View>
        );
    }

}