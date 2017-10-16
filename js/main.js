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
      'title': 'PixelEditor.htm',
    });

    document.getElementById('dimensions').onclick = function(e){
        setup_dimensions();
    }
    document.getElementById('fill').onclick = fill;
    document.getElementById('grid-toggle').onclick = grid_toggle;
    document.getElementById('switch-button').onclick = switch_view;

    setup_dimensions(true);
}
