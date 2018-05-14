var elevator = null;
$(document).ready(function () {
    $("#render").on("click", function () {
        var elevatorNum = parseInt($("#_elevator").val());
        var floorNum = parseInt($("#_floor").val());
        elevator = new ElevatorController(elevatorNum, floorNum);
    })
});


window.activateButton = function (i) {
    elevator.activateButton(i);
};

window.isButtonActivated = function (i) {
    return elevator.isButtonActivated(i);
};