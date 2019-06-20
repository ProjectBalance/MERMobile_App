import React,{Component} from 'react';
import {View,Text,Image,Platform} from 'react-native';
import splashImage from '../../Assets/Images/US-PEPFAR-01.png';
import * as TextFactory from '../Factory/TextFactory';

const isAndroid =  Platform.OS==='android'

export default class SplashScreen extends Component{

    render(){
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{padding:10}}>
                    <Image
                    resizeMode={'cover'}
                    style={{
                        width:250,
                        height:250
                    }}
                    source = {splashImage} 
                    />
                </View>
                <Text
                    style={{
                        fontSize:TextFactory.GetFontSize(25),
                        fontWeight:"bold",
                        alignItems:"center",
                        textAlign:"center"
                    }}
                >MER Mobile Reference Guide</Text>
                
                
            </View>
        );
    }
    
}