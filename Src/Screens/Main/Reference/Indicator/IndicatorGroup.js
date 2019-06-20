import React, {Component} from 'react';
import {View,ScrollView,Image, Text, Button, TouchableOpacity} from 'react-native';
import IndicatorItem from '../../../../Coms/Indicator/IndicatorItem';

import { Toolbar } from 'react-native-material-ui';

import Collapsible from 'react-native-collapsible';

import FavIcon from '../Favourite/FavIcon';
import SearchIcon from '../Search/SearchIcon';
import BottomBar from '../../../../Coms/BottomBar';

import * as DataFactory from '../../../../Factory/DataFactory';
import * as GeneralFactory from '../../../../Factory/GeneralFactory';
import * as IndicatorFactory from '../../../../Factory/IndicatorFactory';
import * as TextFactory from '../../../../Factory/TextFactory';

import {referenceColor,orientationColor,defaultFont} from '../../../../Global/style.json';
import { ListItem, Avatar,Icon } from 'react-native-elements';


export default class IndicatorGroup extends Component{

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Indicators',
            headerStyle: {
              backgroundColor: referenceColor,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerRight: <View style={{flexDirection:'row'}}><SearchIcon onPress={() => navigation.push("Search",{type:"indicator"})}/><Text>  </Text><FavIcon onPress={() => navigation.navigate("Favourites")}/></View>,
            headerRightContainerStyle:{paddingRight:15}
        }
        
    };

    constructor(props){
        super(props);

        var country = GeneralFactory.GetSelectedCountry();

        this.state ={
            selectedCountry:country,
            groups:[],
            merLink:<View></View>
        }
    }

    loadGroups(){

        var realm = DataFactory.GetDB();

        var groups = realm.objects("Group").filtered('country= "' + this.state.selectedCountry + '"').sorted("sort");

        var gList = [];

        groups.forEach(g => {
            var fields = JSON.parse(g.data);
            var bgColor = "#D8E2DC";
            var textColor = "#383838";
            var img = IndicatorFactory.GetGroupIcon(g.type);
            
            if(fields.color != null && fields.color != "")
                if(isOk = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(fields.color))
                    bgColor = fields.color;
            if(fields.textColor != null && fields.textColor != "")
                textColor = fields.textColor;

            gList.push(
                <ListItem
                key={gList.length + 1}
                chevron
                title={g.name}
                titleStyle={{color:'#FFFFFF', fontWeight:'bold',fontSize:TextFactory.GetFontSize(defaultFont)}}
                containerStyle={{backgroundColor:bgColor,borderBottomColor:"#C3C3C3", borderBottomWidth:1}}
                leftAvatar={<Avatar avatarStyle={{backgroundColor:bgColor}} source={img} />}
                // avatar={<Avatar source={img} overlayContainerStyle={{backgroundColor:bgColor}} />}
                onPress={() => this.props.navigation.navigate('IndicatorListing',{title:g.name,type:g.type,color:bgColor})}
              />
            )    
        });

        this.setState({
            groups:gList
        });

    }

    componentDidMount(){
        var realm = DataFactory.GetDB();
        var orientation = realm.objects("Resource").filtered('type = "Orientation" and country= "' + this.state.selectedCountry + '" and title BEGINSWITH "MER"');
        
        this.loadGroups();

        if(orientation != ""){
            var mer =   <ListItem
                            title="MER 2.3"
                            chevron
                            titleStyle={{color:orientationColor, fontWeight:'bold',fontSize:TextFactory.GetFontSize(defaultFont)}}
                            containerStyle={{backgroundColor:"#FFF"}}
                            onPress={() => this.props.navigation.navigate('OrientationDetail',{title:orientation[0].title,id:orientation[0].id})}
                        />
            this.setState({
                merLink:mer
            });
        }

            
    }

    render(){

        return(
            <View style={{flex:1}}>
                <View style={{flex:1}}>
                    <ScrollView>
                        {this.state.merLink}
                        
                        {this.state.groups}
                    </ScrollView>
                </View>
                <BottomBar color={referenceColor}/>
            </View>
              
        );
    }
}