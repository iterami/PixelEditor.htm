'use strict';

function fill(){
    if(!window.confirm('Set every pixel to selected color?')){
        return;
    }

    var loop_counter = Math.pow(parseInt(document.getElementById('dimensions').value, 10), 2) - 1;
    do{
        update_pixel(document.getElementById(loop_counter));
    }while(loop_counter--);
}

function grid_toggle(){
    // If buttons don't currently have borders, add borders.
    var border_width = document.getElementById(0).style.borderWidth != '1px'
      ? '1px'
      : 0;

    var loop_counter = Math.pow(parseInt(document.getElementById('dimensions').value, 10), 2) - 1;
    do{
        document.getElementById(loop_counter).style.borderWidth = border_width;
    }while(loop_counter--);
}

function hover_pixel(pixel){
    var dimensions = parseInt(
      document.getElementById('dimensions').value,
      10
    );

    document.getElementById('color-hover').value = pixel.style.backgroundColor || 'rgb(0, 0, 0)';
    document.getElementById('x').value = dimensions - pixel.id % dimensions;
    document.getElementById('y').value = dimensions - Math.floor(pixel.id / dimensions);
}

function repo_init(){
    core_repo_init({
      'title': 'PixelEditor.htm',
    });
    core_events_bind({
      'beforeunload': {
        'todo': function(){
            // Ask for permission to close if any pixels have been changed.
            if(warn_beforeunload){
                return 'Save feature not yet implemented.';
            }
        },
      },
    });

    document.getElementById('dimensions').onclick = function(e){
        setup_dimensions();
    }
    document.getElementById('fill').onclick = fill;
    document.getElementById('grid-toggle').onclick = grid_toggle;
    document.getElementById('switch-button').onclick = switch_view;

    setup_dimensions(true);
}

function setup_dimensions(skip){
    var dimensions = document.getElementById('dimensions').value;

    if(!skip){
        dimensions = window.prompt(
          'Enter number of pixels on one side:',
          dimensions
        );

        if(dimensions == null){
            return;
        }

        dimensions = parseInt(
          dimensions,
          10
        );
    }

    document.getElementById('dimensions').value = dimensions;

    // Create pixel divs.
    var loop_counter = Math.pow(dimensions, 2) - 1;
    var output = '';
    do{
        output += '<input class=gridbutton id=' + loop_counter
          + ' onclick="update_pixel(this)" onmouseover="hover_pixel(this)" style="border-color:#aaa;border-width:1px;margin:0" type=button>';

        if(loop_counter % dimensions === 0){
            output += '<br>';
        }
    }while(loop_counter--);

    document.getElementById('edit').innerHTML = output;
    document.getElementById('edit').style.minWidth = (dimensions * 22) + 'px';

    // Set borderWidth of first button to use as grid toggle.
    document.getElementById(0).style.borderWidth = '1px';

    warn_beforeunload = false;
}

function switch_view(){
    view = !view;

    if(view){
        var dimensions = parseInt(
          document.getElementById('dimensions').value,
          10
        );

        // Paint canvas pixels based on colors of divs.
        document.getElementById('canvas').height = dimensions;
        document.getElementById('canvas').width = dimensions;

        var canvas = document.getElementById('canvas').getContext('2d');
        var loop_counter = Math.pow(dimensions, 2) - 1;
        var row_counter = parseInt(
          document.getElementById('dimensions').value,
          10
        );
        do{
            // Draw each pixel on the canvas based on div background colors.
            canvas.fillStyle = document.getElementById(loop_counter).style.backgroundColor;
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
    warn_beforeunload = true;

    pixel.style.background = document.getElementById('color').value;
}

var view = 0;
var warn_beforeunload = false;
