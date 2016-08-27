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
    
    
    
    $('#newCode-form').ajaxForm({ 
        success:       function(responseText){
            console.log(responseText);
            if (responseText.error) {
                alert(responseText.error);
            }else {
		$("#class-code .modal-body span").html(responseText.classCode);
                $("#class-code-container .class-code").html(responseText.classCode);
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
    
    
    $(".changeStudentName").click(function(){
        var link = $(this).parent().children('.col-xs-10').children('.studentNameLink');
        var input = $(this).parent().children('.col-xs-10').children('.studentNameInput');
        if ($(this).hasClass('fa-rotate-left')) {
            link.fadeOut(300, function(){
                input.fadeIn(300);
            });
            $(this).removeClass('fa-rotate-left').addClass('fa-thumbs-o-up');
        }else{
            input.fadeOut(300, function(){
                link.fadeIn(300);
            });
            $(this).removeClass('fa-thumbs-o-up').addClass('fa-rotate-left');
            
        }
    });
    
    $(".studentNameInput").blur(function(){
        //get info and submit it.
        var parent = $(this).parents('.studentID-row');
        var studentID = parent.data('studentid');
        var fullName = $(this).val();
        var studentNameLink = $(this).parent().children('.studentNameLink');
        
        $.ajax({
            method: "POST",
            url: studentInfoUpdateURL,
            data: { fullName: fullName, classUserID:studentID },
            dataType: "json"
        })
            .done(function( response ) {
                console.log(response);
                if (response.error) {
                    alert(response.error);
                }else{
                    studentNameLink.html('<strong class="text-primary">'+response.fullName+'&nbsp;&nbsp;</strong>');
                }
            });
    });
    
    
    
    
    
    $('#lockStudentNames-form').ajaxForm({ 
        success:       function(responseText){
            console.log(responseText);
            if (responseText.error) {
                alert(responseText.error);
            }else {
		if (responseText.bLocked == true) {
                    $("#lockStudentNames-btn").removeClass('btn-danger').addClass('btn-success');
                    $("#lockStudentNames-btn").html("<i class='fa fa-unlock'></i>  unlock all student names and id's");
                }else{
                    $("#lockStudentNames-btn").removeClass('btn-success').addClass('btn-danger');
                    $("#lockStudentNames-btn").html("<i class='fa fa-lock'></i>  lock all student names and id's");
                }
            }
        },
        dataType:  'json',
        timeout:   4000 
    });
    
    
    
    $(".form-control.studentID-input").blur(function(){
        var studentSchoolID = $(this).val();
        //get info and submit it.
        var parent = $(this).parents('.studentID-row');
        console.log(parent.attr('class'));
        var studentID = parent.data('studentid');
        console.log(studentID);
        var fullName = parent.children('.col-xs-3').children('.col-xs-10').children('.studentNameInput').val();
        console.log(fullName);
        
        
        $.ajax({
            method: "POST",
            url: studentInfoUpdateURL,
            data: { fullName: fullName, classUserID:studentID, studentID:studentSchoolID },
            dataType: "json"
        })
            .done(function( response ) {
                console.log(response);
                if (response.error) {
                    alert(response.error);
                }else{
                    //studentNameLink.html('<strong class="text-primary">'+response.fullName+'&nbsp;&nbsp;</strong>');
                }
            });
        
    });
    
    
    
    
    
});

function getCSRFCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
function sameOrigin(url) {
    // test that a given url is a same-origin URL
    // url could be relative or scheme relative or absolute
    var host = document.location.host; // host + port
    var protocol = document.location.protocol;
    var sr_origin = '//' + host;
    var origin = protocol + sr_origin;
    // Allow absolute or scheme relative URLs to same origin
    return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
        (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
        // or any other URL that isn't scheme relative or absolute i.e relative.
        !(/^(\/\/|http:|https:).*/.test(url));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        var csrftoken = getCSRFCookie('csrftoken');
        if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
            // Send the token to same-origin, relative URLs only.
            // Send the token only if the method warrants CSRF protection
            // Using the CSRFToken value acquired earlier
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});





