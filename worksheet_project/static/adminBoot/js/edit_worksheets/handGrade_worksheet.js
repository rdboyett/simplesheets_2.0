$('document').ready(function(){
    
    
	$('#sidebar').animate({marginLeft: -210+"px"}, 1000, function(){resizeElements();$("#nav-accordion").attr('style','display: none;');});
	$('#main-content').animate({marginRight: 0+"px", marginLeft: 0}, 1000, function(){resizeElements();});
	
	

$( window ).resize(function() {
        resizeElements();
});
    
function resizeElements() {
	
        var screenWidth = $( '#backgroundImage' ).width();
        var fontPixels = (screenWidth/1267)*14;
        var fontPixels2 = (screenWidth/1267)*20;
        //$("input").attr('style','font-size:'+fontPixels+'px;line-height:'+fontPixels+'px;');
        //$("input").css('font-size', fontPixels+'px', 'line-height', fontPixels+'px');
	
	//console.log(fontPixels);
	
        $("#default_form input").css({
                'font-size': fontPixels+'px',
                'line-height': fontPixels+'px' 
        });
	$("#default_form textarea").css({
                'font-size': fontPixels+'px',
                'line-height': fontPixels+'px' 
        });
	$("#default_form select").css({
                'font-size': fontPixels+'px',
                'line-height': fontPixels+'px' 
        });
	if (fontPixels2 < 12) {
	    fontPixels2 = 12
	}
	$("#default_form div").css({
                'font-size': fontPixels2+'px',
                'line-height': fontPixels2+'px' 
        });
}
    
    resizeElements()
    
    
    
    
    
/*******************  Start of wPaint js ******************************************/
    
        // init wPaint
	
        $('#wPaint1').wPaint({
          path: '/static/page_view/',
          menuOffsetLeft: 10,
          menuOffsetTop: -46,
          menuOrientation: 'horizontal',
          menuHandle:      true,
          imageStretch:    true,
          fontSize       : '60',
          fillStyle:   '#FF0000',
          strokeStyle: '#FF0000',
        });
        
	$("#paintHolder").hide();
	
	$(".wPaint-menu-holder").css({
	    'background-color':'#55bceb',
	});
    
    $("#default_form").on("click", ".show_work", function(){
	var workElementID = $(this).parent().attr('id');
	var inputID = $("#"+workElementID).data("options").answer_id;
        var image = $("#"+workElementID+" img").attr('src');
	
	//Get image width and height
	var imageWidth = $("#"+workElementID+" img").width();
	var imageHeight = $("#"+workElementID+" img").height();
	var windowWidth = $(window).width(); //retrieve current window width
	var windowHeight = ($(window).height()-46);
	//find out which is larger
	if (windowWidth>=windowHeight) {
	    console.log("Window width is greater than Window height");
	    var ratio = imageWidth/imageHeight;
	    var newHeight = windowHeight;
	    var newWidth = newHeight*ratio;
	    if (newWidth>windowWidth) {
		newWidth = windowWidth;
		newHeight = newWidth/ratio;
	    }
	    var left = (windowWidth-newWidth)/2;
	    var top = ((windowHeight-newHeight)/2)+46;
	    console.log("image: width: "+imageWidth+" height: "+imageHeight);
	    console.log("newWidth: "+newWidth+" newHeight: "+newHeight);
	    console.log(imageHeight/imageWidth);
	    console.log(newHeight/newWidth);
	    
	    $("#paintHolder").css({
		'top':top+'px' ,
		'left':left+"px",
		'width':newWidth+"px",
		'height':(newHeight)+"px",
	    });
	    
	    $("#wPaint1").css({
		'width':(newWidth)+"px",
		'height':(newHeight)+"px",
	    });
	    
	}else{
	    console.log("Window height is greater than Window width");
	}
	//set #paintHolder to 90% of screen and use % of other to change painHolder
	//change top and left to center popup
	/*
	//Resize show your work popup
	$("#paintHolder")css({
	    'top':,
	    'left':,
	    'width':,
	    'height':,
	});
	*/
	
        $('#wPaint1').wPaint({
          path: '/static/page_view/',
          menuOffsetLeft: 10,
          menuOffsetTop: -46,
          menuOrientation: 'horizontal',
          menuHandle:      true,
          imageStretch:    true,
          fontSize       : '60',
          fillStyle:   '#000000',
          strokeStyle: '#000000',
	  image: image,
        })
	.wPaint('resize')
	.wPaint('clear')
	.wPaint('image', image);;
	
	
	  
	
	$(".wPaint-menu-icon-name-clear").click(function(){
	    console.log("x was clicked");
	    $("#wPaint1")
	    .wPaint('clear')
	    .wPaint('image', image);
	});
	
	$("#shade").fadeIn(600);
	$("#paintHolder").fadeIn(600);
        
	$("#resize-button").unbind("click").click(function(){
            var paintImage = $("#wPaint1").wPaint("image");
	    var convertImage = paintImage.replace(/^data:image\/(png|jpg);base64,/, "");
	    uploadWorkboxImage(convertImage, inputID);
            $("#"+workElementID+" img").attr('src',paintImage);
            $("#paintHolder").fadeOut(600);
	    $("#shade").fadeOut(600);
	});
        
	
	$("#shade").unbind("click").click(function(){
            var paintImage = $("#wPaint1").wPaint("image");
	    var convertImage = paintImage.replace(/^data:image\/(png|jpg);base64,/, "");
	    uploadWorkboxImage(convertImage, inputID);
            $("#"+workElementID+" img").attr('src',paintImage);
            $("#paintHolder").fadeOut(600);
	    $("#shade").fadeOut(600);
	    $("#shade").unbind("click").click(function(){
		closePopups();
	    });
	});
        
	
        $(document).unbind('keydown').keydown(function(e){
            
            var paintImage = $("#wPaint1").wPaint("image");
            //submit it to 
            
            if (e.keyCode==27) {
		var convertImage = paintImage.replace(/^data:image\/(png|jpg);base64,/, "");
		uploadWorkboxImage(convertImage, inputID);
                $("#"+workElementID+" img").attr('src',paintImage);
                $("#paintHolder").fadeOut(600);
		$("#shade").fadeOut(600);
            }
        });
        
        
        
    });        
        
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
/*******************  Start of Event Pickups ******************************************/
    
    /*****************************Put Answer info**************************************************/
    $('#default_form').on('focus', '.answers', function () {
        var elementID = $(this).attr('id');
        var elt = document.getElementById(elementID);
        //console.log(elt.nodeName);
        if (elt.nodeName != 'SELECT') {
            updateCorrectAnswer_function(elementID);
        }else{
            var selectedText = elt.options[elt.selectedIndex].innerHTML;
            $('#correctAnswer').text(selectedText);
        }
    });
    
    
    $('#default_form').on('click', '.helpQuestionMark', function () {
        showSideBarMenu();
        var elementID = $(this).attr('id');
	questionFocus(elementID);
    });
    
    $('#backgroundImage').click(function(){
        hideSideBarMenu();
    });


    $(".gradeChangeBtn").click(function(){
	var data = $(this).data('options');
	var answerID = data.answerID,
	possiblePoints = parseFloat(data.possiblePoints),
	startingPoints = parseFloat($("#pointsEarnedBlock").html()),
	subtractPoints = parseFloat($("#answerPoints"+answerID).html());
	
	if ($(this).hasClass('btn-danger')) {
		$("#answerPoints"+answerID).html(possiblePoints);
		var endingPoints = parseFloat(startingPoints-subtractPoints+possiblePoints).toFixed(2);
		$("#pointsEarnedBlock").html(endingPoints);
		$("#changeGrade-form input[name='answer_"+answerID+"']").val("correct");
		$("#changeGrade-form input[name='pointsEarned']").val(endingPoints);
		
	}else{
		$("#answerPoints"+answerID).html(0);
		var endingPoints = parseFloat(startingPoints-subtractPoints).toFixed(2);
		$("#pointsEarnedBlock").html(endingPoints);
		$("#changeGrade-form input[name='answer_"+answerID+"']").val("incorrect");
		$("#changeGrade-form input[name='pointsEarned']").val(endingPoints);
	}
	
	var average = parseFloat(parseFloat($("#pointsEarnedBlock").html())/parseFloat($("#pointsPossibleBlock").html())*100).toFixed(2);
	var newAverage = parseFloat(parseFloat(average) + parseFloat(extraCredit)).toFixed(2);
	$('#averageBlock').html(newAverage+"%");
	$("#changeGrade-form input[name='newAverage']").val(newAverage);
	
	$(this).children('span').toggleClass('fa-check').toggleClass('fa-times-circle');
	$(this).toggleClass('btn-success').toggleClass('btn-danger');
    });
    
    
    var extraCredit = $("#changeGrade-form input[name='extraCredit']").val();
    $("#changeGrade-form input[name='extraCredit']").change(function(){
	var average = parseFloat(parseFloat($("#pointsEarnedBlock").html())/parseFloat($("#pointsPossibleBlock").html())*100).toFixed(2);

	extraCredit = parseFloat($(this).val());
	var newAverage = parseFloat(parseFloat(average) + parseFloat(extraCredit)).toFixed(2);
	$('#averageBlock').html(newAverage+"%");
	$("#changeGrade-form input[name='newAverage']").val(newAverage);
    });
    
    
    
    
    
    
    
    /******************Enter Correct Answer****************************/
    
    $("#default_form").on('change', '.answers', function () {
        var elementID = $(this).attr('id');
        var elt = document.getElementById(elementID);
        //console.log(elt.nodeName);
        var data = $(this).data('options');
        
        
        if ($("#"+elementID).attr('type')=='checkbox') {
            var newCorrectAnswer = document.getElementById(elementID).checked;
            if (document.getElementById(elementID).checked == true) {
                $('#showCheckbox').prop("checked", true);
            }
            else{$('#showCheckbox').prop("checked", false);}
        }else{
            var newCorrectAnswer = $('#'+elementID).val();
        }
        
        
        sendStudentAnswer($(this), newCorrectAnswer, data);
        if (elt.nodeName != 'SELECT') {
            updateCorrectAnswer_function(elementID);
        }
    });
    
    

    
    
    
    $("#show-question-sidebar-btn").click(function(){
	showSideBarMenu();
    });
    $("#hide-question-sidebar-btn").click(function(){
	hideSideBarMenu();
    });
    $("#show-question-sidebar-btn").on('swipeleft', function(){
	showSideBarMenu();
    });
    $("#hide-question-sidebar-btn").on('swiperight', function(){
	hideSideBarMenu();
    });
    
    var zoomStatus = 1;
    
    $("#zoom-in-btn").click(function(){
	if (zoomStatus<7) {
		zoomStatus++;
		console.log(zoomStatus);
		$("#wrapper").css({
			'zoom': zoomStatus,	
		});
		resizeElements();
	}
    });
    
    
    $("#zoom-out-btn").click(function(){
	if (zoomStatus>1) {
		zoomStatus--;
		console.log(zoomStatus);
		$("#wrapper").css({
			'zoom': zoomStatus,	
		});
		resizeElements();
	}
    });
    
    
    
    
    
    $(document).on('click','#gradeWorksheet', function(){
        //console.log("in grade check");
        var complete = checkAllAnswersFilled();
        console.log("complete: "+complete);
        if (checkAllAnswersFilled()==true) {
            sureCheck('', '', 'Are you sure you want to grade this worksheet?', submitGradeWorksheet);
        }else{
            sureCheck('', '', 'Your worksheet is not complete! Do you want to grade it anyway?', submitGradeWorksheet);
        }
        
    });
    
    /*
    
    $("#retry-button").click(function(){
       location.reload(); 
    });
    $("#backToDashboard-button").click(function(){
       document.location.href = "/dashboard/";
    });
    
    */
    
    
    
 /************ End of Click events **************************/































/************************   Functions *******************************/






function questionFocus(elementID) {
        $('#'+elementID).css('z-index','2');
        $('#questionMenu').css('display','block');
	var currentHelpText = $('#'+elementID).data("options").help_text;
	var currentHelpLink = $('#'+elementID).data("options").help_link;
	$('.helpInput').val(currentHelpText);
        var helpLinkHtml = '<a href="'+ currentHelpLink +'" target="_blank">'+ currentHelpLink +'</a>'
	$('#textHelpLink').html(helpLinkHtml);
}












function showSideBarMenu() {
	$('#sidebar').animate({marginLeft: -210+"px"}, 1000, function(){resizeElements();$("#nav-accordion").attr('style','display: none;');});
	$('#main-content').animate({marginRight: 210+"px", marginLeft: 0}, 1000);
	//$('#main-content').animate({width: (wholeScreenWidth-270)+"px"}, 1000, function(){resizeElements();});
	$('#sidebar-right').animate({marginRight: 0}, 1000);
	$("#hide-question-sidebar-btn").show();
	$("#show-question-sidebar-btn").hide();
}


function hideSideBarMenu() {
	if ($('#sidebar-right').is(":visible")) {
		$('#sidebar-right').animate({marginRight: -210+"px"}, 1000);
		$('#main-content').animate({marginRight: 0}, 1000, function(){resizeElements();});
		$("#hide-question-sidebar-btn").hide();
		$("#show-question-sidebar-btn").show();
	}
}

function whiteFlash() {
    $("#flash").show();
    $("#flash").fadeOut(400);
}

function highLightQuestionNumber(answer_id) {
    $(".questionTab-holder").removeClass('btn-primary').addClass('btn-default');
    $("#questionTab"+answer_id).removeClass('btn-default').addClass('btn-primary');
}


function toggleSpinner() {
    if ($('#wait').is(":visible")) {
        $("#wait").fadeOut(600);
        $("#wait-spinner").fadeOut(600);
    }else{
        $("#wait").show();
        $("#wait-spinner").show();
    }
}

    


    /***************************** Sure Checks and Callbacks ************************************************************************/
    function sureCheck(answer_id, question_number, sureText, callback) {
	$("#text-holder-sure").html(sureText);
	$("#areYouSurePopup").modal("show");
	$("#yes-button").unbind('click').click(function(){
	    //console.log('yes');
	    callback(answer_id, question_number);
	    closePopups();
	});
	$("#no-button").unbind('click').click(function(){
	    //console.log('no');
	    closePopups();
	});
    }
    
    
    
    
function closePopups() {
    $(".modal").modal("hide");
}



function checkAllAnswersFilled() {
    var answer = true;
    console.log('inputs');
    $("#default_form input").each(function(){
        var val = $(this).val();
        console.log(val);
        if ($(this).attr('type')!='checkbox') {
            if (val==null || val== "" || val== " " || val=='none') {
                console.log('empty');
                var top = $(this).position().top;
		/*
                $('html, body').animate({
                    scrollTop: (top-100) + 'px'
                }, 2000);
                */
                $(this).css({'background-color':'#ffa8a8',});
                answer = false;
            }
        }
    });
    console.log('selects');
    $("#default_form select").each(function(){
        var val = $(this).val();
        console.log(val);
        if (val==null || val== "" || val== " " || val=='none') {
            console.log('empty');
                var top = $(this).position().top;
		/*
                $('html, body').animate({
                    scrollTop: (top-100) + 'px'
                }, 2000);
                */
            $(this).css({'background-color':'#ffa8a8',});
            answer = false;
        }
    });
    console.log('textareas');
    $("#default_form textarea").each(function(){
        var val = $(this).val();
        console.log(val);
        if (val==null || val== "" || val== " " || val=='none') {
            console.log('empty');
                var top = $(this).position().top;
		/*
                $('html, body').animate({
                    scrollTop: (top-100) + 'px'
                }, 2000);
                */
            $(this).css({'background-color':'#ffa8a8',});
            answer = false;
        }
    });
    return answer;
}



    function getCookie(cname){
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++){
	    var c = ca[i].trim();
	    if (c.indexOf(name)==0) return c.substring(name.length,c.length);
	  }
	return "";
    }
    

var csrftoken = getCookie('csrftoken');
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});





function updateCorrectAnswer_function(elementID) {
	console.log('in updateCorrectAnswer_function');
}



    
    /***************************** Generic Checks and Callbacks ************************************************************************/
    function genericCheck(callbackData, sureText, button1, button2, callback1, callback2) {
	console.log('in genericCheck you should fix this');
	/*
	$("#text-holder-message").html(sureText);
	$("#first-button").html(button1);
	$("#second-button").html(button2); //please use one short word
	$("#shade").fadeIn(600);
	$("#genericPopup").fadeIn(600);
	$("#first-button").unbind('click').click(function(){
	    callback1(callbackData);
	    //closePopups();
	});
	$("#second-button").unbind('click').click(function(){
	    callback2(callbackData);
	    //closePopups();
	});
	*/
    }
    
    

function showGradeColors() {
    var counter = 0;
    $(".answers").each(function(){
        counter++;
        //console.log($(this).data('options').input_type);
        if ($(this).data('options').input_type=='textarea') {
                    $( "#default_form" ).append('<div id="checkboxNotify'+ counter +'" class="" title="Auto Graded By Keyword.  You teacher can adjust your grade at a later time if you feel there is an error."><div>');
                    var pos = $(this).position();
                    $("#checkboxNotify"+ counter).css({
                        'position':$(this).css('position'),
                        'z-index':2,
                        'left':((pos.left / $("#backgroundImage").width() * 100)-.2)+'%',
                        'top':((pos.top / $("#backgroundImage").height() * 100)-.2)+'%',
                        'width':(($(this).width() / $("#backgroundImage").width() * 100)+1)+'%',
                        'height':(($(this).height() / $("#backgroundImage").height() * 100)+.8)+'%',
                        'background-color':'#9efe83',
                        'border':'2px solid #1b7401',
                        'opacity':'0.4',
                    });
            
            
        }else if ($(this).data('options').input_type=='work') {
                    if ($(this).data('bCorrect') == 'correct') {
                        var correct = {
                            'backColor':"#9efe83",
                            'borderColor':"#1b7401",
                        }
                    }else{
                        var correct = {
                            'backColor':"#ffa8a8",
                            'borderColor':"#dd0000",
                        }
                    }
                    $( "#default_form" ).append('<div id="checkboxNotify'+ counter +'" class="" title="Auto Graded By Keyword.  You teacher can adjust your grade at a later time if you feel there is an error."><div>');
                    var workElement = $(this).parent().parent();
                    var pos = workElement.position();
                    $("#checkboxNotify"+ counter).css({
                        'position':workElement.css('position'),
                        'z-index':2,
                        'left':((pos.left / $("#backgroundImage").width() * 100)-.2)+'%',
                        'top':((pos.top / $("#backgroundImage").height() * 100)-.2)+'%',
                        'width':((workElement.width() / $("#backgroundImage").width() * 100)+1)+'%',
                        'height':((workElement.height() / $("#backgroundImage").height() * 100)+.8)+'%',
                        'background-color':correct.backColor,
                        'border':'2px solid '+correct.borderColor,
                        'opacity':'0.4',
                    });
            
            
            
        }else{
            if ($(this).data('bCorrect') == 'correct') {
                    $( "#default_form" ).append('<div id="checkboxNotify'+ counter +'" class="" title="Your answer is correct."><div>');
                    var pos = $(this).position();
                    $("#checkboxNotify"+ counter).css({
                        'position':$(this).css('position'),
                        'z-index':2,
                        'left':(pos.left / $("#backgroundImage").width() * 100-.2)+'%',
                        'top':(pos.top / $("#backgroundImage").height() * 100-.2)+'%',
                        'width':($(this).width() / $("#backgroundImage").width() * 100+1)+'%',
                        'height':($(this).height() / $("#backgroundImage").height() * 100+.8)+'%',
                        'background-color':'#9efe83',
                        'border':'2px solid #1b7401',
                        'opacity':'0.4',
                    });
            }else{
                    $( "#default_form" ).append('<div id="checkboxNotify'+ counter +'" class="" title="Sorry, your answer is not correct."><div>');
                    var pos = $(this).position();
                    $("#checkboxNotify"+ counter).css({
                        'position':$(this).css('position'),
                        'z-index':2,
                        'left':(pos.left / $("#backgroundImage").width() * 100-.2)+'%',
                        'top':(pos.top / $("#backgroundImage").height() * 100-.2)+'%',
                        'width':($(this).width() / $("#backgroundImage").width() * 100+1)+'%',
                        'height':($(this).height() / $("#backgroundImage").height() * 100+.8)+'%',
                        'background-color':'#ffa8a8',
                        'border':'2px solid #dd0000',
                        'opacity':'0.4',
                    });
            }
        }
    });
}









  /*******************  End of Functions ***************************/









    $('#changeGrade-form').ajaxForm({ 
        success:       function(responseText){
            console.log(responseText);
            if (responseText.error) {
                alert(responseText.error);
            }else {
		//success
		location.reload();
            }
        },
        dataType:  'json',
        timeout:   4000 
    }); 
    











































/**************************   Ajax calls ******************************/




    /************************** Submit Answer *************************************************************************8*****/
	function sendStudentAnswer(element, answer, data){
		console.log('In sendStudentAnswer');
	    
            var csrftoken = getCookie('csrftoken');
	    var uri = sendStudentAnswerURL;
            var xhr = new XMLHttpRequest();
            var fd = new FormData();
            
            xhr.open("POST", uri, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    // Handle response.
		    //console.log(xhr.responseText);
		    var data = JSON.parse(xhr.responseText)
		    console.log(data);
		    if (data.error) {alert(data.error);}
		    else{
			element.data('bCorrect',data.answer);
			
			if (data.answer == 'correct') {
			    element.addClass('correctOutline').removeClass('incorrectOutline');
			}else{
			    element.addClass('incorrectOutline').removeClass('correctOutline');
			}
			
		    }
                }
            };
	    xhr.timeout = 4000;
	    xhr.ontimeout = function () { location.reload(); }
            fd.append('userInfo_id', userInfo_id_ajax);
            fd.append('inputNumber', data.answer_id);
            fd.append('answer', answer);
            fd.append('classID', classID_ajax);
	    
	    
            // Initiate a multipart/form-data upload
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
	    xhr.send(fd);
	    //console.log( xhr._object);
        }
	
	
	
	
	
    /************************** upload Workbox image *************************************************************************8*****/
	function uploadWorkboxImage(file, inputID){
		console.log('In uploadWorkboxImage');
	    
            var csrftoken = getCookie('csrftoken');
	    var uri = uploadWorkboxImageURL;
            var xhr = new XMLHttpRequest();
            var fd = new FormData();
            
            xhr.open("POST", uri, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    // Handle response.
		    //console.log(xhr.responseText);
		    var data = JSON.parse(xhr.responseText)
		    console.log(data);
		    if (data.error) {alert(data.error);}
		    else{
		    
		    }
                }
            };
	    xhr.timeout = 4000;
	    xhr.ontimeout = function () { location.reload(); }
            fd.append('userInfo_id', userInfo_id_ajax);
            fd.append('project_id', project_id_ajax);
            fd.append('inputNumber', inputID);
            fd.append('file', file);
	    
            // Initiate a multipart/form-data upload
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
	    xhr.send(fd);
	    //console.log( xhr._object);
        }
	
	






	 /****************** End of Ajax calls ***************************/
	 
	 
	if (pageNumber_ajax<2) {
		$("#changeGrade-modal").modal('show');
	}
	

        
}); 



function resetImagePath(inputNumber, imagePath) {
    $("#workinput"+inputNumber+" img").attr('src',imagePath);
}


function resetDrawingImagePath(inputNumber, imagePath) {
    $("#drawinginput"+inputNumber+" img").attr('src',imagePath);
}
