'use strict';

function fill(){
    const type = core_storage_data['mode'] === 2
      ? 'transparent'
      : document.getElementById('color').value;

    if(!globalThis.confirm('Set every pixel to ' + type + '?')){
        return;
    }

    let loop_counter = pixelcount - 1;
    do{
        update_pixel(document.getElementById(loop_counter));
    }while(loop_counter--);

    update_result();
}

function grid_toggle(){
    const border_width = document.getElementById(0).style.borderWidth !== '1px'
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

    document.getElementById('x').textContent = core_digits_min({
      'number': core_storage_data['width'] - pixel.id % core_storage_data['width'],
    });
    document.getElementById('y').textContent = core_digits_min({
      'number': core_storage_data['height'] - Math.floor(pixel.id / core_storage_data['width']),
    });

    if(core_mouse['down-0']){
        update_pixel(
          pixel,
          true
        );
    }
}

function rgb_to_hex(rgb){
    rgb = rgb.slice(4);

    const red = '0' + Number(rgb.substring(0, rgb.indexOf(','))).toString(16);
    rgb = rgb.substring(rgb.indexOf(',') + 2);
    const green = '0' + Number(rgb.substring(0, rgb.indexOf(','))).toString(16);
    rgb = rgb.substring(rgb.indexOf(',') + 2);
    const blue = '0' + Number(rgb.substring(0, rgb.indexOf(')'))).toString(16);

    return '#' + red.slice(-2) + green.slice(-2) + blue.slice(-2);
}

function setup_dimensions(){
    pixelcount = core_storage_data['height'] * core_storage_data['width'];

    let loop_counter = pixelcount - 1;
    let output = '';
    do{
        output += '<input class=gridbutton id=' + loop_counter
          + ' onmousedown="update_pixel(this, true)" onmouseover="hover_pixel(this)" type=button>';

        if(loop_counter % core_storage_data['width'] === 0){
            output += '<br>';
        }
    }while(loop_counter--);

    const element = document.getElementById('edit');
    element.innerHTML = output;
    element.style.minWidth = (core_storage_data['width'] * core_storage_data['size']) + 'px';

    loop_counter = pixelcount - 1;
    do{
        const element = document.getElementById(loop_counter);

        element.style.borderColor = '#aaa';
        element.style.borderWidth = '1px';
        element.style.height = core_storage_data['size'] + 'px';
        element.style.margin = 0;
        element.style.width = core_storage_data['size'] + 'px';
    }while(loop_counter--);

    document.getElementById(0).style.borderWidth = '1px';

    uri_to_grid();
}

function update_pixel(pixel, result){
    core_storage_save();

    if(core_storage_data['mode'] === 1){
        document.getElementById('color').value = rgb_to_hex(pixel.style.backgroundColor);

    }else if(core_storage_data['mode'] === 2){
        pixel.style.background = '#000';
        pixel.value = 'T';
        document.getElementById('color-hover').value = 'transparent';

    }else{
        pixel.style.background = document.getElementById('color').value;
        pixel.value = '';
        document.getElementById('color-hover').value = rgb_to_hex(pixel.style.backgroundColor);
    }

    if(result === true){
        update_result();
    }

    core_mouse['down-0'] = true;
}

function update_result(){
    const canvas_element = document.getElementById('canvas');
    canvas_element.height = core_storage_data['height'];
    canvas_element.width = core_storage_data['width'];

    const canvas = canvas_element.getContext('2d');
    canvas.clearRect(
      0,
      0,
      canvas_element.width,
      canvas_element.height
    );

    let loop_counter = pixelcount - 1;
    let row_counter = core_storage_data['height'];
    do{
        const element = document.getElementById(loop_counter);

        if(element.value !== 'T'){
            canvas.fillStyle = element.style.backgroundColor;

            canvas.fillRect(
              row_counter * core_storage_data['width'] - loop_counter - 1,
              core_storage_data['height'] - row_counter,
              1,
              1
            );

            canvas.fillStyle = '#000';
        }

        if(loop_counter % core_storage_data['width'] === 0){
            row_counter -= 1;
        }
    }while(loop_counter--);

    const uri = core_uri({
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
          const canvas = document.getElementById('canvas').getContext('2d');

          canvas.clearRect(
            0,
            0,
            core_storage_data['width'],
            core_storage_data['height']
          );
          canvas.drawImage(
            core_images['uri'],
            0,
            0
          );

          Reflect.deleteProperty(
            core_images,
            'uri'
          );

          let loop_counter = pixelcount - 1;
          let row_counter = core_storage_data['height'];
          do{
              const pixel = canvas.getImageData(
                row_counter * core_storage_data['width'] - loop_counter - 1,
                core_storage_data['height'] - row_counter,
                1,
                1
              );
              const element = document.getElementById(loop_counter);

              if(pixel['data'][3] > 0){
                  element.style.backgroundColor = '#'
                    + hexvalues((pixel['data'][0] - pixel['data'][0] % 16) / 16) + hexvalues(pixel['data'][0] % 16)
                    + hexvalues((pixel['data'][1] - pixel['data'][1] % 16) / 16) + hexvalues(pixel['data'][1] % 16)
                    + hexvalues((pixel['data'][2] - pixel['data'][2] % 16) / 16) + hexvalues(pixel['data'][2] % 16);
                  element.value = '';

              }else{
                  element.value = 'T';
              }

              if(loop_counter % core_storage_data['width'] === 0){
                  row_counter -= 1;
              }
          }while(loop_counter--);

          update_result();
      },
    });
}
