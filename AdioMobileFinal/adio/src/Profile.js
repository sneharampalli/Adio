import React from 'react';
import { Auth, Storage } from 'aws-amplify';
import { StyleSheet, Text, View, FlatList, Image, ImageBackground, TouchableOpacity, Slider } from 'react-native';
import { API, graphqlOperation } from 'aws-amplify';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Analytics } from 'aws-amplify';
import ProfileTheme from '../libs/ProfileTheme.js';
import { Avatar } from 'react-native-elements';
import { Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import * as queries from "./graphql/queries";
import SwitchSelector from "react-native-switch-selector";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initials: '',
            name: '',
            email: '',
            phone: '',
            yearlyData: new Array(12).fill(0),
            yearMap: new Array(12).fill(0),
            weeklyData: new Array(7).fill(0),
            weekMap: new Array(7).fill(0),
            monthlyData: new Array(30).fill(0),
            monthMap: new Array(30).fill(0),
            graphOption: "year"
        }
        this.getData();
    }

    async componentDidMount() {
        // Auth.currentAuthenticatedUser({}).then(user => 
        //     this.setState({ initials: user.attributes.name.charAt(0).toUpperCase() + user.attributes.family_name.charAt(0).toUpperCase(), 
        //         name: user.attributes.name + ' ' + user.attributes.family_name, 
        //         email: user.attributes.email,
        //         phone: user.attributes.phone_number})
        // )
    }

    async getData() {
        console.log("getting data");
        var today = new Date();
        var currYear = today.getFullYear();
        var currMonth = today.getMonth() + 1;
        var currDate = today.getDate();
        await Auth.currentAuthenticatedUser({}).then(user => 
            this.setState({ initials: user.attributes.name.charAt(0).toUpperCase() + user.attributes.family_name.charAt(0).toUpperCase(), 
                name: user.attributes.name + ' ' + user.attributes.family_name, 
                email: user.attributes.email,
                phone: user.attributes.phone_number})
        );
        const response = await API.graphql(graphqlOperation(queries.listImpressions, { filter: 
            {
                driver: {
                     eq: this.state.email
                },
                year: {
                    ge: currYear - 1
                }
            }
        }));
        const yearData = response.data.listImpressions.items;

        var yearlyData = new Array(12).fill(0);
        var yearMap = new Array(12).fill(0);
        var month = currMonth + 1;
        for (var i = 0; i < 12; i++) {
            yearMap[i] = month;
            month++;
            if (month == 13) {
                month = 1;
            }
        }

        var weeklyData = new Array(7).fill(0);
        var weekMap = new Array(7).fill(0);
        for (var i = 0; i < 7; i++) {
            var next = new Date(new Date().getTime());
            next.setDate(currDate - i);
            weekMap[6-i] = next.getMonth() + 1 + "/" + next.getDate();
        }

        var monthlyData = new Array(30).fill(0);
        var monthMap = new Array(30).fill(0);
        for (var i = 0; i < 30; i++) {
            var next = new Date(new Date().getTime());
            next.setDate(currDate - i);
            monthMap[29-i] = next.getMonth() + 1 + "/" + next.getDate();
        }

        for (var i = 0; i < yearData.length; i++) {
            if (yearData[i].year == currYear) {
                yearlyData[yearMap.indexOf(yearData[i].month)] += yearData[i].numImpressions;
            } else if (yearData[i].year == currYear - 1) {
                yealyData[yearMap.indexOf(yearData[i].month)] += yearData[i].numImpressions;
            }
            weeklyData[weekMap.indexOf(yearData[i].month + "/" + yearData[i].date)] += yearData[i].numImpressions;
            monthlyData[monthMap.indexOf(yearData[i].month + "/" + yearData[i].date)] += yearData[i].numImpressions;
        }
        for (var i = 0; i < 12; i++) {
            if (i <= 11 - currMonth) {
                var yearString = (currYear - 1).toString();
                yearMap[i] += "/" + yearString.substring(yearString.length - 2);
            } else {
                 var yearString = (currYear).toString();
                yearMap[i] += "/" + yearString.substring(yearString.length - 2);;
            }
        }

        var finalMonthMap = [];
        for (var i = 0; i < 30; i+=3) {
            finalMonthMap.push(monthMap[i]);
        }

        this.setState({yearlyData: yearlyData, yearMap: yearMap,
            weeklyData: weeklyData, weekMap: weekMap,
            monthMap: finalMonthMap, monthlyData: monthlyData });

    }

    render() {
        const width =  Dimensions.get("window").width;
        const chartConfig = {
          backgroundGradientFrom: "#1E2923",
          backgroundGradientFromOpacity: 0,
          backgroundGradientTo: "#08130D",
          backgroundGradientToOpacity: 0.5,
          color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
          strokeWidth: 2, // optional, default 3
          barPercentage: 0.5
        };
        let data;
        let map;
        if (this.state.graphOption == "year") {
            data = this.state.yearlyData;
            map = this.state.yearMap;
        }
        if (this.state.graphOption == "month") {
            data = this.state.monthlyData;
            map = this.state.monthMap;
        }
        if (this.state.graphOption == "week") {
            data = this.state.weeklyData;
            map = this.state.weekMap;
        }
        console.log(data);
        console.log(map);
        return (
            <View style={{flex: 1 }}>
                <ImageBackground source={require('../assets/background3.png')} style={{flex: 1, width: '100%', height: '100%',}} imageStyle={{opacity:0.85}}>
                    <Avatar size={200} containerStyle={ProfileTheme.avatar} onPress={() =>
                                this.props.navigation.navigate('Home')
                            } overlayContainerStyle={{backgroundColor: 'rgba(50,50,50,0.9)'}} rounded title={this.state.initials} />
                    <Text style={ProfileTheme.text}>{this.state.name}</Text>
                    <Text style={ProfileTheme.text}>{this.state.email}</Text>
                    <Text style={ProfileTheme.text}>{this.state.phone}</Text>
                    <SwitchSelector
                      initial={0}
                      onPress={value => this.setState({ graphOption: value })}
                      hasPadding
                      options={[
                        { label: "1 year", value: "year" }, 
                        { label: "30 days", value: "month" },
                        { label: "7 days", value: "week" }
                      ]}
                    />
                    <BarChart
                      data={{
                          labels: map,
                          datasets: [
                            {
                              data: data,
                              color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
                              strokeWidth: 2 // optional
                            }
                          ]
                        }}
                      width={width}
                      height={220}
                      yAxisLabel="$"
                      yAxisInterval={2}
                      chartConfig={chartConfig}
                    />
                    <TouchableOpacity style={ProfileTheme.logoutButton} onPress={() => this.props.navigation.navigate('Home')} >
                        <Text style={ProfileTheme.logoutButtonText}> back </Text>
                    </TouchableOpacity>
                    <Image source={require('../assets/adio-white.png')} style={ProfileTheme.logo}/>
                </ImageBackground>
            </View >
        );
    }
}