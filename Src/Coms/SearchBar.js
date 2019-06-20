import React, {Component} from 'react';
import {View} from 'react-native';
import {SearchBar} from 'react-native-elements';

export default class SearchBarCom extends Component{

    search(text){
        if(text != "" && text != null){
            alert(text);
        }
        
    }

    clearSearch(){
    alert("Cleared!");
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    render(){
        return (
                <SearchBar
                onChangeText={(text) => {
                    this.text = text;
                    clearTimeout(this.timeout); // clears the old timer
                    this.timeout = setTimeout(() => this.search(this.text), 500);
                }}
                onClearText={this.clearSearch}
                placeholder='Search...' 
                clearIcon
                />

        );
    }
}