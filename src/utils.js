/**
 * Global Util Functions
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
const UTIL = {
	/**
	  * Test if Obj is empty
	  */
	objIsEmpty: function(obj) {
	  for(let prop in obj) {
	    if(obj.hasOwnProperty(prop))
	      return false;
	  }
	  return true;
	},

	/**
	  * Convert Obj to Arr
	  */
	objToArr: function(obj) {
	  return Object.keys(obj).map(function(k) { return obj[k] });
	},

	/**
	  * Get First Item in Object
	  */
	firstIndexInObj: function(obj) {
	  for (let a in obj) return a;
	},
    /**
     *  check status of a request
     *
     */
    checkStatus: function(response) {
      if (response.status >= 200 && response.status < 300) {
              return response;
            } else {
              let error = new Error(response.status);
              error.response = response;
              throw error;
            }
     },

    // Get all measurements for a sensor
    // an attribute is considered as a measurement if it has a timestamp metadata
    getMeasurement: function(sensor){
        var returnValue = [];
        for(var i in sensor){
            console.info(sensor[i]);
          if (sensor[i] && sensor[i].hasOwnProperty('metadata') && sensor[i].metadata.timestamp) {
            returnValue.push({"key": i, "value": sensor[i].value})
            }
          }
        return returnValue;
    }
};

/* Export ==================================================================== */
module.exports = UTIL;
module.exports.details = {
  title: 'UTIL'
};
