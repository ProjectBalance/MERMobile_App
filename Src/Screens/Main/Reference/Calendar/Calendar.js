import React, {Component} from 'react';
import {View,Dimensions,ScrollView, Text} from 'react-native';

import { Toolbar } from 'react-native-material-ui';

import {Calendar} from 'react-native-calendars';

import * as DateFactory from '../../../../Factory/DateFactory';
import * as EventFactory from '../../../../Factory/EventFactory';
import * as TextFactory from '../../../../Factory/TextFactory';

import {referenceColor} from '../../../../Global/style.json';

const { width, height } = Dimensions.get('window');
const heightLimit = 650;

export default class CalendarScreen extends Component{

    static navigationOptions = {
        title: 'Calendar',
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
        var month = DateFactory.GetThisMonth();
        var year = DateFactory.GetThisYear();

        this.state = {
            markedDates:EventFactory.MarkEventDays(month,year),
            events:[],
            eventLabel:""
        }
    }

    loadEvents =(day)=>{

        var events = EventFactory.GetEvents(day.dateString,this.viewDetails)
        this.setState({
            events:events,
            eventLabel:events.length + " Events on: " + day.dateString
        })

    }

    viewDetails = (id) =>{
        this.props.navigation.navigate('CalendarDetail',{id:id});
    }

    loadMarkedDates(month,year){
        this.setState({
            markedDates:EventFactory.MarkEventDays(month,year),
            events:[],
            eventLabel: "Tap a day to view events"
        })
    }

    componentDidMount(){

        var currentDate = {
            dateString: DateFactory.GetDateToday()
        }


        this.loadEvents(currentDate);
    }

    render(){
        
        return(
            <ScrollView style={{flex: 1}}>

                <View>
                    <Calendar 
                        onDayPress={(day) => this.loadEvents(day)}
                        markedDates = {this.state.markedDates}
                        // markedDates = {{
                        //     '2019-02-01':{
                        //         periods:[
                        //          {startingDay: true,endingDay:false,color:'#123456'}   
                        //         ]
                        //     },
                        //     '2019-02-02':{
                        //         periods:[
                        //             {startingDay: false,endingDay:false,color:'#123456'}   
                        //         ]
                        //     },
                        //     '2019-02-03':{
                        //         periods:[
                        //             {startingDay: false,endingDay:true,color:'#123456'}   
                        //         ]
                        //     },

                        //     }}
                        onMonthChange={(cal) => this.loadMarkedDates(cal.month,cal.year)}
                        markingType='multi-period'
                    />
                </View>

                <View 
                    style={{
                        paddingTop:10,
                        // paddingLeft:5,
                        // paddingRight:5,
                        paddingBottom:10,
                        flex:1
                    }}
                >
                    <Text
                        style={{
                            fontSize:TextFactory.GetFontSize(15),
                            fontWeight:"bold",
                            marginBottom:10,
                            paddingLeft:5
                        }}
                    >{this.state.eventLabel}</Text>
                    <ScrollView>
                        {this.state.events}
                    </ScrollView>
                </View>
            </ScrollView>
           
        );
    }
}