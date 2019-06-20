import React, {Component} from 'react';
import {View,Text,Button, TouchableOpacity} from 'react-native';
import { Card } from "react-native-elements";

export default class BookmarkCard extends Component{

    viewIndicator(){

        this.props.viewbookmark(this.props.id,this.props.title);

    }
    render(){
        return (
            <TouchableOpacity
                onPress={()=>this.viewIndicator()}
            >
                <Card
                    // title={this.props.title}
                    containerStyle={{ 
                        padding: 5, 
                        width: 200, 
                        alignItems:"center",
                        alignContent:"center",
                        backgroundColor:this.props.color.bgColor
                        
                    }}
                >
                    {/* <Button 
                        title={"View Details"}
                        onPress={() => this.props.viewbookmark(this.props.id) }
                    /> */}
                    <View>
                        <Text
                            style={{fontWeight:"bold", fontSize:18, color: this.props.color.textColor}}
                        >
                            {this.props.title}
                            
                        </Text>
                    </View>
                
                
                </Card>
            </TouchableOpacity>
          
        );
    }

}