import React, {Component} from 'react';
import {View,ScrollView,Image,Dimensions,Text, StyleSheet,TouchableHighlight,NetInfo,ActivityIndicator} from 'react-native';
import {Button, Tile, Card} from 'react-native-elements';


import {orientationColor} from '../../../Global/style.json';

import * as DateFactory from '../../../Factory/DateFactory';
import * as DataFactory from '../../../Factory/DataFactory';
import * as TextFactory from '../../../Factory/TextFactory';
import * as GeneralFactory from '../../../Factory/GeneralFactory';


const { width, height } = Dimensions.get('window');

export default class HowToItem extends Component{
    
    constructor(props){
        super(props);
  
        var country = GeneralFactory.GetSelectedCountry();

        
    }

    render(){
        return (

            <ScrollView>
                {/* <Tile
                    imageSrc = {this.props.image}

                    activeOpacity={1}
                    title={this.props.title}
                    height={height * 0.6}
                >
                    <Text>{this.props.description}</Text>
                </Tile> */}

                    <Image
                        source={this.props.image}
                        resizeMode="contain"
                        style={{height:height*0.6,width:width, backgroundColor:"#696969"}}
                    />

                   
                    <Text
                        style={{padding:10, fontSize:TextFactory.GetFontSize(17)}}
                    >{this.props.description}</Text>
                    
                    

                {/* <Card 
                    title={this.props.title}
                    image={this.props.image}
                    imageProps={{resizeMode:"contain"}}
                    containerStyle={{height:height * 0.7}}
                >
                    <Text>{this.props.description}</Text>
                </Card> */}
            </ScrollView>

        );
        

    };

}