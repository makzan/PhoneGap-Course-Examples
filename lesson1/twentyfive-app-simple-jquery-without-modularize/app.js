var counter = 60 * 25;

$('#timer').html('25:00');

function tick(){
  counter -= 1; // the real counting down.

  if (counter < 0)
  {
    counter = 0; // dont forget to set the boundary.
  }

  // the minute
  var minute = Math.floor( counter / 60 );
  if (minute < 10) minute = '0' + minute;

  // the second
  var second = counter % 60;
  if (second < 10) second = '0' + second;

  // display it, finally.
  $('#timer').html(minute + ":" + second);
}

setInterval(tick, 1000);

$('#reset').click( function(e){
  counter = 60 * 25;
  $('#timer').html('25:00');
});
