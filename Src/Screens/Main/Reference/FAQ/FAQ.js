import React, {Component} from 'react';
import {View,Text,  StyleSheet,Image} from 'react-native';
import {Button, ListItem} from 'react-native-elements';

import {referenceColor,defaultFont} from '../../../../Global/style.json';

import * as DataFactory from '../../../../Factory/DataFactory';
import * as TextFactory from '../../../../Factory/TextFactory';
import * as GeneralFactory from '../../../../Factory/GeneralFactory';

const styles = StyleSheet.create({
    navButton: {
      paddingTop: 25,
      paddingLeft:10,
      paddingRight:10
    },
  
    bookmarkBar: {
      paddingTop: 25,
    }
  });

export default class FAQ extends Component{

    static navigationOptions = {
        title: 'FAQ',
        headerStyle: {
          backgroundColor: referenceColor,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
    };

    constructor(props){
      super(props);

      this.state={
        selectedCountry:GeneralFactory.GetSelectedCountry(),
        faqList: []
      }
      
    }

    componentDidMount(){
      var realm = DataFactory.GetDB();

      var faq = realm.objects("Resource").filtered('type = "FAQ" and country= "' + this.state.selectedCountry + '"').sorted("order");
      var options = [];

      faq.forEach(f =>{
        options.push(
          <View 
            key={options.length + 1} 
            >
            <ListItem
              title={f.title}
              chevron
              titleStyle={{color:referenceColor, fontWeight:'bold',fontSize:TextFactory.GetFontSize(defaultFont)}}
              containerStyle={{backgroundColor:'#FFFFFF',borderBottomColor:"#C3C3C3", borderBottomWidth:1}}
              onPress={() => this.props.navigation.navigate('FAQDetail',{title:f.title,id:f.id})}
            />
          </View>
        );
      });

      this.setState({
        faqList:options
      })
    }
      
    render(){

          

        return(
          <View>

                {this.state.faqList}

            
          </View>
        );
     
  }


}