function ElevatorController(ElevatorNumber, floorNumber) {
    if (ElevatorNumber > 4 || ElevatorNumber < 0) {
        return;
    }
    if (floorNumber > 5 || floorNumber < 0) {
        return;
    }
    this._elevatorNumber = ElevatorNumber;
    this._floorNumber = floorNumber;
    this._init();
    this._cacheEventHandlers();
    this._assignEvent();
}

ElevatorController.prototype = {

    activateButton: function (floorNumber) {
        var targetFloorNumber = parseInt(floorNumber);
        if (targetFloorNumber <= 0 || targetFloorNumber > this._floorNumber) {
            console.log("not valid number");
            return;
        }
        this._oView.activateButton(floorNumber);
    },

    isButtonActivated: function (floorNumber) {
        var targetFloorNumber = parseInt(floorNumber);
        if (targetFloorNumber <= 0 || targetFloorNumber > this._floorNumber) {
            console.log("not valid number");
            return false;
        }
        return this._oView.isButtonActivated(floorNumber);
    },

    _init: function () {
        this._oCollection = new ElevatorCollection(this._elevatorNumber);
        this._oView = new ElevatorView(this._elevatorNumber, this._floorNumber);
        this._$View = $(this._oView);
        this._$Collection = $(this._oCollection);
        this._oView.renderElevator.call(this._oView, this._oCollection.getInitialPostion());
    },

    _cacheEventHandlers: function () {
        this._eventHandlers = {};
        this._eventHandlers._onClickButton = $.proxy(this._onClickButton, this);
        this._eventHandlers._onFindElevator = $.proxy(this._onFindElevator, this);
        this._eventHandlers._onAlreadyArrivedElevator = $.proxy(this._onAlreadyArrivedElevator, this);
        this._eventHandlers._onArriveFloor = $.proxy(this._onArriveFloor, this);
    },

    _assignEvent: function () {
        this._$Collection.on("findElevator", this._eventHandlers._onFindElevator);
        this._$Collection.on("alreadyElevator", this._eventHandlers._onAlreadyArrivedElevator);
        this._$View.on("clickButton", this._eventHandlers._onClickButton);
        for (var i = 1; i <= this._elevatorNumber; i++) {
            this._$View.on("arrive" + i, this._eventHandlers._onArriveFloor);
        }
    },

    _onClickButton: function (event) {
        this._oCollection.pushTargetFloor(event.floor);
    },

    _onFindElevator: function (event) {
        this._oView.activateElevator(event.elevator, event.floor, event.current);
    },

    _onAlreadyArrivedElevator: function (event) {
        this._oView.onTheSameFloor(event.floor);
    },

    _onArriveFloor: function (event) {
        this._oCollection.setInactive({elevatorNum: event.elevator});
    }

};




