function ElevatorController(ElevatorNumber, floorNumber) {
    this._elevatorNumber = ElevatorNumber;
    this._floorNumber = floorNumber;
    this._init();
    this._cacheEventHandlers();
    this._assignEvent();
}

ElevatorController.prototype = {

    _init: function () {
        this._oCollection = new ElevatorCollection(this._elevatorNumber);
        this._oView = new ElevatorView(this._elevatorNumber, this._floorNumber);
        this._$View = $(this._oView);
        this._$Collection = $(this._oCollection);
        this._oView.renderElevator(this._oCollection.getInitialPostion());
    },

    _cacheEventHandlers: function () {
        this._eventHandlers = {};
        this._eventHandlers._onClickButton = $.proxy(this._onClickButton, this);
        this._eventHandlers._onFindElevator = $.proxy(this._onFindElevator, this);
        this._eventHandlers._onArriveFloor = $.proxy(this._onArriveFloor, this);
    },

    _assignEvent: function () {
        this._$Collection.on("findElevator", this._eventHandlers._onFindElevator);
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

    _onArriveFloor: function (event) {
        this._oCollection.setActive({elevatorNum: event.elevator});
    }

};




