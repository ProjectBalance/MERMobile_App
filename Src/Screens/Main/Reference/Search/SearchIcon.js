import React, {Component} from 'react';
import {View,ScrollView,Image, Text, Button, TouchableOpacity} from 'react-native';
import IndicatorItem from '../../../../Coms/Indicator/IndicatorItem';

import { Toolbar } from 'react-native-material-ui';

import Collapsible from 'react-native-collapsible';

import * as DataFactory from '../../../../Factory/DataFactory';
import * as GeneralFactory from '../../../../Factory/GeneralFactory';
import * as IndicatorFactory from '../../../../Factory/IndicatorFactory';
import * as TextFactory from '../../../../Factory/TextFactory';

import {referenceColor,orientationColor} from '../../../../Global/style.json';
import { ListItem, Avatar,Icon } from 'react-native-elements';

export default class FavIcon extends Component{
    render(){
        return(
            <TouchableOpacity 
                        onPress={() => this.props.onPress()}
                    >
                        <Icon name="search" type="feather" color="#FFF"/>
            </TouchableOpacity>
        );
        
    }
}