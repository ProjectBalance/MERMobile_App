import React, {Component} from 'react';
import {View,Text,  StyleSheet,TouchableHighlight,Modal} from 'react-native';
import {StackActions,NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';

import {Button} from 'react-native-elements';

import BookmarkBar from '../../Coms/Bookmark/BookmarkBar';

import { Toolbar } from 'react-native-material-ui';

import {indicatorColor,mapColor,bookmarkColor,calendarColor} from '../Global/style.json';


export default class HomeScreen extends Component{

    constructor(props){
      super(props);

      this.state={
        searchValue : "",
        modalVisible: false,
      }
      
    }

    searchTextUpdate(text){
      this.setState({
        searchValue : text
      });
    }

    search(value){
      // this.props.navigation.navigate("Results");
      this.setModalVisible(true);

    }
  
    setModalVisible(visible) {
      this.setState({modalVisible: visible});
    }

    syncData(item){

      if(item.result == "itemSelected"){
        if(item.index == 0){
          this.props.navigation.navigate('Sync');
        }
      }
    }

    render(){

          

          return(
            <View>
              <Toolbar
              leftElement="menu"
              centerElement="MER Mobile"
              searchable={{
                autoFocus: true,
                placeholder: 'Search',
                onChangeText: (text) => this.searchTextUpdate(text),
                onSubmitEditing: (searchValue) => this.search(searchValue)
              }}
              rightElement={{
                  menu: {
                      icon: "more-vert",
                      labels: ["Sync Data"]
                  }
              }}
              onRightElementPress={ (item) => this.syncData(item)}
              onLeftElementPress={() => {this.props.navigation.toggleDrawer()}}
            />

             

              <View style={styles.bookmarkBar}>
                <BookmarkBar navigation={this.props.navigation}/>
              </View>
              
              <View style={[styles.navButton]}>
                  <Button
                    title="Indicators"
                    backgroundColor={indicatorColor}
                    icon={{name:"tasks", type:"font-awesome"}}
                    onPress={() => this.props.navigation.navigate('Indicators')}
                  />
              </View>
              

               <View style={styles.navButton}>
                <Button
                    title="Maps"
                    backgroundColor={mapColor}
                    icon={{name:"map-o", type:"font-awesome"}}
                    onPress={() => this.props.navigation.navigate('Maps')}
                  />
              </View>

              <View style={styles.navButton}>
                <Button
                    title="Calendar"
                    backgroundColor={calendarColor}
                    icon={{name:"calendar", type:"font-awesome"}}
                    onPress={() => this.props.navigation.navigate('Calendar')}
                  />
              </View>

              <View style={styles.navButton}>
                <Button
                    title="Bookmarks"
                    backgroundColor={bookmarkColor}
                    icon={{name:"bookmark", type:"font-awesome"}}
                    onPress={() => this.props.navigation.navigate('Bookmarks')}
                  />
              </View>
              
              <Modal
                 animationType="slide"
                 transparent={false}
                 visible={this.state.modalVisible}
                 onRequestClose={() => {
                    this.setModalVisible(!this.state.modalVisible);
                 }}
               >
                <View
                
                // style={{
                //   marginTop:60,
                //   backgroundColor:"white",
                //   flex:1
                // }}
                >
                  <Text>Seach for: {this.state.searchValue}</Text>
                  <TouchableHighlight
                            onPress={() => {
                            this.setModalVisible(!this.state.modalVisible);
                            }}>
                            <Text style={{color:"blue",fontSize:25, fontWeight:"bold"}}>Close</Text>
                  </TouchableHighlight>
                </View>
               </Modal>
            </View>
          );
       
    }


}

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
