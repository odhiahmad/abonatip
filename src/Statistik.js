import React, {Component} from "react";
import {Dimensions,ActivityIndicator, RefreshControl,Image, ScrollView, StyleSheet, Text, TouchableOpacity, View,StatusBar,FlatList} from "react-native";
import {LinearGradient} from 'expo-linear-gradient';
import {Header, ListItem} from "react-native-elements";
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ErrorState from "./components/ErrorState";
import moment from 'moment';
import {_baseURL_} from "../constant";
import COLORS from "./const/colors";
import jwt_decode from "jwt-decode";

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

const {width, height} = Dimensions.get('screen');
const cardWidth = width / 1.83;
const cardWidthInfo = width / 1.03;
class Statistik extends Component {
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
            cek1:false,
            cek2:false,
            isError: false,
            refreshing: false,
            dataAbsen:[],
            dataAbsenLimit:[],
            dataUser:[]
        }

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

        const token = await AsyncStorage.getItem('token');
        
        var decoded = jwt_decode(token);
    
        console.log(decoded)
        return fetch(_baseURL_ + 'users/getUserAbsenById/' + decoded.result.id_user+'/'+m.format('YYYY-MM-DD'), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':'Bearer '+token
            }
        }).then((response) => response.json()).then((json) => {
                
                if (json.berhasil === true) {

                    if(json.dataAbsen.length === 0){
                        this.setState({
                            isLoading: false,
                            nip: json.dataUser.username,
                            nama_lengkap: json.dataUser.nama,
                            dataAbsen:[],
                            dataAbsenLimit:json.dataAbsenLimit,
                            dataUser:json.dataUser,
                            tap_in:true,
                            cek1:false,
                            cek2:false,
                            tap_out:false
                        })
                    }else{
                      
                        if(json.dataAbsen.jam_cek1 == null){
                            this.setState({
                                tap_in:false,
                                cek1:true,
                                cek2:false,
                                tap_out:false
                            })
                        }else if(json.dataAbsen.jam_cek1 != null){
                            this.setState({
                                tap_in:false,
                                cek1:false,
                                cek2:true,
                                tap_out:false
                            })
                        }else if(json.dataAbsen.jam_cek2 != null){
                            this.setState({
                                tap_in:false,
                                cek1:false,
                                cek2:false,
                                tap_out:true
                            })
                        }
                        this.setState({
                            isLoading: false,
                            nip: json.dataUser.username,
                            nama_lengkap: json.dataUser.nama,
                            dataAbsen:json.dataAbsen[0],
                            dataAbsenLimit:json.dataAbsenLimit,
                            dataUser:json.dataUser,
                        })
                      
                    }


                   

                    console.log(this.state.dataAbsen.jam_masuk);
                    this.setState({
                        isLoading: false,
                        nip: json.dataUser.username,
                        nama_lengkap: json.dataUser.nama,
                    })
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
                        backgroundColor:COLORS.white,
                        borderBottomColor:'white',
                        elevation: 1,
                        shadowColor: '#000',
                        shadowOffset: {width: 0, height: 1},
                        shadowOpacity: 0.5,
                        shadowRadius: 1,
                       
                    }}
                    statusBarProps={{barStyle: 'light-content'}}
                    centerComponent={{text: 'Absensi Online Atip', style: {color: COLORS.dark, fontSize: 16, fontWeight: 'bold'}}}
                />
                    <View style={styles.cardInfo}>
                        <View style={{justifyContent: 'center',
                                        alignItems: 'center', padding: 20,backgroundColor:'white',width:'35%'}}>
                            <Icon name={'align-left'} size={80}
                                                      style={{color: COLORS.primary, textAlign: 'center'}}/>
                              <Text style={{fontSize: 12,fontWeight:'600', color: COLORS.primary,textAlign:'center',marginTop:20}}>Total Terlambat</Text>
                        </View>
                        <View style={{justifyContent: 'center',alignItems: 'center',width:'65%'}}>
                             <FlatList
                             style={{marginTop:20}}
                                data={this.state.dataAbsenLimit}
                                renderItem={({item}) =>      
                                    <Text style={{fontSize: 14, color: COLORS.white,textAlign:'center'}}>Masuk {item.jam_masuk}, keluar {item.jam_keluar}</Text>
                                }
                                listKey={(item, index) => index.toString()}
                                keyExtractor={(item, index) => index.toString()}
                            />
                            
                        </View>
                    </View>
                    

                
            </View>
        );
    }
}

export default Statistik;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
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
    cardAbsen: {
        height: 180,
        width: cardWidth - 40,
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
       
        borderRadius: 15,
        elevation: 13,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.5,
        shadowRadius: 2,
        backgroundColor: COLORS.primary,
    },
    cardInfo: {
        flexDirection:'row',
        height: 160,
        width: cardWidthInfo,
        marginHorizontal: 5,
        marginTop:10,
        marginBottom: 0,
        borderRadius: 15,
        elevation: 13,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.5,
        shadowRadius: 2,
        backgroundColor: COLORS.primary,
    },
    cardStatistik: {
        flexDirection:'row',
        height: 160,
        width: cardWidthInfo,
        marginHorizontal: 5,
        marginBottom: 10,
        borderRadius: 15,
        elevation: 13,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.5,
        shadowRadius: 2,
        backgroundColor: COLORS.primary,
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
