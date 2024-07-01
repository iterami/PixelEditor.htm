'use strict';

function fill(){
    const type = core_storage_data['mode'] === 2
      ? 'transparent'
      : core_elements['color'].value;

    if(!globalThis.confirm('Set every pixel to ' + type + '?')){
        return;
    }

    let loop_counter = pixelcount - 1;
    do{
        update_pixel(core_elements[loop_counter]);
    }while(loop_counter--);

    update_result();
}

function grid_toggle(){
    const border_width = core_elements[0].style.borderWidth !== '1px'
      ? '1px'
      : 0;

    let loop_counter = pixelcount - 1;
    do{
        core_elements[loop_counter].style.borderWidth = border_width;
    }while(loop_counter--);
}

function hexvalues(i){
    return '0123456789abcdef'.charAt(i);
}

function hover_pixel(pixel){
    core_elements['color-hover'].value = pixel.textContent === 'T'
      ? 'transparent'
      : rgb_to_hex(pixel.style.backgroundColor || 'rgb(0, 0, 0)');

    const width = Math.floor(core_storage_data['width']);
    core_elements['x'].textContent = core_digits_min({
      'number': width - pixel.id % width,
    });
    core_elements['y'].textContent = core_digits_min({
      'number': Math.floor(core_storage_data['height']) - Math.floor(pixel.id / width),
    });

    if(core_mouse['down-0']){
        update_pixel(
          pixel,
          true
        );
    }
}

function repo_init(){
    core_repo_init({
      'events': {
        'file-to-uri': {
          'onclick': function(){
              const files = core_elements['file'].files;
              if(files.length === 0){
                  return;
              }

              core_file({
                'file': files[0],
                'todo': function(event){
                    core_elements['uri'].value = event.target.result;
                },
              });
          },
        },
        'fill': {
          'onclick': fill,
        },
        'grid-remake': {
          'onclick': function(){
              if(!globalThis.confirm('Remake grid?')){
                  return;
              }

              core_storage_save();
              setup_dimensions();
          },
        },
        'grid-toggle': {
          'onclick': grid_toggle,
        },
        'uri-to-grid': {
          'onclick': function(){
              if(!globalThis.confirm('Set grid to URI?')){
                  return;
              }

              core_storage_save();
              uri_to_grid();
          },
        },
      },
      'globals': {
        'edited': false,
        'pixelcount': 0,
      },
      'info': '<textarea id=uri></textarea><br><canvas id=preview style="border:solid 10px #000"></canvas> <span id=uri-length></span><hr>'
        + '<input id=file type=file><button id=file-to-uri type=button>Convert File to URI</button><br>'
        + '<button id=grid-remake type=button>Remake Grid</button><button id=grid-toggle type=button>Toggle Borders</button><button id=uri-to-grid type=button>Set Grid to URI</button><br>'
        + '<input id=color type=color value=#ffffff><button id=fill type=button>Fill</button>'
        + ' <span id=x></span> <span id=y></span> <input class=mini id=color-hover readonly type=text>',
      'menu': true,
      'menu-block-events': false,
      'storage': {
        'height': 32,
        'mode': 0,
        'quality': 1,
        'size': 25,
        'type': 'image/png',
        'uri': '',
        'width': 32,
      },
      'storage-menu': '<table><tr><td><input class=mini id=height min=1 step=1 type=number><td>Height'
        + '<tr><td><select id=mode><option value=1>Color Picking<option value=0>Set Pixel Color<option value=2>Transparency</select><td>Mode'
        + '<tr><td><input class=mini id=quality max=1 min=0 step=any type=number><td>Quality'
        + '<tr><td><input class=mini id=size min=1 step=any type=number><td>px Size'
        + '<tr><td><input id=type type=text><td>Type'
        + '<tr><td><input class=mini id=width min=1 step=1 type=number><td>Width</table>',
      'title': 'PixelEditor.htm',
      'ui-elements': [
        'color',
        'color-hover',
        'edit',
        'file',
        'preview',
        'uri',
        'uri-length',
        'x',
        'y',
      ],
    });

    setup_dimensions();
    core_elements['edit'].style.userSelect = 'none';
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
    const width = Math.floor(core_storage_data['width']);
    pixelcount = Math.floor(core_storage_data['height']) * width;

    let loop_counter = pixelcount - 1;
    let output = '';
    do{
        output += '<button class=gridbutton id=' + loop_counter
          + ' onmousedown="update_pixel(this, true)" onmouseover="hover_pixel(this)" type=button></button>';

        if(loop_counter % width === 0){
            output += '<br>';
        }
    }while(loop_counter--);

    core_elements['edit'].innerHTML = output;
    core_elements['edit'].style.minWidth = (width * core_storage_data['size']) + 'px';

    for(const element in core_elements){
        if(!globalThis.isNaN(element)){
            delete core_elements[element];
        }
    }
    loop_counter = pixelcount - 1;
    do{
        core_elements[loop_counter] = document.getElementById(loop_counter);
        const style = core_elements[loop_counter].style;
        style.backgroundColor = '#000';
        style.borderColor = '#aaa';
        style.borderWidth = '1px';
        style.height = core_storage_data['size'] + 'px';
        style.margin = 0;
        style.width = core_storage_data['size'] + 'px';
    }while(loop_counter--);

    core_elements[0].style.borderWidth = '1px';

    uri_to_grid();
}

function update_pixel(pixel, result){
    edited = true;
    core_storage_save([
      'mode',
    ]);

    if(core_storage_data['mode'] === 1){
        core_elements['color'].value = rgb_to_hex(pixel.style.backgroundColor);

    }else if(core_storage_data['mode'] === 2){
        pixel.style.backgroundColor = '#000';
        pixel.textContent = 'T';
        core_elements['color-hover'].value = 'transparent';

    }else{
        pixel.style.backgroundColor = core_elements['color'].value;
        pixel.textContent = '';
        core_elements['color-hover'].value = rgb_to_hex(pixel.style.backgroundColor);
    }

    if(result === true){
        update_result();
    }

    core_mouse['down-0'] = true;
}

function update_result(){
    const height = Math.floor(core_storage_data['height']);
    const width = Math.floor(core_storage_data['width']);
    const canvas_element = core_elements['preview'];
    canvas_element.height = height;
    canvas_element.width = width;

    const canvas = canvas_element.getContext('2d');
    canvas.clearRect(
      0,
      0,
      canvas_element.width,
      canvas_element.height
    );

    if(!edited){
        return;
    }

    let loop_counter = pixelcount - 1;
    let row_counter = height;
    do{
        if(core_elements[loop_counter].textContent !== 'T'){
            canvas.fillStyle = core_elements[loop_counter].style.backgroundColor;

            canvas.fillRect(
              row_counter * width - loop_counter - 1,
              height - row_counter,
              1,
              1
            );

            canvas.fillStyle = '#000';
        }

        if(loop_counter % width === 0){
            row_counter -= 1;
        }
    }while(loop_counter--);

    const uri = core_uri({
      'element': canvas_element,
      'quality': core_storage_data['quality'],
      'type': core_storage_data['type'],
    });
    core_elements['uri'].value = uri;
    core_elements['uri-length'].innerHTML = uri.length;
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
          const canvas = core_elements['preview'].getContext('2d');
          const height = Math.floor(core_storage_data['height']);
          const width = Math.floor(core_storage_data['width']);

          canvas.clearRect(
            0,
            0,
            width,
            height
          );
          canvas.drawImage(
            core_images['uri'],
            0,
            0
          );
          delete core_images['uri'];

          let loop_counter = pixelcount - 1;
          let row_counter = height;
          do{
              const pixel = canvas.getImageData(
                row_counter * width - loop_counter - 1,
                height - row_counter,
                1,
                1
              );
              if(pixel['data'][3] > 0){
                  core_elements[loop_counter].style.backgroundColor = '#'
                    + hexvalues((pixel['data'][0] - pixel['data'][0] % 16) / 16) + hexvalues(pixel['data'][0] % 16)
                    + hexvalues((pixel['data'][1] - pixel['data'][1] % 16) / 16) + hexvalues(pixel['data'][1] % 16)
                    + hexvalues((pixel['data'][2] - pixel['data'][2] % 16) / 16) + hexvalues(pixel['data'][2] % 16);
                  core_elements[loop_counter].textContent = '';

              }else{
                  core_elements[loop_counter].textContent = 'T';
              }

              if(loop_counter % width === 0){
                  row_counter -= 1;
              }
          }while(loop_counter--);

          update_result();
      },
    });
}
