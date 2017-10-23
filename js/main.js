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
      'globals': {
        'pixelcount': 0,
        'view': false,
        'warn_beforeunload': false,
      },
      'info-events': {
        'dimensions': {
          'todo': function(){
              setup_dimensions();
          },
        },
        'fill': {
          'todo': fill,
        },
        'grid-toggle': {
          'todo': grid_toggle,
        },
        'switch-button': {
          'todo': switch_view,
        },
      },
      'title': 'PixelEditor.htm',
    });

    setup_dimensions(true);
}
