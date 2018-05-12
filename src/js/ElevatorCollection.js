function ElevatorCollection(ElevatorNumber) {
    this._elevatorNumber = ElevatorNumber;
    this.elevators = {};
    this.targetFloors = [];
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

    getInitialPostion: function () {
        var position = {};
        var modelData;
        for (var elevator in this.elevators) {
            modelData = this.elevators[elevator].get(['currentPosition']);
            position[elevator] = modelData.currentPosition;
        }
        return position;
    },

    pushTargetFloor: function (targetFloorNum) {
        this.targetFloors.push(targetFloorNum); //분리해야 할것 같음...
        this.findNearestElevator(this.targetFloors[0]);
    },

    findElevator1: function () {
        var self = this;
        var intervalID = window.setInterval(function () {
            console.log("interval")
            var targetFloor = self.targetFloors[0];
            var nearestDistance = self._getNearestDistance(targetFloor);
            var targetElevatorNumber = self._getTargetElevatorNumber(targetFloor, nearestDistance);
            if (targetElevatorNumber !== null) {
                window.clearInterval(intervalID);
                self._notifyTargetElevator(targetElevatorNumber, targetFloor);
                self.targetFloors.shift();
            }

        }, 1000);
    },

    _getNearestDistance: function (targetFloor) {
        var distanceValues = [];
        var modelData;
        for (var elevator1 in this.elevators) {
            modelData = this.elevators[elevator1].get(['status', 'currentPosition']);
            if (modelData.status === 'inactive') {
                distanceValues.push(Math.abs(targetFloor - modelData.currentPosition));
            }
        }

        return Math.min.apply(Math, distanceValues);
    },

    _getTargetElevatorNumber: function (targetFloor, nearestDistance) {
        var movableElevators = [];
        var modelData;
        for (var elevator2 in this.elevators) {
            modelData = this.elevators[elevator2].get(['status', 'currentPosition', 'elevatorNumber']);
            if (Math.abs(targetFloor - modelData.currentPosition) == nearestDistance && modelData.status === 'inactive') {
                movableElevators.push(modelData.elevatorNumber);
            }
        }

        if (movableElevators.length > 0) {
            return Math.min.apply(Math, movableElevators);
        } else {
            return null;
        }

    },

    findNearestElevator: function () {
        var targetFloor = this.targetFloors[0];
        var nearestDistance = this._getNearestDistance(targetFloor);
        var targetElevatorNumber = this._getTargetElevatorNumber(targetFloor, nearestDistance);

        if (targetElevatorNumber !== null) {
            this._notifyTargetElevator(targetElevatorNumber, targetFloor);
            this.targetFloors.shift();
        } else {
            this.findElevator1();
        }
    },

    _notifyTargetElevator: function (targetElevatorNumber, targetFloor) {
        var modelData = this.elevators["elevator" + targetElevatorNumber].get(['currentPosition']);
        $(this).trigger({
            type: 'findElevator',
            elevator: targetElevatorNumber,
            floor: targetFloor,
            current: modelData.currentPosition
        });
        this.elevators["elevator" + targetElevatorNumber].set({currentPosition: targetFloor, status: 'active'});
    },

    setActive: function (event) {
        setTimeout($.proxy(function (event) {
            this.addActiveElevator(event.elevatorNum);
        }, this), 3000, event);

    },

    addActiveElevator: function (elevatorNum) {
        this.elevators["elevator" + elevatorNum].set({status: 'inactive'})
    }
};

