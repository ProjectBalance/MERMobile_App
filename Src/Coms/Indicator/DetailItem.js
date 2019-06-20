import React,{Component} from 'react';
import {View,Text,TouchableOpacity,Dimensions} from 'react-native';

import Collapsible from 'react-native-collapsible';

import * as TextFactory from '../../Factory/TextFactory';
import * as GeneralFactory from '../../Factory/GeneralFactory';

import AboutItem from '../AboutItem';

import HTML from 'react-native-render-html';

export default class DetailItem extends Component{
    
    toggle(){
        this.setState({
            collapsed:!this.state.collapsed
        })
    }

    constructor(props){
        super(props);

        var country = GeneralFactory.GetSelectedCountry();

        this.state = {
            collapsed: true,
            detail: TextFactory.ParseText(String(this.props.detail)),
            definitions:GeneralFactory.GetDefinitions(country)
        }
    }

    render(){

        var html = `
        <!DOCTYPE html>
        <html>
          <body style="padding-left:5px; padding-right:5px;">
          </br>
          ` + 
          
            this.state.detail
          
          + 

          `
          </br>
          </body>
        </html>
        `

        return(
            <View>
                    <View>
                        <Text
                            style={{
                                fontWeight:"bold",
                                fontSize:TextFactory.GetFontSize(20),
                                padding:10,
                                // color:"white"
                            }}
                        >{this.props.title}</Text>
                    </View>
                   
                    {/* <HTML 
                        html={this.state.detail} 
                        containerStyle={{padding:10, backgroundColor:"#FFFFFF"}}
                    /> */}

                    <AboutItem text={this.state.detail} definitions={this.state.definitions}/>


            </View>
        );
    }

}