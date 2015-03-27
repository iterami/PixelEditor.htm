function fill(){
    if(!confirm('Set every pixel to selected color?')){
        return;
    }

    var loop_counter = Math.pow(parseInt(document.getElementById('dimensions').value), 2) - 1;
    do{
        update_pixel(document.getElementById(loop_counter));
    }while(loop_counter--);
}

function grid_toggle(){
    var border_width = 0;
    var loop_counter = Math.pow(parseInt(document.getElementById('dimensions').value), 2) - 1;

    // If buttons don't currently have borders, add borders.
    if(document.getElementById(0).style.borderWidth != '1px'){
        border_width = '1px';
    }

    do{
        document.getElementById(loop_counter).style.borderWidth = border_width;
    }while(loop_counter--);
}

function setup_dimensions(skip){
    var dimensions = document.getElementById('dimensions').value;

    if(!skip){
        dimensions = parseInt(window.prompt('Enter number of pixels on one side:', dimensions) || dimensions);
    }

    document.getElementById('dimensions').value = dimensions;

    // Create pixel divs.
    var dimensions_half = Math.floor(dimensions / 2);
    var dimensions_squared = Math.pow(dimensions, 2);
    var loop_counter = Math.pow(dimensions, 2) - 1;
    var output = '';
    do{
        output += '<div class="pixel'
          + (loop_counter % dimensions - dimensions_half === 0 || (loop_counter > dimensions_squared / 2 - dimensions_half - 1 && loop_counter < dimensions_squared / 2 + dimensions_half)
            ? ' pixel-grid'
            : ''
          )
          + '" id=' + loop_counter
          + ' onclick="update_pixel(this)"></div>';

        if(loop_counter % dimensions === 0){
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
        var dimensions = parseInt(document.getElementById('dimensions').value);

        // Paint canvas pixels based on colors of divs.
        document.getElementById('canvas').height = dimensions;
        document.getElementById('canvas').width = dimensions;

        var canvas = document.getElementById('canvas').getContext('2d');
        var loop_counter = Math.pow(dimensions, 2) - 1;
        var row_counter = parseInt(document.getElementById('dimensions').value);
        do{
            // Draw each pixel on the canvas based on div background colors.
            canvas.fillStyle = document.getElementById(loop_counter).style.background;
            canvas.fillRect(
              row_counter * dimensions - loop_counter - 1,
              dimensions - row_counter,
              1,
              1
            );

            // Reset background color to black.
            canvas.fillStyle = '#000';

            // Only dimensions pixels per row.
            if(loop_counter % dimensions === 0){
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

window.onload = function(){
    setup_dimensions(true);
};
