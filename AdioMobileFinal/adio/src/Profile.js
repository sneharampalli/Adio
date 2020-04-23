import React from 'react';
import { Auth, Storage } from 'aws-amplify';
import { StyleSheet, Text, View, FlatList, Image, ImageBackground, TouchableOpacity, Slider } from 'react-native';
import { API, graphqlOperation } from 'aws-amplify';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Analytics } from 'aws-amplify';
import ProfileTheme from '../libs/ProfileTheme';
import ProfileThemeDark from '../libs/ProfileThemeDark';
import { Avatar } from 'react-native-paper';
import { Dimensions } from "react-native";
import { BarChart, LineChart, ContributionGraph } from "react-native-chart-kit";
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
            graphOption: "week",
            monthRevenue: 0,
            yearRevenue: 0
        } 
        this.getData();
    }

    async componentDidMount() { 
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

        var heatmapData = [];
        var yearRevenue = 0;
        var monthRevenue = 0;
        for (var i = 0; i < yearData.length; i++) {
            if (yearData[i].year == currYear) {
                yearlyData[yearMap.indexOf(yearData[i].month)] += yearData[i].numImpressions * 0.02;
                yearRevenue += yearData[i].numImpressions * 0.02;
                if (yearData[i].month == currMonth) {
                    monthRevenue += yearData[i].numImpressions * 0.02;
                }
            } else if (yearData[i].year == currYear - 1) {
                yealyData[yearMap.indexOf(yearData[i].month)] += yearData[i].numImpressions * 0.02;
            }
            weeklyData[weekMap.indexOf(yearData[i].month + "/" + yearData[i].date)] += yearData[i].numImpressions * 0.02;
            monthlyData[monthMap.indexOf(yearData[i].month + "/" + yearData[i].date)] += yearData[i].numImpressions * 0.02;
            var monthString = yearData[i].month.toString();
            if (monthString.length == 1) {
                monthString = '0' + monthString;
            }
            var dayString = yearData[i].date.toString();
            if (dayString.length == 1) {
                dayString = '0' + dayString;
            }
            heatmapData.push({date: yearData[i].year + "-" + monthString + "-" + dayString, count: yearData[i].numImpressions})
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
            monthMap: finalMonthMap, monthlyData: monthlyData,
            yearRevenue: yearRevenue.toFixed(2), monthRevenue: monthRevenue.toFixed(2) });
    }

    render() {
        const width =  Dimensions.get("window").width - 20;
        const chartConfigBlackBackground = {
          backgroundGradientFrom: "rgba(0, 0, 0)",
          backgroundGradientFromOpacity: 0.5,
          backgroundGradientTo: "rgba(0, 0, 0)",
          backgroundGradientToOpacity: 0.7,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          strokeWidth: 2, // optional, default 3
          barPercentage: 0.5,
          style: {
            borderRadius: 12
          }
        };
        const chartConfigWhiteBackground = {
          backgroundGradientFrom: "rgba(255, 255, 255)",
          backgroundGradientFromOpacity: 0.1,
          backgroundGradientTo: "rgba(255, 255, 255)",
          backgroundGradientToOpacity: 0.6,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          strokeWidth: 2, // optional, default 3
          barPercentage: 0.5,
          style: {
            borderRadius: 12
          }
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
        if (this.props.navigation.state.params.isDarkMode) {
            return (
                <View style={{flex: 1}}>
                    <ImageBackground source={require('../assets/background3Dark.png')} style={{flex: 1, width: '100%', height: '100%',}} imageStyle={{opacity:0.99}}>
                        <Avatar.Text color={'#000'} style={ProfileThemeDark.avatar} size={70} label={this.state.initials} />
                        <View style={ProfileThemeDark.profileContainer}>
                            <Text style={ProfileThemeDark.text}>{this.state.name}</Text>
                            <Text style={ProfileThemeDark.text}>{this.state.email}</Text>
                        </View>
                        <View style={ProfileThemeDark.revenueRow}>
                            <View style={ProfileThemeDark.bubble}>
                                <Text style={ProfileThemeDark.revenueHeader}>Year-to-Date Revenue:</Text><Text style={ProfileThemeDark.revenueVal}>${this.state.yearRevenue}</Text>
                            </View>
                            <View style={ProfileThemeDark.bubble}>
                                <Text style={ProfileThemeDark.revenueHeader}>Month-to-Date Revenue:</Text><Text style={ProfileThemeDark.revenueVal}>${this.state.monthRevenue}</Text>
                            </View>
                        </View>
                        <Text style={ProfileThemeDark.chartHeader}>Revenue History</Text>
                        <LineChart
                            data={{
                                labels: map,
                                datasets: [
                                    {
                                    data: data,
                                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    strokeWidth: 2 // optional
                                    }
                                ]
                                }}
                            width={width}
                            height={220}
                            yAxisLabel="$"
                            yAxisInterval={2}
                            borderRadius={'1px'}
                            chartConfig={chartConfigBlackBackground}
                            style={ProfileThemeDark.chart}
                        />
                        <SwitchSelector
                            initial={0}
                            onPress={value => this.setState({ graphOption: value })}
                            textColor={'#fff'}
                            selectedColor={'rgba(0,0,0, 1)'}
                            buttonColor={'rgba(255, 255, 255, 0.6)'}
                            borderColor={'rgba(255, 255, 255, 0.8)'}
                            backgroundColor={'rgba(0, 0, 0, 0.5)'}
                            borderWidth={0.1}
                            height={30}
                            hasPadding={true}
                            bold={true}
                            style={ProfileThemeDark.selector}
                            options={[
                                { label: "7D", value: "week" },
                                { label: "30D", value: "month" },
                                { label: "1Y", value: "year" }
                            ]}
                        />
                        <TouchableOpacity style={ProfileThemeDark.logoutButton} onPress={() => this.props.navigation.navigate('Home')} >
                            <Text style={ProfileThemeDark.logoutButtonText}> back </Text>
                        </TouchableOpacity>
                        <Image source={require('../assets/adio-white.png')} style={ProfileThemeDark.logo}/>
                    </ImageBackground>
                </View >
            );
        } else {
            return (
                <View style={{flex: 1}}>
                    <ImageBackground source={require('../assets/background3Light.jpg')} style={{flex: 1, width: '100%', height: '100%',}} imageStyle={{opacity:0.85}}>
                        <Avatar.Text color={"#fff"} style={ProfileTheme.avatar} size={70} label={this.state.initials} />
                        <View style={ProfileTheme.profileContainer}>
                            <Text style={ProfileTheme.text}>{this.state.name}</Text>
                            <Text style={ProfileTheme.text}>{this.state.email}</Text>
                        </View>
                        <View style={ProfileTheme.revenueRow}>
                            <View style={ProfileTheme.bubble}>
                                <Text style={ProfileTheme.revenueHeader}>Year-to-Date Revenue:</Text><Text style={ProfileTheme.revenueVal}>${this.state.yearRevenue}</Text>
                            </View>
                            <View style={ProfileTheme.bubble}>
                                <Text style={ProfileTheme.revenueHeader}>Month-to-Date Revenue:</Text><Text style={ProfileTheme.revenueVal}>${this.state.monthRevenue}</Text>
                            </View>
                        </View>
                        <Text style={ProfileTheme.chartHeader}>Revenue History</Text>
                        <LineChart
                            data={{
                                labels: map,
                                datasets: [
                                    {
                                    data: data,
                                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    strokeWidth: 2 // optional
                                    }
                                ]
                                }}
                            width={width}
                            height={220}
                            yAxisLabel="$"
                            yAxisInterval={2}
                            borderRadius={'1px'}
                            chartConfig={chartConfigBlackBackground}
                            style={ProfileTheme.chart}
                        />
                        <SwitchSelector
                            initial={0}
                            onPress={value => this.setState({ graphOption: value })}
                            textColor={'rbga(255, 255, 255, 1)'}
                            selectedColor={'rgba(255,255,255, 1)'}
                            
                            buttonColor={'rgba(0, 0, 0, 0.6)'}
                            borderColor={'rgba(0, 0, 0, 0.8)'}
                            backgroundColor={'rgba(255, 255, 255, 0.5)'}
                            borderWidth={0.1}
                            height={30}
                            hasPadding={true}
                            bold={true}
                            style={ProfileTheme.selector}
                            options={[
                                { label: "7D", value: "week" },
                                { label: "30D", value: "month" },
                                { label: "1Y", value: "year" }
                            ]}
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
}