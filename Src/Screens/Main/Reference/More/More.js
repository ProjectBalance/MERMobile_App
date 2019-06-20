import React, {Component} from 'react';
import {View,ScrollView,Text,  StyleSheet,Image,TouchableOpacity} from 'react-native';
import {Button, ListItem} from 'react-native-elements';

import {referenceColor,defaultFont} from '../../../../Global/style.json';

import * as DataFactory from '../../../../Factory/DataFactory';
import * as TextFactory from '../../../../Factory/TextFactory';
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

export default class More extends Component{

    static navigationOptions = {
        title: 'More',
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
        moreList: [],
 
      }
      
    }

    viewItem =(name,id,group)=>{
      this.props.navigation.navigate("MoreDetail",{title:name,id:id,group:group});
    }


    componentDidMount(){
      var realm = DataFactory.GetDB();

      var res

      var options = []; 

      res = realm.objects("Resource").filtered('type = $0 and country= $1',"About",GeneralFactory.GetSelectedCountry()).sorted("title");
      if(res.length > 0)
        options.push(<MoreGroup key={options.length + 1} type={"About"} itemClick={(name,id) => this.viewItem(name,id,"About")} />);

      res = realm.objects("Resource").filtered('type = $0 and country= $1',"Resource",GeneralFactory.GetSelectedCountry()).sorted("title");
      if(res.length > 0)
        options.push(<MoreGroup key={options.length + 1} type={"Resource"} itemClick={(name,id) => this.viewItem(name,id,"Resource")}  />);

      res = realm.objects("Resource").filtered('type = $0 and country= $1',"Glossary",GeneralFactory.GetSelectedCountry()).sorted("title");
      if(res.length > 0)
        options.push(<MoreGroup key={options.length + 1} type={"Glossary"} itemClick={(name,id) => this.viewItem(name,id,"Glossary")}  />);

      res = realm.objects("Resource").filtered('type = $0 and country= $1',"Definition",GeneralFactory.GetSelectedCountry()).sorted("title");
      if(res.length > 0)
        options.push(<MoreGroup key={options.length + 1} type={"Definition"} itemClick={(name,id) => this.viewItem(name,id,"Definition")}  />);

      res = realm.objects("Resource").filtered('type = $0 and country= $1',"Other",GeneralFactory.GetSelectedCountry()).sorted("title");
      if(res.length > 0)
        options.push(<MoreGroup key={options.length + 1} type={"Other"} itemClick={(name,id) => this.viewItem(name,id,"Other")}  />);


      this.setState({
        moreList:options
      })
    }
      
    render(){

          

        return(
          <ScrollView>
                {this.state.moreList}
          </ScrollView>
        );
     
  }


}

class MoreGroup extends Component{
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


  loadList(type){
    var options = [];

    var realm = DataFactory.GetDB();
    var res = realm.objects("Resource").filtered('type = $0 and country= $1',type,GeneralFactory.GetSelectedCountry()).sorted("title");

    res.forEach(r =>{
      options.push(
          <ListItem
            key={options.length + 1} 
            chevron
            title={r.title}
            titleStyle={{color:referenceColor, fontWeight:'bold', fontSize:TextFactory.GetFontSize(defaultFont)}}
            containerStyle={{backgroundColor:'#FFFFFF',borderBottomColor:"#C3C3C3", borderBottomWidth:1}}
            onPress={() => this.props.itemClick(r.title,r.id)}
          />
      );
    });

    
    this.setState({
      list:options
    });
  }
  componentDidMount(){
     
      this.loadList(this.props.type);
  }

  render(){

      return(
          <View >
              <TouchableOpacity 
                  onPress={() =>this.toggle()}
              >
                  <View
                      style={{
                          backgroundColor:referenceColor,
                          // borderStyle:"solid",
                          borderBottomWidth:1,
                          borderBottomColor:"#FFFFFF",
                          height:50
                      }}
                  >
                      <Text
                          style={{
                              fontSize:TextFactory.GetFontSize(defaultFont),
                              fontWeight:"bold",
                              padding:10,
                              color:"#FFF"
                          }}
                      >
                          {this.props.type}
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