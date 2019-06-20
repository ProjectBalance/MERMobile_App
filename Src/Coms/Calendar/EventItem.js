import React, {Component} from 'react';
import {View,Text, Button, StyleSheet,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import Collapsible from 'react-native-collapsible';

class EventTitle extends Component{
    render(){
        return(
            <View
                style={{
                    backgroundColor:this.props.color

                }}
            >
                <TouchableOpacity
                    onPress={() => this.props.onClick()}
                >
                    <View>
                        <icon 
                            name=''
                            color={this.props.color}
                        />
                        <Text
                            style={{
                                fontSize:16,
                                fontWeight:"bold",
                                padding:5
                            }}
                        >
                            {this.props.title}
                        </Text>
                    </View>

                </TouchableOpacity>
               
            </View>
        );
    }
}

class EventBody extends Component{
    render(){
        return(
            <View
                style={{
                    backgroundColor:"#F6F2FF"
                }}
            >
                <View>
                    <Text
                        style={{
                            padding:5,
                            fontSize:15
                        }}
                    >{this.props.description}</Text>
                </View>
                <View
                    style={{
                        marginTop:10
                    }}
                >
                    <Text
                        style={{
                            padding:5
                        }}
                    >{this.props.location}</Text>
                </View>
            </View>
        );
    }
}

export default class EventItem extends Component{

    constructor(props){
        super(props);

        this.state = {
            collapsed:true
        }
    }

    toggle =()=>{

        this.setState({
            collapsed: !this.state.collapsed
        })
    }

    render(){
        return(

            <View>
                <EventTitle title={this.props.title} color={this.props.color} onClick={this.toggle}/>
                <Collapsible collapsed={this.state.collapsed}>
                   <EventBody description={this.props.description} location={this.props.location}/>
                </Collapsible>
            </View>
            

            // <View
            //     style={
            //         {
            //             borderStyle:"solid",
            //             borderColor:"#727072",
            //             backgroundColor:"#CFD6EA",
            //             borderWidth:1,
            //             height:65,
            //             justifyContent: 'center',
            //             marginTop:5
            //         }
            //     }
            // >
            //     <Text
            //         style={{
            //             fontSize:18,
            //             fontWeight:"bold",
            //             paddingLeft:5
            //         }}
            //     >
            //         {this.props.title}
            //     </Text>
            //     <Text
            //         style={{
            //             fontSize:15,
            //             paddingLeft:5
            //         }}
            //     >{this.props.description}</Text>
            //     <Text style={{paddingLeft:5}}>
            //         {this.props.location}
            //     </Text>
            // </View>
        );
    }

}