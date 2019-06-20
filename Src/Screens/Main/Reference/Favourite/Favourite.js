import React, {Component} from 'react';
import {View,ScrollView, Text,StyleSheet, Button, Modal, TouchableHighlight} from 'react-native';
import IndicatorItem from '../../../../Coms/Indicator/IndicatorItem';


import Collapsible from 'react-native-collapsible';

import * as DataFactory from '../../../../Factory/DataFactory';
import * as GeneralFactory from '../../../../Factory/GeneralFactory';
import * as TextFactory from '../../../../Factory/TextFactory';
import {referenceColor} from '../../../../Global/style.json';
import { Icon, CheckBox, Avatar } from 'react-native-elements';

import BottomBar from '../../../../Coms/BottomBar';

export default class Favourites extends Component{

    static navigationOptions = ({navigation}) => {
        return {
            title: "Indicators",
            headerStyle: {
                backgroundColor: referenceColor,
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                fontWeight: 'bold',
                },
            };
        };

    constructor(props){
        super(props);
        var country = GeneralFactory.GetSelectedCountry();

        var realm = DataFactory.GetDB();
        var reportingFrequency = realm.objects("ReportingFrequency").filtered('country = "' + country + '"');
        var filtered = [];  //Keep track of what is being filtered

        reportingFrequency.forEach(r => {
            filtered.push(
                {
                    name:r.name,
                    state:true
                }
            );
        });
        
        this.state ={
            indicators:[],
            filters:[],
            filtered:filtered,
            annualState:true,
            semiAnnualState:true,
            quarterlyState:true,
            modalVisible:false,
        }
    }

    loadIndicators(){

        var realm = DataFactory.GetDB();
        var country = GeneralFactory.GetSelectedCountry();

        // var iList = realm.objects("Indicator").filtered('group = "' + group + '" and country = "' + country + '"');
        var bmList = realm.objects("Bookmark");
        

        var indicators = [];

        bmList.forEach(b => {

            var ind = realm.objects("Indicator").filtered('id = "' + b.id + '"');
            var i = ind[0];

            var grp = realm.objects("Group").filtered('type = $0 and country = $1',i.group,country);
            var gColor = "#FFF";
            var group = "Indicator Detail";

            if(grp != ""){
                var gData = JSON.parse(grp[0].data);

                gColor = gData.color;
                group = grp[0].name;
            }

            var data = JSON.parse(i.data);

            if(this.getFilterState(data.reportingFrequency)){

                var bookmark = "star-o";

                if(bmList.filtered('id = "'+ i.id + '"').length > 0)
                    bookmark = "star";
                    

                var reportingFrequency = realm.objects("ReportingFrequency").filtered('name = "' + data.reportingFrequency + '" and country = "' + country + '"');
            
            
                var color = "#FFF";
    
                if(reportingFrequency != "")
                    color = reportingFrequency[0].color;
                
                indicators.push(
                    <IndicatorItem 
                        key={indicators.length + 1} 
                        id={i.id} 
                        name={i.code} 
                        bookmark={bookmark}
                        color = {color}
                        onItemClick={(id,name) => this.props.navigation.navigate("IndicatorDetails",{id:id,name:name,group:group,gcolor:gColor,color:color, bookmark:bookmark})}
                        />
                   
                ); 
            }
        });

        this.setState({
            indicators:[]
        },() =>{
            this.setState({
                indicators:indicators
            })
        });
    }

    setupFilters(){
        var country = GeneralFactory.GetSelectedCountry();

        var realm = DataFactory.GetDB();
        var reportingFrequency = realm.objects("ReportingFrequency").filtered('country = "' + country + '"');

        var filters = []; 
       

        reportingFrequency.forEach(r => {

            var color = "#FFF";
            if(r.color != "" && r.color != null)
                color = r.color;

            filters.push(
                <View key={filters.length + 1} style={styles.frequencyBox} >
                    <CheckBox 
                        title={r.name}
                        checked={this.state.filtered[filters.length].state}
                        containerStyle = {{backgroundColor:color, height:60}}
                        onPress = {() => this.filterCheck(r.name)}
                    />
                </View>
            );

            
        });

        this.setState({
            filters:filters
        })
    }

    filterCheck (filter) {

        var filtered = [];

        this.state.filtered.forEach( f=> {
            var checked = f.state;

            if(f.name == filter){
                checked = !checked;
            }

            filtered.push({
                name:f.name,
                state:checked
            });    
        });

        this.setState({
            filtered:filtered
        }, ()=>{
            this.setupFilters();
            this.loadIndicators();
        });

    }

    getFilterState(filter){
        var checked = false
        this.state.filtered.forEach( f=> {
            if(f.name == filter){
                checked =  f.state;
            }
        });

        return checked;
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }
    
    componentDidMount(){
        this.focusListener = this.props.navigation.addListener("didFocus", () => {
            this.loadIndicators();
        });

        this.setupFilters();
    }

    componentWillUnmount() {
        // Remove the event listener
        this.focusListener.remove();
    }
  

    render(){

        return(
            <View style={{flex:1}}>
                <View style={{flex:1}}>
                    <ScrollView>
                        {this.state.indicators}
                    </ScrollView>
                </View>
                <BottomBar 
                color={referenceColor}
                rightIcon={
                    <Avatar 
                        size="medium"
                        rounded 
                        onPress={() => this.setModalVisible(!this.state.modalVisible)}
                        icon={{ name:"filter", type:"font-awesome"}} 
                        overlayContainerStyle={{backgroundColor:referenceColor}} 
                        activeOpacity={0.7}
                    />
                       
                }

                />

                <Modal
                 animationType="slide"
                 transparent={true}
                 visible={this.state.modalVisible}
                 onRequestClose={() => {
                    this.setModalVisible(!this.state.modalVisible);
                 }}
               >
                   <View style={{flex:1}}>
                        <View style={{flex:1}}>
                                <TouchableHighlight
                                style={{flex:1}}
                                                onPress={() => {
                                                this.setModalVisible(!this.state.modalVisible);
                                                }}>
                                                <View></View>
                                </TouchableHighlight>
                        </View>
                       
                        <View style={{flex:1, backgroundColor:"#FFF", padding:10}}>
                            <Text style={{margin:10, fontWeight:'bold'}}>Filters</Text>

                            {this.state.filters}

                            <TouchableHighlight
                                onPress={() => {
                                this.setModalVisible(!this.state.modalVisible);
                                }}>
                                <Icon color="red" name="close" type="font-awesome"/>
                            </TouchableHighlight>
                        </View>
                   </View>
               </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    frequencyBox: {
      flex:1
    },
  
    
  });