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
        'switch-button': {
          'onclick': switch_view,
        },
      },
      'globals': {
        'pixelcount': 0,
        'view': false,
        'warn_beforeunload': false,
      },
      'title': 'PixelEditor.htm',
    });

    setup_dimensions(true);
}
