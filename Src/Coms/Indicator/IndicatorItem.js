import React, {Component} from 'react';
import {View,Text, Button, Alert,TouchableHighlight,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as IndicatorFactory from '../../Factory/IndicatorFactory';

export default class IndicatorItem extends Component{

    constructor(props){
        super(props);

        this.state ={
            bookmark:this.props.bookmark
        }
    }

    bookmark(){
        var bookmarked = false;
        var id = this.props.id;
        if(this.state.bookmark == "star")
        {
            this.setState({
                bookmark:"star-o"
            });

            Alert.alert(this.props.name,"Removed from favourites");
        }
        else{
            bookmarked = true;
            this.setState({
                bookmark:"star"
            })

            Alert.alert(this.props.name,"Added to favourites");
        }

        IndicatorFactory.SaveBookmark(id,this.props.name,bookmarked);

        
    }

    render(){

        return(
            <TouchableHighlight
                    onPress={()=>this.props.onItemClick(this.props.id,this.props.name)}
                >
            <View
                style={
                    {
                        borderStyle:"solid",
                        borderColor:"#727072",
                        backgroundColor:this.props.color,
                        borderWidth:1,
                        height:50,
                        justifyContent: 'center',
                    }
                }
            >
                <View
                    style={{
                        flexDirection:"row",
                        paddingRight:15
                    }}
                >
                    <Text
                            style={{
                                fontSize:15,
                                fontWeight:'bold',
                                flex:1,
                                paddingLeft:5
                            }}
                        >{this.props.name}</Text>
                        <TouchableOpacity
                            onPress={() =>this.bookmark()}
                        >
                            <Icon 
                                name={this.state.bookmark}
                                size={24}
                                style = {{color:'#FFF'}}
                            />
                        </TouchableOpacity>
                       
                </View>
            </View>
            </TouchableHighlight>
        );
    }

}