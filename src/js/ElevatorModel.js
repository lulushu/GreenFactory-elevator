function ElevatorModel(elevatorNum) {
    this._elevatorNumber = elevatorNum;
    this._currentPosition = null;
    this._status = null;
    this._active = false; // TODO status값 교체하자...
    this._init()
}

ElevatorModel.prototype = {

    set: function (dataObject) {
        for (var property in dataObject) {
            this["_" + property] = dataObject[property];
        }
    },

    get: function (dataArray) {
        var dataProperty = {};
        for (var i = 0; i < dataArray.length; i++) {
            dataProperty[dataArray[i]] = this["_" + dataArray[i]]
        }
        return dataProperty;
    },

    _init: function () {
        this._currentPosition = 1;
        this._status = 'inactive';
    }
};