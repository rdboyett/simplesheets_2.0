$('document').ready(function(){
    
    
jQuery.validator.addMethod("noSpace", function(value, element) { 
     return value.indexOf(" ") < 0 && value != "";
  }, "Space are not allowed");
    
    
    /*
jQuery.validator.addMethod("checkUsername", function(value, element) {
    $.ajax({
        type: "POST",
        url: doesUsernameExistURL,
        data: {'username': value},
        success:  function(responseText){
            console.log(responseText.exists);
            if (responseText.error) {
                alert(responseText.error);
            }else{
                if (responseText.exists == 'true'){
                    return true;
                }else{return false;}
            }
        },
        dataType:  'json',
        timeout:   4000,
    }); 
  }, "already exists");
    
    */
    
    
    
    
    
    
$.validator.addMethod("noWhitespace",
   function(value) {
    var noWhitespaces = /^\w+$/;
    if (noWhitespaces.test(value)){
        return true
    }else{return false}
   },'no spaces');
    
    
    
    
    $("#reset-password-form").validate({
	    rules: {
		password1: {
		    required: true,
		    noWhitespace: true,
		},
		password2: {
		    required: true,
		    equalTo: "#password1"
		},
	    },
	    messages: {
		password2: {
		    required: "confirm",
		    equalTo: "same password as above"
		},
	    }
    });
    
    
    
    
    $("form").each(function(){
        $(this).validate();
    });
    
    
    $('#reset-password-form').ajaxForm({ 
        success:       function(responseText){
            if (responseText.error) {
                alert(responseText.error);
            }else{
		window.location.href = "/google/login/";
            }
        },
        dataType:  'json',
        timeout:   4000 
    }); 
    
    
    
    
    
    $("#google-authorization-form").ajaxForm({ 
            success:       function(responseText){
                var error = (responseText.error);
                if (error) {
                    alert(responseText.error);
                }else {
                    window.location.href = "/dashboard/";
                }
            },
            dataType:  'json',
            timeout:   4000 
        });
    
    
    
    
    $("#reset-password-form").ajaxForm({ 
            success:       function(responseText){
                var error = (responseText.error);
                if (error) {
                    alert(responseText.error);
                }else {
                    $("#myModal").modal('hide');
                    alert('Your reset link was sent to your email.');
                }
            },
            dataType:  'json',
            timeout:   4000 
        });
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
});