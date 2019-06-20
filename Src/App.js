import React, {Component} from 'react';

//Screens
import FirstRun from './Screens/Main/FirstRun';
import SplashScreen from './Screens/Splash';
import MainScreen from './Screens/Main/MainMenu';
import SyncScreen from './Screens/Main/Sync';

//Orientation Screens
import OrientationScreen from './Screens/Main/Orientation/OrientationMenu';
import OrientationDetail from './Screens/Main/Orientation/Orientation';
import HowToScreen from './Screens/Main/Orientation/HowTo';

//Reference Screens
import ReferenceScreen from './Screens/Main/Reference/ReferenceMenu';
  //Indicators
import IndicatorGroupScreen from './Screens/Main/Reference/Indicator/IndicatorGroup';
import IndicatorListScreen from './Screens/Main/Reference/Indicator/IndicatorList';
import IndicatorDetails from './Screens/Main/Reference/Indicator/IndicatorDetails';

  //Favourites
import FavouriteScreen from './Screens/Main/Reference/Favourite/Favourite';
import FavouriteMapScreen from './Screens/Main/Reference/Favourite/FavouriteMap';

  //Calendar
import CalendarScreen from './Screens/Main/Reference/Calendar/Calendar';
import CalendarDetails from './Screens/Main/Reference/Calendar/CalendarDetail';
  //Map
import MapScreen from './Screens/Main/Reference/Map/Map';

  //FAQ
import FAQScreen from './Screens/Main/Reference/FAQ/FAQ';
import FAQDetails from './Screens/Main/Reference/FAQ/FAQDetail';

  //More
import MoreScreen from './Screens/Main/Reference/More/More';
import MoreDetail from './Screens/Main/Reference/More/MoreDetail';

import SearchScreen from './Screens/Main/Reference/Search/Search';

import Icon from 'react-native-vector-icons/FontAwesome';
import { createStackNavigator,createMaterialTopTabNavigator } from 'react-navigation';

//Database
import * as DataFactory from './Factory/DataFactory';
import Realm from 'realm';
import * as Schema from './Model/Schema';

import CalendarEventList from './Screens/Main/Reference/Calendar/CalendarEventList';

import {referenceColor} from './Global/style.json';

//Due to using React-Navigation, warning will always pop up
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

const FavouriteTab = createMaterialTopTabNavigator(
  {
    Indicator:FavouriteScreen,
    Maps:FavouriteMapScreen
  },
  {
    tabBarOptions: {
      activeTintColor: '#FFF',
      inactiveTintColor: '#696969',
      labelStyle:{fontWeight:'bold',fontSize:15},
      indicatorStyle:{backgroundColor:"#FFF"}

    },
  }
    
);

const AppNavigator = createStackNavigator({
    MainScreen:{
        screen: MainScreen,
        navigationOptions:{
            header: null,
        }
    },
    SyncScreen:SyncScreen,

    OrientationScreen:OrientationScreen,
    OrientationDetail:OrientationDetail,
    HowToScreen:HowToScreen,

    ReferenceScreen:ReferenceScreen,
    IndicatorGroupScreen:IndicatorGroupScreen,
    IndicatorListing:IndicatorListScreen,
    IndicatorDetails:IndicatorDetails,

    // Favourites:FavouriteMapScreen,
    // FavouriteMaps:FavouriteMapScreen,
    Favourites:{
      screen:FavouriteTab,
      navigationOptions: {
        title: 'Favourites',
        headerStyle: {
          backgroundColor: referenceColor,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        }
      },
    },

    FAQ:FAQScreen,
    FAQDetail:FAQDetails,
    MoreScreen:MoreScreen,
    MoreDetail:MoreDetail,

    CalendarScreen:CalendarScreen,
    CalendarDetail:CalendarDetails,

    MapScreen:MapScreen,
    ModalCalendarEvents:{
        screen: CalendarEventList
    },

    Search:SearchScreen
});



const RootStack = createStackNavigator(
  {
    Main:{
      screen:AppNavigator
    },
    ModalCalendarEvents:CalendarEventList
  },
  {
    mode:'modal',
    headerMode:'none'
  }
);

export default class App extends Component{

  constructor(props){
    super(props);

    this.state = {
      showSplash:true,
      DBInit: false
    }

    
  }

  IsDBInit(){

    var realm = DataFactory.GetDB();

    if(realm.objects("Settings").length > 0){
          this.setState({
            DBInit:true
          })
      }
      //    realm.write(()=>{
      //   realm.deleteAll();
      // });
  }

  Initialized =()=>{
    this.setState({
      DBInit:true
    })
  }

  //Show the splash screen for 2 seconds
  splashTime(){

    setTimeout(() =>{
      this.setState({
        showSplash:false
      });
      this.IsDBInit();
    },2000);

  }

  componentDidMount(){
    this.IsDBInit();
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render(){
    if(this.state.showSplash){
      this.splashTime();
     
      return (
        <SplashScreen />
      );
    }
    else
    {
      

      if(this.state.DBInit){
        return (<AppNavigator />);
      }
      else{
        return (<FirstRun syncDone={() =>this.Initialized()}/>);
      }
    }
  }

}