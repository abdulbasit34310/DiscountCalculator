import * as React from 'react';
import {
  ActivityIndicator,
  Button,
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { DataTable } from 'react-native-paper';

const optionsPerPage = [2, 3, 4];
const optionsPerPage2 = [2, 3, 4];

function WSS() {
  const [page, setPage] = React.useState(0);
  const [itemsPerPage, setItemsPerPage] = React.useState(optionsPerPage[0]);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  const [getws, setws] = React.useState([]);
  const [getpopulation, setpopulation] = React.useState();

  const getData = async () => {
    await fetch('https://covid-19-data.p.rapidapi.com/totals', {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'covid-19-data.p.rapidapi.com',
        'x-rapidapi-key': 'edbf78f9f4mshbd6ddbe223b6524p147d5ejsnd3abddd06975',
      },
    })
      .then((response) => response.json())
      .then((json) => {
        // console.log("Covid 19 Stats")
        // console.log(json[0]);
        setws(json[0]);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const getPopulation = async () => {
    await fetch('https://world-population.p.rapidapi.com/worldpopulation', {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'world-population.p.rapidapi.com',
        'x-rapidapi-key': 'edbf78f9f4mshbd6ddbe223b6524p147d5ejsnd3abddd06975',
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json.body.world_population);
        setpopulation(json.body.world_population);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  React.useEffect(() => {
    getData();
    getPopulation();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Title</DataTable.Title>
          <DataTable.Title>Number</DataTable.Title>
          <DataTable.Title>Percentage</DataTable.Title>
        </DataTable.Header>

        <DataTable.Row>
          <DataTable.Cell>Confirmed</DataTable.Cell>
          <DataTable.Cell numeric>{getws.confirmed} </DataTable.Cell>
          <DataTable.Cell>
            {' '}
            {(getws.confirmed / getpopulation) * 100}{' '}
          </DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>Recovered</DataTable.Cell>
          <DataTable.Cell numeric>{getws.recovered} </DataTable.Cell>
          <DataTable.Cell>
            {' '}
            {(getws.recovered / getpopulation) * 100}{' '}
          </DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>Deaths</DataTable.Cell>
          <DataTable.Cell numeric>{getws.deaths} </DataTable.Cell>
          <DataTable.Cell>
            {' '}
            {(getws.deaths / getpopulation) * 100}{' '}
          </DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>Critical</DataTable.Cell>
          <DataTable.Cell numeric>{getws.critical} </DataTable.Cell>
          <DataTable.Cell>
            {' '}
            {(getws.critical / getpopulation) * 100}{' '}
          </DataTable.Cell>
        </DataTable.Row>

        <DataTable.Pagination
          page={page}
          numberOfPages={3}
          onPageChange={(page) => setPage(page)}
          label="1-2 of 6"
          optionsPerPage={optionsPerPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          showFastPagination
          optionsLabel={'Rows per page'}
        />
      </DataTable>

      <Text style={{ fontStyle: 'italic', color: 'black', fontSize: 15 }}>
        Last Update: {getws.lastUpdate}
      </Text>
    </View>
  );
}

function CNS({ navigation }) {
  const [isEnabled, setIsEnabled] = React.useState(false);

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
  };

  const [getcn, setcn] = React.useState();
  const [getscn, setscn] = React.useState();

  const [isRefreshing, setRefreshing] = React.useState(false);

  const getCountryNames = async () => {
    setRefreshing(true);

    await fetch('https://world-population.p.rapidapi.com/allcountriesname', {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'world-population.p.rapidapi.com',
        'x-rapidapi-key': 'edbf78f9f4mshbd6ddbe223b6524p147d5ejsnd3abddd06975',
      },
    })
      .then((response) => response.json())
      .then((json) => {
        setcn(json.body.countries);
        setscn(json.body.countries);
        setRefreshing(false);
      });
  };

  React.useEffect(
    () => {
      getCountryNames();
    },
    [setcn],
    [setscn]
  );

  const search = (text) => {
    const scn = getscn.filter((item) => {
      return item.startsWith(text);
    });
    setcn(scn);
  };

  const star = () => {};

  if (getcn) {
    return (
      <>
        <View style={{ padding: 10 }}>
          <TextInput
            style={styles.ti}
            onChangeText={(text) => {
              search(text);
            }}
          />

          <FlatList
            refreshing={isRefreshing}
            onRefresh={getCountryNames}
            keyExtractor={(item) => item.key}
            data={getcn}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.list}
                onPress={() => {
                  navigation.navigate('Country Statistics', item);
                }}>
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <Text style={{ color: 'white', fontSize: 16 }}>{item}</Text>
                  <TouchableOpacity>
                    <Switch
                      trackColor={{ false: '#767577', true: '#81b0ff' }}
                      thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={toggleSwitch}
                      value={isEnabled}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </>
    );
  } else {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="#6545a4" size="large" />
        <Text style={{ alignSelf: 'center' }}>Loading....</Text>
      </View>
    );
  }
}

function CSS({ navigation, route }) {
  const [stats, setStats] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [itemsPerPage, setItemsPerPage] = React.useState(optionsPerPage[0]);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  var api = 'https://covid-19-data.p.rapidapi.com/country?name=' + route.params;

  React.useEffect(() => {
    const fetchCountryStatistics = async () => {
      await fetch(api, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'covid-19-data.p.rapidapi.com',
          'x-rapidapi-key':
            'edbf78f9f4mshbd6ddbe223b6524p147d5ejsnd3abddd06975',
        },
      })
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
          setStats(json[0]);
        })
        .catch((err) => {
          console.error(err);
        });
    };
    fetchCountryStatistics();
  }, [api, route.params]);

  if (stats)
    return (
      <View style={styles.container}>
        <Text style={{ color: 'black', fontSize: 16 }}>{route.params}</Text>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Title</DataTable.Title>
            <DataTable.Title>Number</DataTable.Title>
            <DataTable.Title>Percentage</DataTable.Title>
          </DataTable.Header>

          <DataTable.Row>
            <DataTable.Cell>Confirmed</DataTable.Cell>
            <DataTable.Cell numeric>{stats.confirmed} </DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell>Recovered</DataTable.Cell>
            <DataTable.Cell numeric>{stats.recovered} </DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell>Deaths</DataTable.Cell>
            <DataTable.Cell numeric>{stats.deaths} </DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell>Critical</DataTable.Cell>
            <DataTable.Cell numeric>{stats.critical} </DataTable.Cell>
          </DataTable.Row>

          <DataTable.Pagination
            page={page}
            numberOfPages={3}
            onPageChange={(page) => setPage(page)}
            label="1-2 of 6"
            optionsPerPage={optionsPerPage2}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            showFastPagination
            optionsLabel={'Rows per page'}
          />
        </DataTable>
        <Text style={{ color: 'black', fontSize: 16 }}>
          Last Updated: {stats.lastUpdate.substr(0, 10)}
        </Text>
      </View>
    );
  else {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
      </View>
    );
  }
}

function FCS() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Country Statistics Screen</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Country Name"
        component={CNS}
        options={({ navigation }) => ({
          headerTitleAlign: 'center',
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: 'rgb(238,238,238)',
          },
        })}
      />
      <Stack.Screen name="Country Statistics" component={CSS} />
    </Stack.Navigator>
  );
}

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator initialRouteName={'Countries Name'}>
      <Drawer.Screen name="World Statistics" component={WSS} />
      <Drawer.Screen name="Countries Name" component={MyStack} />
      <Drawer.Screen name="Favourite Countries" component={FCS} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyDrawer />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  ti: {
    backgroundColor: 'light-grey',
    margin: 5,
    borderWidth: 1,
    width: '95%',
    height: 40,
    fontSize: 16,
    borderColor: 'black',
    borderRadius: 10,
    padding: 10,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  list: {
    backgroundColor: 'thistle',
    justifyContent: 'center',
    height: 40,
    padding: 8,
    margin: 3,
    elevation: 0,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 20,
  },
  crossContainer: {
    backgroundColor: 'orange',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  // header: {
  //   height: 60,
  //   backgroundColor: '#6545a4',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   elevation: 5,
  // },
});

// /
