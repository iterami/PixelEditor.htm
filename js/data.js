'use strict';

function fill(){
    let type = core_storage_data['mode'] === 2
      ? 'transparent'
      : document.getElementById('color').value;

    if(!window.confirm('Set every pixel to ' + type + '?')){
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

function hexvalues(i){
    return '0123456789abcdef'.charAt(i);
}

function hover_pixel(pixel){
    document.getElementById('color-hover').value = pixel.value === 'T'
      ? 'transparent'
      : rgb_to_hex(pixel.style.backgroundColor || 'rgb(0, 0, 0)');

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

    if(core_mouse['down-0']){
        update_pixel(
          pixel,
          true
        );
    }
}

function rgb_to_hex(rgb){
    rgb = rgb.slice(4);

    let red = '0' + Number(rgb.substring(0, rgb.indexOf(','))).toString(16);
    rgb = rgb.substring(rgb.indexOf(',') + 2);
    let green = '0' + Number(rgb.substring(0, rgb.indexOf(','))).toString(16);
    rgb = rgb.substring(rgb.indexOf(',') + 2);
    let blue = '0' + Number(rgb.substring(0, rgb.indexOf(')'))).toString(16);

    return '#' + red.slice(-2) + green.slice(-2) + blue.slice(-2);
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
          + ' onmousedown="update_pixel(this, true)" onmouseover="hover_pixel(this)" type=button>';

        if(loop_counter % core_storage_data['grid-dimensions'] === 0){
            output += '<br>';
        }
    }while(loop_counter--);

    let element = document.getElementById('edit');
    element.innerHTML = output;
    element.style.minWidth = (core_storage_data['grid-dimensions'] * core_storage_data['size']) + 'px';

    // Add button CSS.
    loop_counter = pixelcount - 1;
    do{
        let element = document.getElementById(loop_counter);

        element.style.borderColor = '#aaa';
        element.style.borderWidth = '1px';
        element.style.height = core_storage_data['size'] + 'px';
        element.style.margin = 0;
        element.style.width = core_storage_data['size'] + 'px';
    }while(loop_counter--);

    // Set borderWidth of first button to use as grid toggle.
    document.getElementById(0).style.borderWidth = '1px';

    uri_to_grid();
}

function update_pixel(pixel, result){
    core_storage_save();

    // Color picking mode.
    if(core_storage_data['mode'] === 1){
        document.getElementById('color').value = rgb_to_hex(pixel.style.backgroundColor);

    // Transparency mode.
    }else if(core_storage_data['mode'] === 2){
        pixel.style.background = '#000';
        pixel.value = 'T';
        document.getElementById('color-hover').value = 'transparent';

    // Set pixel color mode.
    }else{
        pixel.style.background = document.getElementById('color').value;
        pixel.value = '';
        document.getElementById('color-hover').value = pixel.style.backgroundColor;
    }

    if(result === true){
        update_result();
    }

    core_mouse['down-0'] = true;
}

function update_result(){
    // Paint canvas pixels based on colors of divs.
    let canvas_element = document.getElementById('canvas');
    canvas_element.height = core_storage_data['grid-dimensions'];
    canvas_element.width = core_storage_data['grid-dimensions'];

    let canvas = canvas_element.getContext('2d');
    canvas.clearRect(
      0,
      0,
      canvas_element.width,
      canvas_element.height
    );

    let loop_counter = Math.pow(
      core_storage_data['grid-dimensions'],
      2
    ) - 1;
    let row_counter = core_storage_data['grid-dimensions'];
    do{
        let element = document.getElementById(loop_counter);

        // Only draw pixels that aren't transparent.
        if(element.value !== 'T'){
            canvas.fillStyle = element.style.backgroundColor;

            canvas.fillRect(
              row_counter * core_storage_data['grid-dimensions'] - loop_counter - 1,
              core_storage_data['grid-dimensions'] - row_counter,
              1,
              1
            );

            // Reset background color to black.
            canvas.fillStyle = '#000';
        }

        // Only grid-dimensions pixels per row.
        if(loop_counter % core_storage_data['grid-dimensions'] === 0){
            row_counter -= 1;
        }
    }while(loop_counter--);

    let uri = core_uri({
      'id': 'canvas',
      'quality': core_storage_data['quality'],
      'type': core_storage_data['type'],
    });
    document.getElementById('uri').value = uri;
    document.getElementById('uri-length').innerHTML = uri.length;
}

function uri_to_grid(){
    if(core_storage_data['uri'].length === 0){
        update_result();
        return;
    }

    core_image({
      'id': 'uri',
      'src': core_storage_data['uri'],
      'todo': function(){
          let canvas = document.getElementById('canvas').getContext('2d');

          canvas.clearRect(
            0,
            0,
            core_storage_data['grid-dimensions'],
            core_storage_data['grid-dimensions']
          );
          canvas.drawImage(
            core_images['uri'],
            0,
            0
          );

          delete core_images['uri'];

          let loop_counter = Math.pow(
            core_storage_data['grid-dimensions'],
            2
          ) - 1;
          let row_counter = core_storage_data['grid-dimensions'];
          do{
              let pixel = canvas.getImageData(
                row_counter * core_storage_data['grid-dimensions'] - loop_counter - 1,
                core_storage_data['grid-dimensions'] - row_counter,
                1,
                1
              );
              let element = document.getElementById(loop_counter);

              if(pixel['data'][3] > 0){
                  element.style.backgroundColor = '#'
                    + hexvalues((pixel['data'][0] - pixel['data'][0] % 16) / 16) + hexvalues(pixel['data'][0] % 16)
                    + hexvalues((pixel['data'][1] - pixel['data'][1] % 16) / 16) + hexvalues(pixel['data'][1] % 16)
                    + hexvalues((pixel['data'][2] - pixel['data'][2] % 16) / 16) + hexvalues(pixel['data'][2] % 16);
                  element.value = '';

              }else{
                  element.value = 'T';
              }

              // Only grid-dimensions pixels per row.
              if(loop_counter % core_storage_data['grid-dimensions'] === 0){
                  row_counter -= 1;
              }
          }while(loop_counter--);

          update_result();
      },
    });
}
