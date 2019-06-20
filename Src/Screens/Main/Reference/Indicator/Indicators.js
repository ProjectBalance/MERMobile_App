import React, {Component} from 'react';
import {View,ScrollView, Text, Button, TouchableOpacity} from 'react-native';
import IndicatorItem from '../../../../Coms/Indicator/IndicatorItem';

import { Toolbar } from 'react-native-material-ui';

import Collapsible from 'react-native-collapsible';

import * as DataFactory from '../../../../Factory/DataFactory';
import * as GeneralFactory from '../../../../Factory/GeneralFactory';
import * as TextFactory from '../../../../Factory/TextFactory';
import {indicatorColor} from '../../../../Global/style.json';
import { ListItem } from 'react-native-elements';

var indicatorList = [];

class IndicatorGroup extends Component{
    constructor(props){
        super(props);

        this.state ={
            collapsed:true,
            bgColor:this.props.bgColor,
            textColor:this.props.textColor,
            indicators:[]
        }
    }

    toggle =()=>{

        this.setState({
            collapsed:!this.state.collapsed
        })
    }

    loadIndicators(){
        var group = this.props.type;
        var realm = DataFactory.GetDB();

        var iList = realm.objects("Indicator").filtered('group = "' + group + '" and country= "' + GeneralFactory.GetSelectedCountry() + '"');
        var bmList = realm.objects("Bookmark");

        var indicators = [];

        iList.forEach(i => {
            var bookmark = "bookmark-o";

            if(bmList.filtered('id = "'+ i.id + '"').length > 0)
                bookmark = "bookmark";

            indicators.push(
                <IndicatorItem 
                    key={indicators.length + 1} 
                    id={i.id} 
                    name={i.code} 
                    bookmark={bookmark}
                    onItemClick={(id,name) => this.props.indicatorClick(id,name)}
                    />
               
            ); 
        });

        this.setState({
            indicators:indicators
        });
    }

    componentDidMount(){
       
        // this.loadIndicators();
    }

    render(){

        return(
            <ListItem
              title={this.props.title}
              titleStyle={{color:'#FFFFFF', fontWeight:'bold'}}
              containerStyle={{backgroundColor:this.state.bgColor}}
              onPress={() => this.props.navigation.navigate('Orientation')}
            />
        );

    }
}

export default class IndicatorScreen extends Component{

    static navigationOptions = {
        title: 'Indicators',
        headerStyle: {
          backgroundColor: indicatorColor,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
    };

    constructor(props){
        super(props);

        this.state ={
            groups:[]
        }
    }

    viewIndicator =(id,name)=>{
        this.props.navigation.navigate("IndicatorDetails",{id:id,name:name});
    }

    loadGroups(){

        var realm = DataFactory.GetDB();

        var groups = realm.objects("Group").filtered('country= "' + GeneralFactory.GetSelectedCountry() + '"').sorted("sort");

        var gList = [];

        groups.forEach(g => {
            var fields = JSON.parse(g.data);
            var bgColor = "#D8E2DC";
            var textColor = "#383838";
            
            if(fields.color != null)
                bgColor = fields.color;
            if(fields.textColor != null)
                textColor = fields.textColor;

            gList.push(
                <IndicatorGroup 
                    key={gList.length +1}
                    title={g.name}
                    type={g.type}
                    bgColor={bgColor}
                    textColor={textColor}
                    indicatorClick={(id,name) =>this.viewIndicator(id,name)}
                />
            )    
        });

        this.setState({
            groups:gList
        });

    }

    componentDidMount(){
        
        this.loadGroups();
    }

    render(){

        return(
            <View>
                <ScrollView>
                    {this.state.groups}
                </ScrollView>
            </View>
        );
    }
}