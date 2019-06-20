import React, {Component} from 'react';
import {View, Text} from 'react-native';
import { Toolbar } from 'react-native-material-ui';
import TextWithPopUp from '../../Coms/TextWithPopUp';

import Swiper from 'react-native-swiper';

import * as GeneralFactory from '../../Factory/GeneralFactory';

import AboutItem from '../../Coms/AboutItem';

const PEPFARText  = `The President's Emergency Plan For AIDS Relief (PEPFAR/Emergency Plan) is a United States governmental initiative to address the global HIV/AIDS epidemic and help save the lives of those suffering from the disease, primarily in Africa.

The program has provided antiretroviral treatment (ART) to over 7.7 million HIV-infected people in resource-limited settings and supported HIV testing and counseling (HTC) for more than 56.7 million people as of 2014. PEPFAR increased the number of Africans receiving ART from 50,000 at the start of the initiative in 2004.[2][3][4] PEPFAR has been called the largest health initiative ever initiated by one country to address a disease. The budget presented for the fiscal year 2016 included a request for $1.11 billion for PEPFAR as well as contributions from global organizations such as UNAIDS and private donors.

The massive funding increases have made anti-retrovirals widely available, saving an estimated 11 million lives. Critics contend that spending a portion of funding on abstinence-until-marriage programs is unjust while others feel that foreign aid is generally inefficient.
        `;

const keyDefinitions = [
    {
        key:"epidemic",
        definition:"A widespread occurrence of an infectious disease in a community at a particular time."
    },
    {
        key:"antiretroviral",
        definition:"denoting or relating to a class of drugs which inhibit the activity of retroviruses such as HIV."
    },
    {
        key:"HIV",
        definition:"HIV is a sexually transmitted infection (STI). It can also be spread by contact with infected blood or from mother to child during pregnancy, childbirth or breast-feeding. Without medication, it may take years before HIV weakens your immune system to the point that you have AIDS."
    },

];

export default class AboutScreen extends Component{

    constructor(props){
        super(props);

        this.state = {
            abouts:[],
            definitions:GeneralFactory.GetDefinitions()
        }
    }

    loadAbout(){
        var abouts = GeneralFactory.GetAbout();
        var aData = [];
        abouts.forEach(a => {
            aData.push(

            <View 
                key={aData.length + 1}
                style={{
                    flex:1,
                    justifyContent:"center",
                    alignItems:"center",
                    backgroundColor:"#FFFFFF",
                    padding:10
                    
                }}
            >
        
                <AboutItem text={a.description} definitions={this.state.definitions}/>
                {/* <TextWithPopUp text={a.description} definitions={this.state.definitions}/> */}
            </View>     
            );
            
        });

        this.setState({
            abouts:aData
        });
    }

    componentDidMount(){
        this.loadAbout();
    }

    render(){
        

        return(
            <View style={{flex:1}}>
                 <Toolbar
                    leftElement="menu"
                    centerElement="About"
                    onLeftElementPress={() => {this.props.navigation.toggleDrawer()}}
                    />
                {/* <Text>This is the About Screen</Text>
                <View style={{paddingTop:25}}>
                    <TextWithPopUp text={PEPFARText} definitions={keyDefinitions}/>
                </View> */}

                <Swiper
                    style={{
                        flex:1,
                    }}
                    loop={false}
                >

                {this.state.abouts}
                    {/* <View 
                        style={{
                            flex:1,
                            justifyContent:"center",
                            alignItems:"center",
                            backgroundColor:"#FFF000"
                        }}
                    >
                    
                        <Text>
                            This is some next
                        </Text>
                    </View>
                    <View 
                        style={{
                            flex:1,
                            justifyContent:"center",
                            alignItems:"center",
                            backgroundColor:"#FFF888",
                            padding:10
                            
                        }}
                    >
                    
                        <TextWithPopUp text={PEPFARText} definitions={keyDefinitions}/>
                    </View> */}
                </Swiper>
                

            </View>
        );
    }
}