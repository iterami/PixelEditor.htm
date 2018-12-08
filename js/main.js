'use strict';

function repo_init(){
    core_repo_init({
      'events': {
        'fill': {
          'onclick': fill,
        },
        'grid-remake': {
          'onclick': function(){
              if(!window.confirm('Remake grid?')){
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
              if(!window.confirm('Set grid to URI?')){
                  return;
              }

              uri_to_grid();
          },
        },
      },
      'globals': {
        'pixelcount': 0,
        'view': false,
      },
      'info': '<textarea id=uri></textarea><br><canvas id=canvas></canvas> <span id=uri-length></span><hr>'
        + '<input id=grid-remake type=button value="Remake Grid"><input id=grid-toggle type=button value="Toggle Borders"><input id=uri-to-grid type=button value="Set Grid to URI"><br>'
        + '<input id=color type=color value=#ffffff><input id=fill type=button value=Fill>'
        + ' <span id=x></span> <span id=y></span> <input id=color-hover readonly>',
      'menu': true,
      'menu-block-events': false,
      'storage': {
        'grid-dimensions': 32,
        'size': 25,
        'uri': '',
      },
      'storage-menu': '<table><tr><td><input id=grid-dimensions><td>Grid Dimensions'
        + '<tr><td><input id=size><td>Size</table>',
      'title': 'PixelEditor.htm',
    });

    setup_dimensions();
    document.getElementById('edit').style.userSelect = 'none';
}
