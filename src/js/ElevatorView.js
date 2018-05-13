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
        for (var elevator in data) {
            $($("#" + elevator).find(".floor").get().reverse()).eq(data[elevator] - 1).addClass("elevator")
        }
    },

    _init: function () {
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
        if ($(event.target).hasClass("active")) {
            return;
        }
        var id = $(event.target).data("btn");
        $(this).trigger({type: "clickButton", floor: id});
        $(event.target).addClass("active");
    },

    activateElevator: function (elevatorNum, targetFloor, currentFloor) {
        if (targetFloor > currentFloor) {

            this.setIntervalX(currentFloor, targetFloor, elevatorNum)
        } else if (targetFloor < currentFloor) {

            this.setIntervalY(currentFloor, targetFloor, elevatorNum)
        }
    },

    setIntervalX: function (currentFloor, targetFloor, elevatorNum) {
        var current = currentFloor;
        var repetitions = Math.abs((targetFloor - currentFloor));
        var x = 0;
        var self = this;
        $("[data-elevator=" + elevatorNum + "]").find("[data-floor=" + current + "]").addClass("active");
        var intervalID = window.setInterval(function () {
            console.log("interval")
            current++;
            $("[data-elevator=" + elevatorNum + "]").find("div").removeClass("elevator").removeClass("active");
            $("[data-elevator=" + elevatorNum + "]").find("[data-floor=" + current + "]").addClass("elevator").addClass("active");
            if (++x === repetitions) {

                window.clearInterval(intervalID);
                self._onArriveFloor(elevatorNum, current);
            }
        }, 1000);
    },

    setIntervalY: function (currentFloor, targetFloor, elevatorNum) {
        var repetitions = Math.abs((targetFloor - currentFloor));
        var current = currentFloor;
        var x = 0;
        var self = this;
        $("[data-elevator=" + elevatorNum + "]").find("[data-floor=" + current + "]").addClass("active");
        var intervalID = window.setInterval(function () {
            console.log("interval")
            current--;
            $("[data-elevator=" + elevatorNum + "]").find("div").removeClass("elevator").removeClass("active");
            $("[data-elevator=" + elevatorNum + "]").find("[data-floor=" + current + "]").addClass("elevator").addClass("active");
            if (++x === repetitions) {
                window.clearInterval(intervalID);
                self._onArriveFloor(elevatorNum, current);
            }
        }, 1000);
    },

    onTheSameFloor: function(targetFloor){
        setTimeout(function(){
            $("[data-btn=" + targetFloor + "]").removeClass("active");
        },0);
        // $("[data-btn=" + targetFloor + "]").removeClass("active");
    },

    _onArriveFloor: function (elevatorNum, targetFloor) {
        $(this).trigger({type: "arrive" + elevatorNum, elevator: elevatorNum});
        $("[data-btn=" + targetFloor + "]").removeClass("active");
        $("[data-elevator=" + elevatorNum + "]").find("[data-floor=" + targetFloor + "]").removeClass("active");
    }
};
