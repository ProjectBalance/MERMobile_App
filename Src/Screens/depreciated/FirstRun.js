import React, {Component} from 'react';
import {View,Text, Button, StyleSheet,TouchableHighlight,ActivityIndicator} from 'react-native';
import { Toolbar } from 'react-native-material-ui';

import * as DataFactory from '../../Factory/DataFactory';
import Realm from 'realm';
import * as Schema from '../../Model/Schema';

export default class FirstRun extends Component{
    
    constructor(props){
        super(props);
        this.state = {
            currentBlock:<View></View>
        }
    }

    initialize(){
        const SyncBlock = 
        <View>
            <Text
             style={{marginTop:10}}
            >Syncing Data</Text>
            <ActivityIndicator />
        </View>

        this.setState({
            currentBlock:SyncBlock
        });

        DataFactory.InitialSync().then((result) =>{

            if(result == "error"){
                const errorBlock = 
                <View style={{padding:15}}>
                    <Text>Unable to sync data. Please check internet connection or try again later. </Text>
                </View>

                this.setState({
                    currentBlock:errorBlock
                });
            }
            else{
                const doneBlock = 
                <View style={{padding:15}}>
                    <Text
                        style={{marginBottom:10}}
                    >Sync Complete! </Text>
                    <Button 
                        title={"Continue"}
                        onPress = {() => this.allDone()}
                    />
                </View>

                this.setState({
                    currentBlock:doneBlock
                });
            }
        });
    }

    allDone(){
        this.props.syncDone();
    }

    componentDidMount(){
        const GetStartedBlock = 
        
        <View 
        
        >
            <Text
                style={{fontSize:25, fontWeight:"bold"}}
            >Welcome to MER MOBILE</Text>
            
            <View>
                <View style={{marginTop:25, alignItems:"center"}}>
                    <Text>Click the button below to get started!</Text>
                </View>
                <View style={{marginTop:10}}>
                    <Button 
                        title={"Get Started!"}
                        onPress={() => this.initialize()}
                    />
                </View>
            </View>

        </View>

        this.setState({
            currentBlock:GetStartedBlock
        })
    }
    render(){
        

        return(
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                {this.state.currentBlock}
            </View>
        );
    }

}