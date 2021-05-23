import React, {Component} from "react";
import {Dimensions, FlatList, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Feather';
import YearMonthPicker from './components/yearMonthPicker';
import EmptyState from './components/EmptyState';
import {_baseURL_} from "../constant";
import {Header, ListItem} from "react-native-elements";
import LoaderModal from "./components/loader";
import {LinearGradient} from "expo-linear-gradient";

const Screen = Dimensions.get('window');
require('moment/locale/id.js');

class RiwayatAbon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isError: false,
            refreshing: false,
            isLoading: true,
            username: '',
            startYear: 2020,
            endYear: 2050,
            date: null,
            currentMonth: '',
            months: '',
            bulan: '',
            currentTime: null,
            data: []
        }
        this.showPicker = this.showPicker.bind(this);
        AsyncStorage.getItem('username').then((username) => {
            if (username) {
                this.setState({username: username});
            }
        });
        this.monthArray = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    }

    componentDidMount() {
        this.feedData();
        this.getCurrentTime();
    }

    _onRefresh = () => {
        this.setState({refreshing: true, isError: false});
        this.feedData().then(() => {
            this.setState({refreshing: false});
        });
    }

    showPicker = () => {
        const {startYear, endYear, selectedYear, selectedMonth} = this.state;
        this.picker
            .show({startYear, endYear, selectedYear, selectedMonth})
            .then(({year, month}) => {
                this.setState({
                    selectedYear: year,
                    selectedMonth: month,

                }, this.feedData);
                this.getCurrentTime();

            })
    }

    getCurrentTime = () => {
        var currentDate = new Date();
        let month = ((currentDate.getMonth() + 1) >= 10) ? (currentDate.getMonth() + 1) : '0' + (currentDate.getMonth() + 1);
        let year = new Date().getFullYear();

        const {selectedMonth} = this.state;
        this.monthArray.map((item, keys) => {
            if (keys == selectedMonth - 1) {
                this.setState({bulan: item});
            }
        })
        this.setState({currentMonth: year + '-' + month});
    }

    async feedData() {
        const {selectedYear, selectedMonth} = this.state;
        this.state.months = ((selectedMonth >= 10) ? (selectedMonth) : '0' + (selectedMonth));
        const token = await AsyncStorage.getItem('username');

        if (selectedYear == null) {
            this.setState({
                data: []
            })
            fetch(_baseURL_ + 'list_absensi_past_month?nip=' + token + '&date=' + this.state.currentMonth, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then((response) => response.json())
                .then((json) => {
                    if (json.status === 'success') {
                        this.setState({
                            isLoading: false,
                            data: json.harian,
                        });
                    } else {

                        this.setState({
                            isLoading: false,
                            refreshing: false,
                        })
                    }
                })
                .catch((error) => {
                    this.setState({
                        isLoading: false,
                        isError: true
                    })
                    // console.error(error);
                });
        } else {
            this.setState({
                data: []
            })
            fetch(_baseURL_ + 'list_absensi_past_month?nip=' + token + '&date=' + selectedYear + '-' + this.state.months, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then((response) => response.json())
                .then((json) => {
                    if (json.status === 'success') {
                        this.setState({
                            isLoading: false,
                            data: json.harian,
                        }, function () {
                        });
                    } else {
                        this.setState({
                            isLoading: false,
                            refreshing: false,
                        })
                    }
                })
                .catch((error) => {
                    console.error(error);
                    this.setState({
                        isLoading: false,
                        isError: true
                    })
                });
        }
    }

    render() {
        const {selectedYear} = this.state;
        return (
            <View style={{flex: 1}}>

                <StatusBar translucent backgroundColor="rgba(0,0,0,0.4)"/>
                <Header
                    containerStyle={{
                        height: 95,
                    }}
                    statusBarProps={{barStyle: 'light-content'}}
                    centerComponent={{text: 'Riwayat Absen', style: {color: '#fff', fontSize: 16, fontWeight: 'bold'}}}
                />
                <LoaderModal
                    loading={this.state.isLoading}/>
                {this.state.bulan === '' ? <View></View> : <ListItem bottomDivider>
                    <Icon name='list' color='gray'/>
                    <ListItem.Content>
                        <ListItem.Title>{this.state.bulan} {selectedYear}</ListItem.Title>
                    </ListItem.Content>
                </ListItem>}

                <View style={styles.wrapper}>
                    <View style={{
                        paddingHorizontal: 5,
                        marginTop: 10,
                        marginBottom: 10,
                    }}>
                        <TouchableOpacity
                            onPress={this.showPicker}>

                            <LinearGradient
                                colors={['#7868e6', '#b8b5ff']}
                                style={{
                                    // backgroundColor:'#7868e6',
                                    borderRadius: 10,
                                    paddingHorizontal: 20,
                                    paddingVertical: 20,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    shadowOffset: {width: 2, height: 2,},
                                    shadowColor: '#e0e0e0',
                                    shadowOpacity: 1.0,
                                    elevation: 1
                                }}
                                start={{x: 0, y: 0}} end={{x: 1, y: 1}}>
                                <Icon name={'clock'} size={61} style={{color: '#74C6F4', textAlign: 'center'}}/>
                                <View style={{flexShrink: 1, marginLeft: 20}}>
                                    <Text style={{fontSize: 22, color: '#fff'}}>Pilih Riwayat Absen</Text>
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                    {
                        this.state.data.length == 0 ?
                            <EmptyState/>
                            :
                            (
                                <View style={{
                                    marginBottom:80
                                }}>
                                    <FlatList
                                        data={this.state.data}
                                        keyExtractor={item => item.date}
                                        renderItem={({item, i}) => (
                                            <View style={styles.boxItem}>
                                                <View>
                                                    <Text style={{
                                                        paddingVertical: 2,
                                                        fontSize: 16
                                                    }}>{moment(item.date).format("dddd, DD MMMM YYYY ")}</Text>
                                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                        <Icon name="corner-up-right" size={16}
                                                              style={{color: '#1095E8'}}/>
                                                        <Text style={{
                                                            paddingVertical: 5,
                                                            fontSize: 15,
                                                            color: '#2D3137',
                                                            paddingLeft: 5
                                                        }}>{item.tap_in} di {item.absen_in_loc}</Text>
                                                    </View>
                                                    {
                                                        item.valid_in == 2
                                                            ? <Text style={{
                                                                fontSize: 13,
                                                                color: 'red',
                                                                marginLeft: 20
                                                            }}><Icon name="alert-triangle" size={15}
                                                                     style={{color: 'red'}}/> Device Anda tidak
                                                                sesuai</Text>
                                                            : <View></View>
                                                    }
                                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                        <Icon name="corner-up-left" size={16}
                                                              style={{color: '#FF7A74'}}/>
                                                        {
                                                            item.tap_out === null
                                                                ? <Text style={{
                                                                    fontSize: 30,
                                                                    color: 'black',
                                                                    paddingLeft: 5
                                                                }}>-</Text>
                                                                : <Text style={{
                                                                    paddingVertical: 5,
                                                                    fontSize: 15,
                                                                    color: '#2D3137',
                                                                    paddingLeft: 5
                                                                }}>{item.tap_out} di {item.absen_out_loc}</Text>
                                                        }
                                                    </View>
                                                    {
                                                        item.valid_out == 2 ? <Text style={{
                                                            fontSize: 13,
                                                            color: 'red',
                                                            marginLeft: 20
                                                        }}><Icon name="alert-triangle" size={15}
                                                                 style={{color: 'red'}}/> Device Anda tidak
                                                            sesuai</Text> : <View/>
                                                    }
                                                </View>
                                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                    {
                                                        item.duration === null
                                                            ? <View style={{
                                                                flexDirection: 'row',
                                                                alignItems: 'center',
                                                                fontWeight: 'bold'
                                                            }}>
                                                                <Text style={{
                                                                    fontSize: 16,
                                                                    color: '#1095E8',
                                                                    paddingLeft: 5,
                                                                    fontWeight: 'bold'
                                                                }}>-</Text>
                                                                <Text style={{fontSize: 15}}> Jam</Text>
                                                            </View>
                                                            : <View
                                                                style={{flexDirection: 'row', alignItems: 'center'}}>
                                                                <Text style={{
                                                                    fontSize: 16,
                                                                    color: '#1095E8',
                                                                    fontWeight: 'bold'
                                                                }}>{item.duration}</Text>
                                                                <Text style={{fontSize: 15}}> Jam</Text>
                                                            </View>
                                                    }
                                                </View>
                                            </View>
                                        )}
                                    />

                                </View>)

                    }

                </View>
                <YearMonthPicker
                    ref={(picker) => this.picker = picker}/>
            </View>
        );
    }
}

export default RiwayatAbon;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    wrapperHeader: {
        paddingHorizontal: 15,
        marginTop: 5, flexDirection: 'row', marginHorizontal: 5, marginVertical: 5, justifyContent: 'space-between'
    },
    wrapper: {
        paddingBottom: 10
    },
    textHeader: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#2D3137',
        marginTop: 10,
        marginBottom: 5
    },
    yearMonthText: {
        fontSize: 18,
        marginBottom: 10,
        marginLeft: 20
    },
    boxItem: {
        backgroundColor: '#F8F9FA',
        padding: 13,
        paddingBottom: 10,
        borderRadius: 10,
        marginVertical: 5,
        marginHorizontal: 10,
        shadowOffset: {width: 2, height: 2,},
        shadowColor: '#e0e0e0',
        shadowOpacity: 1.0,
        elevation: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});
