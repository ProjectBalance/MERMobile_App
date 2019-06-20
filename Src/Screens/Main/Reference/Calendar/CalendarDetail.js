import React, {Component} from 'react';
import {View,ScrollView, Text} from 'react-native';

import { Toolbar } from 'react-native-material-ui';

import {Calendar} from 'react-native-calendars';

import Realm from 'realm';

import * as DateFactory from '../../../../Factory/DateFactory';
import * as DataFactory from '../../../../Factory/DataFactory';
import * as TextFactory from '../../../../Factory/TextFactory';
import {referenceColor} from '../../../../Global/style.json';


export default class CalendarDetail extends Component{

    static navigationOptions = {
        title: 'Calendar Event',
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

        this.state = {
           title:"",
           dates:"",
           location:"",
           description:""
        }
    }


    componentDidMount(){
        var realm = DataFactory.GetDB();
        var id = this.props.navigation.getParam("id","");

        var event = realm.objects("Event").filtered('id = $0',id);
        
        var date = DateFactory.FormatDate(event[0].startdate);
        if(event[0].enddate != "")
            date = date + " - " + DateFactory.FormatDate(event[0].enddate);

        var color = JSON.parse(event[0].data).color;

        this.setState({
            title:event[0].name,
            dates:date,
            location:event[0].location,
            description:event[0].description,
            color:color
        });
    }

    render(){
        
        return(
            <View style={{flex: 1, paddingTop:10, paddingLeft:5,paddingRight:5, backgroundColor:'#FFFFFF'}}>
                <View style={{flexDirection:'row'}}>
                    <Text style={{backgroundColor:this.state.color, width:10, marginRight:10}} /><Text style = {{fontWeight:'bold', fontSize:TextFactory.GetFontSize(20)}}>{this.state.title}</Text>
                </View>
                <View style={{marginTop:20}}>
                    <Text style={{fontWeight:'bold', fontSize:TextFactory.GetFontSize(17)}}>Date:</Text>
                    <Text style={{fontSize:TextFactory.GetFontSize(17)}}>{this.state.dates}</Text>
                </View>
                <View  style={{marginTop:20}}>
                    <Text style={{fontWeight:'bold', fontSize:TextFactory.GetFontSize(17)}}>Location:</Text>
                    <Text style={{fontSize:TextFactory.GetFontSize(17)}}>{this.state.location}</Text>
                </View>
                <ScrollView  style={{marginTop:20}}>
                    <Text style={{fontWeight:'bold', fontSize:TextFactory.GetFontSize(17)}}>Description:</Text>
                    <Text style={{fontSize:TextFactory.GetFontSize(17)}}>{this.state.description}</Text>
                </ScrollView>
             
            </View>
           
        );
    }
}