$('document').ready(function(){
    
    
jQuery.validator.addMethod("noSpace", function(value, element) { 
     return value.indexOf(" ") < 0 && value != "";
  }, "Space are not allowed");
    
    
    

         //form validation rules
         $("#submit-registration-form").validate({
             onkeyup: false, //turn off auto validate whilst typing
             rules:
             {
                username:
                {
                    "remote":
                    {
                      url: doesUsernameExistURL,
                      type: "post",
                      data:
                      {
                          username: function()
                          {
                              return $('#submit-registration-form :input[name="username"]').val();
                          }
                      }
                    }
                },
                email:
                {
                    "remote":
                    {
                      url: doesEmailExistURL,
                      type: "post",
                      data:
                      {
                          email: function()
                          {
                              return $('#submit-registration-form :input[name="email"]').val();
                          }
                      }
                    }
                },
		password1: {
		    required: true,
		    minlength: 6,
		    maxlength: 30,
		    noSpace: true,
		},
		password2: {
		    required: true,
		    equalTo: "#password1"
		},
             },
             messages:
             {
                 username:
                 {
                    remote: jQuery.validator.format("Already taken.")
                 },
                 email:
                 {
                    remote: jQuery.validator.format("Already used.")
                 },
		password2: {
		    required: "confirm password",
		    equalTo: "same password as above"
		},
             }
         });
    

    
    
    
    
    $('#submit-registration-form').ajaxForm({
        beforeSubmit:  function(){
            console.log('submit registration');
        },
        success:       function(responseText){
            if (responseText.error) {
                alert(responseText.error);
            }else{
		window.location.href = "/dashboard/";
            }
        },
        dataType:  'json',
        timeout:   4000 
    }); 
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
});