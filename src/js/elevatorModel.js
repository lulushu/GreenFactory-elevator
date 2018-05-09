function ElevatorModel() {
    this.currentPosition = null;
    this._init()
}

ElevatorModel.prototype._init = function () {
    this.currentPosition = 1;
};

function ElevatorCollection(ElevatorNumber) {
    this._elevatorNumber = ElevatorNumber;
    this.elevators = {};
    this._init();

}

ElevatorCollection.prototype = {
    _init: function () {
        var elevators = {};
        for (var i = 1; i <= this._elevatorNumber; i++) {
            elevators["elevator"+i] = new ElevatorModel();
        }
        this.elevators = elevators;
    },

    getCurrentPostion: function () {
        var position = {};
        for ( elevator in this.elevators){
            // console.log(this.elevators[elevator].currentPosition);
              position[elevator] = this.elevators[elevator].currentPosition;
        }
        return position;
    }
};

