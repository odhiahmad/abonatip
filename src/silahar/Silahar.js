import React, {useEffect, useState} from 'react';

import {Header,FAB} from "react-native-elements";
import {
    Button,
    Alert,
    Dimensions,
    FlatList,
    Modal,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    SafeAreaView
} from 'react-native';
import {LinearGradient} from "expo-linear-gradient";
import Icon from 'react-native-vector-icons/FontAwesome5';
import {_baseURL_} from "../../constant";
import LoaderModal from "../components/loader";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';


require('moment/locale/id.js');

function Silahar({navigation}) {
    const [active, setActive] = useState(false);

    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const [data, setData] = React.useState({
        tanggal: '',
        tanggalShow: false,
        jamMulai: '',
        jamMulaiShow: false,
        jamAkhir: '',
        jamAkhirShow: false,
        jumlahKegiatan: '',
        kegiatan: '',
        keterangan: '',
        volume: '',
        showTryAgain: false,
        data: '',
        loading: false,

    });

    useEffect(() => {
        getIndex()
    }, [])

    const [text, setText] = React.useState('');

    const onChangeTanggal = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        var tahun = currentDate.getFullYear();
        var bulan = currentDate.getMonth();
        var tanggal = currentDate.getDate();

        console.log(currentDate)
        setData({
            ...data,
            tanggalShow: false,
            tanggal: moment(currentDate).format('DD-MM-YYYY')
        })

    };

    const getIndex = () => {
        setData({
            ...data,
            loading: false,
            showTryAgain: false,
        });
        return fetch(_baseURL_ + '/potensi-kecelakaan/latlng').then((response) => response.json()).then((responseJson) => {
            setData({
                ...data,
                data: responseJson.results,
                showTryAgain: false,
            });
        }).catch((error) => {
            console.log(error);
            setData({
                ...data,
                loading: false,
                showTryAgain: true,
            });
        });
    }

    const renderRow = ({item, index}) => {
        return (
            <ListItem
                onPress={() => {
                    this.props.navigation.navigate('PetaUmumDetail', {'dataItem': item})
                }}

                key={index} bottomDivider>
                <Avatar rounded={true} avatarStyle={{width: 80, height: 80}} source={{uri: item.picture}}/>
                <ListItem.Content>
                    <ListItem.Subtitle style={{fontSize: 17}}>{item.sumber_data}</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron/>
            </ListItem>
        )
    }
    const onChangeJamMulai = (event, selectedDate) => {
        const currentDate = selectedDate || date;

        var jam = currentDate.getHours();
        var menit = currentDate.getMinutes();
        var detik = currentDate.getSeconds();

        setData({
            ...data,
            jamMulaiShow: false,
            jamMulai: moment(selectedDate).format('hh:mm') + ':00' // March 19th 2021, 9:51:29 am
        })

    };
    const onChangeJamAkhir = (event, selectedDate) => {
        const currentDate = selectedDate || date;

        var jam = currentDate.getHours();
        var menit = currentDate.getMinutes();
        var detik = currentDate.getSeconds();


        setData({
            ...data,
            jamAkhirShow: false,
            jamAkhir: moment(selectedDate).format('hh:mm') + ':00'
        })
    };


    const showTanggal = () => {
        setData({
            ...data,
            tanggalShow: true
        })

    };

    const showjamMulai = () => {
        setData({
            ...data,
            jamMulaiShow: true
        })
    };

    const showJamAkhir = () => {
        setData({
            ...data,
            jamAkhirShow: true
        })
    };

    const modalTambahAktif = () => {
        setData({
            ...data,
            tanggal: '',
            tanggalShow: false,
            jamMulai: '',
            jamMulaiShow: false,
            jamAkhir: '',
            jamAkhirShow: false,
            jumlahKegiatan: '',
            kegiatan: '',
            keterangan: '',
            volume: ''
        })
        setActive(true)
    }
    const submit = () => {
        if (data.tanggal === '') {
            Alert.alert(
                "Notifikasi",
                "Inputkan Data Semua nya",
                [
                    {text: "OK", onPress: () => console.log("OK Pressed")}
                ],
                {cancelable: false}
            );
        } else {
            setData({
                ...data,
                loading: true,
            });
            fetch(_baseURL_ + '/silahar', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                        tanggal: data.tanggal,
                        jamMulai: data.jamMulai,
                        jamAkhir: data.jamAkhir,
                        jumlahKegiatan: data.jumlahKegiatan,
                        kegiatan: data.kegiatan,
                        keterangan: data.keterangan,
                        volume: data.volume
                    },
                ),

            }).then((response) => response.json()).then((responseJson) => {
                if (responseJson.status === true) {
                    setData({
                        ...data,
                        loading: false,
                    });
                    Alert.alert(
                        "Notifikasi",
                        "Berhasil menginputkan data kegiatan",
                        [
                            {text: "OK", onPress: () => console.log("OK Pressed")}
                        ],
                        {cancelable: false}
                    );
                } else {
                    setData({
                        ...data,
                        loading: false,
                    });
                    Alert.alert(
                        "Notifikasi",
                        "Gagal",
                        [
                            {text: "OK", onPress: () => console.log("OK Pressed")}
                        ],
                        {cancelable: false}
                    );
                }

            }).catch((error) => {
                setData({
                    ...data,
                    loading: false,
                });
                Alert.alert(
                    "Notifikasi",
                    "Gagal",
                    [
                        {text: "OK", onPress: () => console.log("OK Pressed")}
                    ],
                    {cancelable: false}
                );
            });
        }
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <Modal
                propagateSwipe={true}
                animationInTiming="300"
                animationType="slide"
                transparent={true}
                visible={active}
                onRequestClose={() => {
                    setActive(false)
                }}>
                <View style={{
                    backgroundColor: 'white',
                    height: '97%',
                    marginTop: 'auto'
                }}>

                    <Header
                        containerStyle={{height: 60, backgroundColor: '#28527a'}}
                        leftComponent={
                            <Icon onPress={() => setActive(false)} name={'arrow-left'} size={24}
                                  style={{color: '#74C6F4', textAlign: 'center'}}/>
                        }

                        placement="center"
                        centerComponent={
                            {text: 'Tambah Pekerjaan', style: {fontSize: 16, color: '#fff',fontWeight:'bold'}}
                        }
                    />
                    <View style={{flex: 1, padding: 20, alignContent: 'center', alignItems: 'center'}}>
                        <View style={{marginTop: 10}}>
                            <Button onPress={() => showTanggal()} rounded block style={styles.pickerStyle}>
                                {
                                    data.tanggal !== '' ?
                                        <Text style={styles.textStyle}>Tanggal {data.tanggal}</Text> :
                                        <Text style={styles.textStyle}>Pilih Tanggal</Text>
                                }
                            </Button>
                        </View>
                        {data.tanggalShow && (
                            <DateTimePicker
                                value={date}
                                mode={"date"}
                                is24Hour={true}
                                display="default"
                                onChange={onChangeTanggal}
                            />
                        )}
                        <View style={{marginTop: 10}}>
                            <Button onPress={() => showjamMulai()} rounded block style={styles.pickerStyle}>
                                {
                                    data.jamMulai !== '' ?
                                        <Text style={styles.textStyle}>Jam Mulai {data.jamMulai}</Text> :
                                        <Text style={styles.textStyle}>Pilih Jam Mulai</Text>
                                }

                            </Button>
                        </View>
                        {data.jamMulaiShow && (
                            <DateTimePicker
                                value={date}
                                mode={"time"}
                                is24Hour={true}
                                display="default"
                                onChange={onChangeJamMulai}
                            />
                        )}
                        <View style={{marginTop: 10}}>
                            <Button onPress={() => showJamAkhir()} rounded block style={styles.pickerStyle}>
                                {
                                    data.jamAkhir !== '' ?
                                        <Text style={styles.textStyle}>Jam Akhir {data.jamAkhir}</Text> :
                                        <Text style={styles.textStyle}>Pilih Jam Akhir</Text>
                                }

                            </Button>
                        </View>
                        {data.jamAkhirShow && (
                            <DateTimePicker
                                value={date}
                                mode={"time"}
                                is24Hour={true}
                                display="default"
                                onChange={onChangeJamAkhir}
                            />
                        )}
                        <TextInput
                            value={data.volume}
                            onChangeText={(volume) => setData({
                                ...data,
                                volume: volume
                            })}
                            maxLength={2}
                            placeholder='Volume'
                            clearButtonMode='always'
                            keyboardType={"numeric"}
                            selectionColor="#999999"
                            underlineColorAndroid="lightblue"
                            autoCapitalize='words'
                            style={styles.inputBox}
                        />
                        <TextInput
                            value={data.jumlahKegiatan}
                            onChangeText={(jumlahKegiatan) => setData({
                                ...data,
                                jumlahKegiatan: jumlahKegiatan
                            })}
                            maxLength={2}
                            placeholder='Jumlah Kegiatan'
                            clearButtonMode='always'
                            keyboardType={"numeric"}
                            selectionColor="#999999"
                            underlineColorAndroid="lightblue"
                            autoCapitalize='words'
                            style={styles.inputBox}
                        />
                        <TextInput
                            value={data.kegiatan}
                            onChangeText={(kegiatan) => setData({
                                ...data,
                                kegiatan: kegiatan
                            })}
                            placeholder='Kegiatan'
                            clearButtonMode='always'
                            selectionColor="#999999"
                            underlineColorAndroid="lightblue"
                            autoCapitalize='words'
                            style={styles.inputBox}
                        />
                        <TextInput
                            value={data.keterangan}
                            onChangeText={(keterangan) => setData({
                                ...data,
                                keterangan: keterangan
                            })}
                            placeholder='Keterangan'
                            clearButtonMode='always'
                            selectionColor="#999999"
                            underlineColorAndroid="lightblue"
                            autoCapitalize='words'
                            style={styles.inputBox}
                        />
                        <View style={{marginTop: 20}}>
                            <Button onPress={submit} rounded block style={styles.buttonSubmit}>

                                <Text style={styles.textStyle}>Submit</Text>


                            </Button>
                        </View>
                    </View>
                </View>

            </Modal>

            <LoaderModal
                loading={data.loading}/>
            <StatusBar translucent backgroundColor="rgba(0,0,0,0.4)"/>
            <Header
                containerStyle={{
                    height: 80,
                }}
                barStyle="light-content"
                statusBarProps={{barStyle: 'light-content'}}
                centerComponent={{text: 'Pekerjaan', style: {color: '#fff', fontSize: 16, fontWeight: 'bold'}}}
            />
            <View style={{flex: 1}}>
                <View style={{
                    paddingHorizontal: 5,
                    marginTop: 10,
                    marginBottom: 10,
                }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("RiwayatSilahar")}
                    >

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
                            <Icon name={'list'} size={61} style={{color: '#74C6F4', textAlign: 'center'}}/>
                            <View style={{flexShrink: 1, marginLeft: 20}}>
                                <Text style={{fontSize: 17, color: '#fff'}}>List Semua Pekerjaan</Text>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
                {data.showTryAgain === true ?
                    <View style={styles.container}>
                        <Text style={{color: 'gray'}}>Koneksi Bermasalah :(</Text>
                        <TouchableOpacity style={{
                            width: 200,
                            backgroundColor: 'red',
                            borderRadius: 25,
                            marginVertical: 2,
                            paddingVertical: 13,
                        }} onPress={getIndex}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: '500',
                                color: '#ffffff',
                                textAlign: 'center',
                            }}>Refresh </Text>
                        </TouchableOpacity></View> : <FlatList
                        renderItem={renderRow}
                        keyExtractor={(item, index) => index.toString()}
                        data={data.data}/>}
                <FAB
                    
                   
                    
                    style={{backgroundColor: '#5067FF'}}
                    placement="right"
                    onPress={modalTambahAktif}
                >
                    <Icon name={'plus'} size={16} style={{color: '#74C6F4', textAlign: 'center'}}/>
                </FAB>

            </View>
            </SafeAreaView>
       
    );

}

const windoWidth = Dimensions.get('window').width; // berguna untuk menyesuaikan ukuran gamabar dengan hp
const windowHeight = Dimensions.get('window').height; // sama seperti comment di atas
export default Silahar
const styles = StyleSheet.create({
    pickerStyle: {
        height: 60, width: 350, backgroundColor: '#28527a'
    },
    buttonSubmit: {
        height: 60, width: 200, backgroundColor: 'red'
    },
    inputTextStyle: {
        paddingTop: 30
    },
    inputBox: {
        height: 60,
        width: 350,
        maxWidth: 400,
        paddingHorizontal: 5,
        fontSize: 16,
        color: '#000',
        marginTop: 10,
    },
    inputTextBox: {
        width: 350,
        maxWidth: 400,
        // backgroundColor: 'white',
        borderRadius: 40,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#000',
        marginTop: 10,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 1,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});
