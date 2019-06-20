import React, {Component} from 'react';
import {View,ScrollView,Text,  StyleSheet,Image} from 'react-native';
import {Button, ListItem,SearchBar,Icon} from 'react-native-elements';

import {referenceColor} from '../../../../Global/style.json';

import * as DataFactory from '../../../../Factory/DataFactory';
import * as GeneralFactory from '../../../../Factory/GeneralFactory';
import * as IndicatorFactory from '../../../../Factory/IndicatorFactory';

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

export default class Search extends Component{

    static navigationOptions = {
        title: 'Search',
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

      var type = this.props.navigation.navigate("type","");
      
      this.state={
        selectedCountry:GeneralFactory.GetSelectedCountry(),
        results: [],
        type:type,
        search:""
      }
      
    }

    viewSearchResult = (id,name,group,gColor,color) =>{
      this.props.navigation.push("IndicatorDetails",{id:id,name:name,group:group,gcolor:gColor,color:color});
    }

    search(text){
      //TODO: Add a delay before searching to compensate for typing time
      if(text != "" && text.length > 2){
        var results = [];
        
        // if(this.state.type == "indicator")
          results = IndicatorFactory.Search(text,this.viewSearchResult);

        this.setState({
          search:text,
          results:results
        });
      }
      else{
        this.clearSearch();
      }

      this.setState({
        search:text
      });
    }

    clearSearch(){
      this.setState({
        results:[]
      })
    }

    componentDidMount(){
      
    }
      
    render(){
      
        return(
          <View>
                <View>
                <SearchBar
                  lightTheme
                  onChangeText={(text) => this.search(text)}
                  onClear={() => this.clearSearch()}
                  icon={{ type: 'font-awesome', name: 'search' }}
                  placeholder='Search...' 
                  value={this.state.search}
                  />
                  
                </View>
                <ScrollView>
                    {this.state.results}
                 </ScrollView>
                

            
          </View>
        );
     
  }


}