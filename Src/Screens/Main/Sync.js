import React, {Component} from 'react';
import {View,Text,Alert, StyleSheet,TouchableHighlight,NetInfo,ActivityIndicator} from 'react-native';
import {Button} from 'react-native-elements';
import { Toolbar } from 'react-native-material-ui';

import {syncColor} from '../../Global/style.json';

import * as DateFactory from '../../Factory/DateFactory';
import * as DataFactory from '../../Factory/DataFactory';
import * as GeneralFactory from '../../Factory/GeneralFactory';

const styles = StyleSheet.create({
  
    infoText: {
      marginBottom:10,
      textAlign:'center'

    }
  });

export default class SyncScreen extends Component{

    static navigationOptions = {
        title: 'Content Update',
        headerStyle: {
          backgroundColor: syncColor,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
    };

    constructor(props){
        super(props);
  
        var country = GeneralFactory.GetSelectedCountry();
        var lastUpdated = GeneralFactory.GetLastUpdated(country);

        if(lastUpdated == "1900-01-01")
            lastUpdated = "N/A";
            
        this.state={
          syncBar:<View></View>,
          lastUpdated:lastUpdated,
          currentVersion:GeneralFactory.GetContentVersion(country),
          nextVersion:"Checking for latest version..."
        }
        
      }

    checkAppVersion(){

        DataFactory.GetAppVersion().then((result) =>{
            if(result != "error"){
                if(result != DataFactory.CurrentAppVersion()){
                    Alert.alert("New Version Available", "Version " + result + " of MER Mobile is available. Please update to the latest version in order to sync data.");
                }
                else{
                    this.syncData();
                }
            }
            else{
                this.setState({
                    nextVersion:"Unable to connect."
                })
            }
        })
    }

    syncData(){
        if(this.state.nextVersion == "Version is up to date"){
            Alert.alert("Up To Date","You currently have the latest content version");
        }
        else
        {
            var updateBar = 
            <View
                style={{ alignItems:"center"}}
            >
                <Text
                style={{marginBottom:10, marginBottom:10, alignItems:"center"}}
                >Syncing Data...</Text>
                <ActivityIndicator />
            </View>

            this.setState({
                syncBar:updateBar
            });

            DataFactory.SyncData().then((result) =>{
                switch(result){
                    case "error":
                        var updateBar = 
                        <View
                            style={{marginTop:10, marginBottom:10, alignItems:"center", padding:10}}
                        >
                            <Text
                            
                            >
                                Unable to sync data. Please check internet connection or try again later. 
                            </Text>
                        </View>
                
                        this.setState({
                            syncBar:updateBar
                        });
                    break;
                    case "noData":
                    var updateBar = 
                        <View
                            style={{ alignItems:"center"}}
                        >
                            <Text
                            style={{marginTop:10, marginBottom:10, alignItems:"center"}}
                            >
                                Data is up to date!
                            </Text>
                        </View>
                
                        this.setState({
                            syncBar:updateBar
                        });
                    break;
                    default:
                        var country = GeneralFactory.GetSelectedCountry();
                        var realm = DataFactory.GetDB();
                        realm.write(()=>{
                            realm.create("Settings",
                            {
                                key:"lastUpdated - " + country,
                                value:DateFactory.GetDateToday()
                            },true);
                        });

                        var updateBar = 
                            <View
                                style={{ alignItems:"center"}}
                            >
                                <Text
                                style={{marginTop:10, marginBottom:10, alignItems:"center"}}
                                >
                                    Sync Complete!
                                </Text>
                            </View>
                    
                            this.setState({
                                lastUpdated:GeneralFactory.GetLastUpdated(country),
                                currentVersion:GeneralFactory.GetContentVersion(country),
                                nextVersion:"Version is up to date",
                                syncBar:updateBar
                            });
                    break;
                }
            })
        }
    }

    clearData(){
        Alert.alert("Clear All Data","Warning, this will clear all data from the application. You will need to re-sync data again after this is done.");
    }

    componentDidMount() {

        NetInfo.getConnectionInfo().then((connectionInfo) => {
  
            var updateBar = <View></View>;

            var WifiText = "Wifi is Available";

            if(connectionInfo.type != "wifi")
                WifiText = "Warning: No WiFi detected. Mobile data will be used.";

            // if(connectionInfo.type == "wifi")
            // {
                updateBar = 
                    <View 
                        style={{marginTop:10, alignItems:"center"}}
                    >
                        <Text>{WifiText}</Text>

                        <View style={{marginTop:10}}>
                            <Button 
                                title={"Sync"}
                                raised
                                icon={{name:"refresh",color:"#FFF", type:"font-awesome"}}
                                buttonStyle={{width:200,backgroundColor:"#B44954"}}
                                
                                onPress={()=>this.checkAppVersion()}
                            />
                        </View>
                     
                    </View>
            
                    this.setState({
                    syncBar:updateBar
                });

                DataFactory.GetContentVersion().then((result) =>{
                    if(result != "error"){
                        if(result != this.state.currentVersion){
                            this.setState({
                                nextVersion: "Next Version: " + result,
                            })
                        }
                        else{
                            this.setState({
                                nextVersion:"Version is up to date"
                            })
                        }
                    }
                    else{
                        this.setState({
                            nextVersion:"Unable to connect."
                        })
                    }
                })
            // }
            // else
            // {
            //     updateBar =
            //         <View>
            //             <Text style={{fontWeight:'bold'}}>No wifi Available</Text>
            //         </View>

            //     this.setState({
            //         syncBar:updateBar
            //     });
            // }
        });
  
      }

    render(){
        return(
            <View style={{flex:1}}
            >

                    <View style={{flex:1,alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={styles.infoText}>
                            Content Version: {this.state.currentVersion}
                        </Text>
                        <Text style={styles.infoText}>
                            Last Updated: {this.state.lastUpdated}
                        </Text>
                        <Text style={styles.infoText}>
                            {this.state.nextVersion}
                        </Text>
                        {this.state.syncBar}
                    </View>
                    <View style={{alignItems:'center'}}>
                        <TouchableHighlight>
                            <Text style={{textAlign:'center'}}> </Text>
                        </TouchableHighlight>
                    </View>

            </View>
        );
    }

}