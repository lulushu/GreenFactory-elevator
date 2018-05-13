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
        var reversedData;
        for (var elevator in data) {
            reversedData = $("#" + elevator).find(".floor").get().reverse();
            $(reversedData).eq(data[elevator] - 1).addClass("elevator");
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

    activateElevator: function (elevatorNum, targetFloor, currentFloor) {
        var distance = Math.abs((targetFloor - currentFloor));
        if (targetFloor > currentFloor) {
            this.setIntervalX(currentFloor, distance, elevatorNum)
        } else if (targetFloor < currentFloor) {
            this.setIntervalY(currentFloor, distance, elevatorNum)
        }
    },

    setIntervalX: function (currentFloor, distance, elevatorNum) {
        var current = currentFloor;
        var repetitions = 0;
        var self = this;
        this._$elevatorElements[elevatorNum].find("[data-floor=" + current + "]").addClass("active");
        var intervalID = window.setInterval(function () {
            console.log("interval"); // todo 확인용 삭제해야함
            current++;
            self._$elevatorElements[elevatorNum].find("div").removeClass("elevator active");
            self._$elevatorElements[elevatorNum].find("[data-floor=" + current + "]").addClass("elevator active");
            if (++repetitions === distance) {
                window.clearInterval(intervalID);
                self._onArriveFloor(elevatorNum, current);
            }
        }, 1000);
    },

    setIntervalY: function (currentFloor, distance, elevatorNum) {
        var current = currentFloor;
        var repetitions = 0;
        var self = this;
        this._$elevatorElements[elevatorNum].find("[data-floor=" + current + "]").addClass("active");
        var intervalID = window.setInterval(function () { //todo interval 파악하기..
            console.log("interval"); // todo 확인용 삭제해야함
            current--;
            self._$elevatorElements[elevatorNum].find("div").removeClass("elevator active");
            self._$elevatorElements[elevatorNum].find("[data-floor=" + current + "]").addClass("elevator active");
            if (++repetitions === distance) {
                window.clearInterval(intervalID);
                self._onArriveFloor(elevatorNum, current);
            }
        }, 1000);
    },

    onTheSameFloor: function (targetFloor) {
        var self = this;
        setTimeout(function () {
            self._$buttonElements[targetFloor].removeClass("active");
        }, 0);
    },

    _onArriveFloor: function (elevatorNum, targetFloor) {
        $(this).trigger({type: "arrive" + elevatorNum, elevator: elevatorNum});
        this._$buttonElements[targetFloor].removeClass("active");
        this._$elevatorElements[elevatorNum].find("[data-floor=" + targetFloor + "]").removeClass("active");
    }
};
