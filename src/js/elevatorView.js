function ElevatorView(ElevatorNumber, floorNumber) {
    this._elevatorNumber = ElevatorNumber;
    this._floorNumber = floorNumber;
    this._renderContent();
    this._init();
}

ElevatorView.prototype = {
    _renderContent: function () {
        var template = {
            elevator: _.template($('#elevator-template').html())
        };

        $(".content").html(template.elevator({floorLength: this._floorNumber, elevatorNumber: this._elevatorNumber}));

    },

    renderElevator: function (data) {
        for (elevator in data) {
            $($("#" + elevator).find(".floor").get().reverse()).eq(data[elevator] - 1).addClass("elevator")
        }
    },

    _init: function () {
        console.log(this);
        this._assignElement();
        this._cacheEventHandlers();
        this._assignEvent();
    },

    _assignElement: function () {
        this._$button = $("[data-elevator-btn]");
        this._$elevatorWrapper = $("[data-elevator-wrapper]");
    },

    _cacheEventHandlers: function () {
        this._eventHandlers = {};
        this._eventHandlers._onClickButton = $.proxy(this._onClickButton, this);
    },

    _assignEvent: function () {
        this._$button.on("click", this._eventHandlers._onClickButton);
    },

    _onClickButton: function (event) {
        var id = $(event.target).data("floor");
        $(this).trigger({type: "clickButton", floor: id});
        $(event.target).addClass("active");
    },

    activateElevator: function (elevatorNum, targetFloor, currentFloor) {


        if (targetFloor > currentFloor) {

            this.setIntervalX(currentFloor, Math.abs((targetFloor - currentFloor)), elevatorNum)
        } else if (targetFloor < currentFloor) {

            this.setIntervalY(currentFloor, Math.abs((targetFloor - currentFloor)), elevatorNum)
        }


        // $("[data-elevator="+elevatorNum+"]").find("div").removeClass("elevator");
        // $("[data-elevator="+elevatorNum+"]").find("[data-floor="+targetFloor+"]").addClass("elevator");
        console.log("target", elevatorNum);
    },

    setIntervalX: function (currentFloor, repetitions, elevatorNum) {
        console.log(currentFloor, repetitions, elevatorNum);
        var current = currentFloor;
        var x = 0;
        var intervalID = window.setInterval(function () {
            current++;
            $("[data-elevator=" + elevatorNum + "]").find("div").removeClass("elevator");
            $("[data-elevator=" + elevatorNum + "]").find("[data-floor=" + current + "]").addClass("elevator");

            if (++x === repetitions) {

                window.clearInterval(intervalID);
            }
        }, 1000);
    },




    // onArriveElevator: function(){
    //
    // },
    //
    // _deActiveButton: function(){
    //
    // }
};
