import React,{Component} from 'react';
import {View,ScrollView,Text,FlatList} from 'react-native';

import DetailItem from './DetailItem';
import Collapsible from 'react-native-collapsible';

import * as DataFactory from '../../Factory/DataFactory';

export default class Details extends Component{

    constructor(props){
        super(props);

        this.state = {
            detailItems:[]
        }
    }

    loadIndicator(){
        var id = this.props.id;

        var realm = DataFactory.GetDB();

        var indicator = realm.objects("Indicator").filtered('id = "'+ id +'"');
        var model = realm.objects("Model");

        var iData = JSON.parse(indicator[0].data);
        var mData = JSON.parse(model[0].data);

        var details = [];


        mData.fields.forEach(field => {
            if(field.id != "code" && field.id != "group" && field.id != "country" && field.id != "reportingFrequency" && field.id != "displayorder")
            {
                var detail = " ";
                if(iData[field.id] != null)
                {  
                    detail = iData[field.id];

                    details.push(
                        {
                            id:details.length + 1,
                            title:field.name,
                            detail:detail
                        }
                    );
                }
            }  
        });

        this.setState({
            detailItems:details
        })
    }

    componentDidMount(){
        this.loadIndicator();
    }

    render(){
        return(
            <FlatList
                data={this.state.detailItems}
                renderItem={({item}) => (
                    <DetailItem title={item.title} detail={item.detail} />
                )}
                keyExtractor={item => item.id.toString()}
                initialNumToRender={20}
                maxToRenderPerBatch={20}
            />
        );
    }

}