function ElevatorModel(elevatorNum) {
    this._elevatorNumber = elevatorNum;
    this._currentPosition = null;
    this._status = "inactive";
    this.isMoiving = false;
    this._init()
}

ElevatorModel.prototype = {
    _init: function () {
        this._currentPosition = 1;
    },

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
    }

};