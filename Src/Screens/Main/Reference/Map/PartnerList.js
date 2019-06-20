import React, {Component} from 'react';
import {View,ScrollView,Text,  StyleSheet,Image,TouchableOpacity} from 'react-native';
import {Button, ListItem} from 'react-native-elements';

import {referenceColor} from '../../../../Global/style.json';

import * as DataFactory from '../../../../Factory/DataFactory';
import * as GeneralFactory from '../../../../Factory/GeneralFactory';

import Collapsible from 'react-native-collapsible';

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


export default class Partner extends Component{
  constructor(props){
      super(props);

      this.state ={
          collapsed:true,
          list:[]
      }
  }

  toggle =()=>{

      this.setState({
          collapsed:!this.state.collapsed
      })
  }


  loadList(){
    var options = [];

    var realm = DataFactory.GetDB();
    var pm = realm.objects("PartnerMap").filtered('partnerID = $0 and country= $1 and mapItem = $2',this.props.partnerID,GeneralFactory.GetSelectedCountry(),this.props.mapItem);

    pm.forEach(p =>{
        var data = JSON.parse(p.data);

        data.indicator.forEach(i =>{    

            var ind = realm.objects("Indicator").filtered('id = $0',i.sys.id);
    
            options.push(
                <ListItem
                    key={options.length + 1} 
                    title={ind[0].code}
                    titleStyle={{color:referenceColor, fontWeight:'bold'}}
                    containerStyle={{backgroundColor:'#FFFFFF'}}
                    onPress={() => this.props.onPress(ind[0].id)}
                />
            );
        });

    })
    


    
    this.setState({
      list:options
    });
  }
  componentDidMount(){
     
      this.loadList();
  }

  render(){

      return(
          <View >
              <TouchableOpacity 
                  onPress={() =>this.toggle()}
              >
                  <View
                      style={{
                          backgroundColor:'#696969',
                          // borderStyle:"solid",
                          borderBottomWidth:1,
                          borderBottomColor:"#FFFFFF",
                          height:50
                      }}
                  >
                      <Text
                          style={{
                              fontSize:15,
                              fontWeight:"bold",
                              padding:10,
                              color:"#FFF"
                          }}
                      >
                          {this.props.partner}
                      </Text>
                  </View>
              </TouchableOpacity>
              <Collapsible collapsed={this.state.collapsed}>
                  {this.state.list}
              </Collapsible>
          </View>
        
      );
  }
}