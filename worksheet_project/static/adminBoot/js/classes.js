$('document').ready(function(){
    $(".content-panel.pn").mouseenter(function(){
        $(this).animate({
            opacity: 1,
        },600);
        $(this).find(".profile-01").animate({
            backgroundColor: '#2f2f2f',
        },600);
        $(this).find(".profile-01 p").animate({
            color: '#ffffff',
        },600);
    });
    
    
    $(".content-panel.pn").mouseleave(function(){
        $(this).animate({
            opacity: 0.8,
        },100);
        $(this).find(".profile-01").animate({
            backgroundColor: '#68dff0',
        },100);
        $(this).find(".profile-01 p").animate({
            color: '#424a5d',
        },100);
    });
    
    $(function () {
        $('[data-toggle="popover"]').popover()
    })
    
    
    
    $("#change-className-form").ajaxForm({ 
            success:       function(responseText){
                console.log(responseText);
                if (responseText.error) {
                    alert(responseText.error);
                }else if (responseText.groupID) {
                    $('#class-settings').modal('hide');
                    location.reload();
                }
            },
            dataType:  'json',
            timeout:   4000 
        });
    
    
    $("#delete-class-form").ajaxForm({ 
            success:       function(responseText){
                console.log(responseText);
                if (responseText.error) {
                    alert(responseText.error);
                }else if (responseText.classID) {
                    window.location.href = "/dashboard/";
                }
            },
            dataType:  'json',
            timeout:   4000 
        });
    
    
    
    $("#toggle-lock-form").ajaxForm({ 
            success:       function(responseText){
                //console.log(responseText);
                if (responseText.error) {
                    alert(responseText.error);
                }else {
                    var text;
                    //console.log(responseText.allowJoin);
                    if (responseText.allowJoin==false){
                        text = "<i class='fa fa-unlock'></i>  unlock"
                    }else{
                        text = "<i class='fa fa-lock'></i>  lock"
                    };
                    $("#toggle-lock-form button").toggleClass("btn-success")
                        .toggleClass("btn-danger")
                        .html(text);
                }
            },
            dataType:  'json',
            timeout:   4000 
        });
    
    
    
    
    
    
    
    
});