import React, {Component} from 'react';
import {View,ScrollView, Text} from 'react-native';

import { Toolbar } from 'react-native-material-ui';

import Calendar from '../../Coms/Calendar/Calendar';

import * as DateFactory from '../../Factory/DateFactory';
import * as EventFactory from '../../Factory/EventFactory';

export default class CalendarScreen extends Component{

    constructor(props){
        super(props);

        this.state = {
            events:[],
            eventDay:DateFactory.GetDateToday()
        }
    }

    loadEvents =(day)=>{

        this.setState({
            events:EventFactory.GetEvents(day.dateString),
            eventDay:day.dateString
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
            <View style={{flex: 1}}>
                <Toolbar
                leftElement="menu"
                centerElement="Calendar"
                onLeftElementPress={() => {this.props.navigation.toggleDrawer()}}
                />

                <Calendar loadEvents={this.loadEvents} markedDates = {EventFactory.MarkEventDays()}/>

                <View 
                    style={{
                        paddingTop:10,
                        paddingLeft:5,
                        paddingRight:5,
                        flex:1
                    }}
                >
                    <Text
                        style={{
                            fontSize:15,
                            fontWeight:"bold",
                            marginBottom:10
                        }}
                    >Events: {this.state.eventDay}</Text>
                    <ScrollView>
                        {this.state.events}
                    </ScrollView>
                    
                </View>
            </View>
           
        );
    }
}