function fill(){
    if(!confirm('Set every pixel to selected color?')){
        return;
    }

    var loop_counter = 624;
    do{
        update_pixel(document.getElementById(loop_counter));
    }while(loop_counter--);
}

function grid_toggle(){
    var border_width = 0;
    var loop_counter = 624;

    // If buttons don't currently have borders, add borders.
    if(document.getElementById(0).style.borderWidth != '1px'){
        border_width = '1px';
    }

    do{
        document.getElementById(loop_counter).style.borderWidth = border_width;
    }while(loop_counter--);
}

function init(){
    // Create pixel divs.
    var output = '';
    var loop_counter = 624;
    do{
        output += '<div class="pixel'
          + (loop_counter % 25 - 12 === 0 || (loop_counter > 299 && loop_counter < 325)
            ? ' pixel-grid'
            : ''
          )
          + '" id=' + loop_counter
          + ' onclick="update_pixel(this)"></div>';

        if(loop_counter % 25 === 0){
            output += '<br>';
        }
    }while(loop_counter--);

    document.getElementById('edit').innerHTML = output;

    // Set borderWidth of first button to use as grid toggle.
    document.getElementById(0).style.borderWidth = '1px';
}

function switch_view(){
    view = !view;

    if(view){
        // Paint canvas pixels based on colors of divs.
        document.getElementById('canvas').height = 25;
        document.getElementById('canvas').width = 25;

        var canvas = document.getElementById('canvas').getContext('2d');
        var loop_counter = 624;
        var row_counter = 25;
        do{
            // Draw each pixel on the canvas based on div background colors.
            canvas.fillStyle = document.getElementById(loop_counter).style.background;
            canvas.fillRect(
              row_counter * 25 - loop_counter - 1,
              25 - row_counter,
              1,
              1
            );

            // Reset background color to black.
            canvas.fillStyle = '#000';

            // Only 25 pixels per row.
            if(loop_counter % 25 === 0){
                row_counter -= 1;
            }
        }while(loop_counter--);
    }

    document.getElementById('canvas').style.display = view
      ? 'block'
      : 'none';
    document.getElementById('controls').style.display = view
      ? 'none'
      : 'inline-block';
    document.getElementById('edit').style.display = view
      ? 'none'
      : 'block';
    document.getElementById('switch-button').value = view
      ? 'Edit'
      : 'View';
}

function update_pixel(pixel){
    warn_onbeforeunload = true;

    pixel.style.background = document.getElementById('color').value;
}

var view = 0;
var warn_onbeforeunload = false;

window.onbeforeunload = function(){
    // Ask for permission to close if any pixels have been changed.
    if(warn_onbeforeunload){
        return 'Save feature not yet implemented.';
    }
};

window.onload = init;
