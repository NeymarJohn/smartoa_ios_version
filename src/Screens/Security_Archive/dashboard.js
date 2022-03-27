import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import LoadingActionContainer from '../../Components/LoadingActionContainer';
import useAppTheme from '../../Themes/Context';
import { ScrollView } from 'react-native-gesture-handler';
import AssociationFooterScreen from '../../Components/AssociationFooterScreen';
import {Container} from '../../Components';
import Routes from '../../Navigation/Routes';
import theme from '../../Themes/configs/default';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { BASE_URL } from '../../Config';
import { useIsFocused } from '@react-navigation/native';

const SecurityArchiveHome = ({route, navigation}) => {
  const {theme} = useAppTheme();
  const [user, setUser] = useState({});
  const [serverData, setServerData] = useState([]);
  const [viewMode, setViewMode] = useState(false);
  const [statusColor, setStatusColor] = useState({color: theme.colors.background});
  const isFocused = useIsFocused();
  useEffect( async () => {
    var userInfo = JSON.parse(await AsyncStorage.getItem('USER_INFO'));
    setUser(userInfo);
    await axios.post(`${BASE_URL}/move/getList`, {notStatus: 1, building_id: userInfo.building_id}).then( res => {
      if(res.data.success) {
        setServerData(res.data.data);
        if(res.data.data.length > 0) {
          setViewMode(true);
        }
      }
    }).catch(err => {
    });
  }, [isFocused]);
  
  const renderView = () => {
    if(viewMode) {
      return (
        <View
          style={{justifyContent: 'center', alignItems: 'center', padding: 20}}>
              <View style={[styles.card, styles.shadowProp]}>
                {serverData.map(data => {
                  return (
                    <TouchableOpacity onPress={() => {
                      navigation.navigate(Routes.SECURITY_ARCHIVE_DETAIL, {data: data});
                    }}>
                      <View
                      style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomColor: '#e2e2e2', borderBottomWidth: 0.8}}>
                          <View style={{flexDirection: 'column', alignItems: 'flex-start', alignContent: 'center'}}>
                              <Text style={[{fontWeight: 'bold'}, data.status == 2 ? {color: '#00E01A'} : {color: '#d91414'}]}>{data.status == 2 ? 'Approved' : 'Rejected'}</Text>
                              <Text>Date Created:</Text>
                              <Text>{data.type == 3 ? data.carried_date : data.move_date}</Text>
                          </View>
                          <View style={{flexDirection: 'column', alignItems: 'flex-start', alignContent: 'center'}}>
                              <Text>Building:</Text>
                              <Text>{data.building_name}</Text>
                          </View>
                          <View style={{flexDirection: 'column', alignItems: 'flex-start', alignContent: 'center'}}>
                              <Text>Unit:</Text>
                              <Text>{data.unit_name}</Text>
                          </View>
                      </View>
                    </TouchableOpacity>
                  )
                })}
              </View>
        </View>
      )
    }else {
      return (
        <View
          style={{justifyContent: 'center', alignItems: 'center', padding: 20}}>
              <Text>There is no data</Text>
        </View>
      )
    }
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
              {renderView()}
            </View>
          </ScrollView>
        </Container>
      </LoadingActionContainer>
  );
};

const styles = StyleSheet.create({
  shadowProp: {
    shadowColor: '#000',
    shadowOffset: {width: 5, height: -5},
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 10,
  },
  card: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 8,
    width: '100%',
    marginVertical: 10,
  },
});

export default SecurityArchiveHome;
