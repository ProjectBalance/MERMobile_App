import React, {Component} from 'react';

//Screens
import FirstRun from './Screens/FirstRun';
import SplashScreen from './Screens/Splash';
import HomeScreen from './Screens/Home';
import AboutScreen from './Screens/About';
import ResourceScreen from './Screens/Resources';
import SettingsScreen from './Screens/Settings';
import IndicatorScreen from './Screens/Indicators';
import IndicatorDetailScreen from './Screens/IndicatorDetails';
import MapScreen from './Screens/Maps';
import BookmarkScreen from './Screens/Bookmark';
import CalendarScreen from './Screens/Calendar';
import ResultScreen from './Screens/Results';
import SyncScreen from './Screens/Update';

import Icon from 'react-native-vector-icons/FontAwesome';
import { createStackNavigator,StackNavigator, createDrawerNavigator } from 'react-navigation';

//Database
import * as DataFactory from './Factory/old_DataFactory';
import Realm from 'realm';
import * as Schema from './Model/Schema';


//Due to using React-Navigation, warning will always pop up
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

const HomeStack = StackNavigator({
  Home:{
    screen:HomeScreen,
    navigationOptions:{
      header: null,
    }
  }
})

const IndicatorStack = StackNavigator({
  Indicators:{
    screen:IndicatorScreen,
    navigationOptions:{
      header: null,
    }
  },
  IndicatorDetails:{
    screen:IndicatorDetailScreen,
    navigationOptions:{
      header: null,
    }
  }
})

const ResourceStack = StackNavigator({
  Resource:{
    screen:ResourceScreen,
    navigationOptions:{
      header: null,
    }
  }
})

const AboutStack = StackNavigator({
  About:{
    screen:AboutScreen,
    navigationOptions:{
      header: null
    }
  }
})

const SettingsStack = StackNavigator({
  Settings:{
    screen:SettingsScreen,
    navigationOptions:{
      header: null
    }
  }
})

const SyncStack = StackNavigator({
  Sync:{
    screen:SyncScreen,
    navigationOptions:{
      header: null
    }
  }
})


const DrawerStack = createDrawerNavigator({
  Home:{
    screen:HomeStack,
    navigationOptions:{
      drawerIcon: ({ tintColor }) => (<Icon name="home" size={24} style={{ color: tintColor }} />)
    }
  } ,
  Bookmarks: {
    screen:BookmarkScreen,
    navigationOptions:{
      drawerIcon: ({ tintColor }) => (<Icon name="bookmark" size={24} style={{ color: tintColor }} />)
    }
  },
  Indicators: {
    screen:IndicatorStack,
    navigationOptions:{
      drawerIcon: ({ tintColor }) => (<Icon name="tasks" size={24} style={{ color: tintColor }} />)
    }
  },
  Maps: {
    screen:MapScreen,
    navigationOptions:{
      drawerIcon: ({ tintColor }) => (<Icon name="map-o" size={24} style={{ color: tintColor }} />)
    }
  },
  Calendar: {
    screen:CalendarScreen,
    navigationOptions:{
      drawerIcon: ({ tintColor }) => (<Icon name="calendar" size={24} style={{ color: tintColor }} />)
    }
  },
  Settings: {
    screen:SettingsStack,
    navigationOptions:{
      drawerIcon: ({ tintColor }) => (<Icon name="cog" size={24} style={{ color: tintColor }} />)
    }
  },
  Resources:{
    screen:ResourceStack,
    navigationOptions:{
      drawerIcon: ({ tintColor }) => (<Icon name="archive" size={24} style={{ color: tintColor }} />)
    }
  },
  About : {
    screen: AboutStack,
    navigationOptions:{
      drawerIcon: ({ tintColor }) => (<Icon name="info" size={24} style={{ color: tintColor }} />)
    }
  },
  Sync : {
    screen: SyncStack,
    navigationOptions:{
      drawerIcon: ({ tintColor }) => (<Icon name="refresh" size={24} style={{ color: tintColor }} />)
    }
  }
});

export default class App extends Component{

  constructor(props){
    super(props);

    this.state = {
      showSplash:true,
      DBInit: false
    }

    
  }

  IsDBInit(){
    // Realm.open({schema:[Schema.SettingsSchema]}).then(realm =>{
    //   if(realm.objects("Settings").length > 0){
    //       this.setState({
    //         DBInit:true
    //       })
    //   }

      // realm.close();

      //TODO:Delete 
      // realm.write(()=>{
      //   realm.deleteAll();
      // })
  // });
    var realm = DataFactory.GetDB();

    if(realm.objects("Settings").length > 0){
          this.setState({
            DBInit:true
          })
      }
    
      // realm.write(()=>{
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
        return (<DrawerStack />);
      }
      else{
        return (<FirstRun syncDone={() =>this.Initialized()}/>);
      }
    }
  }

}