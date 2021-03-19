import React, {useContext} from 'react';
import {Image, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {AuthContext} from './utils/authContext';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import {LinearGradient} from 'expo-linear-gradient';
import {useTheme} from 'react-native-paper';
import LoaderModal from "./components/loader";
import AsyncStorage from '@react-native-community/async-storage';
import Constants from 'expo-constants';

import * as Device from 'expo-device';
import {_baseURL_} from '../constant';

const LoginActivity = ({}) => {

    const [data, setData] = React.useState({
        username: '',
        password: '',
        device_name: Device.modelName,
        device_id: Constants.deviceId,
        device_device: Device.brand,
        device_hardware: Device.manufacturer,
        check_textInputChange: false,
        secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
        loading: false,

    });

    const {colors} = useTheme();

    const {signIn} = useContext(AuthContext);

    const textInputChange = (val) => {
        if (val.trim().length >= 4) {
            setData({
                ...data,
                username: val,
                check_textInputChange: true,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                username: val,
                check_textInputChange: false,
                isValidUser: false
            });
        }
    }

    const handlePasswordChange = (val) => {
        if (val.trim().length >= 4) {
            setData({
                ...data,
                password: val,
                isValidPassword: true
            });
        } else {
            setData({
                ...data,
                password: val,
                isValidPassword: false
            });
        }
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const handleValidUser = (val) => {
        if (val.trim().length >= 4) {
            setData({
                ...data,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                isValidUser: false
            });
        }
    }

    const loginHandle = (userName, password) => {

        setData({
            ...data,
            loading: true
        })

        let details = {
            username: userName,
            password: password,
            device_id: data.device_id,
            device_model: data.device_name,
            device_device: data.device_id,
            device_hardware: data.device_hardware,

        };
        let formBody = [];
        for (let property in details) {
            let encodedKey = encodeURIComponent(property);
            let encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join('&');

        return fetch(_baseURL_ + 'login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formBody
        }).then((response) => response.json())
            .then((json) => {
                if (json.response == 1) {

                    AsyncStorage.setItem('pegawai', json.result[0].pegawai);
                    AsyncStorage.setItem('token', json.result[0].pegawai);
                    AsyncStorage.setItem('username', json.result[0].username);
                    AsyncStorage.setItem('nama_asn', json.result[0].nama_asn);
                    AsyncStorage.setItem('opd', json.result[0].opd);
                    AsyncStorage.setItem('nm_opd', json.result[0].nm_opd);
                    AsyncStorage.setItem('sub_opd', json.result[0].sub_opd);
                    AsyncStorage.setItem('nm_sub_opd', json.result[0].nm_sub_opd);
                    AsyncStorage.setItem('jabatan', json.result[0].jabatan);
                    AsyncStorage.setItem('nip', json.result[0].nip);
                    AsyncStorage.setItem('id_eselon', json.result[0].id_eselon);
                    AsyncStorage.setItem('eselon', json.result[0].eselon);
                    AsyncStorage.setItem('pangkat', json.result[0].pangkat);
                    AsyncStorage.setItem('jenjang', json.result[0].jenjang);

                    AsyncStorage.setItem('store_device_id', data.device_id);
                    AsyncStorage.setItem('device_model', data.device_name);
                    AsyncStorage.setItem('device_device', data.device_device);
                    AsyncStorage.setItem('device_hardware', data.device_hardware);

                    let masuk = true
                    let token = json.result[0].pegawai

                    signIn({masuk, token})


                    setData({
                        ...data,
                        loading: false
                    });

                } else {

                    alert(json.message)
                    setData({
                        ...data,
                        loading: false
                    });
                }
            })
            .catch((error) => {
                setData({
                    ...data,
                    loading: false
                });
                console.error(error);
                alert('Anda sedang tidak terhubung ke jaringan internet')
            });


    }


    return (
        <View style={styles.container}>
            <LoaderModal
                loading={data.loading}/>
            <StatusBar backgroundColor='#009387' barStyle="light-content"/>
            <View style={styles.header}>
                <Text style={styles.text_header}>Selamat Datang!</Text>
                <Text style={styles.text_header1}>Absensi Online Kab. Pesisir Selatan</Text>
            </View>
            <Animatable.View
                animation="fadeInUpBig"

                style={[styles.footer, {
                    backgroundColor: colors.background
                }]}
            >
                <View style={{alignItems:'center',marginBottom:40}}>
                    <Image style={{width: 120, height: 120}}
                           source={require('../assets/icon.png')}/>
                </View>
                <Text style={[styles.text_footer, {
                    color: colors.text
                }]}>Username</Text>
                <View style={styles.action}>
                    <FontAwesome
                        name="user-o"
                        color={colors.text}
                        size={20}
                    />
                    <TextInput
                        placeholder="Your Username"
                        placeholderTextColor="#666666"
                        style={[styles.textInput, {
                            color: colors.text
                        }]}
                        autoCapitalize="none"
                        onChangeText={(val) => textInputChange(val)}
                        onEndEditing={(e) => handleValidUser(e.nativeEvent.text)}
                    />
                    {data.check_textInputChange ?
                        <Animatable.View
                            animation="bounceIn"
                        >
                            <Feather
                                name="check-circle"
                                color="green"
                                size={20}
                            />
                        </Animatable.View>
                        : null}
                </View>
                {data.isValidUser ? null :
                    <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>Username must be 4 characters long.</Text>
                    </Animatable.View>
                }


                <Text style={[styles.text_footer, {
                    color: colors.text,
                    marginTop: 35
                }]}>Password</Text>
                <View style={styles.action}>

                    <Feather
                        name="lock"
                        color={colors.text}
                        size={20}
                    />
                    <TextInput
                        placeholder="Your Password"
                        placeholderTextColor="#666666"
                        secureTextEntry={data.secureTextEntry ? true : false}
                        style={[styles.textInput, {
                            color: colors.text
                        }]}
                        autoCapitalize="none"
                        onChangeText={(val) => handlePasswordChange(val)}
                    />
                    <TouchableOpacity
                        onPress={updateSecureTextEntry}
                    >
                        {data.secureTextEntry ?
                            <Feather
                                name="eye-off"
                                color="grey"
                                size={20}
                            />
                            :
                            <Feather
                                name="eye"
                                color="grey"
                                size={20}
                            />
                        }
                    </TouchableOpacity>
                </View>
                {data.isValidPassword ? null :
                    <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>Password must be 4 characters long.</Text>
                    </Animatable.View>
                }


                <TouchableOpacity>
                    <Text style={{color: '#009387', marginTop: 15}}></Text>
                </TouchableOpacity>
                <View style={styles.button}>
                    <TouchableOpacity
                        style={styles.signIn}
                        onPress={() => {
                            loginHandle(data.username, data.password)
                        }}
                    >
                        <LinearGradient
                            colors={['#b8b5ff', '#b8b5ff']}
                            style={styles.signIn}
                        >
                            <Text style={[styles.textSign, {
                                color: '#fff'
                            }]}>Sign In</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/*<TouchableOpacity*/}
                    {/*    onPress={() => navigation.navigate('SignUpScreen')}*/}
                    {/*    style={[styles.signIn, {*/}
                    {/*        borderColor: '#009387',*/}
                    {/*        borderWidth: 1,*/}
                    {/*        marginTop: 15*/}
                    {/*    }]}*/}
                    {/*>*/}
                    {/*    <Text style={[styles.textSign, {*/}
                    {/*        color: '#009387'*/}
                    {/*    }]}>Sign Up</Text>*/}
                    {/*</TouchableOpacity>*/}
                </View>
            </Animatable.View>
        </View>
    );

};
export default LoginActivity;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#b8b5ff'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 30,
        paddingTop:30,
    },
    footer: {
        flex: 6,
        backgroundColor: '#7868e6',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 25
    },
    text_header1: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 19
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        marginTop: 20
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    }
});

