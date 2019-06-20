import React, {Component} from 'react';
import {View,Text,ScrollView, StyleSheet,TouchableHighlight,NetInfo,ActivityIndicator} from 'react-native';
import {Button} from 'react-native-elements';
import { Toolbar } from 'react-native-material-ui';

import {referenceColor} from '../../../../Global/style.json';

import * as TextFactory from '../../../../Factory/TextFactory';
import * as DataFactory from '../../../../Factory/DataFactory';
import * as GeneralFactory from '../../../../Factory/GeneralFactory';

export default class FAQDetail extends Component{
    static navigationOptions = ({navigation}) => {
    return {
        title:"FAQ",
        headerStyle: {
            backgroundColor: referenceColor,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
            fontWeight: 'bold',
            },
        };
    };

    constructor(props){
        super(props);
  
        var country = GeneralFactory.GetSelectedCountry();
        this.state={
            description:"",
        }
        
    }

    componentDidMount(){
        var realm = DataFactory.GetDB();
        var o = realm.objects("Resource").filtered('id= "' + this.props.navigation.getParam("id","") + '"');

        var link = <Text></Text>
        
        if(o[0].link != ""){
            link = <Text style={{color:'blue', marginTop:10, fontSize:TextFactory.GetFontSize(15)}} onPress={() => Linking.openURL(o[0].link)}>
                {o[0].link}
            </Text>
        }

        this.setState({
            description:o[0].description,
            link:link
        })
    }

    render(){
        return(
            <View style={{paddingTop:20, paddingLeft:10, paddingRight:10, backgroundColor:'#FFF',flex:1}}>
                <View style={{marginBottom:20}}>
                    <Text style={{fontSize:TextFactory.GetFontSize(20), fontWeight:'bold'}}>
                        {this.props.navigation.getParam("title","FAQ Detail")}
                    </Text>
                </View>
                <ScrollView>
                    <Text style={{textAlign:"justify", fontSize:TextFactory.GetFontSize(17)}}>
                        {this.state.description}
                    </Text>

                    {this.state.link}
                    
                </ScrollView>
            </View>
        );
    }

}