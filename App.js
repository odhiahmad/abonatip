import React, {useEffect, useMemo, useReducer} from 'react';
import {StyleSheet,View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import Home from './src/HomeAbon'
import Agenda from './src/AgendaAbon'
import Riwayat from './src/RiwayatAbon'
import Silahar from './src/silahar/Silahar'
import RiwayatSilahar from "./src/silahar/RiwayatSilahar";

import Profile from './src/ProfileAbon'
import AmbilAbsen from './src/AmbilAbsen'
import AjukanIzin from './src/AjukanIzin'
import RiwayatIzin from './src/RiwayatIzin'
import PdfViewer from "./src/PdfViewer";
import SuccessAbsen from './src/SuccessAbsen'
import TakePhoto from './src/TakePhoto'

import Icon from 'react-native-vector-icons/Feather';
import IconB from 'react-native-vector-icons/FontAwesome5';
import IconC from 'react-native-vector-icons/FontAwesome';

import LoginActivity from './src/LoginActivity'


import {stateConditionString} from './src/utils/helpers';
import {AuthContext} from './src/utils/authContext';
import {initialState, reducer} from "./src/reducers/reducer";

import AsyncStorage from '@react-native-community/async-storage';
import COLORS from './src/const/colors';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


//Home Screen
const StackHome = () => (
    <Stack.Navigator>

        <Stack.Screen name="Home" component={Home}
                      options={{
                          headerShown: false,
                      }}
        />
        <Stack.Screen name="AmbilAbsen" component={AmbilAbsen}
                      options={{
                          title: 'Ambil Absen',
                          headerStyle: {
                              backgroundColor: 'white'
                          },
                          headerShown: false,
                      }}
        />
        <Stack.Screen name="SuccessAbsen" component={SuccessAbsen}
                      options={{
                          headerShown: false,
                      }}
        />
        <Stack.Screen name="TakePhoto" component={TakePhoto}
                      options={{
                          headerShown: false,
                      }}
        />

    </Stack.Navigator>
)
const StackAgenda = () => (
    <Stack.Navigator>

        <Stack.Screen name="Agenda" component={Agenda}
                      options={{
                          headerShown: false,
                      }}
        />
        <Stack.Screen name="AjukanIzin" component={AjukanIzin}
                      options={{
                          title: 'Pengajuan Izin',
                          headerStyle: {
                              backgroundColor: 'white'
                          },
                          headerShown: false,
                      }}
        />
        <Stack.Screen name="RiwayatIzin" component={RiwayatIzin}
                      options={{
                          title: 'Riwayat Izin',
                          headerStyle: {
                              backgroundColor: 'white',
                              elevation: 0
                          },
                          headerShown: false,
                          headerTitleStyle: {alignSelf: 'center'},
                      }}
        />
    </Stack.Navigator>
)
const StackRiwayat = () => (
    <Stack.Navigator>

        <Stack.Screen name="Riwayat" component={Riwayat}
                      options={{
                          headerShown: false,
                      }}
        />

    </Stack.Navigator>
)
const StackSilahar = () => (
    <Stack.Navigator>

        <Stack.Screen name="Silahar" component={Silahar}
                      options={{
                          headerShown: false,
                      }}
        />
        <Stack.Screen name="RiwayatSilahar" component={RiwayatSilahar}
                      options={{
                          headerShown: false,
                      }}
        />

    </Stack.Navigator>
)
const StackProfile = () => (
    <Stack.Navigator>

        <Stack.Screen name="Profile" component={Profile}
                      options={{
                          headerShown: false,
                      }}/>
        <Stack.Screen name="PdfViewer" component={PdfViewer}
                      options={{
                          headerShown: false,
                      }}/>

    </Stack.Navigator>
)

export default function App() {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        // Fetch the token from storage then navigate to our appropriate place
        const bootstrapAsync = async () => {
            let userToken;

            try {
                userToken = await AsyncStorage.getItem('token');

            } catch (e) {
                // Restoring token failed
            }

            // After restoring token, we may need to validate it in production apps
            // This will switch to the App screen or Auth screen and this loading
            // screen will be unmounted and thrown away.
            console.log(userToken)
            dispatch({type: 'RESTORE_TOKEN', token: userToken});
        };
        bootstrapAsync();
    }, []);

    // In a production app, we need to send some data (usually username, password) to server and get a token
    // We will also need to handle errors if sign in failed
    // After getting token, we need to persist the token using `AsyncStorage`
    const authContextValue = useMemo(
        () => ({
            signIn: async (data) => {
                if (data.masuk === true) {
                    dispatch({type: 'SIGN_IN', token: data.token});

                } else {
                    dispatch({type: 'TO_SIGNIN_PAGE'});
                }
            },
            signOut: async (data) => {
                AsyncStorage.clear()
                dispatch({type: 'SIGN_OUT'});
            },

            signUp: async (data) => {
                if (
                    data &&
                    data.emailAddress !== undefined &&
                    data.password !== undefined
                ) {
                    dispatch({type: 'SIGNED_UP', token: 'dummy-auth-token'});
                } else {
                    dispatch({type: 'TO_SIGNUP_PAGE'});
                }
            },
        }),
        [],
    );

    const chooseScreen = (state) => {
        let navigateTo = stateConditionString(state);
        let arr = [];

        switch (navigateTo) {
            case 'LOAD_SIGNIN':
                arr.push(<Stack.Screen options={{
                    headerShown: false,
                }} name="Auth" component={Auth}/>);
                break;

            case 'LOAD_HOME':
                arr.push(
                    <Stack.Screen
                        name="Home"
                        component={HomeScreenStack}
                        options={{
                            headerShown: false,
                        }}
                    />,
                );
                break;
            default:
                arr.push(<Stack.Screen options={{
                    headerShown: false,
                }} name="Auth" component={Auth}/>);
                break;
        }
        return arr[0];
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            <NavigationContainer>
                <Stack.Navigator>{chooseScreen(state)}</Stack.Navigator>
            </NavigationContainer>
        </AuthContext.Provider>
    );
}

function HomeScreenStack({navigation}) {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
                name="BottomTabStack"
                component={BottomTabStack}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
}

function Auth({}) {
    return (
        <Stack.Navigator initialRouteName="LoginActivity">
            <Stack.Screen
                name="LoginActivity"
                component={LoginActivity}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
}

function BottomTabStack() {
    return (
        <Tab.Navigator
            tabBarOptions={{
                style: {
                    paddingBottom: 15,
                    height: 70,
                    fontSize: 20,
                    borderTopWidth: 0,
                    elevation: 0,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    zIndex: 2,
                    marginTop: -10
                },
                activeTintColor: '#7868e6',
                inactiveTintColor: COLORS.primary,

            }}>
            <Tab.Screen name="Home" color={'#00AEEF'} component={StackHome}
                        options={{
                            tabBarLabel: 'Home',
                            tabBarIcon: ({color, size}) => (
                                <Icon name={'home'} color={color} size={28}/>
                            ),
                        }}
            />
            <Tab.Screen name="Agenda" color={'#00AEEF'} component={StackAgenda}
                        options={{
                            tabBarLabel: 'Agenda',
                            tabBarIcon: ({color, size}) => (
                                <IconB name={'calendar-alt'} color={color} size={28}/>
                            ),
                        }}
            />
            <Tab.Screen name="Riwayat" color={'#00AEEF'} component={StackRiwayat}
                        options={{
                            tabBarLabel: 'Riwayat',
                            tabBarIcon: ({color, size}) => (
                                <View
                            style={{
                                height: 60,
                                width: 60,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: COLORS.white,
                                borderColor: COLORS.primary,
                                borderWidth: 2,
                                borderRadius: 30,
                                top: -15,
                                elevation: 5,
                            }}>
                            <IconC name={'list-alt'} color={color} size={28}/>
                        </View>
                               
                            ),
                        }}
            />
            <Tab.Screen name="Silahar" color={'#00AEEF'} component={StackSilahar}
                        options={{
                            tabBarLabel: 'Silahar',
                            tabBarIcon: ({color, size}) => (
                                <IconB name={'book'} color={color} size={28}/>
                            ),
                        }}
            />
            <Tab.Screen name="Profile" color={'#00AEEF'} component={StackProfile}
                        options={{
                            tabBarLabel: 'Profile',
                            tabBarIcon: ({color, size}) => (
                                <Icon name={'user'} color={color} size={28}/>
                            ),
                        }}
            />
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
