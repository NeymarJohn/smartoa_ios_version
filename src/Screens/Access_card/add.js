import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, TextInput, Alert, Keyboard } from 'react-native';
import {Dropdown, MultiSelect} from 'react-native-element-dropdown';
import { Button } from 'react-native-paper';
import LoadingActionContainer from '../../Components/LoadingActionContainer';
import useAppTheme from '../../Themes/Context';
import useTranslation from '../../i18n';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import FooterScreen from '../../Components/FooterScreen';
import {Container} from '../../Components';
import axios from 'axios';
import { BASE_URL } from '../../Config';
import AsyncStorage from '@react-native-community/async-storage';
import {showInfoToast, showErrorToast, showSuccessToast} from '../../Lib/Toast';
import Toast from 'react-native-tiny-toast';
import NavigationService from '../../Navigation';
import Routes from '../../Navigation/Routes';

const AccessCardAdd = ({routes, navigation}) => {
  const {t} = useTranslation();
  const {theme} = useAppTheme();
  const [user, setUser] = useState({});
  const [dropdown, setDropdown] = useState(null);
  const [unitDropDown, setUnitDropDown] = useState(null);
  const [buildingData, setBuildingData] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [price, setPrice] = useState('');

  useEffect( async () => {
    let isMounted = true;    
    if(isMounted) {
      setUser(JSON.parse(await AsyncStorage.getItem('USER_INFO')));
    }
    return () => { isMounted = false };
  }, []);

  useEffect(() => {
    return setBuildingData(user.building_list);
  }, [user])

  const _renderItem = item => {
    return (
    <View>
        <Text>{item.name}</Text>
    </View>
    );
  };

  const _renderItem1 = item => {
    return (
    <View>
        <Text>{item.unit_name}</Text>
    </View>
    );
  };

  useEffect( () => {
    axios.post(`${BASE_URL}/userowner/getList`, {building_id: dropdown, user_id: user.id}).then( res => {
      if(res.data.success) {
        setUnitData(res.data.data);
      }
    }).catch(err => {
    });
  }, [dropdown])

  const submitHandle = async (e) => {
    Keyboard.dismiss();
    if(!formValidation().success){
      showErrorToast(formValidation().message);
      return;
    }
    
    var formData = new FormData();
    formData.append('building_id', dropdown);
    formData.append('unit_id', unitDropDown);
    formData.append('price', price);
    formData.append('user_id', user.id);

    await axios.post(`${BASE_URL}card/access_add`, formData,
    { headers: { 'Content-Type': 'multipart/form-data', 'X-Requested-With': 'XMLHttpRequest', }}).then(res => { 
      showSuccessToast('Your request is sent successfully. Please wait for the reply.');
      NavigationService.navigate(Routes.ACCESS_CARD_DASHBOARD);
    }).catch(err => {
      console.log(err);
      showErrorToast('Something went wrong! Please try again.');
    });
  }

  const formValidation = () => {
    var result = true;
    var message = "";
    var res = {};

    if(!dropdown) {
      message = "Please select the building";
      result = false;
      res['success'] = result;
      res['message'] = message;
      return res;
    }

    if(!unitDropDown) {
      message = "Please select the unit";
      result = false;
      res['success'] = result;
      res['message'] = message;
      return res;
    }

    res['success'] = result;
    res['message'] = message;
    return res;
  }

  return (
      <LoadingActionContainer fixed>
        <Container
          style={{
            backgroundColor: theme.colors.primary,
            flex: 1,
          }}>
          <ScrollView>
            <View style={{paddingBottom: 100}}>
              <View style={{flexDirection: 'column', justifyContent: 'center', padding: 20}}>
                <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                  <Text style={{width: '50%', marginTop: 15}}>{t('Select Building')}</Text>
                  <Dropdown
                    data={buildingData}
                    style={styles.dropdown}
                    containerStyle={styles.shadow}
                    search
                    searchPlaceholder="Search Building"
                    labelField="name"
                    valueField="id"
                    label="Building"
                    placeholder="Select Building"
                    value={dropdown}
                    onChange={item => {
                    setDropdown(item.id);
                    }}
                    // renderLeftIcon={() => (
                    //     <Image style={styles.icon} source={require('./assets/account.png')} />
                    // )}
                    renderItem={item => _renderItem(item)}
                    textError="Error"
                  />
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                  <Text style={{width: '50%', marginTop: 15}}>{t('Select Unit')}</Text>
                  <Dropdown
                    data={unitData}
                    style={styles.dropdown}
                    containerStyle={styles.shadow}
                    search
                    searchPlaceholder="Search Unit"
                    labelField="unit_name"
                    valueField="unit_id"
                    label="Unit"
                    placeholder="Select Unit"
                    value={unitDropDown}
                    onChange={item => {
                      setUnitDropDown(item.unit_id);
                    }}
                    // renderLeftIcon={() => (
                    //     <Image style={styles.icon} source={require('./assets/account.png')} />
                    // )}
                    renderItem={item => _renderItem1(item)}
                    textError="Error"
                  />
                </View>
                
                <View style={{borderBottomWidth: 1, borderBottomColor: '#e2e2e2', marginTop: 15, marginBottom: 15}}></View>
                <Text style={{justifyContent: 'center', flexDirection: 'row', alignContent: 'center', alignSelf: 'center'}}>Cost of new/replacement card is 200 AED</Text>
                {/* <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                  <Text style={{width: '50%', marginTop: 15}}>{t('Price')}</Text>
                  <TextInput
                    style={styles.textfield}
                    numberOfLines={1}
                    value={price}
                    multiline={true}
                    onChangeText={text => setPrice(text)}
                  />
                </View> */}
                <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 25}}>
                  <Button
                    mode="contained"
                    style={{borderRadius: 30, marginLeft: 30, marginRight: 30, padding: 5}}
                    color={theme.colors.background}
                    onPress={submitHandle}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        textAlign: 'center',
                        color: theme.colors.primary
                      }}>
                      {t('submit')}
                    </Text>
                  </Button>
                </View>
              </View>
            </View>
            <Toast />
          </ScrollView>
        </Container>
      </LoadingActionContainer>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: 'white',
      padding: 40,
  },
  dropdown: {
      backgroundColor: 'white',
      borderColor: '#505252',
      borderWidth: 0.8,
      paddingLeft: 10,
      paddingRight: 10,
      marginTop: 10,
      width: '50%',
      borderRadius: 5
  },
  icon: {
      marginRight: 5,
      width: 18,
      height: 18,
  },
  item: {
      paddingVertical: 17,
      paddingHorizontal: 4,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  textItem: {
      flex: 1,
      fontSize: 16,
  },
  shadow: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
      marginTop: -25
  },
  dateTouchable: {
    backgroundColor: 'white',
    borderColor: '#505252',
    borderWidth: 0.8,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 8,
    paddingBottom: 8,
    marginTop: 10,
    borderRadius: 5,
  },
  textfield: {
    backgroundColor: 'white',
    borderColor: '#505252',
    borderWidth: 0.8,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginTop: 10,
    borderRadius: 5,
    width: '50%'
  }

});

export default AccessCardAdd;
