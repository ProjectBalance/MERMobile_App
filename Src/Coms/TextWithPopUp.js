import React, {Component} from 'react';
import {View,Text, TouchableHighlight,Modal, StyleSheet} from 'react-native';
import { Dialog, DialogDefaultActions } from 'react-native-material-ui';

export default class TextWithPopUp  extends Component{

    constructor(props){
        super(props);

        this.state = {
            modalVisible:false,
            dialogHeader:"",
            dialogText:""
        }
    }

    showDialog = (key) =>{
        this.setState({
            dialogHeader:key,
            dialogText:this.getDefinition(key)
        });
        this.setModalVisible(true);
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
      }

    hasDefinition(key){
        var defList = this.props.definitions;
        var found = false;

        defList.forEach(def => {
            if(def.key == key)
            {
                found = true;
                return true;
            }
        });

        return found;
    }
    getDefinition(key){
        var defList = this.props.definitions;
        var definition = "";
        defList.forEach(def => {
            if(def.key == key)
            {
                definition = def.definition;
            }
        });
        return definition;
    }        
      
    render(){
        var textList = [];
        var words = this.props.text.split(" ");
       
        words.forEach(word => {
            var def = this.hasDefinition(word);

            if(def){

                textList.push(
                    <TouchableHighlight 
                        key={textList.length + 1}
                        onPress={() =>this.showDialog(word)}
                    >
                        <Text style={{color:"red"}}>{word + " "}</Text>
                    </TouchableHighlight>
                    
                );

            }
            else
            {
                if(word != " "){
                    textList.push(
                        <Text key={textList.length + 1}>{word + " "}</Text>
                    )
                }
            }
           
        });

        return(
            <View style={{flexDirection:"row", flexWrap: 'wrap'}}>
                {textList}

               <Modal
                 animationType="slide"
                 transparent={true}
                 visible={this.state.modalVisible}
                 onRequestClose={() => {
                    this.setModalVisible(!this.state.modalVisible);
                 }}
               >
                   <View style={styles.container}>
                       <Text style={{fontSize:20, fontWeight:"bold"}}>{this.state.dialogHeader}</Text>

                       <Text style={{paddingTop:20, paddingBottom:20, paddingLeft:15,paddingRight:15}}>{this.state.dialogText}</Text>

                       <TouchableHighlight
                            onPress={() => {
                            this.setModalVisible(!this.state.modalVisible);
                            }}>
                            <Text style={{color:"blue",fontSize:15, fontWeight:"bold"}}>Close</Text>
                        </TouchableHighlight>
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
      backgroundColor: '#F5FCFF',
    },
  });