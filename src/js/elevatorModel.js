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
        for(property in dataObject){

            if(this[property] !== dataObject[property]){
                this[property] = dataObject[property];
                $(this).trigger({type: 'change.'+ property, value: this[property]})
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
        var position = {};
        var positionValues = [];
        var Elevators = [];
        for (elevator in this.elevators) {
            console.log(Math.abs(targetFloor - this.elevators[elevator].currentPosition));
            // position[elevator] =  Math.abs(targetFloor - this.elevators[elevator].currentPosition) ;
            positionValues.push(Math.abs(targetFloor - this.elevators[elevator].currentPosition));
        }
        console.log(positionValues);
        var maxNum = Math.min.apply(Math, positionValues);
        console.log(maxNum);
        for (elevator in this.elevators) {
            // position[elevator] =  Math.abs(targetFloor - this.elevators[elevator].currentPosition) ;
            if (Math.abs(targetFloor - this.elevators[elevator].currentPosition) == maxNum) {
                Elevators.push(this.elevators[elevator].elevatorNumber);
            }
        }

        if (Elevators.length >= 2) {
            $(this).trigger({
                type: 'findElevator',
                elevator: Math.min.apply(Math, Elevators),
                floor: targetFloor,
                current: this.elevators[elevator].currentPosition
            });
            this.elevators["elevator" + Math.min.apply(Math, Elevators)].currentPosition = targetFloor;
        } else {
            $(this).trigger({
                type: 'findElevator',
                elevator: Elevators[0],
                floor: targetFloor,
                current: this.elevators[elevator].currentPosition
            });
            this.elevators["elevator" + Elevators[0]].currentPosition = targetFloor;
        }
        console.log(this.elevators);
        // return position;
    },


    setIntervalY: function (currentFloor, repetitions, elevatorNum) {
        console.log(currentFloor, repetitions, elevatorNum);
        var current = currentFloor;
        var x = 0;
        var intervalID = window.setInterval(function () {
            current--;
            console.log(current);
            $("[data-elevator=" + elevatorNum + "]").find("div").removeClass("elevator");
            $("[data-elevator=" + elevatorNum + "]").find("[data-floor=" + current + "]").addClass("elevator");

            if (++x === repetitions) {
                window.clearInterval(intervalID);
            }
        }, 1000);
    }
};

