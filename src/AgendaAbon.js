import React, {Component} from "react";
import {Alert, ScrollView, StatusBar, StyleSheet, Text, ToastAndroid, TouchableOpacity, View} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import CalendarPicker from 'react-native-calendar-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Header} from "react-native-elements";
import {LinearGradient} from "expo-linear-gradient";
import COLORS from "./const/colors";

class AgendaAbon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //set value in state for start and end date
            selectedStartDate: null,
            selectedEndDate: null,
            startDate: null,
            endDate: null,
        };

        this.onDateChange = this.onDateChange.bind(this);
    }

    onDateChange(date, type) {
        if (type === 'END_DATE') {
            this.setState({
                selectedEndDate: date,
            });
        } else {
            this.setState({
                selectedStartDate: date,
                selectedEndDate: null,
            });
        }
    }

    handleSaveClick = async () => {
        if (this.state.startDate == '') {
            Alert.alert('Silahkan pilih tanggal..', ToastAndroid.SHORT);
            this.setState({
                isLoading: false
            })
        } else {
            this.props.navigation.navigate('AjukanIzin');
        }
    }

    render() {
        const {selectedStartDate, selectedEndDate} = this.state;
        const minDate = new Date(2020, 1, 1); // Min date
        const maxDate = new Date(2050, 6, 3); // Max date
        this.state.startDate = selectedStartDate ? selectedStartDate.format('YYYY-MM-DD') : '';
        this.state.endDate = selectedEndDate ? selectedEndDate.format('YYYY-MM-DD') : '';
        AsyncStorage.setItem('startDate', this.state.startDate);
        AsyncStorage.setItem('endDate', this.state.endDate);

        return (
            <View style={{flex: 1, backgroundColor: 'white'}}>
                <StatusBar translucent backgroundColor="rgba(0,0,0,0.4)"/>
                <Header
                    containerStyle={{
                        height:95,
                        backgroundColor:COLORS.white
                    }}
                    statusBarProps={{barStyle: 'light-content'}}
                    centerComponent={{text: 'Agenda', style: {color: COLORS.dark, fontSize: 16, fontWeight: 'bold'}}}
                />
                {/* Agenda */}
                {/* Kalender */}
                <View style={{
                    paddingHorizontal: 5,
                    marginTop:10,
                    marginBottom:10,
                }}>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.push('RiwayatIzin')
                        }}>

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
                            <Icon name={'history'} size={61} style={{color: COLORS.white, textAlign: 'center'}}/>
                            <View style={{flexShrink: 1, marginLeft: 20}}>
                                <Text style={{fontSize: 22, color: '#fff'}}>Pilih Riwayat Izin</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <CalendarPicker
                    startFromMonday={true}
                    allowRangeSelection={true}
                    minDate={minDate}
                    maxDate={maxDate}
                    weekdays={['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']}
                    months={[
                        'Januari',
                        'Febrauri',
                        'Maret',
                        'April',
                        'Mei',
                        'Juni',
                        'Juli',
                        'Agustus',
                        'September',
                        'Oktober',
                        'November',
                        'Desember',
                    ]}
                    style={{color: '#000'}}
                    // previousTitle={<Icon name={'caret-left'} size={22} style={{color:'#00AEEF', textAlign:'center'}}/>}
                    previousTitle="Sebelumnya"
                    nextTitle="Berikutnya"

                    todayBackgroundColor="#00AEEF"
                    selectedDayColor="#74C6F4"
                    selectedDayTextColor="#fff"
                    scaleFactor={375}
                    textStyle={{
                        color: 'black',
                    }}
                    onDateChange={this.onDateChange}
                />
                {/* onPress={() => {this.props.navigation.push('AjukanIzin')}} */}
                <TouchableOpacity onPress={this.handleSaveClick} style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between', marginTop: 20
                }}>
                    <View style={{
                        paddingVertical: 10,
                        paddingHorizontal: 10,
                        borderWidth: 1,
                        borderColor: '#00AEEF',
                        backgroundColor: '#00AEEF',
                        borderRadius: 10
                    }}>
                        <Text style={{textAlign: 'center', fontSize: 15, color: 'white', fontWeight: "bold"}}>Ajukan
                            Izin</Text>
                    </View>
                </TouchableOpacity>
                {/*{this.state.startDate === '' ? <View></View>: <View style={{padding: 6}}>*/}
                {/*    <Text style={{padding: 6}}>Tanggal Mulai: {this.state.startDate}</Text>*/}
                {/*    <Text style={{padding: 6}}>Tanggal Akhir : {this.state.endDate}</Text>*/}
                {/*</View>}*/}

            </View>
        );
    }
}

export default AgendaAbon;
const styles = StyleSheet.create({});
