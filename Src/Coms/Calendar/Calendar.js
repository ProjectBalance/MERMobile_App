import React, {Component} from 'react';
import {View,Text, Button, StyleSheet,TouchableHighlight} from 'react-native';
import {Calendar} from 'react-native-calendars';

export default class Calendar extends Component{

    // render(){
    //     return (
    //         <View>
    //             <CalendarList
    //             // Enable horizontal scrolling, default = false
    //             horizontal={true}
    //             // Enable paging on horizontal, default = false
    //             pagingEnabled={true}

    //             onDayPress={(day) => this.props.loadEvents(day)}

    //             markedDates = {
    //                 this.props.markedDates
    //             }
    //             />
    //         </View>
    //     );
    // }

    render(){
        return (
            <View>
                <Calendar 
                    onDayPress={(day) => this.props.loadEvents(day)}
                    markedDates = {
                        this.props.markedDates
                    }
                />
            </View>
        );
    }
}