import React, {Component} from 'react';
import {View,Text, FlatList, TouchableOpacity} from 'react-native';
import BookmarkCard from './BookmarkCard';

import Icon from 'react-native-vector-icons/FontAwesome';

import * as IndicatorFactory from '../../Factory/IndicatorFactory';

import Swiper from 'react-native-swiper';

export default class BookmarkBar extends Component{

    constructor(props){
        super(props);
        this.state = {
            data:[]
        }
    }

    bookmarkPage(){
        this.props.navigation.navigate("Bookmarks");
    }

    viewBookmark = (id,name) =>{
       this.props.navigation.navigate("IndicatorDetails",{id:id,name:name});
    }

    loadBookmarks(){
        var bookmarks = IndicatorFactory.GetHomeBookmarks();
        var bmData = [];

        bookmarks.forEach(bm => {

            var color = IndicatorFactory.GetGroupColor(bm.id);

            bmData.push(
                <View
                    key={bmData.length + 1}
                    style={{
                        height:150,
                        alignItems: 'center',
                    }}
                >
                    <BookmarkCard  id={bm.id} title={bm.name} color={color} viewbookmark={this.viewBookmark} />
                </View>
                
            );  
            // bmData.push(
            //     {
            //         id:bm.id,
            //         title:bm.name,
            //         color:color
            //     }
            // )    

        });

        this.setState({
            data:bmData
        })
    }


    componentDidMount(){
        this.loadBookmarks();
    }
    
    render(){
        if(this.state.data.length == 0){
            return(
                <View></View>
            );
        }
        else
        {
            return(
                <View 
                    style={{
                        borderBottomColor:"#000333",
                        borderBottomWidth:1,
                        paddingBottom:15,
                        height:100
                    }}
                >
                    <TouchableOpacity
                        onPress={()=>this.bookmarkPage()}
                        style={{alignSelf: 'flex-start'}}
                    >
                        <Text style={{fontWeight:"bold", paddingLeft:10}}> <Icon name={"bookmark"}/>  {"Bookmarks"}</Text>
                    </TouchableOpacity>
                    
                    {/* <FlatList
                        horizontal
                        data={this.state.data}
                        renderItem={({ item: rowData }) => {
                            return (
                                <BookmarkCard id={rowData.id} title={rowData.title} color={rowData.color} viewbookmark={this.viewBookmark} />
                            );
                        }}
                        keyExtractor={(item, index) => index.toString()}
                    /> */}
                    <Swiper
                        showsButtons={true}
                        showsPagination={false}
                        loop={false}
                    >
                        {this.state.data}
                    </Swiper>
                </View>
            );
        }
     
    }

}