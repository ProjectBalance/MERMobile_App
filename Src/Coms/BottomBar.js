import React from 'react';
import { View,TouchableOpacity } from 'react-native';
import {Icon, Avatar} from 'react-native-elements';

import { withNavigation } from 'react-navigation';

import {bottomBarColor} from '../Global/style.json';

class BottomBar extends React.Component {
    constructor(props){
        super(props);

        var rightIcon = <View />
        if(this.props.rightIcon != null)
            rightIcon = this.props.rightIcon;

        var color = bottomBarColor;
        if(this.props.color != null)
            color = this.props.color;

        this.state ={
            rightIcon:rightIcon,
            color:color
        }

        
    }

    render() {
        return (
        
        <View style={{height:55,flexDirection:'row', paddingLeft:12, paddingRight:12, backgroundColor:this.state.color,justifyContent:"center"}}>

                <Avatar 
                    size="medium"
                    rounded 
                    onPress={()=> this.props.navigation.navigate("ReferenceScreen")}
                    icon={{name:"home", type:"font-awesome"}} 
                    overlayContainerStyle={{backgroundColor:this.state.color}} 
                    activeOpacity={0.7}
                />

            
            <View style={{flex:1,}} />
            {this.state.rightIcon}
        </View>

        );
    }
}

// withNavigation returns a component that wraps MyBackButton and passes in the
// navigation prop
export default withNavigation(BottomBar);



