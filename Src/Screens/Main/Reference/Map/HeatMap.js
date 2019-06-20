import React, {Component} from 'react';
import {View,ScrollView,Text,  StyleSheet,Image,TouchableOpacity} from 'react-native';
import {Button, ListItem} from 'react-native-elements';

import * as DataFactory from '../../../../Factory/DataFactory';
import * as GeneralFactory from '../../../../Factory/GeneralFactory';
import * as MapFactory from '../../../../Factory/MapFactory';

import Collapsible from 'react-native-collapsible';

import {referenceColor} from '../../../../Global/style.json';
import { green } from 'ansi-colors';

const styles = StyleSheet.create({
  
    header: {
        fontWeight:"bold"
    },

  });



export default class HeatMap extends Component{
    constructor(props){
        super(props);

        this.state = {
            data:[]
        }
    }

    processHeatmap(mapping,data,mapFeatures){

        var dataList = [];

        var sortedList = [];

        mapFeatures.forEach(mf =>{
            
            var map = mf.name;
            var total = 0;
            var actual = 0;
            var result = 0;
            var value;
            
            data.forEach(d=>{
                if(d[mapping.map] == mf.name){
                       
                    if(mapping.format != "value"){
                    
                        total += parseInt(d[mapping.total]);
                        actual += parseInt(d[mapping.actual]);
                        
                    }
                    else{
                        value = d[mapping.value];
                    }
                }
                
            });
            
            

            switch (mapping.format) {
                case "percentage":
                    if(total == 0)
                        result = "0%";
                    else
                        result = Math.round(actual / total * 100) + "%";
                break;
                case "addition":
                    result = actual + total;
                break;
                case "difference":
                    result = total - actual;
                break;
                case "value":
                    result = value;
                break;
                default:
                    result = value;
                break;
            }

            var color = MapFactory.GetHeatMapColor(mf,mapping,data);

           sortedList.push({
               map:map,
               total:total,
               actual:actual,
               value:result,
               color:color
           });

          


        });

        if(mapping.sort != null)
            sortedList = GeneralFactory.sortList(sortedList,mapping.sort);

        sortedList.forEach(s=>{
            var columns;

            if(mapping.format == "value"){
                columns =   <View style={{justifyContent:"center"}}>
                                <View style={{flexDirection:'row'}}>
                                    <View style={{padding:2}}>
                                        <Text style={{backgroundColor:s.color, width:10}}> </Text>
                                    </View>
                                    <View style={{flex:1}}>
                                        <Text>{s.map}</Text>
                                    </View>
                                    <View style={{flex:1}}>
                                        <Text>{s.value}</Text>
                                    </View>
                                </View>
                            </View>
            }
            else{
                columns =   <View style={{justifyContent:"center"}}>
                                <View style={{flexDirection:'row'}}>
                                    <View style={{padding:2}}>
                                        <Text style={{backgroundColor:s.color, width:10}}> </Text>
                                    </View>
                                    <View style={{flex:2}}>
                                        <Text>{s.map}</Text>
                                    </View>
                                    <View style={{flex:1}}>
                                        <Text>{s.total}</Text>
                                    </View>
                                    <View style={{flex:1}}>
                                        <Text>{s.actual}</Text>
                                    </View>
                                    <View style={{flex:1}}>
                                        <Text>{s.value}</Text>
                                    </View>
                                </View>
                            </View>
            }

            dataList.push(
                <ListItem
                key={dataList.length + 1}
                title={columns}
                containerStyle={{borderBottomColor:"#C3C3C3", borderBottomWidth:1}}
            />
            );
        });

        var scrollable = 
        <ScrollView>
            {dataList}
        </ScrollView>

        this.setState({
            data:scrollable
        })
    }

    componentDidMount(){
        this.processHeatmap(this.props.mapping, this.props.data, this.props.maps);
    }

    render(){
        var columns;

        if(this.props.mapping.format == "value"){
            columns =   <View style={{flexDirection:"row", padding:5, borderBottomWidth:1, borderBottomColor:'#C3C3C3'}}>
                            <View style={{flex:1}}>
                                <Text style={styles.header}>{this.props.mapping.map}</Text>
                            </View>
                            <View style={{flex:1}}>
                                <Text style={styles.header}>{this.props.mapping.value}</Text>
                            </View>
                        </View>
        }
        else{
            columns =   <View style={{flexDirection:"row", padding:5, borderBottomWidth:1, borderBottomColor:'#C3C3C3'}}>
                            <View style={{flex:2}}>
                                <Text style={styles.header}>{this.props.mapping.map}</Text>
                            </View>
                            <View style={{flex:1}}>
                                <Text style={styles.header}>{this.props.mapping.total}</Text>
                            </View>
                            <View style={{flex:1}}>
                                <Text style={styles.header}>{this.props.mapping.actual}</Text>
                            </View>
                            <View style={{flex:1}}>
                                <Text style={styles.header}>{this.props.mapping.value}</Text>
                            </View>
                        </View>
                        
        }
  
        return(
            <View style={{flex:1}}>
                {/* <View style={{flexDirection:"row", padding:5, borderBottomWidth:1, borderBottomColor:'#C3C3C3'}}>
                    <View></View>
                    <View style={{flex:2}}>
                        <Text style={styles.header}>{this.props.mapping.map}</Text>
                    </View>
                    <View style={{flex:1}}>
                        <Text style={styles.header}>{this.props.mapping.total}</Text>
                    </View>
                    <View style={{flex:1}}>
                        <Text style={styles.header}>{this.props.mapping.actual}</Text>
                    </View>
                    <View style={{flex:1}}>
                        <Text style={styles.header}>{this.props.mapping.value}</Text>
                    </View>
                </View> */}
                {columns}
                <ScrollView>
                    {this.state.data}
                </ScrollView>
            </View>
        
          
        );
    }
}