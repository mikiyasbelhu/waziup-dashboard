import { connect } from 'react-redux';
import Sensors from './Sensors.js';
import {createSensor, updateSensorStart, updateSensorLocation, fetchSensors} from '../actions/actions';

function mapStateToProps(state) {
  return {
      sensors: state.sensors.sensors,
      isLoading:state.sensors.isLoading,
      user: state.keycloak.idTokenParsed,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createSensor:(sensor,servicePath)=>{dispatch(createSensor(sensor,servicePath))},
    updateSensorStart:(sensor,servicePath)=>{dispatch(updateSensorStart(sensor,servicePath))},
    updateSensorLocation:(sensor, service, servicePath)=>{dispatch(updateSensorLocation(sensor, service, servicePath))},
    fetchSensors:(service, servicePath)=>{dispatch(fetchSensors(service, servicePath))}
  };
}
const SensorsContainer = connect(mapStateToProps, mapDispatchToProps)(Sensors);
export default SensorsContainer;
