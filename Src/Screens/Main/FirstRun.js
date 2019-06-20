import React, {Component} from 'react';
import {View,Text ,Alert, StyleSheet,TouchableHighlight,NetInfo,ActivityIndicator} from 'react-native';
import {Button} from 'react-native-elements';

import * as DataFactory from '../../Factory/DataFactory';
import * as DateFactory from '../../Factory/DateFactory';

import Realm from 'realm';
import * as Schema from '../../Model/Schema';
import * as TextFactory from '../../Factory/TextFactory';

import RNPicker from 'react-native-picker-select';

import {syncColor,orientationColor,referenceColor} from '../../Global/style.json';

const styles = StyleSheet.create({
  
    infoText: {
        marginBottom:25,
        fontSize:15, 
        fontWeight:'bold'
    }
  });

export default class FirstRun extends Component{
    
    constructor(props){
        super(props);
        this.state = {
            selectedCountry:"",
            currentBlock:<View></View>,
        }
    }

    checkAppVersion(){

        DataFactory.GetAppVersion().then((result) =>{
            if(result != "error"){
                if(result != DataFactory.CurrentAppVersion()){
                    Alert.alert("New Version Available", "Version " + result + " of MER Mobile is available. Please update to the latest version in order to sync data.");
                }
                else{
                    this.initialize();
                }
            }
            else{
                var SyncBlock = 
                <View>
                    <Text
                    style={styles.infoText}
                    >Unable to connect</Text>
                    
                </View>

            this.setState({
                currentBlock:SyncBlock
            });
            }
        })
    }

    initialize(){
        if(this.state.selectedCountry != ""){
            
            var realm = DataFactory.GetDB();
            
            var SyncBlock = 
            <View>
                <Text
                style={styles.infoText}
                >Syncing Data</Text>
                <ActivityIndicator />
            </View>

            this.setState({
                currentBlock:SyncBlock
            });

            //Set the lastUpdated date. This is the first run so set to 1900-01-01
            realm.write(()=>{
                realm.create("Settings",
                {
                    key:"lastUpdated - " + this.state.selectedCountry,
                    value:"1900-01-01"
                },true);
            });


            DataFactory.SyncData().then((result) =>{

                if(result == "error"){
                    const errorBlock = 
                    <View style={{padding:15}}>
                        <Text style={{textAlign:'center'}}>Unable to sync data. Please check internet connection or try again later. </Text>
                    </View>

                    this.setState({
                        currentBlock:errorBlock
                    });
                }
                else{

                    //Update the lastUpdated date. 
                    var date = DateFactory.GetDateToday();
                    
                    realm.write(()=>{
                        realm.create("Settings",
                        {
                            key:"lastUpdated - " + this.state.selectedCountry,
                            value:date
                        },true);
                    });

                    const doneBlock = 
                    <View style={{padding:15}}>
                        <Text
                            style={styles.infoText}
                        >Sync Complete! </Text>
                        <Button 
                            title={"Continue"}
                            raised
                            titleStyle = {{fontSize:TextFactory.GetFontSize(17)}} 
                            buttonStyle={{ backgroundColor:referenceColor}}
                            onPress = {() => this.allDone()}
                        />
                    </View>

                    this.setState({
                        currentBlock:doneBlock
                    });
                }
            });

        }
        else{
            Alert.alert("Select a country","Please select a country in order to begin");
        }
    }

    allDone(){
        this.props.syncDone();
    }
    

    letsGetStarted(){
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


        const GetStartedBlock = 
        
        <View style={{ alignItems:"center"}} >
            <View  style={{alignItems:"center"}}>
                <Text
                    style={{fontSize:15, fontWeight:"bold"}}>
                    Welcome to the
                </Text>
                <Text
                    style={{fontSize:24, fontWeight:"bold", textAlign:'center'}}>
                    MER Mobile Reference Guide
                </Text>
            </View>
           
            
            <View>
                <View style={{marginTop:25, alignItems:"center"}}>
                    <Text style={{textAlign:'center'}}>Select a country below and press Get Started to begin</Text>
                </View>
                <View style={{marginTop:25, alignItems: 'center'}}>
                    <RNPicker 
                        placeholder={{
                            label: 'Please select a country',
                            value: null
                        }}
                        items={countryItems}
                        onValueChange={(value) => {
                            this.saveSelectedCountry(value);
                        }}>
                    </RNPicker>
                </View>
                <View style={{marginTop:10}}>
                    <Button 
                        title={"Get Started"}
                        raised
                        titleStyle = {{fontSize:TextFactory.GetFontSize(17)}} 
                        buttonStyle={{ backgroundColor:referenceColor}}
                        onPress={() => this.checkAppVersion()}
                    />
                </View>
            </View>

        </View>

        this.setState({
            currentBlock:GetStartedBlock
        });
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
        }
        else{
            this.setState({
                selectedCountry:""
            })
        }

    }

    componentDidMount(){

        NetInfo.getConnectionInfo().then((connectionInfo) => {


            if(connectionInfo.type == "wifi")
            {
                const FetchBlock = 
                <View>
                    <Text
                    style={styles.infoText}
                    >Fetching Meta Data...</Text>
                    <ActivityIndicator />
                </View>

                this.setState({
                    currentBlock:FetchBlock
                });

                //Get the Country-Language list
                DataFactory.GetMetaData().then((result) =>{

                    if(result == "error"){
                        const errorBlock = 
                        <View style={{padding:15}}>
                            <Text>Unable to retrieve data. Please check internet connection or try again later. </Text>
                        </View>
        
                        this.setState({
                            currentBlock:errorBlock
                        });
                    }
                    else{
                        this.letsGetStarted();
                    }
                });
            }
            else
            {
                const noWifiBlock =
                    <View>
                        <Text style={styles.infoText}>No wifi Available</Text>
                    </View>

                this.setState({
                    currentBlock:noWifiBlock
                });
            }
        });
        
       
    }
    render(){
        

        return(
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding:10 }}>
                {this.state.currentBlock}
            </View>
        );
    }

}