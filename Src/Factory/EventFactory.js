import React,{Component} from 'react';
import {View,Text} from 'react-native';

import EventItem from '../Coms/Calendar/EventItem';
import Realm from 'realm';
import * as Schema from '../Model/Schema';
import {ListItem} from 'react-native-elements';

import * as DateFactory from './DateFactory';
import * as DataFactory from './DataFactory';
import * as TextFactory from './TextFactory';
import * as GeneralFactory from './GeneralFactory';

import {referenceColor} from '../Global/style.json';

export function GetEvents(day,onclick){
    //ToDO: Load events from local store
    var numEvents = 0;
    var events = [];

    var convertedDate = new Date(day);
    convertedDate.setHours(0,0,0,0);

    var realm = DataFactory.GetDB();
    // var eList = realm.objects("Event").filtered('startdate <= $0 and enddate >= $1 and country = $2',convertedDate,convertedDate,GeneralFactory.GetSelectedCountry());
    var eList = realm.objects("Event").filtered('country = $0',GeneralFactory.GetSelectedCountry());



    eList.forEach(e => {
        var startDate = new Date(e.startdate);
        var endDate = new Date(e.enddate);

        startDate.setHours(0,0,0,0);
        endDate.setHours(0,0,0,0);

        if(startDate <= convertedDate && endDate >= convertedDate)
        {
            var color = JSON.parse(e.data).color;

            events.push(
                <ListItem 
                    key={events.length + 1}
                    chevron
                    title = {<View style={{flexDirection:'row'}}>
                        <Text style={{backgroundColor:color, width:10, marginRight:10}}></Text>
                        <Text style={{fontSize:TextFactory.GetFontSize(15)}}>{e.name}</Text>
                    </View>}
                    onPress={() => onclick(e.id)}
                    containerStyle={{borderBottomColor:"#C3C3C3", borderBottomWidth:1}}
               />
            );
        }
       
    });

    return events;
}

// //Get all days with events
// export function MarkEventDays(month){
//     var markedDates = {};
//         var country = GeneralFactory.GetSelectedCountry();
//         var realm = DataFactory.GetDB();

//         var events = realm.objects("Event").filtered("country = $0",country).sorted('startdate');

//         var index = 0;
//         var periodStack = 0;

//         //Loop through each event
//         events.forEach(e => {

//             var sdate = new Date(e.startdate);
//             var edate = new Date(e.enddate);

//             var theEnd = false;
//             var currentDate = new Date(e.startdate);

//             var eData = JSON.parse(e.data);

//             //Loop through the period the event spans
//             while(!theEnd){
//                 if(currentDate <= edate){
//                     var date = DateFactory.FormatDate(currentDate);
//                     var isStart = false;
//                     var isEnd = false;

//                     if(currentDate == sdate)
//                         isStart = true;
                    
//                     if(currentDate == edate)
//                         isEnd = true;

//                     //Check if there is a period stack for the given date
//                     if(markedDates[date] == null){
//                         //create a new period object
//                         markedDates[date] = {periods:[]};
//                     }

//                     if(markedDates[date].periods.length == 0)
//                     markedDates[date].periods.push(
//                             {
//                                 startingDay:isStart,
//                                 endingDay:isEnd,
//                                 color:eData.color
//                             }
//                         );
//                     else{

//                         var filled = false
//                         //Check if the amount of stack items matches the event index. if not, then add empty placeholders. 
//                         while(!filled){
//                             if(markedDates[date].periods.length < periodStack){
//                                 markedDates[date].periods.push(
//                                     {
//                                         color:'transparent'
//                                     }
//                                 );
//                             }
//                             else{
//                                 markedDates[date].periods.push(
//                                     {
//                                         startingDay:isStart,
//                                         endingDay:isEnd,
//                                         color:eData.color
//                                     }
//                                 );
//                                 filled = true;
//                             }
//                         }
                        
//                     }

//                     //go to the next day
//                     currentDate.setDate(currentDate.getDate() + 1);
//                 } 
//                 else{
//                     theEnd = true;
//                 }
//             };

//             // markedDates[date] = marked;   
//             index += 1;
//             periodStack += 1;
//         });

        
//     return markedDates;
// }

// function getPeriodStack(currentDate,events){
//     var count = 0;
//     events.forEach(e => {
//         var sdate = new Date(e.startdate);
//         var edate = new Date(e.enddate);

//         //Only count the stack if 
//         if(sdate <= currentDate && edate >= currentDate)
//             count += 1;
//     });

//     return count;
// }

//Get all days with events for the month
export function MarkEventDays(month,year){
    var markedDates = {};

    var events = GetMonthEvents(month,year);

    var days = DateFactory.GetDaysInMonth(month,year);

    var test = [];

    //Loop through the days 
    for (let d = 1; d <= days; d++) {
        for (let i = 0; i < events.length; i++) {
            var e = events[i];

            var day = new Date(year,month - 1,d);
            var sdate = new Date(e.startdate);
            var edate = new Date(e.enddate);

            var isStart = false;
            var isEnd = false;

             //Check if day is a start or end date
             if(DateFactory.FormatDate(day) == DateFactory.FormatDate(sdate))
                isStart = true;

            if(DateFactory.FormatDate(day) == DateFactory.FormatDate(edate))
                isEnd = true;

            day.setHours(0,0,0,0);
            sdate.setHours(0,0,0,0);
            edate.setHours(0,0,0,0);

            //Check if the day falls within the event period
            if(sdate <= day && edate >= day)    
            {
                test.push(
                    {
                        day:day,
                        sdate:sdate,
                        edate:edate
                    }
                )

                var eData = JSON.parse(e.data);
                //convert day into a format the calendar can use
                var date = DateFactory.FormatDate(day);

                //Check if there is a period stack for the given date
                if(markedDates[date] == null){
                    //create a new period object
                    markedDates[date] = {periods:[]};
                }

                markedDates[date].periods.push(
                    {
                        startingDay:isStart,
                        endingDay:isEnd,
                        color:eData.color
                    }
                );

                // //If the event is the first on the stack, then do a straight push
                // if(markedDates[date].periods.length == 0)
                //     markedDates[date].periods.push(
                //             {
                //                 startingDay:isStart,
                //                 endingDay:isEnd,
                //                 color:eData.color
                //             }
                //         );
                // else{

                //     var filled = false
                //     //Check if the amount of stack items matches the event index. if not, then add empty placeholders. 
                //     while(!filled){
                //         if(markedDates[date].periods.length < i){
                //             markedDates[date].periods.push(
                //                 {
                //                     color:'transparent'
                //                 }
                //             );
                //         }
                //         else{
                //             markedDates[date].periods.push(
                //                 {
                //                     startingDay:isStart,
                //                     endingDay:isEnd,
                //                     color:eData.color
                //                 }
                //             );
                //             filled = true;
                //         }
                //     }
                    
                // }
            }    
        }
    }    

    // alert(JSON.stringify(test));
    // alert(JSON.stringify(markedDates));    
    return markedDates;
}

//Get all the events where the start and end date fall within the month
export function GetMonthEvents(month,year){
    var realm = DataFactory.GetDB();

    var country = GeneralFactory.GetSelectedCountry();
    var events = realm.objects("Event").filtered("country = $0",country).sorted("startdate");
    var monthEvents = [];

    var test = [];

    events.forEach(e=>{

        var sdate = new Date(e.startdate);
        var edate = new Date(e.enddate);

        test.push(
            {
                name:e.name,
                month:month,
                year:year,
                sMonth:sdate.getMonth() + 1,
                sYear:sdate.getFullYear(),
                eMonth:edate.getMonth() + 1,
                eYear:edate.getFullYear()
            }
        )
        //Check if the either the start or end date falls within the month and year
        if(sdate.getMonth() + 1 <= month && sdate.getFullYear() <= year && edate.getMonth() + 1 >= month && edate.getFullYear() >= year)
            monthEvents.push(e);

    });

    // alert(JSON.stringify(monthEvents));
    // alert(JSON.stringify(test));
    return monthEvents;
}

//We want to stack the events in a set order
function CreateEventStack(events){
    var eventStack = [];
    var index = 0;

    events.forEach(e=>{
        eventStack.push(
            {
                event:e,
                index:index
            }

        );
        index += 1;    
    });


    return eventStack
}