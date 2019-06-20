import React,{Component} from 'react';
import {View,Text,Linking, TouchableHighlight,Modal, StyleSheet} from 'react-native';

import * as TextFactory from '../Factory/TextFactory';
import * as GeneralFactory from '../Factory/GeneralFactory';

import HTML from 'react-native-render-html';

export default class AboutItem extends Component{

    constructor(props){
        super(props);

        var text = '<div style="font-size:' + TextFactory.GetFontSize(15) + ';">' + this.encapsulateDefinition(TextFactory.ParseText(this.props.text)) + "</div>";
        this.state = {
            modalVisible:false,
            dialogHeader:"",
            dialogText:"",
            text: text
        }
    }

    encapsulateDefinition(text){
        var txt = text;
        var defs = this.props.definitions;
        defs.forEach(d => {
            var esc = d.key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            var reg = new RegExp("\\b" + esc + "\\b","g");
            txt = txt.replace(reg,'<b><a style="text-decoration:none; color:black" href="def:'+ d.key + '" >'+ d.key + '</a></b>')
        });

        
        return txt;
    }

    onWordPress(e,a,o){

        if(o.href.startsWith("def:"))
            this.showDialog(o.href.substring(4));
        else{
            Linking.openURL(GeneralFactory.CheckURL(o.href));
        }
    }

    showDialog = (key) =>{
        this.setState({
            dialogHeader:key,
            dialogText:this.getDefinition(key)
        });
        this.setModalVisible(true);
    }

    getDefinition(key){
        var defList = this.props.definitions;
        var definition = "";
        defList.forEach(def => {
            if(def.key.toLowerCase() == key.toLowerCase())
            {
                definition = def.definition;
            }
        });
        return definition;
    }  

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
      }

    render(){

        return(
            <View>
                <HTML 
                        html={this.state.text} 
                        containerStyle={{padding:10, backgroundColor:"#FFFFFF"}}
                        onLinkPress={(e,a,o)=> this.onWordPress(e,a,o)}
                    />

                 <Modal
                 animationType="slide"
                 transparent={true}
                 visible={this.state.modalVisible}
                 onRequestClose={() => {
                    this.setModalVisible(!this.state.modalVisible);
                 }}
               >
               <View style={{flex:1}}>
                        <View style={{flex:1}}>
                                <TouchableHighlight
                                style={{flex:1}}
                                                onPress={() => {
                                                this.setModalVisible(!this.state.modalVisible);
                                                }}>
                                                <View></View>
                                </TouchableHighlight>
                        </View>
                   <View style={styles.container}>
                       <Text style={{fontSize:TextFactory.GetFontSize(20), fontWeight:"bold"}}>{this.state.dialogHeader}</Text>

                       <Text style={{paddingTop:20, paddingBottom:20, paddingLeft:15,paddingRight:15,fontSize:TextFactory.GetFontSize(17)}}>{this.state.dialogText}</Text>

                       <TouchableHighlight
                            onPress={() => {
                            this.setModalVisible(!this.state.modalVisible);
                            }}>
                            <Text style={{color:"blue",fontSize:TextFactory.GetFontSize(17), fontWeight:"bold"}}>Close</Text>
                        </TouchableHighlight>
                   </View>
                </View>
               </Modal>
            </View>
            
        );
    }

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFF',
      borderTopWidth:1,
      borderTopColor:'#696969'
    },
  });