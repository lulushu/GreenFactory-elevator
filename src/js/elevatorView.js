function ElevatorView (ElevatorNumber, floorNumber){
    this._elevatorNumber = ElevatorNumber;
    this._floorNumber = floorNumber;
    this._renderContent();
    this._init();
}

ElevatorView.prototype = {
    _renderContent: function(){
        var template ={
            elevator: _.template($('#elevator-template').html())
        };

        $(".content").html(template.elevator({floorLength: this._floorNumber, elevatorNumber: this._elevatorNumber}));

    },

    renderElevator: function (data) {
        for(elevator in data){
            $($("#"+elevator).find(".floor").get().reverse()).eq(data[elevator]-1).addClass("elevator")
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
        var id =$(event.target).attr("id");
        $(this).trigger({type: "clickButton", floor: id});
        $(event.target).addClass("active");
    }
};
