import React, {Component} from 'react';
import {View, Text} from 'react-native';

import { Toolbar } from 'react-native-material-ui';

import * as IndicatorFactory from '../Factory/IndicatorFactory';

export default class BookmarkScreen extends Component{
    constructor(props){
        super(props);

        this.state = {
            homeBookmarks:[],
            bookMarks:[]
        }
    }

    loadBookmarks(){
        var homeBookmarks = IndicatorFactory.GetHomeBookmarks();
    }

    componentDidMount(){
        this.loadBookmarks();
    }

    render(){
        return(
            <View>
                  <Toolbar
                    leftElement="menu"
                    centerElement="Bookmarks"
                    onLeftElementPress={() => {this.props.navigation.toggleDrawer()}}
                    />
                <Text>This is the Bookmark Screen</Text>
            </View>
        );
    }
}