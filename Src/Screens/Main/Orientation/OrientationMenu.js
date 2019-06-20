import React, {Component} from 'react';
import {View,ScrollView,Text,  StyleSheet,Image} from 'react-native';
import {Button, ListItem} from 'react-native-elements';

import {orientationColor,defaultFont} from '../../../Global/style.json';

import * as DataFactory from '../../../Factory/DataFactory';
import * as TextFactory from '../../../Factory/TextFactory';
import * as GeneralFactory from '../../../Factory/GeneralFactory';

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

export default class OrientationMenu extends Component{

    static navigationOptions = {
        title: 'Orientation',
        headerStyle: {
          backgroundColor: orientationColor,
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
        orientationOptions: []
      }
      
    }

    componentDidMount(){
      var realm = DataFactory.GetDB();

      var orientation = realm.objects("Resource").filtered('type = "Orientation" and country= "' + this.state.selectedCountry + '"').sorted("order");
      var options = [];

      orientation.forEach(o =>{
        options.push(
          <View 
            key={options.length + 1} 
            >
            <ListItem
              title={o.title}
              chevron={true}
              titleStyle={{color:orientationColor, fontWeight:'bold', fontSize:TextFactory.GetFontSize(defaultFont)}}
              containerStyle={{borderBottomColor:"#C3C3C3", borderBottomWidth:1}}
              onPress={() => this.props.navigation.navigate('OrientationDetail',{title:o.title,id:o.id})}
            />
          </View>
        );
      });

      this.setState({
        orientationOptions:options
      })
    }
      
    render(){

          

        return(
          <ScrollView>

             {this.state.orientationOptions}

            <View>
              <ListItem
                  title="How To Use"
                  chevron
                  chevronColor="#FF0000"
                  titleStyle={{color:orientationColor, fontWeight:'bold',fontSize:TextFactory.GetFontSize(defaultFont)}}
                  containerStyle={{borderBottomColor:"#C3C3C3", borderBottomWidth:1}}
                  onPress={() => this.props.navigation.navigate('HowToScreen')}
                />
            </View>
            
          </ScrollView>
        );
     
  }


}