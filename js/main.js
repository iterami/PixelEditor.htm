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
        'dimensions': {
          'onclick': function(){
              setup_dimensions();
          },
        },
        'fill': {
          'onclick': fill,
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
        + '<hr><input id=color type=color value=#ffffff><input id=fill type=button value=Fill><input id=grid-toggle type=button value=Grid><input id=dimensions type=button value=25>'
        + ' <span id=x></span> <span id=y></span> <input id=color-hover readonly>',
      'menu': true,
      'title': 'PixelEditor.htm',
    });

    setup_dimensions(true);
}
