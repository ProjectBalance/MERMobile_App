import React, {Component} from 'react';
import {View,Text, Image, Dimensions, StyleSheet,TouchableOpacity} from 'react-native';
import {Button} from 'react-native-elements';

import * as DataFactory from '../../Factory/DataFactory';
import * as GeneralFactory from '../../Factory/GeneralFactory';
import * as TextFactory from '../../Factory/TextFactory';

import {syncColor,orientationColor,referenceColor, defaultFont} from '../../Global/style.json';

import logo from '../../../Assets/Images/mainLogo.png';

import RNPicker from 'react-native-picker-select';
import { red } from 'ansi-colors';

const { width } = Dimensions.get('window');

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

export default class MainMenu extends Component{

      
    constructor(props){
        super(props);
        var country = GeneralFactory.GetSelectedCountry();
        var version = GeneralFactory.GetContentVersion(country);
        this.state = {
            selectedCountry:country,
            countries:[],
            currentBlock:<View></View>,
            currentContent:version,
            mainMessage:"Content Version: " + version,
            appMessage:"App Version: " + DataFactory.CurrentAppVersion()
        }
    }

    saveSelectedCountry = (country) =>{

      if(country != null){
        this.setState({
          selectedCountry:country
        })

        var realm = DataFactory.GetDB();

        //Save the selected country
        realm.write(()=>{
            realm.create("Settings",
            {
                key:"selectedCountry",
                value:country
            },true);
        });

        var version = GeneralFactory.GetContentVersion(country);
        
        DataFactory.GetContentVersion().then((result)=> {
          if(version != result)
          {
            this.setState({
              mainMessage:"New Content Available"
            });
          }
          else{
            this.setState({
              mainMessage:"Content Version: " + version
            });
          }
        });
      }

  }
  
    componentDidMount(){
      var realm = DataFactory.GetDB();
      var countries = realm.objects("Country");
      
      var countryItems = [];

      countries.forEach(i => {
          
          var country = {};
          country.label = i.key;
          country.value = i.key;

          countryItems.push(
              country
          );
      });

      this.setState({
        countries:countryItems
      });

      this.focusListener = this.props.navigation.addListener("didFocus", () => {
          var country = GeneralFactory.GetSelectedCountry();
          var version = GeneralFactory.GetContentVersion(country);

          DataFactory.GetContentVersion().then((result)=> {
            if(result != "error"){
              if(version != result)
              {
                this.setState({
                  mainMessage:"New Content Available"
                });
              }
              else{
                this.setState({
                  mainMessage:"Content Version: " + version
                });
              }
            }
            else{
              this.setState({
                mainMessage:"Content Version: " + version
              });
            }
          });

          DataFactory.GetAppVersion().then((result)=> {
            if(result != "error"){
              if(DataFactory.CurrentAppVersion() != result)
              {
                this.setState({
                  appMessage:"New App Available"
                });
              }
              else{
                this.setState({
                  appMessage:"App Version: " + DataFactory.CurrentAppVersion()
                });
              }
            }
            else{
              this.setState({
                appMessage:"App Version: " + DataFactory.CurrentAppVersion()
              });
            }
          });
        
      });
    }
    
    componentWillUnmount() {
      // Remove the event listener
      this.focusListener.remove();
    }

    render(){

        return (
          <View style={{flex:1}}>
            <View style={{flex:1, backgroundColor:'#FFFFFF', alignItems:"center"}}>
              <Image
                resizeMode={'contain'}
                style={{
                    flex:1,
                    width:width / 1.5,
                }}
                source = {logo}
              />
              <View style={{alignItems: 'center', backgroundColor:'#FFFFFF', padding:5}}>
                <Text style={{color:'#B31919', fontSize:TextFactory.GetFontSize(25), fontWeight:'bold', textAlign:'center' }}>MER Mobile Reference Guide</Text>
              </View>
              
            </View>
            <View style={{flex:1, backgroundColor:'#FFF'}}>
                  <View style={styles.navButton}>
                    <RNPicker 
                        placeholder={{
                            label: "Please select a country",
                            value: null
                        }}
                        value={this.state.selectedCountry}
                        items={this.state.countries}
                        onValueChange={(value) => {
                            this.saveSelectedCountry(value);
                        }}>
                    </RNPicker>
                  </View>
                  <View style={styles.navButton}>
                      <Button
                        title="Orientation"
                        raised
                        buttonStyle = {{backgroundColor:orientationColor}}
                        titleStyle = {{fontSize:TextFactory.GetFontSize(defaultFont)}} 
                        onPress={() => this.props.navigation.navigate('OrientationScreen')}
                      />
                  </View>

                  <View style={styles.navButton}>
                    <Button
                        title="Reference Guide"
                        raised
                        titleStyle = {{fontSize:TextFactory.GetFontSize(defaultFont)}} 
                        buttonStyle={{ backgroundColor:referenceColor}}
                        onPress={() => this.props.navigation.navigate('ReferenceScreen')}
                      />
                  </View>
            </View>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('SyncScreen')}>
              <View style={{padding:10, flexDirection:'row',backgroundColor:"#FFF"}}>
            
                  <View style={{flex:1, padding:2}}>
                    <Text style={{fontSize:TextFactory.GetFontSize(12)}}>{this.state.appMessage}</Text>
                  </View>
                  <View style={{flex:1, padding:2}}>
                    <Text style={{fontSize:TextFactory.GetFontSize(12), textAlign:'right'}}>{this.state.mainMessage}  </Text>
                  </View>
                
              </View>
            </TouchableOpacity>
          </View>
        );
        
     
  }


}