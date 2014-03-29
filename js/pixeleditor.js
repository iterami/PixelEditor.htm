function fill(){
    if(confirm('Set every pixel to selected color?')){
        i = 624;
        do{
            document.getElementById(i).style.backgroundColor = document.getElementById('color').value;
        }while(i--);

        // set view to edit mode to prevent errors
        view = 1;
        switch_view();
    }
}

function grid_toggle(){
    i = 624;

    // enable grid if buttons don't have borders, else disable grid
    if(document.getElementById(0).style.borderWidth != '1px'){
        do{
            document.getElementById(i).style.borderWidth = '1px';
        }while(i--);

    }else{
        do{
            document.getElementById(i).style.borderWidth = 0;
        }while(i--);
    }
}

function make_png(){
    window.open(document.getElementById('canvas').toDataURL('image/png'));
}

function switch_view(){
    view = !view;

    // preview mode
    if(view){
        // paint canvas pixels based on colors of divs
        document.getElementById('canvas').height = 25;
        document.getElementById('canvas').width = 25;

        j = 25;
        i = 624;
        x = document.getElementById('canvas').getContext('2d');
        do{
            // draw each pixel on the canvas based on div background colors
            x.fillStyle = document.getElementById(i).style.background;
            x.fillRect(
              j * 25 - i - 1,
              25 - j,
              1,
              1
            );

            // reset background color to black
            x.fillStyle = '#000';

            // only 25 pixels per row
            if(i % 25 === 0){
                j -= 1;
            }
        }while(i--);
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

var i = 624;
var j = '';
var view = 0;
var warn_onbeforeunload = 0;
var x = 0;

// create pixel divs
do{
    j += '<div class="pixel' + (i % 25 - 12 === 0 || (i > 299 && i < 325)
        ? ' pixel-grid'
        : '')
      + '" id=' + i
      + ' onclick="warn_onbeforeunload=1;this.style.background=document.getElementById(\'color\').value"'
      + ' ondragstart="return false"></div>';
    if(i % 25 === 0){
        j += '<br>';
    }
}while(i--);

document.getElementById('edit-div').innerHTML = j;

// set borderWidth of first button to use as grid toggle
document.getElementById(0).style.borderWidth = '1px';

j = 0;

window.onbeforeunload = function(){
    // ask for permission to close if any pixels have been changed
    if(warn_onbeforeunload){
        return 'Save feature not yet implemented.';
    }
}
