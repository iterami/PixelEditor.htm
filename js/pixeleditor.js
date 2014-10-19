function fill(){
    if(confirm('Set every pixel to selected color?')){
        var loop_counter = 624;
        do{
            update_pixel(document.getElementById(loop_counter));
        }while(loop_counter--);

        // set view to edit mode to prevent errors
        view = 1;
        switch_view();
    }
}

function grid_toggle(){
    var loop_counter = 624;

    // enable grid if buttons don't have borders, else disable grid
    if(document.getElementById(0).style.borderWidth != '1px'){
        do{
            document.getElementById(loop_counter).style.borderWidth = '1px';
        }while(loop_counter--);

    }else{
        do{
            document.getElementById(loop_counter).style.borderWidth = 0;
        }while(loop_counter--);
    }
}

function init(){
    // create pixel divs
    var output = '';
    var loop_counter = 624;
    do{
        output += '<div class="pixel'
          + (loop_counter % 25 - 12 === 0 || (loop_counter > 299 && loop_counter < 325)
            ? ' pixel-grid'
            : ''
          )
          + '" id=' + loop_counter
         + ' onclick="update_pixel(this)"'
          + ' ondragstart="return false"></div>';

        if(loop_counter % 25 === 0){
            output += '<br>';
        }
    }while(loop_counter--);

    document.getElementById('edit-div').innerHTML = output;

    // set borderWidth of first button to use as grid toggle
    document.getElementById(0).style.borderWidth = '1px';
}

function switch_view(){
    view = !view;

    // preview mode
    if(view){
        // paint canvas pixels based on colors of divs
        document.getElementById('canvas').height = 25;
        document.getElementById('canvas').width = 25;

        var canvas = document.getElementById('canvas').getContext('2d');
        var loop_counter = 624;
        var row_counter = 25;
        do{
            // draw each pixel on the canvas based on div background colors
            canvas.fillStyle = document.getElementById(loop_counter).style.background;
            canvas.fillRect(
              row_counter * 25 - loop_counter - 1,
              25 - row_counter,
              1,
              1
            );

            // reset background color to black
            canvas.fillStyle = '#000';

            // only 25 pixels per row
            if(loop_counter % 25 === 0){
                row_counter -= 1;
            }
        }while(loop_counter--);
    }

    document.getElementById('switch-button').value = view
      ? 'Edit'
      : 'Preview';
    document.getElementById('edit-div').style.display = view
      ? 'none'
      : 'inline';
    document.getElementById('preview-div').style.display = view
      ? 'inline'
      : 'none';
}

function update_pixel(pixel){
    warn_onbeforeunload = true;

    pixel.style.background = document.getElementById('color').value;
}

var view = 0;
var warn_onbeforeunload = false;

window.onbeforeunload = function(){
    // ask for permission to close if any pixels have been changed
    if(warn_onbeforeunload){
        return 'Save feature not yet implemented.';
    }
};

window.onload = init;
