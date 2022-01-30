'use strict';

function repo_init(){
    core_repo_init({
      'events': {
        'file-to-uri': {
          'onclick': function(){
              const files = document.getElementById('file').files;
              if(files.length === 0){
                  return;
              }

              core_file({
                'file': files[0],
                'todo': function(event){
                    document.getElementById('uri').value = event.target.result;
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
        'pixelcount': 0,
        'view': false,
      },
      'info': '<textarea id=uri></textarea><br><canvas id=canvas></canvas> <span id=uri-length></span><hr>'
        + '<input id=file type=file><input id=file-to-uri type=button value="Convert File to URI"><br>'
        + '<input id=grid-remake type=button value="Remake Grid"><input id=grid-toggle type=button value="Toggle Borders"><input id=uri-to-grid type=button value="Set Grid to URI"><br>'
        + '<input id=color type=color value=#ffffff><input id=fill type=button value=Fill>'
        + ' <span id=x></span> <span id=y></span> <input id=color-hover readonly>',
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
      'storage-menu': '<table><tr><td><input id=height min=1 type=number><td>Height'
        + '<tr><td><select id=mode><option value=1>Color Picking</option><option value=0>Set Pixel Color</option><option value=2>Transparency</option></select><td>Mode'
        + '<tr><td><input id=quality max=1 min=0 step=0.01 type=number><td>Quality'
        + '<tr><td><input id=size min=1 type=number><td>px Size'
        + '<tr><td><input id=type><td>Type'
        + '<tr><td><input id=width min=1 type=number><td>Width</table>',
      'title': 'PixelEditor.htm',
    });

    setup_dimensions();
    document.getElementById('edit').style.userSelect = 'none';
}
