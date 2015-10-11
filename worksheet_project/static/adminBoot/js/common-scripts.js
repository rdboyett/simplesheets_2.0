/*---LEFT BAR ACCORDION----*/
$(function() {
    $('#nav-accordion').dcAccordion({
        eventType: 'click',
        autoClose: true,
        saveState: true,
        disableLink: true,
        speed: 'slow',
        showCount: false,
        autoExpand: true,
//        cookie: 'dcjq-accordion-1',
        classExpand: 'dcjq-current-parent'
    });
});

var Script = function () {


//    sidebar dropdown menu auto scrolling

    jQuery('#sidebar .sub-menu > a').click(function () {
        var o = ($(this).offset());
        diff = 250 - o.top;
        if(diff>0)
            $("#sidebar").scrollTo("-="+Math.abs(diff),500);
        else
            $("#sidebar").scrollTo("+="+Math.abs(diff),500);
    });



//    sidebar toggle

    $(function() {
        function responsiveView() {
            var wSize = $(window).width();
            if (wSize <= 768) {
                $('#container').addClass('sidebar-close');
                $('#sidebar > ul').hide();
            }

            if (wSize > 768) {
                $('#container').removeClass('sidebar-close');
                $('#sidebar > ul').show();
            }
        }
        $(window).on('load', responsiveView);
        $(window).on('resize', responsiveView);
    });

    $('.fa-bars').click(function () {
        if ($('#sidebar > ul').is(":visible") === true) {
            $('#main-content').css({
                'margin-left': '0px'
            });
            $('#sidebar').css({
                'margin-left': '-210px'
            });
            $('#sidebar > ul').hide();
            $("#container").addClass("sidebar-closed");
        } else {
            $('#main-content').css({
                'margin-left': '210px'
            });
            $('#sidebar > ul').show();
            $('#sidebar').css({
                'margin-left': '0'
            });
            $("#container").removeClass("sidebar-closed");
        }
    });

// custom scrollbar
    $("#sidebar").niceScroll({styler:"fb",cursorcolor:"#4ECDC4", cursorwidth: '3', cursorborderradius: '10px', background: '#404040', spacebarenabled:false, cursorborder: ''});

    $("html").niceScroll({styler:"fb",cursorcolor:"#4ECDC4", cursorwidth: '6', cursorborderradius: '10px', background: '#404040', spacebarenabled:false,  cursorborder: '', zindex: '1000'});

// widget tools

    jQuery('.panel .tools .fa-chevron-down').click(function () {
        var el = jQuery(this).parents(".panel").children(".panel-body");
        if (jQuery(this).hasClass("fa-chevron-down")) {
            jQuery(this).removeClass("fa-chevron-down").addClass("fa-chevron-up");
            el.slideUp(200);
        } else {
            jQuery(this).removeClass("fa-chevron-up").addClass("fa-chevron-down");
            el.slideDown(200);
        }
    });

    jQuery('.panel .tools .fa-times').click(function () {
        jQuery(this).parents(".panel").parent().remove();
    });


//    tool tips

    $('.tooltips').tooltip();

//    popovers

    $('.popovers').popover();



// custom bar chart

    if ($(".custom-bar-chart")) {
        $(".bar").each(function () {
            var i = $(this).find(".value").html();
            $(this).find(".value").html("");
            $(this).find(".value").animate({
                height: i
            }, 2000)
        })
    }
    
jQuery.validator.addMethod("noSpace", function(value, element) { 
     return value.indexOf(" ") < 0 && value != ""; 
  }, "Space are not allowed");
    
jQuery.validator.addMethod("checkExtension", function(value, element) { 
    if (value.split('.')[1] != "pdf") {
	return false
    }else{
	return true
    }
  }, "must be a pdf");

jQuery.validator.addMethod("complete_url", function(val, elem) {
    // if no url, don't do anything
    if (val.length == 0) { return true; }

    // if user has not entered http:// https:// or ftp:// assume they mean http://
    if(!/^(https?|ftp):\/\//i.test(val)) {
        val = 'http://'+val; // set both the value
        $(elem).val(val); // also update the form element
    }
    // now check if valid url
    // http://docs.jquery.com/Plugins/Validation/Methods/url
    // contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
    return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&amp;'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&amp;'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&amp;'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&amp;'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&amp;'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(val);
}, "oops, link is not valid");


    $("form").each(function(){
        $(this).validate();
    });
    
    $("#create-class-form").validate({
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
		}else{
		    
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
    });
    
    
    $("#create-class-form").ajaxForm({ 
            success:       function(responseText){
                console.log(responseText);
                if (responseText.error) {
                    alert(responseText.error);
                }else if (responseText.groupID) {
                    $('#new-class').modal('hide');
                    window.location.href = "/classes/"+responseText.groupID+"/";
                }
            },
            dataType:  'json',
            timeout:   4000 
        });
    
    

    
    $("#delete-worksheet-form").ajaxForm({ 
            success:       function(responseText){
                var error = (responseText.error);
                if (error) {
                    alert(responseText.error);
                }else {
                    
                    location.reload();
                }
            },
            dataType:  'json',
            timeout:   4000,
	    error: function(jqXHR, textStatus, errorThrown) {
		if(textStatus==="timeout") {
		   location.reload();
		}else{
		    alert("Sorry, something went wrong...That's all we know.");
		    location.reload();
		}
	    }
        });
    
    
    
    
    $("#join-class-form").ajaxForm({ 
            success:       function(responseText){
                var error = (responseText.error);
                if (error) {
                    alert(responseText.error);
                }else {
                    $('#join-class').modal('hide');
                    window.location.href = "/classes/"+responseText.groupID+"/";
                }
            },
            dataType:  'json',
            timeout:   4000 
        });
    
    
    
    $("#rename-worksheetName-form").ajaxForm({ 
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
    
    
    
    $("#toggle-lock-worksheet-base-form").ajaxForm({ 
            success:       function(responseText){
                //console.log(responseText);
                if (responseText.error) {
                    alert(responseText.error);
                }else {
		    location.reload();
                }
            },
            dataType:  'json',
            timeout:   4000 
        });
    
    
    
    $('#forceTurnIn-baseForm').ajaxForm({ 
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
    
    
    
    $('#print-student-work-form').ajaxForm({ 
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
    
    
    
    $('#share-worksheet-form').ajaxForm({ 
        success:       function(responseText){
            console.log(responseText);
            if (responseText.error) {
                alert(responseText.error);
            }else {
		//location.reload();
		$("#share-worksheet-modal").modal('hide');
		$.gritter.add({
		    text: "<div class='text-center text-success' style='font-size:30px;'><i class='fa fa-check fa-lg'></i>&nbsp;&nbsp;Shared</div>",
		    fade: true,
		    speed: "fast",
		    class_name: 'gritter-light'
		});
            }
        },
	clearForm: true,
        resetForm: true,
        dataType:  'json',
        timeout:   4000 
    });
    
    
    
    $("#toggleWorksheetListGrid").click(function(){
	if ($('#worksheetListView').is(':visible')){
	    $('#worksheetListView').fadeOut(300,function(){
		$('#worksheetGridView').fadeIn(300);
		$('#toggleWorksheetListGrid .fa-stack-1x').removeClass('fa-th').addClass('fa-list');
		setCookie('worksheetListGridView', 'grid', 30);
	    });
	}else{
	    $('#worksheetGridView').fadeOut(300,function(){
		$('#worksheetListView').fadeIn(300);
		$('#toggleWorksheetListGrid .fa-stack-1x').removeClass('fa-list').addClass('fa-th');
		setCookie('worksheetListGridView', 'list', 30);
	    });
	}
    });
    
    function resizeWorksheetList() {
	var width = $(document).width();
	if (width<769) {
	    if ($('#worksheetListView').is(':visible')){
		//do nothing
	    }else{
		$('#worksheetGridView').fadeOut(300,function(){
		    $('#worksheetListView').fadeIn(300);
		    $('#toggleWorksheetListGrid .fa-stack-1x').removeClass('fa-th').addClass('fa-list');
		});
	    }
	}else{
	    setListGridDisplay();
	}
    }
    
    $(window).resize(function(){resizeWorksheetList();});
    
    function setListGridDisplay() {
	var worksheetListGridView = getCookieWorksheet('worksheetListGridView');
	//console.log(worksheetListGridView);
	if ((worksheetListGridView == "" || worksheetListGridView == 'grid') && $(document).width()>768) {
	    if ($('#worksheetListView').is(':visible')){
		$('#worksheetListView').fadeOut(300,function(){
		    $('#worksheetGridView').fadeIn(300);
		    $('#toggleWorksheetListGrid .fa-stack-1x').removeClass('fa-th').addClass('fa-list');
		});
	    }else{
		$('#worksheetGridView').fadeIn(300);
		$('#toggleWorksheetListGrid .fa-stack-1x').removeClass('fa-th').addClass('fa-list');
	    }
	}else if (worksheetListGridView == 'list' || $(document).width()<769){
	    if ($('#worksheetGridView').is(':visible')){
		$('#worksheetGridView').fadeOut(300,function(){
		    $('#worksheetListView').fadeIn(300);
		    $('#toggleWorksheetListGrid .fa-stack-1x').removeClass('fa-list').addClass('fa-th');
		});
	    }else{
		$('#worksheetListView').fadeIn(300);
		$('#toggleWorksheetListGrid .fa-stack-1x').removeClass('fa-list').addClass('fa-th');
	    }
	}
    }
    
    setListGridDisplay();
    
    $(".modal-content").on("resizestart", function(event, ui) {
	if (!$(this).data('originalHeight')) {
	    $(this).css({"min-height":ui.size.height, "min-width":ui.size.width});
	    $(this).data("originalHeight", $(this).height());
	    $(this).find('.modal-footer').addClass('resized');
	}
	
    });
    
    
    /*
    $(".modal-content").on("resize", function(event, ui) {

	$(this).css("min-height", $(this).data("resizeoriginalheight") + ui.size.height - ui.originalSize.height);
    });
    */
    
    $(".modal-content").resizable({
	stop: function(event, ui) {
	    ui.element.css("margin-left", -ui.size.width/2);
	    ui.element.css("left", "50%");
	}
    });
    
    
}();




function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}



function getCookieWorksheet(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}








