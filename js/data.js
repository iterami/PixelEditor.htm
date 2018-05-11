'use strict';

function fill(){
    if(!window.confirm('Set every pixel to ' + document.getElementById('color').value + '?')){
        return;
    }

    var loop_counter = pixelcount - 1;
    do{
        update_pixel(document.getElementById(loop_counter));
    }while(loop_counter--);
}

function grid_toggle(){
    // If buttons don't currently have borders, add borders.
    var border_width = document.getElementById(0).style.borderWidth != '1px'
      ? '1px'
      : 0;

    var loop_counter = pixelcount - 1;
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

    var x = dimensions - pixel.id % dimensions;
    if(x < 10){
        x = '0' + x;
    }
    document.getElementById('x').innerHTML = x;

    var y = dimensions - Math.floor(pixel.id / dimensions);
    if(y < 10){
        y = '0' + y;
    }
    document.getElementById('y').innerHTML = y;
}

function setup_dimensions(skip){
    var element = document.getElementById('dimensions');
    var dimensions = element.value;

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

    element.value = dimensions;
    pixelcount = Math.pow(dimensions, 2);

    // Create pixel divs.
    var loop_counter = pixelcount - 1;
    var output = '';
    do{
        output += '<input class=gridbutton id=' + loop_counter
          + ' onclick="update_pixel(this)" onmouseover="hover_pixel(this)" style="border-color:#aaa;border-width:1px;margin:0" type=button>';

        if(loop_counter % dimensions === 0){
            output += '<br>';
        }
    }while(loop_counter--);

    element = document.getElementById('edit');
    element.innerHTML = output;
    element.style.minWidth = (dimensions * 22) + 'px';

    // Set borderWidth of first button to use as grid toggle.
    document.getElementById(0).style.borderWidth = '1px';

    warn_beforeunload = false;
}

function switch_view(){
    view = !view;
    var element = document.getElementById('canvas');

    if(view){
        var dimensions = parseInt(
          document.getElementById('dimensions').value,
          10
        );

        // Paint canvas pixels based on colors of divs.
        element.height = dimensions;
        element.width = dimensions;

        var canvas = element.getContext('2d');
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

    element.style.display = view
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
    document.getElementById('color-hover').value = pixel.style.backgroundColor;
}
