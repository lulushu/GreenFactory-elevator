function ElevatorView(ElevatorNumber, floorNumber) {
    this._elevatorNumber = ElevatorNumber;
    this._floorNumber = floorNumber;
    this._renderContent();
    this._init();
}

ElevatorView.prototype = {

    renderElevator: function (data) {
        var reversedData;
        for (var elevatorNumber in data) {
            reversedData = this._$elevatorElements[elevatorNumber].find(".floor").get().reverse();
            $(reversedData).eq(data[elevatorNumber] - 1).addClass("elevator");
        }
    },

    activateElevator: function (elevatorNum, targetFloor, currentFloor) {
        var distance = (currentFloor - targetFloor);
        this._moveElevator(currentFloor, distance, elevatorNum)
    },

    onTheSameFloor: function (targetFloor) {
        var self = this;
        setTimeout(function () {
            self._$buttonElements[targetFloor].removeClass("active");
        }, 0);
    },

    isButtonActivated: function (targetFloor) {
        return this._$buttonElements[targetFloor].hasClass("active");
    },

    activateButton: function (targetFloor) {
        if (this._$buttonElements[targetFloor].hasClass("active")) {
            return false;
        }
        $(this).trigger({type: "clickButton", floor: targetFloor});
        this._$buttonElements[targetFloor].addClass("active");
    },

    _renderContent: function () {
        var template = {
            elevator: _.template($('#elevator-template').html())
        };
        $(".content").html(template.elevator({floorLength: this._floorNumber, elevatorNumber: this._elevatorNumber}));
    },

    _init: function () {
        this._assignElement();
        this._cacheEventHandlers();
        this._assignEvent();
    },

    _assignElement: function () {
        this._$button = $("[data-elevator-btn]");
        this._$elevatorWrapper = $("[data-elevator-wrapper]");
        this._$buttonWrapper = $("[data-btn-wrapper]");
        this._$elevatorElements = {};
        this._$buttonElements = {};
        for (var i = 1; i <= this._elevatorNumber; i++) {
            this._$elevatorElements[i] = this._$elevatorWrapper.find("#elevator" + i);
        }
        for (var j = 1; j <= this._floorNumber; j++) {
            this._$buttonElements[j] = this._$buttonWrapper.find("[data-btn=" + j + "]");
        }
    },

    _cacheEventHandlers: function () {
        this._eventHandlers = {};
        this._eventHandlers._onClickButton = $.proxy(this._onClickButton, this);
    },

    _assignEvent: function () {
        this._$button.on("click", this._eventHandlers._onClickButton);
    },

    _onClickButton: function (event) {
        var $eventTarget = $(event.target);
        if ($eventTarget.hasClass("active")) {
            return;
        }
        var floorNumber = $eventTarget.data("btn");
        $(this).trigger({type: "clickButton", floor: floorNumber});
        $eventTarget.addClass("active");
    },

    _moveElevator: function (currentFloor, distance, elevatorNum) {
        var current = currentFloor;
        var absoluteDistance = Math.abs(distance);
        var repetitions = 0;
        var criterion = distance > 0 ? -1 : 1;
        var self = this;
        this._$elevatorElements[elevatorNum].find("[data-floor=" + current + "]").addClass("active");
        var intervalID = window.setInterval(function () {
            console.log("interval"); // todo 확인용 삭제해야함
            current += criterion;
            self._$elevatorElements[elevatorNum].find("div").removeClass("elevator active");
            self._$elevatorElements[elevatorNum].find("[data-floor=" + current + "]").addClass("elevator active");
            if (++repetitions === absoluteDistance) {
                window.clearInterval(intervalID);
                self._onArriveFloor(elevatorNum, current);
            }
        }, 1000);
    },

    _onArriveFloor: function (elevatorNum, targetFloor) {
        $(this).trigger({type: "arrive" + elevatorNum, elevator: elevatorNum});
        this._$buttonElements[targetFloor].removeClass("active");
        this._$elevatorElements[elevatorNum].find("[data-floor=" + targetFloor + "]").removeClass("active");
    }
};
