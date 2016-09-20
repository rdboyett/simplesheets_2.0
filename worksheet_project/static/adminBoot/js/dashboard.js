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
    

});