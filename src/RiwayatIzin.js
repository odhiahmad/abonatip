import React, {Component} from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    RefreshControl, ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';

import EmptyState from './components/EmptyState';
import ErrorState from './components/ErrorState';
import YearMonthPicker from './components/yearMonthPicker';
import {_baseURL_} from "../constant";
import {Header, ListItem,Icon} from "react-native-elements";
import LoaderModal from "./components/loader";

const Screen = Dimensions.get('window');
require('moment/locale/id.js');

class RiwayatIzin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            isError: false,
            refreshing: false,
            isLoading: true,
            startYear: 2020,
            endYear: 2050,
            bulan: null,
            months: '',
            currentMonth: '2020-09',
            data: []
        }

        this.monthArray = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    }

    showPicker = () => {
        const {startYear, endYear, selectedYear, selectedMonth} = this.state;
        this.picker
            .show({startYear, endYear, selectedYear, selectedMonth})
            .then(({year, month}) => {
                this.setState({
                    selectedYear: year,
                    selectedMonth: month,

                })

                this.getCurrentTime();
                this.feedDataBulan();
            })
    }

    getCurrentTime = () => {
        const {selectedMonth} = this.state;
        this.monthArray.map((item, keys) => {
            if (keys == selectedMonth - 1) {
                this.setState({bulan: item});
            }
        })
        var currentDate = new Date();
        let month = ((currentDate.getMonth() + 1) >= 10) ? (currentDate.getMonth() + 1) : '0' + (currentDate.getMonth() + 1);
        let year = new Date().getFullYear();

        this.setState({currentMonth: year + '-' + month});
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
        this.feedDataBulan().then(() => {
            this.setState({refreshing: false});
        });
    }

    //Semua Izin
    feedData = async () => {
        const token = await AsyncStorage.getItem('username');
        return fetch(_baseURL_ + 'izin_pegawai?nip=' + token, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                //console.log(responseJson);
                if (responseJson.status === 'success') {
                    this.setState({
                        isLoading: false,
                        data: responseJson.harian,
                    }, function () {
                    });
                } else {
                    this.setState({
                        isLoading: false,
                        refreshing: false,
                    })
                } // console.log(this.setState.perbulan);
            })

            .catch((error) => {
                this.setState({
                    isLoading: false,
                    isError: true
                })
            });
    }

    //Per Bulan
    feedDataBulan = async () => {

        const {selectedYear, selectedMonth} = this.state;
        this.state.months = ((selectedMonth >= 10) ? (selectedMonth) : '0' + (selectedMonth));
        const token = await AsyncStorage.getItem('username');
        if (selectedYear == null) {
            this.setState({
                data: []
            })
            return fetch(_baseURL_ + 'izin_pegawai?nip=' + token + '&date=' + this.state.currentMonth, {

                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    //console.log(responseJson);
                    if (responseJson.status === 'success') {

                        this.setState({
                            isLoading: false,
                            data: responseJson.harian,
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
                    this.setState({
                        isLoading: false,
                        isError: true
                    })
                });
        } else {
            this.setState({
                data: []
            })
            return fetch(_baseURL_ + 'izin_pegawai?nip=' + token + '&date=' + selectedYear + '-' + this.state.months, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    //console.log(responseJson);
                    if (responseJson.status === 'success') {
                        this.setState({
                            isLoading: false,
                            data: responseJson.harian,
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
                    this.setState({
                        isLoading: false,
                        isError: true
                    })
                });
        }
    }

    render() {
        const {selectedYear} = this.state;

        // if (this.state.isLoading) {
        //     return (
        //         <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        //             <ActivityIndicator
        //                 style={styles.indicator}
        //                 animating={true}
        //                 size="large"
        //             />
        //         </View>
        //     );
        // }

        if (this.state.isError) {
            return (
                <ErrorState refresh={this._onRefresh}/>
            );
        }
        return (
            <View style={styles.container}>
                <LoaderModal
                    loading={this.state.isLoading}/>
                <Header
                    statusBarProps={{barStyle: 'light-content'}}
                    style={{
                        height:90
                    }}
                    leftComponent={<TouchableOpacity
                        onPress={() => {
                            this.props.navigation.pop()
                        }}>
                        <Icon size={27} name='arrow-back' color='#fff'
                        /></TouchableOpacity>}
                    centerComponent={{text: 'Riwayat Izin', style: {color: '#fff', fontSize: 16, fontWeight: 'bold'}}}
                />

                {/* list riwayat */}
                <ScrollView style={styles.wrapper}>
                    <ListItem bottomDivider onPress={this.showPicker}>
                        <Icon name='list' color='gray'/>
                        <ListItem.Content>
                            <ListItem.Title>Per Bulan</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                    <ListItem bottomDivider onPress={this.feedData}>
                        <Icon name='list' color='gray'/>
                        <ListItem.Content>
                            <ListItem.Title>Semua</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>

                    {
                        this.state.data.length == 0 ?
                            (
                                <View>
                                    <EmptyState/>
                                </View>
                            ) :
                            <FlatList
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.refreshing}
                                        onRefresh={this._onRefresh}
                                    />
                                }
                                data={this.state.data}
                                keyExtractor={item => item.tanggal}
                                renderItem={({item}) => (
                                    <View style={styles.boxItem}>
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}>
                                            <Text style={{
                                                paddingVertical: 5,
                                                fontSize: 16
                                            }}>{moment(item.tanggal).format("dddd, DD MMMM YYYY ")}</Text>
                                            <View style={styles.wrapper1}>
                                                {
                                                    item.status === '1'
                                                        ? <Text style={{
                                                            fontSize: 16,
                                                            color: 'blue',
                                                            fontWeight: 'bold'
                                                        }}>ACC</Text>
                                                        : <Text style={{
                                                            fontSize: 16,
                                                            color: 'red',
                                                            fontWeight: 'bold'
                                                        }}> Pending</Text>
                                                }

                                            </View>
                                        </View>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}/>
                                        <View>
                                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                <Icon type="font-awesome" name="info-circle" size={16} color="gray"/>
                                                <Text style={{
                                                    paddingVertical: 5,
                                                    fontSize: 15,
                                                    color: 'gray',
                                                    paddingLeft: 5
                                                }}>{item.izin} </Text>
                                            </View>
                                            <View style={{flexDirection: 'row', alignItems: 'center'}}>

                                                <Icon type="font-awesome" name="list-alt" size={16} color="gray"/>
                                                <Text style={{
                                                    paddingVertical: 5,
                                                    fontSize: 15,
                                                    color: 'gray',
                                                    paddingLeft: 5,
                                                    paddingHorizontal: 30
                                                }}>{item.perihal} </Text>
                                            </View>
                                        </View>

                                    </View>
                                )}/>
                    }
                </ScrollView>

                <YearMonthPicker
                    ref={(picker) => this.picker = picker}/>
            </View>
        );
    }
}

export default RiwayatIzin;
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    wrapperHeader: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        marginTop: 10,
        borderColor: 'grey', color: 'black',
        marginHorizontal: 10, marginVertical: 5,
    },
    wrapper: {
        paddingHorizontal: 5,
        marginBottom: 2
    },
    wrapper1: {
        paddingHorizontal: 10
    },
    textHeader: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#2D3137',
        marginTop: 10,
        marginBottom: 5
    },
    showPickerBtn: {
        height: 144,
        backgroundColor: '#973BC2',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        borderRadius: 6,
    },
    yearMonthText: {
        fontSize: 20,
        marginTop: 12
    },
    boxItem: {
        backgroundColor: '#F8F9FA',
        padding: 10,
        borderRadius: 14,
        marginBottom: 5,
        margin: 10,
        shadowOffset: {width: 2, height: 2,},
        shadowColor: '#e0e0e0',
        shadowOpacity: 1.0,
        elevation: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    }
});
