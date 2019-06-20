import React, {Component} from 'react';
import {View,Text, Button, Alert,TouchableHighlight,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as DataFactory from '../../Factory/DataFactory';

export default class BookmarkItem extends Component{

    constructor(props){
        super(props);

    }

    remove(){
        alert("remove!");
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
                        backgroundColor:"#CFD6EA",
                        borderWidth:1,
                        height:50,
                        justifyContent: 'center',
                    }
                }
            >
                <View
                    style={{
                        flexDirection:"row"
                    }}
                >
                    <Text
                            style={{
                                fontSize:15,
                                width:"90%",
                                paddingLeft:5
                            }}
                        >{this.props.name}</Text>
                        <TouchableOpacity
                            onPress={() =>this.remove()}
                        >
                            <Icon 
                                name={"trash"}
                                size={24}
                            />
                        </TouchableOpacity>
                       
                </View>
            </View>
            </TouchableHighlight>
        );
    }

}