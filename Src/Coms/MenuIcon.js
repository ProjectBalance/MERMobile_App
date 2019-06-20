import React,{Component} from 'react';
import {View,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class MenuIcon extends Component{



toggleDrawer=()=>{
    
    this.props.navigationProps.toggleDrawer();
 
  }
 
  render() {
 
    return (
 
      <View style={{flexDirection: 'row'}}>
 
        <TouchableOpacity onPress={this.toggleDrawer.bind(this)} >
 
          <Icon 
          name='navicon' 
          size={24}
          style={{marginLeft: 15,}}
          />
 
        </TouchableOpacity>
 
      </View>
    
    );
  
  
  }
}