function ElevatorModel(elevatorNum) {
    this.elevatorNumber = elevatorNum;
    this.currentPosition = null;
    this.status = "inactive";
    // this.destination = null;
    this._init()
}

ElevatorModel.prototype = {
    _init: function () {
        this.currentPosition = 1;
    },

    set: function (dataObject) {
        for (property in dataObject) {

            if (this[property] !== dataObject[property]) {
                this[property] = dataObject[property];
                $(this).trigger({type: 'change.' + property, value: this[property]})
            }
        }
    }

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
            elevators["elevator" + i] = new ElevatorModel(i);
        }
        this.elevators = elevators;
    },

    getCurrentPostion: function () {
        var position = {};
        for (elevator in this.elevators) {
            position[elevator] = this.elevators[elevator].currentPosition;
        }
        return position;
    },

    findNearestElevator: function (targetFloor) {
        console.log(targetFloor);
        var position = {};
        var positionValues = [];
        var Elevators = [];

        for (elevator in this.elevators) {
            if (this.elevators[elevator].status === 'inactive') {
                positionValues.push(Math.abs(targetFloor - this.elevators[elevator].currentPosition));
            }
        }
        console.log(positionValues);
        var maxNum = Math.min.apply(Math, positionValues);

        for (elevator in this.elevators) {
            if (Math.abs(targetFloor - this.elevators[elevator].currentPosition) == maxNum && this.elevators[elevator].status === 'inactive') {
                Elevators.push(this.elevators[elevator].elevatorNumber);
            }
        }

        var target = Math.min.apply(Math, Elevators);

        if (Elevators.length > 0) {
            $(this).trigger({
                type: 'findElevator',
                elevator: Math.min.apply(Math, Elevators),
                floor: targetFloor,
                current: this.elevators["elevator" + target].currentPosition
            });
            this.elevators["elevator" + Math.min.apply(Math, Elevators)].currentPosition = targetFloor;
            this.elevators["elevator" + Math.min.apply(Math, Elevators)].status = 'active';
        }
    },

    setActive: function(event){
        setTimeout($.proxy(function(event){
            this.elevators["elevator" + event.elevatorNum].status = 'inactive';
        },this),3000,event);

    }
};

