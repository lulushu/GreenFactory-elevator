$(document).ready(function () {
    $("#render").on("click", function () {
        var elevatorNum = parseInt($("#_elevator").val());
        var floorNum = parseInt($("#_floor").val());
        var elevator = new ElevatorController(elevatorNum, floorNum);
    })
});