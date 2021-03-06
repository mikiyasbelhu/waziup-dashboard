import React, {Component} from 'react';
import { reduxForm, Field } from 'redux-form'
import Dialog from 'material-ui/Dialog';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem'
import Checkbox from 'material-ui/Checkbox'
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField'
import PropTypes from 'prop-types';
import * as Waziup from 'waziup-js'


class SensorForm extends Component {

  constructor(props){
    super(props);
    const defaultSensor = new Waziup.Sensor("MySensor")
    defaultSensor.name = "My sensor"
    defaultSensor.domain = "waziup"
    defaultSensor.visibility = "public"
    this.state = {
      sensor: (this.props.sensor? this.props.sensor: defaultSensor)
    };
  }
  
  componentWillReceiveProps(nextProps) { 
    if(nextProps.sensor && nextProps.sensor !== this.state.sensor) {
      this.setState({sensor: nextProps.sensor})
    }
  }
  
  handleChange = (formData) => {
    var sensor = this.state.sensor
    sensor[formData.target.name] = formData.target.value;
    this.setState({sensor: sensor})
  }
  
  handleChangeVisibility = (event, index, value) => {
    var sensor = this.state.sensor
    sensor.visibility = value;
    this.setState({sensor: sensor})
  }

  render() {
    const {modalOpen, handleClose, onSubmit} = this.props;
    const actions = [ 
      <FlatButton label="Cancel" primary={true} onTouchTap={()=>{handleClose();}}/>,
      <FlatButton label="Submit" primary={true} onTouchTap={()=>{this.props.onSubmit(this.state.sensor); handleClose();}}/>,
    ];

    return (
        <Dialog title={this.props.isEdit? "Update Sensor Node": "Add Sensor Node"} actions={actions} modal={true} open={modalOpen}>
          <TextField name="id" disabled={this.props.isEdit} floatingLabelText="Sensor ID" value={this.state.sensor.id} onChange={this.handleChange} title="ID used by the gateway to send data"/>
          <TextField name="name"  floatingLabelText="Sensor name" value={this.state.sensor.name} onChange={this.handleChange} title="Name of the sensor"/>
          <TextField name="domain"  floatingLabelText="Domain" value={this.state.sensor.domain} onChange={this.handleChange} title="Domain this sensor belongs to"/>
          <SelectField name="visibility" floatingLabelText="Visibility" value={this.state.sensor.visibility} onChange={this.handleChangeVisibility} title="Public visibility of the sensor">
            <MenuItem value="public" primaryText="Public" />
            <MenuItem value="private" primaryText="Private" />
          </SelectField>
        </Dialog>
      );
  }

  propTypes = {
    sensor: PropTypes.object.isRequired, //Should be a Waziup.Sensor
    modalOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    isEdit: PropTypes.bool
  }
}

export default reduxForm({form: 'simple'})(SensorForm)
