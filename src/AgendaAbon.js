import React, {Component} from "react";
import {Alert, ScrollView, StatusBar, StyleSheet, Text, ToastAndroid, TouchableOpacity, View} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import CalendarPicker from 'react-native-calendar-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Header} from "react-native-elements";
import {LinearGradient} from "expo-linear-gradient";
import COLORS from "./const/colors";
import AwesomeAlert from 'react-native-awesome-alerts';

class AgendaAbon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //set value in state for start and end date
            selectedStartDate: null,
            selectedEndDate: null,
            startDate: null,
            endDate: null,
            showAlertPesan:false,
            pesan:''
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

    hideAlertPesan = () => {
        this.setState({
            showAlertPesan: false
        });
    };

    handleSaveClick = async () => {
        if (this.state.startDate == '') {
            this.setState({
                showAlertPesan:true,
                isLoading: false,
                pesan:'Silahkan pilih tanggal mulai'
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
                        marginBottom:15,
                        height:95,
                        backgroundColor:COLORS.white,
                        elevation: 1,
                        shadowColor: '#000',
                        shadowOffset: {width: 0, height: 1},
                        shadowOpacity: 0.5,
                        shadowRadius: 1,
                    }}
                    statusBarProps={{barStyle: 'light-content'}}
                    centerComponent={{text: 'Agenda', style: {color: COLORS.dark, fontSize: 16, fontWeight: 'bold'}}}
                />
               
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

                    previousTitle="Sebelumnya"
                    nextTitle="Berikutnya"
                    todayBackgroundColor={COLORS.primary}
                    selectedDayColor={COLORS.primary}
                    selectedDayTextColor="#fff"
                    scaleFactor={375}
                    textStyle={{
                        color: 'black',
                    }}
                    onDateChange={this.onDateChange}
                />
                {/* onPress={() => {this.props.navigation.push('AjukanIzin')}} */}
                <View style={{flex: 1,justifyContent: 'flex-end',marginBottom:30,padding:15}}>
                    <TouchableOpacity style={{widht:'200',borderRadius:10,height:60,backgroundColor:COLORS.primary,marginBottom:10,justifyContent:'center',flexDirection:'row',alignItems:'center'}} onPress={this.handleSaveClick}>
                        <Icon name={'clipboard'} size={15} style={{color: COLORS.white, textAlign: 'center'}}/>
                        <Text style={{textAlign:'center',alignItems:'center',color:COLORS.white,fontSize:17}}> Ajukan Izin</Text>
                    </TouchableOpacity>
                </View>

                <AwesomeAlert
                    show={this.state.showAlertPesan}
                    showProgress={false}
                    title="Pesan"
                    message={this.state.pesan}
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={false}
                    showCancelButton={true}
                    showConfirmButton={false}
                    cancelText="Kembali"
                    confirmButtonColor={COLORS.primary}
                    onCancelPressed={
                        () => { this.hideAlertPesan();
                    }}
                />
            </View>
        );
    }
}

export default AgendaAbon;
const styles = StyleSheet.create({});
