function get(i){
    return document.getElementById(i)
}
function make_png(){
    window.open(get('canvas').toDataURL('image/png'))
}
function reset(){
    if(confirm('Reset pixels?')){
        warn_onbeforeunload = 0;

        i = 624;
        do{
            get(i).style.backgroundColor = '#000'
        }while(i--);

        view = 1;/*edit*/
        switch_view()
    }
}
function set_pixeldiv_color(i){
    warn_onbeforeunload = 1;

    j = 2;
    do{
        q = ['red','green','blue'][j];
        if(isNaN(get(q).value) || get(q).value<0 || get(q).value>255){
            get(q).value = 255
        }
    }while(j--);

    get(i).style.background = 'rgb('+parseInt(get('red').value)+','+parseInt(get('green').value)+','+parseInt(get('blue').value)+')'
}
function switch_view(){
    view = !view;

    if(view){/*preview*/
        /*paint canvas pixels based on colors of divs*/
        j = get('canvas').height = get('canvas').width = 25;
        x = get('canvas').getContext('2d');
        i = 624;
        do{
            x.fillStyle = get(i).style.background;
            x.fillRect(
                j*25-i-1,
                25-j,
                1,
                1
            );
            x.fillStyle = '#000';
            if(i%25===0){
                j -= 1
            }
        }while(i--)
    }

    get('switch-button').value = view ? 'Edit' : 'Preview';
    get('edit-div').style.display = view ? 'none' : 'inline';
    get('preview-div').style.display = view ? 'inline' : 'none'
}
var i = 624;
var j = '';
var q = 0;
var view = 0;
var warn_onbeforeunload = 0;
var x = 0;

/*create pixel divs*/
do{
    j += '<div class=pixel id='+i+' onclick=set_pixeldiv_color('+i+')></div>';
    if(i%25===0){
        j += '<br>'
    }
}while(i--);

get('edit-div').innerHTML = j;
j = 0;

window.onbeforeunload = function(){
    if(warn_onbeforeunload){/*if any pixels have been changed*/
        return'Save feature not yet implemented.'
    }
}
