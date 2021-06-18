import React, {Component} from "react";
import {StyleSheet, Text, TouchableOpacity, View, Alert, StatusBar,Dimensions} from "react-native";
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import {StackActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import IconB from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as DocumentPicker from 'expo-document-picker';
import * as Device from 'expo-device';
import {_baseURL_} from "../constant";
import Constants from 'expo-constants';
import {BottomSheet, Header, ListItem} from 'react-native-elements';
import LoaderModal from './components/loader';
import COLORS from "./const/colors";
import AwesomeAlert from 'react-native-awesome-alerts';
import jwt_decode from "jwt-decode";

const {width, height} = Dimensions.get('screen');
const cardWidth = width / 1.83;
const cardWidthInfo = width / 1.03;
class AmbilAbsen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            locationResult: null,
            distance: null,
            isLoading: true,
            showAlert: false,
            opd: '',
            uri: '',
            username: '',
            absen_type: this.props.route.params.absen_type,
            locationStatus: null,
            distance_max: null,
            value: null,
            id_koordinat: null,
            qrcode: null,
            pesan:'Pastikan anda berada dilokasi kantor',
            pesanAbsen:'',
            lokasi:false,
            isVisible: false,
            isVisiblePilihan: false,
            jam_masuk:this.props.route.params.jam_masuk,

            showAlertPesan:false,
        }

    }


    componentDidMount() {
        this._getLocationAsync();
    }

    showAlert = () => {
        this.setState({
            showAlert: true
        });
    };

    hideAlert = () => {
        this.setState({
            showAlert: false
        });
    };

    hideAlertPesan = () => {
        this.setState({
            showAlertPesan: false
        });
    };


    _pickFoto = () => {
        const {navigate} = this.props.navigation;

        // this.setState({isVisible: !this.state.isVisible});
        navigate("TakePhoto", {
            absen_type: this.state.absen_type,
            lat: this.state.lat,
            long: this.state.long
        })

    }
    _pickDocument = async () => {
        // this.setState({isVisible: !this.state.isVisible});
        const token = await AsyncStorage.getItem('username');
        let result = await DocumentPicker.getDocumentAsync({type: "application/pdf", copyToCacheDirectory: true});
        if (result.type !== 'cancel') {
            this.setState({loading: true})
            let filename;
            let type;

            filename = result.name;
            type = result.name.split('.').reverse()[0];

        

            this.setState({
                isLoading: true
            })

            const url = 'http://abon1.sumbarprov.go.id/api/tap_in_out_outdor'
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data;'
                }, body:JSON.stringify({
                    nip: token,
                    image_tag: filename,
                    image_data: result,
                    lattitude: this.state.lat,
                    longitude: this.state.long,
                    store_device_id: Expo.Constants.deviceId,
                    device_model: Device.modelName,
                    device_device: Device.brand,
                    device_hardware: Device.manufacturer
                })
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson);
                    this.setState({
                        isLoading: false
                    })
                    this.reset(responseJson.time, responseJson.date);
                })
                .catch((error) => {
                    console.error(error);
                    alert('Anda sedang tidak terhubung ke jaringan internet')
                });
        } else {

        }
        console.log(result);
    }

    //Absen Masuk
    tap_absen_in = async () => {
        const token = await AsyncStorage.getItem('token');
        var decoded = jwt_decode(token);
        this.setState({
            showAlert:false,
            isLoading: true
        })

        fetch(_baseURL_+'absen/ambilAbsen', {
            method: 'POST',
            headers: {
                'Authorization':'Bearer '+token,
                'Content-Type': 'application/json'
            }, body: JSON.stringify({
                tipe:decoded.result.role,
                absen:'masuk',
                id_user:decoded.result.id_user,
                id_pegawai:decoded.result.id,
                nama:decoded.result.nama,
                device_id:Constants.deviceId
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                if(responseJson.berhasil == true){
                    this.setState({
                        isLoading: false,
                        pesanAbsen:responseJson.pesan,    
                    })

                    this.reset(responseJson.tanggal, responseJson.jam);
                }else{
                    this.setState({
                        isLoading: false,
                        showAlertPesan: true,
                        pesanAbsen:responseJson.pesan,
                    })
                }
            })
            .catch((error) => {
                console.error(error);
                alert('Anda sedang tidak terhubung ke jaringan internet')
            });
    }

    //Absen Keluar
    tap_absen_out = async () => {
        const token = await AsyncStorage.getItem('token');
        var decoded = jwt_decode(token);
        this.setState({
            showAlert:false,
            isLoading: true
        })

        console.log({
            tipe:decoded.result.role,
                absen:'pulang',
                id_user:decoded.result.id_user,
                id_pegawai:decoded.result.id,
                nama:decoded.result.nama,
                device_id:Constants.deviceId,
                jam_masuk:this.state.jam_masuk
        })
        fetch(_baseURL_+'absen/ambilAbsen', {
            method: 'PATCH',
            headers: {
                'Authorization':'Bearer '+token,
                'Content-Type': 'application/json'
            }, body: JSON.stringify({
                tipe:decoded.result.role,
                absen:'pulang',
                id_user:decoded.result.id_user,
                id_pegawai:decoded.result.id,
                nama:decoded.result.nama,
                device_id:Constants.deviceId,
                jam_masuk:this.state.jam_masuk
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                if(responseJson.berhasil == true){
                    this.setState({
                        isLoading: false,
                        pesanAbsen:responseJson.pesan,    
                    })

                    this.reset(responseJson.tanggal, responseJson.jam);
                }else{
                    this.setState({
                        isLoading: false,
                        showAlertPesan: true,
                        pesanAbsen:responseJson.pesan,
                    })
                }
            })
            .catch((error) => {
                console.error(error);
                alert('Anda sedang tidak terhubung ke jaringan internet')
            });
    }

    tap_absen_check1 = async () => {
        const token = await AsyncStorage.getItem('token');
        var decoded = jwt_decode(token);
        this.setState({
            showAlert:false,
            isLoading: true
        })


        console.log({
            
        })
        fetch(_baseURL_+'absen/ambilAbsen', {
            method: 'PATCH',
            headers: {
                'Authorization':'Bearer '+token,
                'Content-Type': 'application/json'
            }, body: JSON.stringify({
                tipe:'CS',
                absen:'cek1',
                id_user:decoded.result.id_user,
                device_id:Constants.deviceId,
               
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                if(responseJson.berhasil == true){
                    this.setState({
                        isLoading: false,
                        pesanAbsen:responseJson.pesan,    
                    })

                    this.reset(responseJson.tanggal, responseJson.jam);
                }else{
                    this.setState({
                        isLoading: false,
                        showAlertPesan: true,
                        pesanAbsen:responseJson.pesan,
                    })
                }
            })
            .catch((error) => {
                console.error(error);
                alert('Anda sedang tidak terhubung ke jaringan internet')
            });
    }

    tap_absen_check2 = async () => {
        console.log('cek2')
        const token = await AsyncStorage.getItem('token');
        var decoded = jwt_decode(token);
        this.setState({
            showAlert:false,
            isLoading: true
        })

        fetch(_baseURL_+'absen/ambilAbsen', {
            method: 'PATCH',
            headers: {
                'Authorization':'Bearer '+token,
                'Content-Type': 'application/json'
            }, body: JSON.stringify({
                tipe:'CS',
                absen:'cek2',
                id_user:decoded.result.id_user,
                device_id:Constants.deviceId,
                
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                if(responseJson.berhasil == true){
                    this.setState({
                        isLoading: false,
                        pesanAbsen:responseJson.pesan,    
                    })

                    this.reset(responseJson.tanggal, responseJson.jam);
                }else{
                    this.setState({
                        isLoading: false,
                        showAlertPesan: true,
                        pesanAbsen:responseJson.pesan,
                    })
                }
            })
            .catch((error) => {
                console.error(error);
                alert('Anda sedang tidak terhubung ke jaringan internet')
            });
    }

    //Get Lokasi
    _getLocationAsync = async () => {
        const token = await AsyncStorage.getItem('token');
        let {status} = await Permissions.askAsync(Permissions.LOCATION);
   
        this.setState({
            locationStatus: status,
        })

        if (status !== 'granted') {
            this.setState({
                locationResult: 'Permission to access location was denied',
                isLoading: false
            });
        } else {
            let location = await Location.getCurrentPositionAsync({});
            const { mocked } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest, timeInterval: 1, })

            var lat = location.coords.latitude.toString()
            var latSubstr = lat.substring(0, 10)

            var long = location.coords.longitude.toString()
            var longSubstr = long.substring(0, 10)

            if(mocked === true){
                this.setState({
                    lokasi:false,
                    pesan:'Anda terdeteksi menggunakan fake GPS',
                    isLoading: false,
                })
            }else{
                fetch(_baseURL_+'absen/getLokasi', {
                    method: 'POST',
                    headers: {
                        'Authorization':'Bearer '+token,
                        'Content-Type': 'application/json'
                    }, body: JSON.stringify({
                        lat: latSubstr,
                        long: longSubstr
                    })
                }).then((response) => response.json()).then((responseJson) => {
                        if (responseJson.berhasil == true) {
                            this.setState({
                                isLoading: false, 
                                lokasi:responseJson.berhasil,
                                pesan:responseJson.pesan
                            })
                        } else {
                            this.setState({
                                lokasi:responseJson.berhasil,
                                pesan:responseJson.pesan,
                                isLoading: false,
                            })
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        alert('Anda sedang tidak terhubung ke jaringan internet')
                    });
            }
        }
    };

    reset(date,time) {
        this.props.navigation.dispatch(
            StackActions.replace('SuccessAbsen', {jam: time, tanggal: date}));
    }

    render() {
        if (this.state.locationStatus !== 'granted') {
            return (
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20}}>
                     <LoaderModal
                    loading={this.state.isLoading}/>
                    <IconB name="location-off" size={50} style={{color: COLORS.primary, marginBottom: 20}}/>
                    <Text style={{textAlign: 'center'}}>Kami mendeteksi anda tidak mengaktifkan GPS atau tidak
                        memberikan akses lokasi terhadap aplikasi ini</Text>
                </View>
            );
        }


        return (
            <View style={styles.container}>
                <LoaderModal
                    loading={this.state.isLoading}/>
                <StatusBar translucent backgroundColor="rgba(0,0,0,0.4)"/>
                <Header
                placement="left"
                    containerStyle={{
                        // borderBottomColor:'white',
                        backgroundColor:COLORS.white,
                        height:95
                    }}
                    leftComponent={
                        <TouchableOpacity
                        style={{
                            marginLeft:10,
                            
                        }}
                            onPress={() => {
                                this.props.navigation.pop()
                            }}>
                              <Icon name="chevron-left" size={28} onPress={ () =>this.props.navigation.pop()}/></TouchableOpacity>}
                    statusBarProps={{barStyle: 'light-content'}}
                    centerComponent={{text:this.state.absen_type == 1 ? 'Ambil Absen Masuk':'Ambil Absen Keluar', style: {color: 'black', fontSize: 20, fontWeight: 'bold'}}}
                
                />
                 <View style={styles.cardInfo}>
                        <View style={{justifyContent: 'center',alignItems: 'center', padding: 20,backgroundColor:'white',width:'35%'}}>
                            <Icon name={'building'} size={80}
                                                      style={{color: COLORS.primary, textAlign: 'center'}}/>
                              <Text style={{fontSize: 12,fontWeight:'600', color: COLORS.primary,textAlign:'center',marginTop:20}}>Absen di Kantor</Text>
                        </View>
                        <View style={{justifyContent: 'center',padding:15,width:'65%'}}>
                            <Text style={{fontSize: 14, color: COLORS.white,textAlign:'center'}}>{this.state.pesan}</Text>
                           <View style={{flex: 1,justifyContent: 'flex-end'}}>
                           
                               {this.state.lokasi === false ?
                                <TouchableOpacity style={{widht:'200',borderRadius:10,height:40,backgroundColor:COLORS.white,marginBottom:10,justifyContent:'center',flexDirection:'row',alignItems:'center'}} onPress={this._getLocationAsync}>
                                <Icon name={'map-marker-alt'} size={15}
                                                      style={{color: COLORS.primary, textAlign: 'center'}}/><Text style={{textAlign:'center',alignItems:'center',color:COLORS.primary,fontSize:17}}> Update Lokasi</Text>
                            </TouchableOpacity>:
                             <TouchableOpacity style={{widht:'200',borderRadius:10,height:40,backgroundColor:COLORS.white,marginBottom:10,justifyContent:'center',flexDirection:'row',alignItems:'center'}} onPress={this.showAlert}>
                               <Icon name={'clipboard'} size={15}
                                                      style={{color: COLORS.primary, textAlign: 'center'}}/><Text style={{textAlign:'center',alignItems:'center',color:COLORS.primary,fontSize:17}}> Ambil Absen</Text>
                         </TouchableOpacity>
                               }
                            </View>
                        </View>
                    </View>
                    <View style={styles.cardInfo}>
                        <View style={{justifyContent: 'center',alignItems: 'center', padding: 20,backgroundColor:'white',width:'35%'}}>
                            <Icon name={'users'} size={80}
                                                      style={{color: COLORS.primary, textAlign: 'center'}}/>
                              <Text style={{fontSize: 12,fontWeight:'600', color: COLORS.primary,textAlign:'center',marginTop:20}}>Absen di Luar Kantor</Text>
                        </View>
                        <View style={{justifyContent: 'center',padding:15,width:'65%'}}>
                        <Text style={{fontSize: 14, color: COLORS.white,textAlign:'center',marginBottom:10}}>Silahkan pilih opsi untuk mengambil absen diluar kantor</Text>
                        <TouchableOpacity style={{widht:'200',borderRadius:10,height:40,backgroundColor:COLORS.white,marginBottom:10,justifyContent:'center',flexDirection:'row',alignItems:'center'}} onPress={this._getLocationAsync}>
                               <Icon name={'upload'} size={15}
                                                      style={{color: COLORS.primary, textAlign: 'center'}}/><Text style={{textAlign:'center',alignItems:'center',color:COLORS.primary,fontSize:17}}> Upload Dokumen</Text>
                         </TouchableOpacity>
                         <TouchableOpacity style={{widht:'200',borderRadius:10,height:40,backgroundColor:COLORS.white,marginBottom:10,justifyContent:'center',flexDirection:'row',alignItems:'center'}} onPress={this._getLocationAsync}>
                               <Icon name={'camera'} size={15}
                                                      style={{color: COLORS.primary, textAlign: 'center'}}/><Text style={{textAlign:'center',alignItems:'center',color:COLORS.primary,fontSize:17}}> Kirim Foto</Text>
                         </TouchableOpacity>
                        </View>
                    </View>

                    <AwesomeAlert
          show={this.state.showAlert}
          showProgress={false}
          title="Ambil Absen"
          message="Apakah anda yakin ingin mengambil absen dalam kantor sekarang ini ?"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="Tidak, Kembali"
          confirmText="Ya, Tentu"
          confirmButtonColor={COLORS.primary}
          onCancelPressed={() => {
            this.hideAlert();
          }}
          onConfirmPressed={() => {
              this.state.absen_type == 1 ? this.tap_absen_in() : this.state.absen_type == 2 ? this.tap_absen_out() : this.state.absen_type == 3 ? this.tap_absen_check1() : this.tap_absen_check2()
          }}
        />
         <AwesomeAlert
          show={this.state.showAlertPesan}
          showProgress={false}
          title="Pesan"
          message={this.state.pesanAbsen}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={false}
          cancelText="Kembali"
          confirmButtonColor={COLORS.primary}
          onCancelPressed={() => {
            this.hideAlertPesan();
          }}
        />
            </View>
        );
    }
}

export default AmbilAbsen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white'
    },
    boxItemBlue: {
        paddingVertical: 20,
        paddingHorizontal: 30,
        justifyContent: 'center',
        shadowOffset: {width: 2, height: 2,},
        shadowColor: '#e0e0e0',
        shadowOpacity: 1.0,
        elevation: 1,
        borderRadius: 10,
        marginBottom: 10,
        marginTop: 20,
        backgroundColor: '#b8b5ff'
    },
    cardInfo: {
        flexDirection:'row',
        height: 220,
        width: cardWidthInfo,
        marginHorizontal: 5,
        marginTop: 20,
        borderRadius: 15,
        elevation: 13,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.5,
        shadowRadius: 2,
        backgroundColor: COLORS.primary,
    },
    boxItemRed: {
        paddingVertical: 20,
        paddingHorizontal: 30,
        justifyContent: 'center',
        shadowOffset: {width: 2, height: 2,},
        shadowColor: '#e0e0e0',
        shadowOpacity: 1.0,
        elevation: 1,
        borderRadius: 10,
        marginBottom: 10,
        marginTop: 10,
        backgroundColor: '#FF4955'
    },
    textBold: {
        fontWeight: 'bold',
        color: '#FFF',
        fontSize: 25
    }
});
