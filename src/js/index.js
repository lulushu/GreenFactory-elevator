


var template ={
  elevator: _.template($('#elevator-template').html())
};


$(".inner").html(template.elevator({floorLength: 5, elevatorNumber: 4}));