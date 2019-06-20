import React, {Component} from 'react';
import {View,Text, StyleSheet,TouchableHighlight,NetInfo,ActivityIndicator} from 'react-native';
import {Button} from 'react-native-elements';
import { Toolbar } from 'react-native-material-ui';

import * as DataFactory from '../Factory/DataFactory';


export default class SyncScreen extends Component{

    constructor(props){
        super(props);
  
        this.state={
          syncBar:<View></View>
        }
        
      }

    syncData(){
        
        var updateBar = 
        <View
            style={{ alignItems:"center"}}
        >
            <Text
             style={{marginTop:10, marginBottom:10, alignItems:"center"}}
            >Syncing Data...</Text>
            <ActivityIndicator />
        </View>

        this.setState({
            syncBar:updateBar
        });

        DataFactory.Sync().then((result) =>{
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
                            syncBar:updateBar
                        });
                break;
            }
        })

        
        // DataFactory.SyncData().then((data)=>{

        //     var realm = DataFactory.GetDB();

        //     //Save the next sync URL
        //     realm.write(()=>{
        //         realm.create("Settings",
        //         {
        //             key:"nextSyncURL",
        //             value:data.nextSyncUrl
        //         },
        //         true);
        //     });

        //     //Sync items if there is any
        //     if(data.items.length > 0){
        //         DataFactory.SaveData(data.items).then((sucess) =>{

        //             if(sucess){

        //                 DataFactory.GetContentData().then((data) =>{

        //                     DataFactory.SaveContentData(data);

        //                     var updateBar = 
        //                     <View
        //                         style={{ alignItems:"center"}}
        //                     >
        //                         <Text
        //                         style={{marginTop:10, marginBottom:10, alignItems:"center"}}
        //                         >
        //                             Sync Complete!
        //                         </Text>
        //                     </View>
                    
        //                     this.setState({
        //                         syncBar:updateBar
        //                     });

        //                 });
                        
        //             }
        //         });
                // DataFactory.SaveData(data.items).then((success) =>{
                //     var updateBar = 
                //     <View
                //         style={{ alignItems:"center"}}
                //     >
                //         <Text
                //          style={{marginTop:10, marginBottom:10, alignItems:"center"}}
                //         >
                //             Sync Complete!
                //         </Text>
                //     </View>
            
                //     this.setState({
                //         syncBar:updateBar
                //     });
                // });
            // }
            // else{
            //     var updateBar = 
            //     <View
            //         style={{ alignItems:"center"}}
            //     >
            //         <Text
            //          style={{marginTop:10, marginBottom:10, alignItems:"center"}}
            //         >
            //             Data is up to date!
            //         </Text>
            //     </View>
        
            //     this.setState({
            //         syncBar:updateBar
            //     });
            // }
        // });
    }

    componentDidMount() {

        NetInfo.getConnectionInfo().then((connectionInfo) => {
  
            var updateBar = <View></View>;

            if(connectionInfo.type == "wifi")
            {
                updateBar = 
                    <View 
                        style={{ alignItems:"center"}}
                    >
                        <Text
                            
                        >Wifi Available</Text>

                        <View style={{marginTop:10}}>
                            <Button 
                                title={"Sync"}
                                icon={{name:"refresh", type:"font-awesome"}}
                                buttonStyle={{width:100}}
                                backgroundColor={"#5299D3"}
                                onPress={()=>this.syncData()}
                            />
                        </View>
                                {/* <TouchableHighlight
                                    
                                    onPress ={ () => this.syncData()}
                                >
                                <View style={{flexDirection:"row", padding:10}}>
                                    <Icon name="refresh" size={25} />
                                    <Text style={{paddingLeft:10}}>Sync Data</Text>
                                </View>
                                    
                                    
                                </TouchableHighlight> */}
                     
                    </View>
            
                    this.setState({
                    syncBar:updateBar
                });
            }
            else
            {
                updateBar =
                    <View>
                        <Text>No wifi Available</Text>
                    </View>

                this.setState({
                    syncBar:updateBar
                });
            }
        });
  
      }

    render(){
        return(
            <View
            >
                  <Toolbar
                    leftElement="menu"
                    centerElement="Sync Data"
                    onLeftElementPress={() => {this.props.navigation.toggleDrawer()}}
                    />

                    <View style={{marginTop:100,alignItems: 'center', justifyContent: 'center' }}>
                        {this.state.syncBar}
                    </View>
                

            </View>
        );
    }

}