import React, {Component} from 'react';
import {View,Text,  StyleSheet,Image} from 'react-native';
import {Button,ListItem} from 'react-native-elements';

import {referenceColor} from '../../../Global/style.json';

import FavIcon from './Favourite/FavIcon';
import SearchIcon from './Search/SearchIcon';

import * as TextFactory from '../../../Factory/TextFactory';

// const fontSize = TextFactory.GetFontSize();
const styles = StyleSheet.create({
    navButton: {
      paddingTop: 25,
      paddingLeft:10,
      paddingRight:10
    },
  
    bookmarkBar: {
      paddingTop: 25,
    },

    listText:{
      color:referenceColor, 
      fontWeight:'bold',
      paddingLeft:15,
      fontSize:TextFactory.GetFontSize(17)
    },
    
    listItem:{
      // backgroundColor:'#FFFFFF',
      // justifyContent:"center",
      borderBottomWidth:1,
      borderBottomColor:'#C3C3C3'
    }
  });

export default class ReferenceMenu extends Component{

    static navigationOptions = ({navigation}) => {
      return {
        title: 'Reference Guide',
        headerStyle: {
          backgroundColor: referenceColor,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: <View style={{flexDirection:'row'}}><SearchIcon onPress={() => navigation.navigate("Search")}/><Text>  </Text><FavIcon onPress={() => navigation.navigate("Favourites")}/></View>,
        headerRightContainerStyle:{paddingRight:15}
      }
       
    };

      
    render(){

        return(
          <View style={{flex:1}}>
            <ListItem
              title="Indicators"
              chevron
              titleStyle={styles.listText}
              containerStyle={styles.listItem}
              leftIcon={{name:"align-left", type:"font-awesome", color:referenceColor}}
              onPress={() => this.props.navigation.navigate('IndicatorGroupScreen')}
            />
             <ListItem
              title="Map"
              chevron
              titleStyle={styles.listText}
              containerStyle={styles.listItem}
              leftIcon={{name:"map-o", type:"font-awesome", color:referenceColor}}
              onPress={() => this.props.navigation.navigate('MapScreen')}
            />
             <ListItem
              title="Calendar"
              chevron
              titleStyle={styles.listText}
              containerStyle={styles.listItem}
              leftIcon={{name:"calendar", type:"font-awesome", color:referenceColor}}
              onPress={() => this.props.navigation.navigate('CalendarScreen')}
            />
             <ListItem
              title="Favourites"
              chevron
              titleStyle={styles.listText}
              containerStyle={styles.listItem}
              leftIcon={{name:"star", type:"font-awesome", color:referenceColor}}
              onPress={() => this.props.navigation.navigate('Favourites')}
            />
             <ListItem
              title="FAQ"
              chevron
              titleStyle={styles.listText}
              containerStyle={styles.listItem}
              leftIcon={{name:"info-circle", type:"font-awesome", color:referenceColor}}
              onPress={() => this.props.navigation.navigate('FAQ')}
            />
            <ListItem
              title="More"
              chevron
              titleStyle={styles.listText}
              containerStyle={styles.listItem}
              leftIcon={{name:"plus-circle", type:"font-awesome", color:referenceColor}}
              onPress={() => this.props.navigation.navigate('MoreScreen')}
            />
            <View style={{flex:1}}></View>
          </View>
        );
          
     
  }


}