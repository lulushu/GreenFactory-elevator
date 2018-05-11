function ElevatorController(ElevatorNumber, floorNumber) {
    this._elevatorNumber = ElevatorNumber;
    this._floorNumber = floorNumber;
    this._init();
    this._cacheEventHandlers();
    this._assignEvent();
    console.log(this._oCollection);
}

ElevatorController.prototype = {

    _init: function () {
        this._oCollection = new ElevatorCollection(this._elevatorNumber);
        this._oView = new ElevatorView(this._elevatorNumber, this._floorNumber);
        this._$View = $(this._oView);
        this._$Collection = $(this._oCollection);
        this._oView.renderElevator(this._oCollection.getCurrentPostion());
    },

    _cacheEventHandlers: function () {
        this._eventHandlers = {};
        this._eventHandlers._onClickButton = $.proxy(this._onClickButton, this);
        this._eventHandlers._onFindElevator = $.proxy(this._onFindElevator, this);
        this._eventHandlers._onArriveFloor = $.proxy(this._onArriveFloor, this);
    },

    _assignEvent: function () { //바로 다른객체들의 method 부르지 말자...
        // this._$Model.on("insertMoney", $.proxy(this._oView.oConsoleWindow.onChangeStatus, this._oView.oConsoleWindow));  // 같은종류의 이벤트로 감싸서 다시 수정예정...
        // this._$Model.on("noMorePaperMoney", $.proxy(this._oView.oConsoleWindow.onChangeStatus, this._oView.oConsoleWindow));
        // this._$Model.on("returnMoney", $.proxy(this._oView.oConsoleWindow.onChangeStatus, this._oView.oConsoleWindow));  //수정해야함.
        // this._$Model.on("noMoreMoney", $.proxy(this._oView.oConsoleWindow.onChangeStatus, this._oView.oConsoleWindow)); //view 하위의 consolewindow까지 알아야함.. 수정..
        // this._$Model.on("noDeposit", $.proxy(this._oView.oConsoleWindow.onChangeStatus, this._oView.oConsoleWindow)); //view가 알아서 처리하도록..
        // this._$Model.on("buyProduct", $.proxy(this._oView.oConsoleWindow.onChangeStatus, this._oView.oConsoleWindow));
        //
        // this._$Model.on("soldOut", $.proxy(this._oView.onSoldOutProduct, this._oView)); // 수정....
        // this._$Model.on("updateDeposit", $.proxy(this._oView.onChangeDeposit, this._oView));
        // this._$Model.on("returnMoney", $.proxy(this.onReturnMoney, this)); //
        //
        // this._$View.on("returnMoney", this._eventHandlers._onClickReturnMoney);  //수정해야함.
        this._$Collection.on("findElevator", this._eventHandlers._onFindElevator);
        this._$View.on("clickButton", this._eventHandlers._onClickButton);

        for(var i =1; i<= this._elevatorNumber; i++){
            this._$View.on("arrive"+i, this._eventHandlers._onArriveFloor);
        }
        // this._$View.on("arrive", this._eventHandlers._onArriveFloor);
    },

    _onClickButton: function (event) {
        this._oCollection.findNearestElevator(event.floor);
    },

    _onFindElevator: function (event){
        this._oView.activateElevator(event.elevator, event.floor, event.current);
    },

    _onArriveFloor: function(event){
        console.log(event);
        this._oCollection.setActive({elevatorNum: event.elevator});
    }

};




