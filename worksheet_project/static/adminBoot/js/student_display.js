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
    
    
    
$.validator.addMethod("noWhitespace",
   function(value) {
    var noWhitespaces = /^\w+$/;
    if (noWhitespaces.test(value)){
        return true
    }else{return false}
   },'no spaces');
    
    
    $("#reset-password-form").validate({
            errorPlacement: function(error, element){
		element.parent().parent().prepend(error);
            },
	    highlight: function(element, errorClass, validClass) {
		$(element).addClass(errorClass).removeClass(validClass);
		$(element.form).find("label[for=" + element.id + "]")
		  .addClass(errorClass);
		var check = $(element).next();
		if (check.hasClass("register-check-good")) {
		    check.removeClass("register-check-good").addClass("register-check-error");
		}
		check.fadeIn(300);
	    },
	    unhighlight: function(element, errorClass, validClass) {
		$(element).removeClass(errorClass).addClass(validClass);
		$(element.form).find("label[for=" + element.id + "]")
		  .removeClass(errorClass);
		var check = $(element).next();
		if (check.hasClass("register-check-error")) {
		    check.removeClass("register-check-error").addClass("register-check-good");
		}
		check.fadeIn(300);
	    },
	    rules: {
		password1: {
		    required: true,
		    minlength: 6,
		    maxlength: 30,
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
    
    
    
    $('#reset-password-form').ajaxForm({ 
        success:       function(responseText){
            if (responseText.error) {
                alert(responseText.error);
            }else if (responseText.success) {
		$('#reset-password').modal('hide');
            }
        },
	clearForm: true,
	resetForm: true,
        dataType:  'json',
        timeout:   4000 
    }); 
    
    
    
    $('#remove-from-class-form').ajaxForm({ 
        success:       function(responseText){
            console.log(responseText);
            if (responseText.error) {
                alert(responseText.error);
            }else {
		location.reload();
            }
        },
        dataType:  'json',
        timeout:   4000 
    }); 
    
    
    
    
    $('#resetRetry-form').ajaxForm({ 
        success:       function(responseText){
            console.log(responseText);
            if (responseText.error) {
                alert(responseText.error);
            }else {
		location.reload();
            }
        },
        dataType:  'json',
        timeout:   4000 
    }); 
    
    $('#forceTurnIn').ajaxForm({ 
        success:       function(responseText){
            console.log(responseText);
            if (responseText.error) {
                alert(responseText.error);
            }else {
		location.reload();
            }
        },
        dataType:  'json',
        timeout:   4000 
    });
    
    
});