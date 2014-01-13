function fill(){
    if(confirm('Set every pixel to selected color?')){
        i = 624;
        do{
            get(i).style.backgroundColor = get('color').value;
        }while(i--);

        // set view to edit mode
        view = 1;
        switch_view();
    }
}

function get(i){
    return document.getElementById(i);
}

function grid_toggle(){
    i = 624;

    // enable grid if buttons don't have borders, else disable grid
    if(get(0).style.borderWidth != '1px'){
        do{
            get(i).style.borderWidth = '1px';
        }while(i--);

    }else{
        do{
            get(i).style.borderWidth = 0;
        }while(i--);
    }
}

function make_png(){
    window.open(get('canvas').toDataURL('image/png'));
}

function switch_view(){
    view = !view;

    if(view){// preview mode
        // paint canvas pixels based on colors of divs
        get('canvas').height = 25;
        get('canvas').width = 25;
        j = 25;
        i = 624;
        x = get('canvas').getContext('2d');
        do{
            x.fillStyle = get(i).style.background;
            x.fillRect(
                j * 25 - i - 1,
                25 - j,
                1,
                1
            );
            x.fillStyle = '#000';
            if(i % 25 === 0){
                j -= 1;
            }
        }while(i--);
    }

    get('switch-button').value = view ? 'Edit' : 'Preview';
    get('edit-div').style.display = view ? 'none' : 'inline';
    get('preview-div').style.display = view ? 'inline' : 'none';
}

var i = 624;
var j = '';
var view = 0;
var warn_onbeforeunload = 0;
var x = 0;

// create pixel divs
do{
    j += '<div class="pixel' + (i % 25 - 12 === 0 || (i > 299 && i < 325) ? ' pixel-grid' : '') + '" id=' + i
       + ' onclick="warn_onbeforeunload=1;this.style.background=get(\'color\').value" ondragstart="return false"></div>';
    if(i % 25 === 0){
        j += '<br>';
    }
}while(i--);

get('edit-div').innerHTML = j;

// set borderWidth of first button to use as grid toggle
get(0).style.borderWidth = '1px';

j = 0;

window.onbeforeunload = function(){
    if(warn_onbeforeunload){// if any pixels have been changed
        return 'Save feature not yet implemented.';
    }
}
