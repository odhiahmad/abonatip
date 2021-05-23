import React, {Component} from "react";
import {ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View,StatusBar} from "react-native";
import {LinearGradient} from 'expo-linear-gradient';
import {Header, ListItem} from "react-native-elements";
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ErrorState from "./components/ErrorState";
import moment from 'moment';
import {_baseURL_} from "../constant";
import COLORS from "./const/colors";

var g = null;
var m = moment();

var split_siang = 12
var split_sore = 16
var split_malam = 18
var currentHour = parseFloat(m.format("HH"));

if (currentHour >= split_siang && currentHour < split_sore) {
    g = "Siang";
}
if (currentHour >= split_sore && currentHour < split_malam) {
    g = "Sore";
} else if (currentHour >= split_malam) {
    g = "Malam";
} else if (currentHour < split_siang) {
    g = "Pagi";
}

class HomeAbon extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)
        currentDate = new Date();
        this.state = {
            isLoading: true,
            nama_lengkap: 'User',
            username: '0000000',
            tap_in: null,
            tap_out: null,
            data: [],
            currentTime: null,
            currentDay: null,
            currentMonth: null,
            greeting: g,
            isError: false,
            refreshing: false,
        }

        AsyncStorage.getItem('nama_asn', (error, result) => {
            if (result) {
                this.setState({
                    nama_lengkap: result
                });
            }
        });
        AsyncStorage.getItem('username', (error, result) => {
            if (result) {
                this.setState({
                    username: result
                });
            }
        });
        this.monthArray = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        this.daysArray = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    componentDidMount() {
        this.feedData();
        this.timer = setInterval(() => {
            this.getCurrentTime();
        }, 1000);
    }

    _onRefresh = () => {
        this.setState({refreshing: true, isError: false});
        this.feedData().then(() => {
            this.setState({refreshing: false});
        });
    }

    getCurrentTime = () => {
        let hour = new Date().getHours();
        let minutes = new Date().getMinutes();
        let seconds = new Date().getSeconds();
        let date = new Date().getDate(); //Current Date
        let month = new Date().getMonth() + 1; //Current Month
        let year = new Date().getFullYear();
        let am_pm = 'PM';

        if (minutes < 10) {
            minutes = '0' + minutes;
        }

        if (seconds < 10) {
            seconds = '0' + seconds;
        }

        if (hour < 10) {
            // hour = hour - 12;
            hour = '0' + hour;
        }

        // if( hour == 0 )
        // {
        //     hour = 12;
        // }

        if (new Date().getHours() < 12) {
            am_pm = 'AM';
        }

        this.setState({currentTime: hour + ':' + minutes + ':' + seconds});

        this.monthArray.map((item, keys) => {
            if (keys == new Date().getMonth()) {
                this.setState({currentMonth: item});
            }
        })

        this.daysArray.map((item, key) => {
            if (key == new Date().getDay()) {
                this.setState({currentDay: item.charAt(0).toUpperCase() + item.slice(1) + ', ' + date + ' ' + this.state.currentMonth + ' ' + year});
            }
        })
    }

    async feedData() {

        const token = await AsyncStorage.getItem('username');
        return fetch(_baseURL_ + 'biodata_pegawai?nip=' + token, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                if (json.status === 'success') {
                    this.setState({
                        isLoading: false,

                        nip: json.biodata[0].nip,
                        nama_lengkap: json.biodata[0].nama_lengkap,
                        tap_in: json.waktu_kerja[0].tap_in,
                        tap_out: json.waktu_kerja[0].tap_out,

                    }, function () {
                        // do something with new state
                    });
                } else {
                    alert('Sesi anda telah habis, silahkan Logout dan Login kembali')
                    this.setState({
                        isLoading: false,
                        refreshing: false,
                    })
                }
            })
            .catch((error) => {
                // console.error(error);
                this.setState({
                    isLoading: false,
                    // isError: true
                })
            });
    }

    render() {
        const {navigate} = this.props.navigation;
        const preview = {uri: "../assets/logo.png"};
        const uri = 'https://res.cloudinary.com/dyacj8kac/image/upload/v1545113147/finger2.png';

        if (this.state.isLoading) {
            return (
                <View style={{flex: 1, alignItems: 'center'}}>
                    <ActivityIndicator
                        style={styles.indicator}
                        animating={true}
                        size="large"
                    />
                    {/* <Lottie
            ref={animation => { this.animation = animation; }}
            source={require('../assets/simple.json')}
          /> */}
                </View>

            );
        }

        if (this.state.isError) {
            return (
                <ErrorState refresh={this._onRefresh}/>
            );
        }

        return (
            <View style={{flex:1, backgroundColor:'white'}}>
                <StatusBar translucent backgroundColor={COLORS.white}/>
                <Header
                    containerStyle={{
                        height:95,
                        backgroundColor:COLORS.white
                    }}
                    statusBarProps={{barStyle: 'light-content'}}
                    centerComponent={{text: 'Dashboard', style: {color: COLORS.dark, fontSize: 16, fontWeight: 'bold'}}}
                />
                <ScrollView
                    style={{paddingBottom: 200}}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />
                    }>

                   
                    {/*<ListItem bottomDivider>*/}
                    {/*    <Icon name='user' color='gray'/>*/}
                    {/*    <ListItem.Content>*/}
                    {/*        <ListItem.Title>Selamat {this.state.greeting}, {this.state.nama_lengkap}</ListItem.Title>*/}
                    {/*    </ListItem.Content>*/}
                    {/*</ListItem>*/}
                    {/*<View style={styles.wrapperHeader}>*/}
                    {/*    <Text style={styles.textHeader}>Selamat {this.state.greeting}, {this.state.nama_lengkap} !!</Text>*/}
                    {/*</View>*/}
                    <View style={styles.wrapper}>
                        <View style={styles.boxStatus}>
                            <View style={{
                                alignItems: 'center',
                                borderBottomWidth: 1,
                                borderBottomColor: '#e0e0e0',
                            }}>
                                <Text style={{
                                    fontSize: 42,
                                    color: COLORS.primary,
                                    fontWeight: 'bold'
                                }}>{this.state.currentTime}</Text>
                                <Text style={{paddingBottom: 20, fontSize: 20}}>{this.state.currentDay}</Text>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                paddingTop: 20
                            }}>
                                <View style={{
                                    alignItems: 'center',
                                    width: '50%',
                                    borderRightWidth: 1,
                                    borderRightColor: '#e0e0e0'
                                }}>
                                    <TouchableOpacity style={{alignItems: 'center', paddingHorizontal: 10}}
                                                      onPress={() => navigate("AmbilAbsen", {absen_type: 1})}>
                                        {
                                            this.state.tap_in === null ?
                                                <Icon name={'fingerprint'} size={38}
                                                      style={{color: COLORS.primary, textAlign: 'center'}}/>
                                                : <Text style={{fontSize: 27}}>{this.state.tap_in}</Text>

                                        }
                                        <Text style={{fontSize: 17, marginTop: 5}}>Absen Masuk</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{
                                    alignItems: 'center',
                                    width: '50%'
                                }}>
                                    <TouchableOpacity style={{alignItems: 'center', paddingHorizontal: 10}}
                                                      onPress={() => navigate("AmbilAbsen", {absen_type: 1})}>
                                        {
                                            this.state.tap_out === null ?
                                                <Icon name={'fingerprint'} size={38}
                                                        style={{color: COLORS.primary, textAlign: 'center'}}/>
                                                : <Text style={{fontSize: 27}}>{this.state.tap_out}</Text>
                                        }
                                        <Text style={{fontSize: 17, marginTop: 5}}>Absen Keluar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                    </View>
                    <View style={{
                        paddingHorizontal: 5,
                        marginTop:10,
                        marginBottom:10,
                    }}>
                        <TouchableOpacity
                            onPress={() => navigate("AmbilAbsen", {absen_type: this.state.tap_in ? 2 : 1})}>

                            <View
                               
                                style={{
                                    backgroundColor:COLORS.primary,
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
                                >
                                <Icon name={'user'} size={61} style={{color: COLORS.white, textAlign: 'center'}}/>
                                <View style={{flexShrink: 1, marginLeft: 20}}>
                                    <Text style={{fontSize: 17, color: '#fff'}}>Selamat {this.state.greeting}, {this.state.nama_lengkap}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.wrapper}>
                        <TouchableOpacity
                            onPress={() => navigate("AmbilAbsen", {absen_type: this.state.tap_in ? 2 : 1})}>

                            <View
                                style={{
                                    backgroundColor:COLORS.primary,
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
                                >
                                <Icon name={'fingerprint'} size={61} style={{color: COLORS.white, textAlign: 'center'}}/>
                                <View style={{flexShrink: 1, marginLeft: 20}}>
                                    <Text style={{fontSize: 17, color: '#fff'}}>Tekan tombol untuk mengambil
                                        absen {this.state.tap_in ? 'keluar' : 'masuk'}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </View>
        );
    }
}

export default HomeAbon;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    wrapper: {
        paddingHorizontal: 5,
        marginBottom:0
    },
    wrapperHeader: {
        paddingHorizontal: 5,
        marginTop: 5
    },
    textHeader: {
        fontSize: 16,
        marginTop: 10,
        fontWeight: 'bold',
        color: '#2D3137'
    },
    boxStatus: {
        backgroundColor: COLORS.white,
        padding: 30,
        borderRadius: 10,
        marginVertical: 20,
        shadowOffset: {width: 2, height: 2,},
        shadowColor: '#e0e0e0',
        shadowOpacity: 1.0,
        elevation: 1
    },
    boxItem: {
        backgroundColor: '#F8F9FA',
        padding: 20,
        borderRadius: 10,
        marginBottom: 15,
        shadowOffset: {width: 2, height: 2,},
        shadowColor: '#e0e0e0',
        shadowOpacity: 1.0,
        elevation: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    indicator: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 80
    }
});
