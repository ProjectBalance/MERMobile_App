import React, {Component} from 'react';
import {View,ScrollView,Text,  StyleSheet,Image,TouchableOpacity} from 'react-native';
import {Button, ListItem} from 'react-native-elements';

import * as DataFactory from '../../../../Factory/DataFactory';
import * as GeneralFactory from '../../../../Factory/GeneralFactory';
import * as MapFactory from '../../../../Factory/MapFactory';

import Collapsible from 'react-native-collapsible';

import {referenceColor} from '../../../../Global/style.json';

const styles = StyleSheet.create({
  
    header: {
        fontWeight:"bold"
    },

  });



export default class MapKey extends Component{

    constructor(props){
        super(props);

        this.state = {
            keyData:[]
        }
    }

    displayHorizontalKey(){
        var country = GeneralFactory.GetSelectedCountry();
        var config = MapFactory.GetMapConfig(country,this.props.level,this.props.parent,this.props.state,this.props.selected,this.props.mapDataID);
        var key = config.mapping.key;
        var keys = [];

        if(config.mapping.format =="value"){
            key.forEach(k=>{
                keys.push(
                    <View key={keys.length + 1} style={{flexDirection:"row", width:'50%', marginBottom:5}}>
                        <Text style={{width:25,backgroundColor:k.color, marginRight:10}}> </Text>
                        <Text style={{fontWeight:"bold"}}>{k.value}</Text>
                    </View>
                );
               
            });
        }
        else{
            key.forEach(k=>{
                keys.push(
                    <View key={keys.length + 1} style={{flexDirection:"row", width:'50%', marginBottom:5}}>
                        <Text style={{width:25,backgroundColor:k.color, marginRight:10}}> </Text>
                        <Text style={{fontWeight:"bold"}}>{k.min} - {k.max}</Text>
                    </View>
                );
               
            });
        }
        

        keys.push(
            <View key={keys.length + 1} style={{flexDirection:"row", width:'50%', marginBottom:5}}>
                <Text style={{width:25,backgroundColor:"#C3C3C3", marginRight:10}}> </Text>
                <Text style={{fontWeight:"bold"}}>No Data</Text>
            </View>
        );

        this.setState({
            keyData:keys,
        })

    }

    displayVerticalKey(){
        var country = GeneralFactory.GetSelectedCountry();
        var config = MapFactory.GetMapConfig(country,this.props.level,this.props.parent,this.props.state,this.props.selected,this.props.mapDataID);
        var key = config.mapping.key;
        var keys = [];

        var val;

       
        
        key.forEach(k=>{

            if(config.mapping.format =="value"){
                val = k.value;
            }
            else{
                if(k.max == "" || k.max == null)
                    val = k.min + " + ";
                else
                    val = k.min + " - " + k.max;
            }   

            keys.push(
                <View key={keys.length + 1} style={{flex:1, marginBottom:5, alignItems:"center"}}>
                    <Text style={{width:35,backgroundColor:k.color}}> </Text>
                    <Text style={{fontWeight:"bold"}}>{val}</Text>
                </View>
            );
           
        });

        keys.push(
            <View key={keys.length + 1} style={{flex:1, marginBottom:5, alignItems:"center"}}>
                <Text style={{width:35,backgroundColor:"#C3C3C3", marginRight:10}}> </Text>
                <Text style={{fontWeight:"bold"}}>No Data</Text>
            </View>
        );

        this.setState({
            keyData:keys,
        })

    }

    componentDidMount(){
        this.displayVerticalKey();
    }

    render(){
  
        return(
           <View style={{flexDirection:"row", padding:10, backgroundColor:"#FFF"}}>
               {this.state.keyData}
           </View>
        
        );
    }

}