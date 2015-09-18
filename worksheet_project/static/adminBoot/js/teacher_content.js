$('document').ready(function(){
    
    
    $('#userSearch-form').ajaxForm({ 
        success:       function(responseText){
            console.log(responseText);
            $("#searchReturn").fadeOut(300, function(){
                $("#searchReturn").html(responseText).fadeIn(300);
            });
        },
	clearForm: true,
        resetForm: true,
        dataType:  'html',
        timeout:   4000 
    });
    
    
    
    
    
    
    
    
    
});