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
        console.log(this.targetFloors);
    },

    findElevator1: function () {
        var self = this;
        var intervalID = window.setInterval(function () {
            console.log(intervalID);
            console.log("modelInterval");
            var targetFloor = self.targetFloors[0];
            var nearestDistance = self._getNearestDistance2(targetFloor);
            var targetElevatorNumber = self._getTargetElevatorNumber(targetFloor, nearestDistance);
            console.log("가까운거리", nearestDistance);
            console.log("엘리베이터", targetElevatorNumber);
            if (targetElevatorNumber !== null) {
                window.clearInterval(intervalID);
                self._notifyTargetElevator(targetElevatorNumber, targetFloor);
                self.targetFloors.shift();
            }

        }, 1000);
    },

    _getNearestDistance2: function (targetFloor) {
        var distanceValues = [];
        var modelData;
        for (var elevator1 in this.elevators) {
            modelData = this.elevators[elevator1].get(['status', 'currentPosition']);
            var object = {};
            if (this.elevators[elevator1]._status === 'inactive') {
                object["distance"] = Math.abs(targetFloor - modelData.currentPosition);
                object["elevator"] = elevator1;
                distanceValues.push(object);
            }
        }

        distanceValues.sort(function (a, b) {
            if (a["distance"] < b["distance"]) return -1;
            if (a["distance"] > b["distance"]) return 1;
            return 0;
        });
        console.log(distanceValues);
        return distanceValues;
    },


    _getNearestDistance: function (targetFloor) {
        var distanceValues = [];
        var modelData;
        for (var elevator1 in this.elevators) {
            modelData = this.elevators[elevator1].get(['status', 'currentPosition']);
            var object = {};
            if (this.elevators[elevator1].isMoiving === false) {
                object["distance"] = Math.abs(targetFloor - modelData.currentPosition);
                object["elevator"] = elevator1;
                distanceValues.push(object);
            }
        }
        console.log(distanceValues);
        distanceValues.sort(function (a, b) {
            if (a["distance"] < b["distance"]) return -1;
            if (a["distance"] > b["distance"]) return 1;
            return 0;
        });
        console.log(distanceValues);
        return distanceValues;
    },

    _getTargetElevatorNumber: function (targetFloor, nearestDistance) {
        var movableElevators = [];
        var modelData;
        var distanceArray = [];
        var distance;
        var array = nearestDistance;
        var elevatorNum;
        for (var i = 0; i < nearestDistance.length; i++) {
            elevatorNum = array[i].elevator;
            console.log(elevatorNum);
            if (this.elevators[elevatorNum]._status === 'inactive') {
                distanceArray.push(array[i].distance);
            }
        }
        distance = Math.min.apply(Math, distanceArray); //distanceArray length 가 0인 경우 값은 infinity
        for (var elevator2 in this.elevators) {
            modelData = this.elevators[elevator2].get(['status', 'currentPosition', 'elevatorNumber']);
            if (Math.abs(targetFloor - modelData.currentPosition) == distance && modelData.status === 'inactive') {
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
        if (nearestDistance.length === 0) {
            this.findElevator1();
            return;
        }

        if (nearestDistance[0].distance === 0) {
            this._notifyAlreadyArriveElevator(targetFloor);
            this.targetFloors.shift();
            return;
        }
        var targetElevatorNumber = this._getTargetElevatorNumber(targetFloor, nearestDistance);
        console.log("가까운거리", nearestDistance);
        console.log("엘리베이터", targetElevatorNumber);

        if (targetElevatorNumber !== null) {
            this._notifyTargetElevator(targetElevatorNumber, targetFloor);
            this.targetFloors.shift();
        }
        // } else {
        //     this.findElevator1();
        // }
    },

    _notifyAlreadyArriveElevator: function (targetFloor) {
        $(this).trigger({
            type: 'alreadyArriveElevator',
            floor: targetFloor
        });
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
        this.elevators["elevator" + targetElevatorNumber].isMoiving = true;
    },

    setActive: function (event) {
        this.elevators["elevator" + event.elevatorNum].isMoiving = false;
        setTimeout($.proxy(function (event) {
            this.addActiveElevator(event.elevatorNum);
        }, this), 3000, event);
    },

    addActiveElevator: function (elevatorNum) {
        console.log("add");
        this.elevators["elevator" + elevatorNum].set({status: 'inactive'})
    }
};

