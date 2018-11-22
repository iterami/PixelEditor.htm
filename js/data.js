'use strict';

function fill(){
    if(!window.confirm('Set every pixel to ' + document.getElementById('color').value + '?')){
        return;
    }

    let loop_counter = pixelcount - 1;
    do{
        update_pixel(document.getElementById(loop_counter));
    }while(loop_counter--);

    update_result();
}

function grid_toggle(){
    // If buttons don't currently have borders, add borders.
    let border_width = document.getElementById(0).style.borderWidth != '1px'
      ? '1px'
      : 0;

    let loop_counter = pixelcount - 1;
    do{
        document.getElementById(loop_counter).style.borderWidth = border_width;
    }while(loop_counter--);
}

function hover_pixel(pixel){
    document.getElementById('color-hover').value = pixel.style.backgroundColor || 'rgb(0, 0, 0)';

    let x = core_storage_data['grid-dimensions'] - pixel.id % core_storage_data['grid-dimensions'];
    if(x < 10){
        x = '0' + x;
    }
    document.getElementById('x').innerHTML = x;

    let y = core_storage_data['grid-dimensions'] - Math.floor(pixel.id / core_storage_data['grid-dimensions']);
    if(y < 10){
        y = '0' + y;
    }
    document.getElementById('y').innerHTML = y;
}

function setup_dimensions(){
    pixelcount = Math.pow(
      core_storage_data['grid-dimensions'],
      2
    );

    // Create pixel divs.
    let loop_counter = pixelcount - 1;
    let output = '';
    do{
        output += '<input class=gridbutton id=' + loop_counter
          + ' onclick="update_pixel(this, true)" onmouseover="hover_pixel(this)" style="border-color:#aaa;border-width:1px;margin:0" type=button>';

        if(loop_counter % core_storage_data['grid-dimensions'] === 0){
            output += '<br>';
        }
    }while(loop_counter--);

    let element = document.getElementById('edit');
    element.innerHTML = output;
    element.style.minWidth = (core_storage_data['grid-dimensions'] * 22) + 'px';

    // Set borderWidth of first button to use as grid toggle.
    document.getElementById(0).style.borderWidth = '1px';

    warn_beforeunload = false;

    update_result();
}

function update_pixel(pixel, result){
    warn_beforeunload = true;

    pixel.style.background = document.getElementById('color').value;
    document.getElementById('color-hover').value = pixel.style.backgroundColor;

    if(result === true){
        update_result();
    }
}

function update_result(){
    // Paint canvas pixels based on colors of divs.
    let canvas_element = document.getElementById('canvas');
    canvas_element.height = core_storage_data['grid-dimensions'];
    canvas_element.width = core_storage_data['grid-dimensions'];

    let canvas = canvas_element.getContext('2d');
    let loop_counter = Math.pow(
      core_storage_data['grid-dimensions'],
      2
    ) - 1;
    let row_counter = core_storage_data['grid-dimensions'];
    do{
        // Draw each pixel on the canvas based on div background colors.
        canvas.fillStyle = document.getElementById(loop_counter).style.backgroundColor;
        canvas.fillRect(
          row_counter * core_storage_data['grid-dimensions'] - loop_counter - 1,
          core_storage_data['grid-dimensions'] - row_counter,
          1,
          1
        );

        // Reset background color to black.
        canvas.fillStyle = '#000';

        // Only grid-dimensions pixels per row.
        if(loop_counter % core_storage_data['grid-dimensions'] === 0){
            row_counter -= 1;
        }
    }while(loop_counter--);

    document.getElementById('uri').innerHTML = core_uri({
      'id': 'canvas',
    });
}
