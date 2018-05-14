/**
 * Created by wonseok on 2018. 5. 9..
 */
function ElevatorView(ElevatorNumber, floorNumber) {
    this._elevatorNumber = ElevatorNumber;
    this._floorNumber = floorNumber;
    this._renderContent();
    this._init();
}

ElevatorView.prototype = {

    /**
     * 초기 elevator의 위치 그리는 method
     * @param data
     */
    renderElevator: function (data) {
        var reversedData;
        for (var elevatorNumber in data) {
            reversedData = this._$elevatorElements[elevatorNumber].find(".floor").get().reverse();
            $(reversedData).eq(data[elevatorNumber] - 1).addClass("elevator");
        }
    },

    /**
     * elevator 활성화
     * @param elevatorNum
     * @param targetFloor
     * @param currentFloor
     */
    activateElevator: function (elevatorNum, targetFloor, currentFloor) {
        var distance = (currentFloor - targetFloor);
        this._moveElevatorToTargetFloor(currentFloor, distance, elevatorNum)
    },

    /**
     * targetFloor의 button 비활성화
     * @param targetFloor
     */
    deactivateTargetButton: function (targetFloor) {
        var self = this;
        setTimeout(function () {
            self._$buttonElements[targetFloor].removeClass("active");
        }, 0);
    },

    /**
     * 버튼의 활성화 여부 return
     * @param targetFloor
     * @returns {*}
     */
    isButtonActivated: function (targetFloor) {
        return this._$buttonElements[targetFloor].hasClass("active");
    },

    /**
     * targetFloor의 버튼 활성화
     * @param targetFloor
     * @returns {boolean}
     */
    activateButton: function (targetFloor) {
        if (this._$buttonElements[targetFloor].hasClass("active")) {
            return false;
        }
        $(this).trigger({type: "clickButton", floor: targetFloor});
        this._$buttonElements[targetFloor].addClass("active");
    },

    /**
     * template render
     * @private
     */
    _renderContent: function () {
        var template = {
            elevator: _.template($('#elevator-template').html())
        };
        $(".content").html(template.elevator({floorLength: this._floorNumber, elevatorNumber: this._elevatorNumber}));
    },

    /**
     * 초기화
     * @private
     */
    _init: function () {
        this._assignElement();
        this._cacheEventHandlers();
        this._assignEvent();
    },

    /**
     * element 캐싱
     * @private
     */
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

    /**
     * eventHandler 캐싱
     * @private
     */
    _cacheEventHandlers: function () {
        this._eventHandlers = {};
        this._eventHandlers._onClickButton = $.proxy(this._onClickButton, this);
    },

    /**
     * event assign
     * @private
     */
    _assignEvent: function () {
        this._$button.on("click", this._eventHandlers._onClickButton);
    },

    /**
     * button 클릭시 실행
     * @param event
     * @private
     */
    _onClickButton: function (event) {
        var $eventTarget = $(event.target);
        if ($eventTarget.hasClass("active")) {
            return;
        }
        var floorNumber = $eventTarget.data("btn");
        $(this).trigger({type: "clickButton", floor: floorNumber});
        $eventTarget.addClass("active");
    },

    /**
     * elevator를 움직이는 method
     * @param currentFloor
     * @param distance
     * @param elevatorNum
     * @private
     */
    _moveElevatorToTargetFloor: function (currentFloor, distance, elevatorNum) {
        var current = currentFloor;
        var absoluteDistance = Math.abs(distance);
        var repetitions = 0;
        var criterion = distance > 0 ? -1 : 1;
        var self = this;
        this._$elevatorElements[elevatorNum].find("[data-floor=" + current + "]").addClass("active");
        var intervalID = setInterval(function () {
            current += criterion;
            self._$elevatorElements[elevatorNum].find("div").removeClass("elevator active");
            self._$elevatorElements[elevatorNum].find("[data-floor=" + current + "]").addClass("elevator active");
            if (++repetitions === absoluteDistance) {
                clearInterval(intervalID);
                self._onArriveToTargetFloor(elevatorNum, current);
            }
        }, 1000);
    },

    /**
     * elevator가 targetFloor로 도착시 알림
     * @param elevatorNum
     * @param targetFloor
     * @private
     */
    _onArriveToTargetFloor: function (elevatorNum, targetFloor) {
        $(this).trigger({type: "arrive" + elevatorNum, elevator: elevatorNum});
        this._$buttonElements[targetFloor].removeClass("active");
        this._$elevatorElements[elevatorNum].find("[data-floor=" + targetFloor + "]").removeClass("active");
    }
};
