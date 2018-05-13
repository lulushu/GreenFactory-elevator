function ElevatorCollection(ElevatorNumber) {
    this._elevatorNumber = ElevatorNumber;
    this.elevators = {};
    this.targetFloors = [];
    this._init();
}

ElevatorCollection.prototype = {

    getInitialPostion: function () {
        var position = {};
        var modelData;
        for (var elevatorNumber in this.elevators) {
            modelData = this.elevators[elevatorNumber].get(['currentPosition']);
            position[elevatorNumber] = modelData.currentPosition;
        }
        return position;
    },

    pushTargetFloor: function (targetFloorNum) {
        this.targetFloors.push(targetFloorNum); // TODO 분리해야 할것 같음...
        this._findNearestElevator(this.targetFloors[0]);
    },

    setInactive: function (event) {
        var self = this;
        setTimeout(function (event) { //todo jquery proxy 알아보기
            self._setInactiveElevator(event.elevatorNum);
        }, 3000, event);
    },

    _init: function () {
        for (var i = 1; i <= this._elevatorNumber; i++) {
            this.elevators[i] = new ElevatorModel(i);
        }
    },

    _findElevatorPerSecond: function () {
        var self = this;
        var intervalID = setInterval(function () {
            console.log("interval");
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

    // TODO 거리값 구하는 함수들 3개 중복되는 코드들 많음...

    _getNearestDistance: function (targetFloor) {
        var distanceValues = [];
        var modelData;

        for (var elevatorNumber in this.elevators) {
            modelData = this.elevators[elevatorNumber].get(['status', 'currentPosition']);
            if (modelData.status === 'inactive') {
                distanceValues.push(Math.abs(targetFloor - modelData.currentPosition));
            }
        }
        console.log(distanceValues);

        //////
        return Math.min.apply(Math, distanceValues); //todo 최소값 원리 알아야함..

    },

    _getNearestDistance3: function (targetFloor) {
        var distanceValues = [];
        var modelData;
        //////

        for (var elevatorNumber in this.elevators) {
            modelData = this.elevators[elevatorNumber].get(['status', 'currentPosition']);
            distanceValues.push(Math.abs(targetFloor - modelData.currentPosition));
        }
        console.log("거리값들", distanceValues);


        //////////
        return Math.min.apply(Math, distanceValues);

    },

    // TODO 거리값 구하는 함수들 3개 중복되는 코드들 많음...

    _getTargetElevatorNumber: function (targetFloor, nearestDistance) {
        var movableElevators = [];
        var modelData;
        for (var elevatorNumber in this.elevators) {
            modelData = this.elevators[elevatorNumber].get(['status', 'currentPosition', 'elevatorNumber']);
            if (Math.abs(targetFloor - modelData.currentPosition) === nearestDistance && modelData.status === 'inactive') {
                movableElevators.push(modelData.elevatorNumber);
            }
        }
        return (movableElevators.length > 0) ? Math.min.apply(Math, movableElevators) : null;
    },

    _findNearestElevator: function () {
        var targetFloor = this.targetFloors[0];
        var sameDistance = this._getNearestDistance3(targetFloor);
        if (sameDistance === 0) {
            this._notifyAlreadyElevatorArrived(targetFloor);
            return;
        }
        var nearestDistance = this._getNearestDistance(targetFloor);
        var targetElevatorNumber = this._getTargetElevatorNumber(targetFloor, nearestDistance);
        console.log("타겟엘리베이터는", targetElevatorNumber);
        if (targetElevatorNumber !== null) {
            this._notifyTargetElevator(targetElevatorNumber, targetFloor);
            this.targetFloors.shift();
        } else {
            this._findElevatorPerSecond();
        }
    },

    _notifyAlreadyElevatorArrived: function (targetFloor) {
        $(this).trigger({
            type: 'alreadyElevator',
            floor: targetFloor
        });
        this.targetFloors.shift();
    },

    _notifyTargetElevator: function (targetElevatorNumber, targetFloor) {
        var modelData = this.elevators[targetElevatorNumber].get(['currentPosition']);
        $(this).trigger({
            type: 'findElevator',
            elevator: targetElevatorNumber,
            floor: targetFloor,
            current: modelData.currentPosition
        });
        if (targetFloor !== modelData.currentPosition) {
            this.elevators[targetElevatorNumber].set({currentPosition: targetFloor, status: 'active'});
        }
    },

    _setInactiveElevator: function (elevatorNum) {
        this.elevators[elevatorNum].set({status: 'inactive'})
    }

};

