'use strict';

function repo_init(){
    core_repo_init({
      'beforeunload': {
        'todo': function(){
            // Ask for permission to close if any pixels have been changed.
            if(warn_beforeunload){
                return 'Save feature not yet implemented.';
            }
        },
      },
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
      },
      'globals': {
        'pixelcount': 0,
        'view': false,
        'warn_beforeunload': false,
      },
      'info': '<textarea id=uri></textarea><br><canvas id=canvas></canvas>'
        + '<hr><input id=grid-remake type=button value="Remake Grid"><input id=grid-toggle type=button value="Toggle Grid"><br>'
        + '<input id=color type=color value=#ffffff><input id=fill type=button value=Fill>'
        + ' <span id=x></span> <span id=y></span> <input id=color-hover readonly>',
      'menu': true,
      'storage': {
        'grid-dimensions': 32,
      },
      'storage-menu': '<table><tr><td><input id=grid-dimensions><td>Grid Dimensions</table>',
      'title': 'PixelEditor.htm',
    });

    setup_dimensions();
    document.getElementById('edit').style.userSelect = 'none';
}
