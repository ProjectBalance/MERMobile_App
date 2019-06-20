import React, {Component} from 'react';
import {View,Image,Dimensions,Text, StyleSheet,TouchableHighlight,NetInfo,ActivityIndicator} from 'react-native';
import {Button, Tile} from 'react-native-elements';


import {orientationColor} from '../../../Global/style.json';

import * as DateFactory from '../../../Factory/DateFactory';
import * as DataFactory from '../../../Factory/DataFactory';
import * as GeneralFactory from '../../../Factory/GeneralFactory';

import Swiper from 'react-native-swiper';

import HowToItem from './HowToItem';

import HowTo1 from '../../../../Assets/HowTo/HowTo001.png';
import HowTo2 from '../../../../Assets/HowTo/HowTo002.png';
import HowTo3 from '../../../../Assets/HowTo/HowTo003.png';
import HowTo4 from '../../../../Assets/HowTo/HowTo004.png';
import HowTo5 from '../../../../Assets/HowTo/HowTo005.png';
import HowTo6 from '../../../../Assets/HowTo/HowTo006.png';
import HowTo7 from '../../../../Assets/HowTo/HowTo007.png';
import HowTo8 from '../../../../Assets/HowTo/HowTo008.png';
import NoImage from '../../../../Assets/HowTo/NoImageAvailable.png';

const { width } = Dimensions.get('window');

export default class HowTo extends Component{
    static navigationOptions = ({navigation}) => {
    return {
        title: "How To",
        headerStyle: {
            backgroundColor: orientationColor,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
            fontWeight: 'bold',
            },
        };
    };

    constructor(props){
        super(props);
  
        var country = GeneralFactory.GetSelectedCountry();
        this.state={
            description:this.props.navigation.getParam("desc",""),
            howToItems:[]
        }
        
    }

    getHowToImage(order){
        switch(order){
            case 1:
                return HowTo1;
            case 2:
                return HowTo2;
            case 3:
                return HowTo3;
            case 4:
                return HowTo4;
            case 5:
                return HowTo5;
            case 6:
                return HowTo6;
            case 7:
                return HowTo7;
            case 8:
                return HowTo8;
            default:
                return NoImage;
        }
    }

    componentDidMount(){
        var realm = DataFactory.GetDB();
        var howTos = realm.objects("Resource").filtered('type = $0 and country= $1',"HowTo",GeneralFactory.GetSelectedCountry()).sorted("order");

        var howToItems = [];
        howTos.forEach(h =>{
            howToItems.push(
                <View key={howToItems.length + 1}>
                <HowToItem 
                    image={this.getHowToImage(h.order)}
                    title={h.title}
                    description={h.description}
                />
            </View>
            );
        });

        this.setState({
            howToItems:howToItems
        })
    }

    render(){
        var title = "this is a title";
        var desc = `this is a desc jskdfl jsdkfl dsj
        jskdlf djskfj d
        js dkfj sdfkls 
        js djfklsd jflsd
         jfskdjf ksdlfjsdkl fj dsl
          jkldsjf klsdjf sdlf
          let giaj ajd;a d
          lllllll
          dfdfdfdf
          erewrwerwe
          sdsdfsdfsd
          ertwwet


          fgfdgdfgdf
          `;
        return(
            // <HowToItem 
            //     image={HowTo1}
            //     title={"hey"}
            // />
                 <Swiper
                        showsButtons={true}
                        showsPagination={false}
                        loop={false}
                        style={{paddingBottom:10,paddingTop:10,paddingLeft:10,paddingRight:10, backgroundColor:"#FFF"}}
                    >
                        {this.state.howToItems}

                        {/* <View>
                            <HowToItem 
                                image={HowTo1}
                                title={title}
                                description={desc}
                            />
                        </View>
                        <View>
                            <HowToItem 
                                image={HowTo2}
                                title={title}
                                description={desc}
                            />
                        </View>
                        <View>
                            <HowToItem 
                                image={HowTo3}
                                title={title}
                                description={desc}
                            />
                        </View>
                        <View>
                            <HowToItem 
                                image={HowTo4}
                                title={title}
                                description={desc}
                            />
                        </View>
                        <View>
                            <HowToItem 
                                image={HowTo5}
                                title={title}
                                description={desc}
                            />
                        </View>
                         */}
                       
                        {/* <Image
                            resizeMode={'stretch'}
                            style={{
                                width,
                                flex:1
                            }}
                            source = {HowTo1} 
                        />
                        <Image
                            resizeMode={'stretch'}
                            style={{
                                width,
                                flex:1
                            }}
                            source = {HowTo2} 
                        />
                        <Image
                            resizeMode={'stretch'}
                            style={{
                                width,
                                flex:1
                            }}
                            source = {HowTo3} 
                        />

                        <Image
                            resizeMode={'stretch'}
                            style={{
                                width,
                                flex:1
                            }}
                            source = {HowTo4} 
                        />

                        <Image
                            resizeMode={'stretch'}
                            style={{
                                width,
                                flex:1
                            }}
                            source = {HowTo5} 
                        />       */}
                </Swiper>
        );
    }

}