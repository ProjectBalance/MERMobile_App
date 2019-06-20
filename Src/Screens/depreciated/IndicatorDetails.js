import React, {Component} from 'react';
import {View,Text, Button, StyleSheet,TouchableHighlight} from 'react-native';
import { Toolbar } from 'react-native-material-ui';
import Details from '../Coms/Indicator/Details';
import * as IndicatorFactory from '../Factory/IndicatorFactory';


export default class IndicatorDetailScreen extends Component{
    
    constructor(props){
        super(props);

        this.id = this.props.navigation.getParam("id","");
        var bgTBColor = IndicatorFactory.GetGroupColor(this.id).bgColor;
        var textTBColor = IndicatorFactory.GetGroupColor(this.id).textColor;

        if(bgTBColor == "")
            bgTBColor = "#5299D3";

        if(textTBColor == "")
            textTBColor = "#383838";

        this.state ={
            title:this.props.navigation.getParam("name","Details"),
            bgTBColor:bgTBColor,
            textTBColor:textTBColor
        }
    }


    render(){

        return(
            <View style={{flex:1}}>
                  <Toolbar
                    style={{
                        container:{backgroundColor:this.state.bgTBColor}
                    }}
                    leftElement="arrow-back"
                    centerElement={this.state.title}

                    onLeftElementPress={() => {this.props.navigation.goBack()}}

                    />
                <Details 
                    id={this.id}
                />
            </View>
        );
    }

}