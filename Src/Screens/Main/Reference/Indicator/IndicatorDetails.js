import React, {Component} from 'react';
import {View,Text, Button, Alert,StyleSheet,TouchableOpacity} from 'react-native';

import Details from '../../../../Coms/Indicator/Details';
import FavIcon from '../Favourite/FavIcon';
import SearchIcon from '../Search/SearchIcon';

import BottomBar from '../../../../Coms/BottomBar';

import * as IndicatorFactory from '../../../../Factory/IndicatorFactory';

import * as TextFactory from '../../../../Factory/TextFactory';

import {referenceColor} from '../../../../Global/style.json';

import { ListItem,Icon } from 'react-native-elements';

export default class IndicatorDetailScreen extends Component{
    
    static navigationOptions = ({navigation}) => {
        return {
            title: navigation.getParam("group","Details"),
            headerStyle: {
            backgroundColor:  navigation.getParam("gcolor",referenceColor),
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
            fontWeight: 'bold',
            },
            headerRight: <View style={{flexDirection:'row'}}><SearchIcon onPress={() => navigation.push("Search",{type:"indicator"})}/><Text>  </Text><FavIcon onPress={() => navigation.navigate("Favourites")}/></View>,
            headerRightContainerStyle:{paddingRight:15}
        };
    };

    constructor(props){
        super(props);

        this.id = this.props.navigation.getParam("id","");
        var bgTBColor = IndicatorFactory.GetGroupColor(this.id).bgColor;
        var textTBColor = IndicatorFactory.GetGroupColor(this.id).textColor;
        var bookmarked = IndicatorFactory.GetBookmark(this.id);

        if(bgTBColor == "")
            bgTBColor = "#5299D3";

        if(textTBColor == "")
            textTBColor = "#383838";

        this.state ={
            title:this.props.navigation.getParam("name","Details"),
            bgTBColor:bgTBColor,
            textTBColor:textTBColor,
            bookmarked:bookmarked
        }
    }

    bookmark(){
        var b = "star";
        var bookmarked = true;

        var name = this.props.navigation.getParam("name","Indicator");
        var id = this.props.navigation.getParam("id","");

        if(this.state.bookmarked == "star"){
            b = "star-o";
            bookmarked = false
            Alert.alert(name,"Removed from favourites");
        }
        else{
            Alert.alert(name,"Added to favourites");
        }

        this.setState({
            bookmarked:b
        });

        IndicatorFactory.SaveBookmark(id,name,bookmarked);

    }

    render(){

        return(
            <View style={{flex:1}}>
                <View style={{flexDirection:'row', height:50,padding:10,paddingRight:15, backgroundColor:this.props.navigation.getParam("color","#FFF")}}>
                    <Text style={{flex:1, fontWeight:'bold',fontSize:TextFactory.GetFontSize(20)}}>{this.props.navigation.getParam("name","Indicator")}</Text>
                    <TouchableOpacity
                            onPress={() =>this.bookmark()}
                        >
                        <Icon 
                            name={this.state.bookmarked}
                            type="font-awesome"
                            color="#FFF"
                            size={24}                            
                        />
                    </TouchableOpacity>
                    
                </View>
                <Details 
                    id={this.id}
                />
                <BottomBar color={this.props.navigation.getParam("gcolor",referenceColor)}/>
            </View>
        );
    }

}