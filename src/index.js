import React from 'react';
import ReactDOM from 'react-dom';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore} from 'react-router-redux'
import Keycloak from 'keycloak-js';
import configureStore from './store';
import Layout from './components/Layout';
import Home from './components/Home';
import SMComparisonChart from './components/SMComparisonChart';
import MVPCattle from './components/Mvpcattle';
import MVPAgri from './components/Mvpagri';
import MVPUrbanWaste from './components/Mvpurbanwaste';
import MVPFishFarming from './components/Mvpfishfarming';
import Sensors from './components/SensorsContainer';
import Sensor from './components/sensors/sensorDetail/sensorDetailContainer';
import Profile from './components/profile/ProfileContainer.js';
import Settings from './components/profile/SettingsContainer.js';
import UserList from './components/user/UserList/UserListContainer';
import Notifications from './components/notification/NotificationsContainer.js';
import NotifDetail from './components/notification/notifDetail/NotifDetailContainer.js';
import './index.css';
import injectTapEventPlugin from 'react-tap-event-plugin';
import * as actions from './actions/actions';
import UTIL from './utils.js';

injectTapEventPlugin();

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store)

// load all sensors in the store, using service and servicePath from the user attributes.
// if isAllSensors == true, the sensors with the same servicePath as the user or un sub-paths are loaded. 
// if isAllSensors == false, the sensors with the strictly same servicePath as the user are loaded.
export function loadSensors(isAllSensors) {

    var userDetails = store.getState().keycloak.idTokenParsed;

    if(userDetails) {
       var service     = userDetails.Service;
       var servicePath = userDetails.ServicePath + (isAllSensors?"#":"");
       store.dispatch( actions.fetchSensors(service, servicePath));
    }
};

// Create a sensor with the given parameters.
// the user's service and servicePath will be used.
export function createSensor(sensorId, sensorType, sensorLon, sensorLat) {

    var userDetails = store.getState().keycloak.idTokenParsed;
    
    if(userDetails) {
      var sensor  = {
        id: sensorId,
        type: sensorType,
        location: {
            value: {
              type: "Point",
              coordinates: [sensorLon, sensorLat]
            },
            type: "geo:json"
          },
          owner: {
           type: "string",
           value: userDetails.preferred_username
          },
      }
      store.dispatch(actions.createSensor(sensor, userDetails.Service, userDetails.ServicePath));
    }
}

//delete a sensor.
export function deleteSensor(sensor) {
    console.log("deleteSensors" + JSON.stringify(sensor));

    var userDetails = store.getState().keycloak.idTokenParsed;

    if(userDetails) {
       store.dispatch( actions.deleteSensor(sensor.id, userDetails.Service, sensor.servicePath.value));
    }
};

//get the history of values for each attributes of the sensor.
export function getHisto(sensor) {
    console.log("getHisto" + JSON.stringify(sensor));

    var userDetails = store.getState().keycloak.idTokenParsed;

    if(userDetails) {
        var meas =  UTIL.getMeasurements(sensor);
        meas.map((item) => {
           store.dispatch( actions.getHistoData(sensor.id, item.key, userDetails.Service, sensor.servicePath.value));
        });
    }
};

//update the sensor location
export function updateSensorLocation(sensorId, sensorLon, sensorLat) {

  var userDetails = store.getState().keycloak.idTokenParsed;

  if(userDetails) {
    let attribute  = {
      location: {
        value: {
          type: "Point",
          coordinates: [sensorLon, sensorLat]
        },
        type: "geo:json"
      }
    }

    console.log("update" + JSON.stringify(store.getState().sensors));
    var sensor = store.getState().sensors.sensors.find((s) => {
        return s.id === sensorId;
    });
    store.dispatch(actions.updateSensorAttributes(sensorId, attribute, userDetails.Service, sensor.servicePath.value));
  }
}

//update the sensor owner
export function updateSensorOwner(sensorId) {

  var userDetails = store.getState().keycloak.idTokenParsed;

  if(userDetails) {
    let attribute  = {
      owner: {
        type: "string",
        value: userDetails.preferred_username,
      }
    }

    var mySensor = store.getState().sensors.sensors.find((s) => {
        return s.id === sensorId;
    });
    store.dispatch(actions.updateSensorAttributes(sensorId, attribute, userDetails.Service, mySensor.servicePath.value));
  }
}

export function subscribeHistoData(sensorId, attrs) {

  var userDetails = store.getState().keycloak.idTokenParsed;
  if(userDetails) {
    let sub =
      {
        "description": "A subscription to get info about WS_UPPA_Sensor2",
        "subject": {
          "entities": [
            {
              "id": sensorId,
              "type": "SensingDevice"
            }
          ],
          "condition": {
            "attrs": [
              "SM1"
            ]
          }
        },
        "notification": {
          "httpCustom": {
            "url": "https://api.plivo.com/v1/Account/MAMDA5ZDJIMDM1NZVMZD/Message/",
            "headers": {
               "Content-type": "application/json",
               "Authorization": "Basic TUFNREE1WkRKSU1ETTFOWlZNWkQ6WXpoaU5ESmpPRE5oTkRreE1qaGlZVGd4WkRkaE5qYzNPV1ZsTnpZMA=="
               
            },
            "method": "POST",
            "payload": "%7B%22src%22%3A%2200393806412092%22%2C%22dst%22%3A%2200393806412093%22%2C%22text%22%3A%22test%22%7D"
          },
          "attrs": [
            "SM1"
          ]
        },
        "expires": "2040-01-01T14:00:00.00Z",
        "throttling": 5
      }

    console.log("sensor" + JSON.stringify(sensorId)); 
    console.log("sensors" + JSON.stringify(store.getState().sensors)); 
    var mySensor = store.getState().sensors.sensors.find((s) => {
        return s.id === sensorId;
    });
    store.dispatch(actions.subscribeHistoData(sub, userDetails.Service, mySensor.servicePath.value));
  }
}

function loadUsers(){
  store.dispatch(actions.getUsers());
};

const MyApp = () =>{
  return (
    <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)} >
      <Layout />
    </MuiThemeProvider>
  );
}

const routes = {
  path: '/',
  component: Layout,
  indexRoute: { component: Home },
  childRoutes: [
    { path: 'home', component:  Home },
    { path: 'apps', component:  Home },
    { path: 'profile', component:  Profile },
    { path: 'profile/settings', component:  Settings },
    { path: 'apps/cattle', component:  MVPCattle },
    { path: 'apps/agri', component:  MVPAgri },
    { path: 'apps/urbanwaste', component:  MVPUrbanWaste },
    { path: 'apps/fishfarming', component:  MVPFishFarming },
    { path: 'notifications', component: Notifications},
    { path: 'notifications/:notifId', component: NotifDetail},
    { path: '/farmview/farm1', component: SMComparisonChart},
    { path: 'sensors', component:  Sensors},
    { path: 'sensors/:sensorId', component:Sensor},
    { path: 'users', component:  UserList, onEnter: loadUsers},
  ]
}

function displayPage() {

  ReactDOM.render(
     <Provider store={store}>
          <Router history={history} routes={routes} />
        </Provider>,
    document.getElementById('root')
    );

}

const kc = Keycloak('/keycloak.json');

const checkIdentity = process.env.REACT_APP_DASHBOARD_IDENTITY;

if (checkIdentity === 'false') {

  //console.log("test" + checkIdentity)
  displayPage();

} else {

  kc.init({ onLoad: 'login-required'}).
    success(authenticated => {
    if (!authenticated) {
      kc.login();
    } else {

      //console.log(authenticated);
      store.getState().keycloak = kc;
      setInterval(() => {
        kc.updateToken(10).error(() => kc.logout());
      }, 10000);

      displayPage();
    }
  }).error(function (error) {

    console(error);
  });
}
