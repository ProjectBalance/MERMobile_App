import React, {Component} from 'react';
import {View,ScrollView, Text, Button, TouchableOpacity} from 'react-native';
import IndicatorItem from '../Coms/Indicator/IndicatorItem';

import { Toolbar } from 'react-native-material-ui';

import Collapsible from 'react-native-collapsible';

import * as DataFactory from '../Factory/DataFactory';
import * as TextFactory from '../Factory/TextFactory';

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
        var group = this.props.title;
        var realm = DataFactory.GetDB();

        var iList = realm.objects("Indicator").filtered('group = "' + group + '"');
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
       
        this.loadIndicators();
    }

    render(){

        return(
            <View>
                <TouchableOpacity 
                    onPress={() =>this.toggle()}
                >
                    <View
                        style={{
                            backgroundColor:this.state.bgColor,
                            borderStyle:"solid",
                            borderWidth:1,
                            borderColor:"#9D8189",
                            height:60
                        }}
                    >
                        <Text
                            style={{
                                fontSize:20,
                                fontWeight:"bold",
                                padding:10,
                                color:this.state.textColor
                            }}
                        >
                            {this.props.title}
                        </Text>
                    </View>
                </TouchableOpacity>
                <Collapsible collapsed={this.state.collapsed}>
                    {this.state.indicators}
                </Collapsible>
            </View>
          
        );
    }
}

export default class IndicatorScreen extends Component{

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

        var groups = realm.objects("Group").sorted("id");

        var gList = [];
        var lang = TextFactory.GetLanguage();

        groups.forEach(g => {
            var fields = JSON.parse(g.data);
            var bgColor = "#D8E2DC";
            var textColor = "#383838";
            
            if(fields.color != null)
                bgColor = fields.color[lang];
            if(fields.textColor != null)
                textColor = fields.textColor[lang];

            gList.push(
                <IndicatorGroup 
                    key={gList.length +1}
                    title={g.name}
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
                  <Toolbar
                    leftElement="menu"
                    centerElement="Indicators"
                    onLeftElementPress={() => {this.props.navigation.toggleDrawer()}}
                    />
                <ScrollView>
                    {this.state.groups}
                </ScrollView>
            </View>
        );
    }
}