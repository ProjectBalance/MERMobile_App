import React, {Component} from 'react';
import {View,ScrollView,Text,  StyleSheet,Image,TouchableOpacity} from 'react-native';
import {Button, ListItem} from 'react-native-elements';

import * as DataFactory from '../../../../Factory/DataFactory';
import * as GeneralFactory from '../../../../Factory/GeneralFactory';

import Collapsible from 'react-native-collapsible';

import {referenceColor} from '../../../../Global/style.json';

const styles = StyleSheet.create({
  
    tabActive: {
        color:"#B44954",
        fontWeight:"bold"
    },

    tabInactive: {
        fontWeight:"bold"
    }
  });



export default class TabbedGroup extends Component{
    constructor(props){
        super(props);

        var tabStyles = [];
        if(this.props.tabs.length > 0){
            if(this.props.tabs.length > 1){
                for (let i = 0; i < this.props.tabs.length; i++) {
                    if(i == 0)
                        tabStyles.push(styles.tabActive);
                    else
                        tabStyles.push(styles.tabInactive);
                }
            }
            else
                tabStyles.push(styles.tabInactive);

        }
        
        this.state ={
            tabs:[],
            tabStyles:tabStyles,
            selectedTab:0,
            data:[]
            
        }
    }

    renderTabs(){
        var tabs = this.props.tabs;
        var tabList = [];
        var index = 0;

        for (let i = 0; i < tabs.length; i++) {
            var t = tabs[i];
            tabList.push(
                <TouchableOpacity  key={tabList.length + 1} style={{flex:1, alignItems:"center", padding:5}} onPress={() => this.selectTab(i)}>
                    <View>
                        <Text style={this.state.tabStyles[i]}>{t.header}</Text>
                    </View>
                </TouchableOpacity>
                
            );
            
        }

        this.setState({
            tabs:tabList
        })
    }

    renderData(){
        var nodes = this.populateTree();

        var dataList = [];

        nodes.forEach(node =>{

            // this.renderNodes(subNodes,dataList);
            node.sort(function(a,b){
                if(a.name < b.name) { return -1; }
                if(a.name > b.name) { return 1; }
                return 0;
            });
    
            node.forEach(n =>{
                    
                if(n.children.length > 0){
                    dataList.push(
                        <TabbedItem key={dataList.length + 1} name={n.name} children={n.children} colorBlend={0} />
                    )
                }
                else{
                    dataList.push(
                        <ListItem
                        key={dataList.length + 1} 
                        title={n.name}
                        titleStyle={{color:referenceColor, fontWeight:'bold'}}
                        containerStyle={{borderBottomColor:"#C3C3C3", borderBottomWidth:1}}
                        hideChevron={true}
                      />
                    );
                }
                
            });
        });

        this.setState({
            data:dataList
        })
    }


    populateTree(){ 
        var index = 0;
        var nodes = []
        var mapFeatures = this.props.maps;

        mapFeatures.forEach(mf=>{
            nodes.push(this.popTree(mf,index,[]));
        });

        return nodes;
    }

    popTree(map,index,params){
        var tabs = this.props.tabs;
        var tree = tabs[this.state.selectedTab].tree;
        var data = this.props.data;
        var mapping = this.props.mapping;

        var checkList = [];
        var nodeList = [];

        data.forEach(d=>{
            var match = true;
            

            match = this.hasMatch(d,mapping.map,map.name); //Match on the map

            if(match)            
                for (let i = 0; i < index; i++) {
                    if(match)
                        match =  this.hasMatch(d,tree[i],params[i]);            
                }
            
            if(match)
            {
                
                if(!checkList.includes(d[tree[index]]))
                {
                    var node = {
                        name:"",
                        children:[]
                    };

                    var name = d[tree[index]];
                    node.name = name;
                    checkList.push(name);
                    var newParams = params.slice();
                    newParams.push(name);

                    if((index + 1) < tree.length)
                    {
                        node.children = this.popTree(map,index + 1,newParams);;
                    }

                    nodeList.push(node);
                } 
                
               
            }
        });

        return nodeList;

    }

    hasMatch(row,col,value){
        if(row[col] == value)
            return true;
        else
            return false;
    }

    selectTab(index){
        if(this.state.selectedTab != index){
            var tabStyles = [];
            for (let i = 0; i < this.props.tabs.length; i++) {
                    tabStyles.push(styles.tabInactive);
            }
    
            tabStyles[index] = styles.tabActive;
    
            this.setState({
                selectedTab:index,
                tabStyles:tabStyles,
                data:[]
            },()=>{
                
               this.renderTabs();
                this.renderData();
            });
    
        } 
    }

    componentDidMount(){
        this.renderTabs();
        this.renderData();
    }
  
    render(){
  
        return(
            <View style={{flex:1}}>
                <View style={{flexDirection:"row"}}>
                    {this.state.tabs}
                </View>
                <ScrollView>
                    {this.state.data}
                </ScrollView>
            </View>
        
          
        );
    }

}


class TabbedItem extends Component{
    constructor(props){
        super(props);
  
        this.state ={
            collapsed:true,
            list:[],
            color:referenceColor
        }
    }
  
    toggle =()=>{
  
        this.setState({
            collapsed:!this.state.collapsed
        })
    }
  
    renderNodes (nodes){
        var dataList = [];

        nodes.sort(function(a,b){
            if(a.name < b.name) { return -1; }
            if(a.name > b.name) { return 1; }
            return 0;
        });

        var blend = this.props.colorBlend += 0.2;
        
        nodes.forEach(n =>{
            if(n.children.length > 0){
                dataList.push(
                    <TabbedItem key={dataList.length + 1} name={n.name} children={n.children}  colorBlend={blend}  />
                )
            }
            else{
                dataList.push(
                    <ListItem
                    key={dataList.length + 1} 
                    title={n.name}
                    titleStyle={{color:referenceColor, fontWeight:'bold'}}
                    containerStyle={{borderBottomColor:"#C3C3C3", borderBottomWidth:1}}
                    hideChevron={true}
                  />
                );
            }
        });

        this.setState({
            list:dataList
        })
    }

    componentDidMount(){

        var blend = GeneralFactory.BlendColor(this.state.color,this.props.colorBlend);
        this.setState({
            color:blend
        });

        this.renderNodes(this.props.children)
    }
  
    render(){
  
        return(
            <View >
                <TouchableOpacity 
                    onPress={() =>this.toggle()}
                >
                    <View
                        style={{
                            backgroundColor:this.state.color,
                            // borderStyle:"solid",
                            borderBottomWidth:1,
                            borderBottomColor:"#FFFFFF",
                            height:50
                        }}
                    >
                        <Text
                            style={{
                                fontSize:15,
                                fontWeight:"bold",
                                padding:10,
                                color:"#FFF"
                            }}
                        >
                            {this.props.name}
                        </Text>
                    </View>
                </TouchableOpacity>
                <Collapsible collapsed={this.state.collapsed}>
                    {this.state.list}
                </Collapsible>
            </View>
          
        );
    }
  }