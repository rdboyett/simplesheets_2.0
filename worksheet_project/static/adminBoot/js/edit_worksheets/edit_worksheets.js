$('document').ready(function(){

    
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
	
	$("#default_form textarea.answers").css({
                'font-size': 25+'px',
                'line-height': 25+'px',
		'color':'#000',
        });
	if (fontPixels2 < 12) {
	    fontPixels2 = 12
	}
	$("#default_form div").css({
                'font-size': fontPixels2+'px',
                'line-height': fontPixels2+'px' 
        });
	
	
	$("#default_form input.answers").each(function(){
		//subtract 10px for padding
		var height = $(this).height();
		var font = height*.85;
		$(this).css({
			'font-size': font+'px',
			'line-height': height+'px' 
		});
	});
	
	$("#default_form select.answers").each(function(){
		//subtract 10px for padding
		var height = $(this).height();
		var font = height*.85;
		$(this).css({
			'font-size': font+'px',
			'line-height': height+'px' 
		});
	});
	
	$("#default_form .mathquill-editable").each(function(){
		
		//subtract 10px for padding
		var height = $(this).height();
		var font = height*.5;
		if (font<12) {
			$(this).css({
				'font-size': 12+'px',
				'line-height': 1,
				'padding':5+'px',
			});
		}else{
			$(this).css({
				'font-size': font+'px',
				'line-height': 1,
			});
		}
	});
	
	
}
    
    resizeElements()
    
    
    
    
/**************************  Start of Image Area Select **********************************/
$.extend($.imgAreaSelect.prototype, {
    animateSelection: function (x1, y1, x2, y2, duration) {
        console.log("in Image area: x1: "+x1+" y1: "+y1+" x2: "+x2+" y2: "+y2);
        var fx = $.extend($('<div/>')[0], {
            ias: this,
            start: this.getSelection(),
            end: { x1: x1, y1: y1, x2: x2, y2: y2 }
        });

        $(fx).animate({
            cur: 1
        },
        {
            duration: duration,
            step: function (now, fx) {
                var start = fx.elem.start, end = fx.elem.end,
                    curX1 = Math.round(start.x1 + (end.x1 - start.x1) * now),
                    curY1 = Math.round(start.y1 + (end.y1 - start.y1) * now),
                    curX2 = Math.round(start.x2 + (end.x2 - start.x2) * now),
                    curY2 = Math.round(start.y2 + (end.y2 - start.y2) * now);
                fx.elem.ias.setSelection(curX1, curY1, curX2, curY2);
                fx.elem.ias.update();
            }
        });
    }
});







    var leftPercentage = 0;
    var topPercentage = 0;
    var widthPercentage = 0;
    var heightPercentage = 0;
    
    ias = $('#backgroundImage').imgAreaSelect({
        fadeSpeed: false,
        handles: true,
        onSelectStart: makeImageAreaSelection(),
        onSelectEnd: function(img, selection){
            if (!selection.width || !selection.height){
                return;
            }
            $('.imgareaselect-selection').attr( 'id', 'enter_area');
            var imageWidth = $( '#wrapper' ).width();
            leftPercentage = (selection.x1/imageWidth)*100;
            var imageHeight = $( '#wrapper' ).height();
            topPercentage = (selection.y1/imageHeight)*100;
            widthPercentage = (selection.width/imageWidth)*100;
            heightPercentage = (selection.height/imageHeight)*100;
            
            
            //alert('left: ' + leftPercentage + '%, top: '+ topPercentage+ '%, width: ' + widthPercentage + '%, height: ' + heightPercentage + '%...');
            
        },
        instance: true,
    });
    
function makeImageAreaSelection() {
    $(document).unbind('keydown').keydown(function (e) {
        if (e.keyCode == 13){
            e.preventDefault();
            if ($('#enter_area').is(":visible")) {
                //alert('selection is visible');
                runSelection();
            }
        }
    });
    
    $( document ).unbind('dblclick').dblclick(function() {
            if ($('#enter_area').is(":visible")) {
                //alert('selection is visible');
                runSelection();
            }
        //alert('left: ' + leftPercentage + '%, top: '+ topPercentage+ '%, width: ' + widthPercentage + '%, height: ' + heightPercentage + '%...');
    });
    
    
    $( document ).unbind('click').on('click','#createSelection',function() {
            if ($('#enter_area').is(":visible")) {
                //alert('selection is visible');
                runSelection();
            }
    });
}
    
    function runSelection() {
        whiteFlash();
        ias.cancelSelection();
        /*
        $('#wrapper img').imgAreaSelect({
            fadeSpeed: 1000,
            hide: true,
            onSelectStart: doThisNext,
        });
        $('#wrapper img').imgAreaSelect({
            fadeSpeed: false,
        });
        */
        var inputNumber = ($("form input").length)+1;
        //Dajaxice.myproject.googleapi.test(test_callback, {'userInfo': '{{ userInfo.id }}', 'project_id':'{{ newProject.id }}', 'pageNumber': '{{ pageNumber }}', 'inputNumber': inputNumber, 'left': leftPercentage,'top':topPercentage,'width':widthPercentage,'height':heightPercentage});
        imageAreaSet(project_id_ajax, pageNumber_ajax, inputNumber, leftPercentage, topPercentage, widthPercentage, heightPercentage);
        
    }
    
    $(document).on('click','#cancelSelection',function(){ias.cancelSelection();});
    
    
    //Dajaxice.myproject.teacherTools.setQuickLink(setQuickLink_callback, {'list_id':listId, 'link_id':parseInt(linkID), 'user_id':parseInt(userID), 'sort_number':parseInt(sortNumber)});
    /*--------------------for dajaxice callbacks------------------------------------*/
	
    function imageAreaSet_callback(data){
        //alert('left: ' + data.left + '%, top: '+ data.top+ '%, width: ' + data.width + '%, height: ' + data.height + '%...');

        $( "#default_form" ).append( "<input id='input"+ data.inputNumber +"' class='answers highlight' data-options='' type='text' title='answer...' name=''>" );
        $("#input"+ data.inputNumber).css({
                'position': 'absolute',
                'z-index': '1',
                'left': data.left + '%',
                'top': data.top+ '%',
                'width': data.width + '%',
                'height': data.height + '%'
        });
        $("#input"+ data.inputNumber).attr('data-options', '{"answer_id":"'+ data.inputNumber + '", "question_number":"'+ data.questionNumber + '", "input_type":"text", "points":"1", "help_text":"", "help_link":""}');
        
        $("#page"+pageNumber_ajax+" .page-holder" ).remove();
        var newhtml = '<li class="sub-menu"><button id="questionTab'+ data.inputNumber + '" class="btn btn-default btn-block questionTab-holder">'+
                            '<span class="question_click pull-left">Question '+ data.questionNumber + '</span>'+
                            '<i class="x-icon fa fa-trash pull-right" title="delete"></i>'+
                            '<i class="resize-icon fa fa-arrows-alt pull-right" title="resize"></i>'+
                        '</button></li>'
                        
			
			
        $( "#page"+pageNumber_ajax ).append(newhtml);
        
        $("#questionTab"+ data.inputNumber).attr('data-options','{"answer_id":"'+ data.inputNumber + '", "question_number":"'+ data.questionNumber + '"}');
        
        resizeElements();
    }
    
/************************** End of Image area select ************************************/
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
/*******************  Start of Event Pickups ******************************************/
    
    /*****************************Put Answer info**************************************************/
    $('#default_form').on('focus', '.answers', function () {
        showSideBarMenu();
        var elementID = $(this).attr('id');
	questionFocus(elementID);
        var answer_id = $(this).data('options').answer_id;
        highLightQuestionNumber(answer_id);
    });
    
    
    
    $('#backgroundImage').click(function(){
        hideSideBarMenu();
        var elementID = $(this).attr('id');
    });


    $("#default_form").on('keydown', '.answers', function() {
        var elementID = $(this).attr('id');
	updateCorrectAnswer_function(elementID);
    });
    
    /******************CHECK IF QUESTION NUMBER CHANGES****************************/
    
    $('#questionNumber').change(function () {
	changeQuestionNumber();
    });
    
    
    /******************Enter Correct Answer****************************/
    
    $("#default_form").on('change', '.answers', function () {
        console.log("on change answers");
        var elementID = $(this).attr('id');
        //$("#savedSignal").show();
        //setTimeout(function(){$("#savedSignal").hide();},3500);
	changeAnswer(elementID);
    });
    
    
    $("#default_form").on('blur', '.answers.mathquill-editable', function () {
        console.log("on change mathquill answers");
        var elementID = $(this).attr('id');
	$(this).next('.editor-btn').fadeOut(300);
        //$("#savedSignal").show();
        //setTimeout(function(){$("#savedSignal").hide();},3500);
	changeAnswer(elementID);
    });
    $("#default_form").on('focus', '.answers.mathquill-editable', function () {
	$(this).next('.editor-btn').fadeIn(300);
    });
    
    $("#default_form").on('click','.editor-btn', function(){
	$("#mathChemEditor-modal .modal-body").html("");
	var latex = $(this).prev().mathquill('latex');
	$("#mathChemEditorInputID").val($(this).prev().attr('id'));
	console.log('from edit: '+latex);
	$("#mathChemEditor-modal").modal('show');
	
	setTimeout(function(){ 
		$("<div>"+latex+"</div>").mathquill('editable').appendTo("#mathChemEditor-modal .modal-body").mathquill('redraw').find('textarea').focus();
	}, 500);
    });
    
    $("#mathChemEditor-modal").on('click','#updateMathChem-btn', function(){
	var latex = $("#mathChemEditor-modal .modal-body div").mathquill('latex');
	var inputID = $("#mathChemEditorInputID").val();
	console.log('from edit: '+latex);
	$("#"+inputID).html(latex).mathquill('editable').mathquill('redraw');
	$("#"+inputID+" textarea").focus();
	$("#mathChemEditor-modal").modal('hide');
	$("#tryTyping").html('');
    });
    
    /******************Change question Type****************************/
    $( "#questionType" ).change(function() {
	changeQuestionType();
    });
    
    
    
    /*****************************Synchronize Checkboxes*************************/
    $('#showCheckbox').click(function(){
	synchronizeCheckbox();
    });
    
    /**************************Change Points Value************************************/
    $( ".points" ).change(function() {
	changePoints();
    });
    
    /************************HelpText Input*********************************************/
    $( ".helpInput" ).change(function() {
        var helpID = $(this).attr('id');
	updateHelpInput(helpID);
    });
    
    /************************HelpLink Input*********************************************/
    $( ".helpLink" ).change(function() {
        var helpID = $(this).attr('id');
	changeHelpLink(helpID);
    });
    
    
    /************************Paragraph keywords Input*********************************************/
    $( ".keyword" ).change(function() {
        var keywordID = $(this).attr('id');
	changeKeyword(keywordID);
    });
    
    /************************Multiplechoice Choices Input*********************************************/
    $( ".choice").change(function() {
        var choiceID = $(this).attr('id');
	updateMulitipleChoice(choiceID);
    });
    
    /************************Multiplechoice Correct Answer Input*********************************************/
    $( ".radioChoice").change(function() {
	updateRadioCorrectAnswer();
    });

    $("#default_form").on('change', 'select', function () {
        var choiceID = $(this).attr('id');
	changeAnswerSelect(choiceID);
    });

    
    
    
    /************************ Delte Input *********************************************/
    $(".page_title").on('click','.x-icon', function(){
        console.log("in delete question");
        var parent = $(this).parent();
        var data = parent.data('options');
        //submitDeleteInput(data.answer_id, data.question_number);
        sureCheck(data.answer_id, data.question_number, 'Are you sure you want to delete this question?', submitDeleteInput);
    });
    
    
    $(".page_title").on('click','.questionTab-holder', function(){
        var data = $(this).data('options');
	var element = $("#input"+data.answer_id);
        
	if (element.data('options').input_type=='mathChem' || element.data('options').input_type=='mathwork') {
		$("#input"+data.answer_id+" textarea").focus();
	}else{
		element.focus();
	}
    });
    
    $(".page_title").on('click','.resize-icon', function(){
        var parent = $(this).parent();
        var data = parent.data('options');
        resizeInput(data.answer_id);
    });
    
    
    
    
    $("#barLogo").click(function(){
        checkAllAnswersFilled();
    });
    
    $("#question-list-btn").click(function(e){
	e.preventDefault();
	//console.log("list btn clicked");
	$('#question-properties').animate({right: -210+"px"}, 300, function(){
		$('#question-list').animate({right: 0+"px"}, 300);
	});
	if (!$(this).hasClass('active')) {
		$(this).toggleClass('active');
		$("#question-properties-btn").toggleClass('active');
	}
    });
    
    $("#question-properties-btn").click(function(e){
	e.preventDefault();
	//console.log("properties btn clicked");
	$('#question-list').animate({right: -210+"px"}, 300, function(){
		$('#question-properties').animate({right: 0+"px"}, 300);
	});
	if (!$(this).hasClass('active')) {
		$(this).toggleClass('active');
		$("#question-list-btn").toggleClass('active');
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
	}
    });
    
    
    $("#zoom-out-btn").click(function(){
	if (zoomStatus>1) {
		zoomStatus--;
		console.log(zoomStatus);
		$("#wrapper").css({
			'zoom': zoomStatus,	
		});
	}
    });
    
    $("#addQuestion-btn").click(function(){
	
        // If nothing's selected, start with a tiny area in the center
        if (!ias.getSelection().width){
            ias.setOptions({ show: true, x1: 0, y1: 0, x2: 0, y2: 0 });
            ias.animateSelection(10, 10, 260, 60, 'slow');
        }
    });
    
    
    
 /************ End of Click events **************************/































/************************   Functions *******************************/






function questionFocus(elementID) {
        console.log('in questionFocus');
        $('.typeMenu').hide();
        var IDnum = elementID.match(/\d+/g);
        $('#'+elementID).css('z-index','1');
        $('#questionMenu').css('display','block');
	var answerID = $('#'+elementID).data("options").answer_id;
	$('#questionNumber').attr('data-options', '{"answer_id":"'+ answerID + '"}');
	$('#questionNumber').data("options").answer_id = answerID;
	$('#questionType').val($('#'+elementID).attr('type'));
	var question_type = $('#'+elementID).data("options").input_type;
	$( "#questionType" ).val(question_type);
	//console.log(question_type);
        $('#questionNumber').val($('#'+elementID).data("options").question_number);
        resizeElements();
        setTimeout(function() {
            var dInput = $('#'+elementID).val();
            //console.log(dInput);
	    if (question_type == 'select') {
		$('#multipleChoicePane').slideDown( "slow");
		for (var j=1; j<6; j++) {
		    $('#choice'+j).val($('#'+elementID).data("choice"+j));
		}
		var optionSelected = $('#'+elementID).val();
		var optionValueNumber = optionSelected.match(/\d+/g);
		$(".radioChoice").prop('checked',false);
		$('#multipleChoicePane .radioChoice[value="'+optionValueNumber+'"]').prop('checked',true);
                $(".choice").css({'background-color':'#ffaaaa'});
                $("#choice"+optionValueNumber).css({'background-color':'#77ff77'});
		
		
	    }
	    else if (question_type == 'checkbox') {
		$('#checkboxPane').slideDown( "slow");
	    }
	    else if (question_type == 'textarea') {
		$('#textareaPane').slideDown( "slow");
		for (var j=1; j<5; j++) {
		    $('#keyword'+j).val($('#'+elementID).data("keyword"+j));
		}
	    }
	    else{
		$('#textPane').slideDown( "slow");
	    }
            $('#correctAnswer').text(dInput);
        }, 500);
	var currentPoints = $('#'+elementID).data("options").points;
	var currentHelpText = $('#'+elementID).data("options").help_text;
	var currentHelpLink = $('#'+elementID).data("options").help_link;
	$('.helpInput').val(currentHelpText);
	$('.points').val(currentPoints);
	$('.helpLink').val(currentHelpLink);
	//console.log(currentPoints);
	//console.log("Points Input: "+$("#points").val());
}





function updateCorrectAnswer_function(elementID) {
        //Interrupt the execution thread to allow input to update
        setTimeout(function() {
            var dInput = $('#'+elementID).val();
            //console.log(dInput);
            $('#correctAnswer').text(dInput);
        }, 0);
}


function changeQuestionNumber() {
	var inputNumber_id = $('#questionNumber').data("options").answer_id;
	var newQuestionNumber = $('#questionNumber').val();
	// change question number of question menu
	
	//alert(inputNumber_id);
	//Dajaxice.myproject.googleapi.updateQuestionNumber(updateQuestionNumber_callback, {'inputNumber': inputNumber_id, 'newQuestionNumber': newQuestionNumber});
        updateQuestionNumber(inputNumber_id, newQuestionNumber);
        
}

function changeAnswer(elementID) {
        console.log("in changeAnswer function.");
        setTimeout(function() {
            var dInput = $('#'+elementID).val();
            //console.log(dInput);
            $('#correctAnswer').text(dInput);
        }, 1);
        
        var inputNumber_id = elementID.match(/\d+/g);
        
        if ($("#"+elementID).attr('type')=='checkbox') {
            var newCorrectAnswer = document.getElementById(elementID).checked;
            if (document.getElementById(elementID).checked == true) {
                $('#showCheckbox').prop("checked", true);
            }
            else{$('#showCheckbox').prop("checked", false);}
        }else if ($("#"+elementID).data("options").input_type=='mathwork' || $("#"+elementID).data("options").input_type=='mathChem') {
	    var newCorrectAnswer = $('#'+elementID).mathquill('latex');
	    newCorrectAnswer = newCorrectAnswer.replace(/\\/g, "\\\\");
	}else{
            var newCorrectAnswer = $('#'+elementID).val();
        }
        console.log("correct answer with change: "+newCorrectAnswer);
	//alert(inputNumber_id);
	//Dajaxice.myproject.googleapi.updateCorrectAnswer(updateCorrectAnswer_callback, {'inputNumber': parseInt(inputNumber_id), 'newCorrectAnswer': (newCorrectAnswer).toString()});
        updateCorrectAnswer(parseInt(inputNumber_id), (newCorrectAnswer).toString());
        
}

function changeQuestionType() {
	var inputNumber_id = $('#questionNumber').data("options").answer_id;
	var inputType = $( "#questionType" ).val();
	var oldInputType = $('#input'+inputNumber_id).data("options").input_type;
	
	//Dajaxice.myproject.googleapi.updateInputType(updateInputType_callback, {'inputNumber': parseInt(inputNumber_id), 'newInputType': (inputType).toString()});
        updateInputType(parseInt(inputNumber_id), (inputType).toString());
        
	//alert(inputNumber_id);
	if (inputType == 'textarea') {
	    createTextarea(oldInputType, 'input'+inputNumber_id);
	}
	else if (inputType == 'select') {
	    createSelect(oldInputType, 'input'+inputNumber_id);
	}
	else if (inputType == 'work') {
	    createWork(oldInputType, 'input'+inputNumber_id);
	}
	else if (inputType == 'mathwork') {
	    createMathWork(oldInputType, 'input'+inputNumber_id);
	}
	else if (inputType == 'mathChem') {
	    createMathChem(oldInputType, 'input'+inputNumber_id);
	}
	else if (inputType == 'drawing') {
	    createDrawing(oldInputType, 'input'+inputNumber_id);
	}
	else if ((inputType == 'text' || inputType == 'number' || inputType == 'checkbox') && (oldInputType == 'textarea' || oldInputType == 'select' || oldInputType == 'work' || oldInputType == 'mathwork' || oldInputType == 'mathChem' || oldInputType == 'drawing')) {
	    //Re-create the default input type
	    createDefaultInput(oldInputType, 'input'+inputNumber_id, inputType);
	    /*
	    $('#input'+inputNumber_id).data("options").input_type = inputType;
	    $('#input'+inputNumber_id).attr('data-options', '{"answer_id":"'+ data.answer_id + '", "question_number":"'+ data.question_number + '", "input_type":"'+inputType+'", "points":"'+data.points+'"}');
	    */
	}
	else{
	    $('#input'+inputNumber_id).get(0).type = inputType;
	    var data = $('#input'+inputNumber_id).data("options");
	    $('#input'+inputNumber_id).data("options").input_type = inputType;
	    $('#input'+inputNumber_id).attr('data-options', '{"answer_id":"'+ data.answer_id + '", "question_number":"'+ data.question_number + '", "input_type":"'+inputType+'", "points":"'+data.points+'", "help_text":"'+data.help_text+'", "help_link":"'+data.help_link+'"}');
	}
	$('#input'+inputNumber_id).focus();
}




    /****************************Create Inputs Area*********************************/
    function createTextarea(oldInputType, elementID) {
	//get the important parts of element
        if (oldInputType=="work") {
            var testStyle = $('#work'+elementID).attr('style');
        }else if (oldInputType=="mathwork") {
            var testStyle = $('#mathwork'+elementID).attr('style');
	}else{var testStyle = $('#'+elementID).attr('style');}
	
	var data = $('#'+elementID).data("options");
	var choice = [];
	for (var i=0;i<5;i++) {
	    choice[i] = $('#'+elementID).data("choice"+(i+1));
	    if (!choice[i]) {
		choice[i] = $('#'+elementID).data("keyword"+(i+1));
	    }
	    //console.log("Create Textarea Choice "+(i+1)+" = "+choice[i]);
	}
	console.log($('#'+elementID).data("choice1"));
	//make the old input disappear
	$('#'+elementID).remove();
	$('#work'+elementID).remove();
	$('#mathwork'+elementID).remove();
	$('#drawing'+elementID).remove();
	$('#editorBtn-'+elementID).remove();
	//$('#'+elementID).css("display","none");
	//$('#'+elementID).attr('id','noShow');
	
	//Now, create the textarea
	$( "#default_form" ).append( "<textarea id='"+ elementID +"' class='answers highlight img-rounded' readonly='readonly' data-options=''>Place keywords to search in order to help with grading later.</textarea>" );
        $('#'+elementID).attr('style',testStyle);
        //$('#'+elementID).attr('data-options', '{"answer_id":"'+ options.answer_id + '", "question_number":"'+ options.question_number + '"}');
	
	$('#'+elementID).attr('data-options', '{"answer_id":"'+ data.answer_id + '", "question_number":"'+ data.question_number + '", "input_type":"textarea", "points":"'+data.points+'", "help_text":"'+data.help_text+'", "help_link":"'+data.help_link+'"}');
	
		for (var j=1; j<6; j++) {
		    if (choice[j-1]) {
			$('#'+elementID).data("choice"+j, choice[j-1]);
			//console.log("Choice"+j+" saved as: "+choice[j-1]);
			$('#'+elementID).data("keyword"+j, choice[j-1]);
		    }
		}
	$('#'+elementID).focus();
        resizeElements();
        
	
	//console.log(style);
	//style="position: absolute;z-index: 1000;left: {{ input.left }}%;top: {{ input.top }}%;width: {{ input.width }}%; height: {{ input.height }}%"
    }
    
    
    function createSelect(oldInputType, elementID) {
	//get the important parts of element
        if (oldInputType=="work") {
            var testStyle = $('#work'+elementID).attr('style');
        }else if (oldInputType=="mathwork") {
            var testStyle = $('#mathwork'+elementID).attr('style');
	}else{var testStyle = $('#'+elementID).attr('style');}
        
	var data = $('#'+elementID).data("options");
	var choice = [];
	for (var i=0;i<5;i++) {
	    choice[i] = $('#'+elementID).data("choice"+(i+1));
	    if (!choice[i]) {
		choice[i] = $('#'+elementID).data("keyword"+(i+1));
	    }
	    //console.log("Create Select Choice "+(i+1)+" = "+choice[i]);
	}
	//make the old input disappear
	$('#'+elementID).remove();
	$('#work'+elementID).remove();
	$('#mathwork'+elementID).remove();
	$('#drawing'+elementID).remove();
	$('#editorBtn-'+elementID).remove();
	
	//Now, create the textarea
	$( "#default_form" ).append( "<select id='"+ elementID +"' class='answers highlight img-rounded' data-options=''><option id='option0' value='none'>Select One...</option></select>" );
        $('#'+elementID).attr('style',testStyle);
	
		for (var j=1; j<5; j++) {
		    if (choice[j-1]) {
			$('#'+elementID).append("<option id='option"+j+"' value='option"+j+"' >"+ choice[j-1] +"</option>");
			$('#'+elementID).data("choice"+j, choice[j-1]);
			$('#'+elementID).data("keyword"+j, choice[j-1]);
		    }
		}
	
	$('#'+elementID).attr('data-options', '{"answer_id":"'+ data.answer_id + '", "question_number":"'+ data.question_number + '", "input_type":"select", "points":"'+data.points+'", "help_text":"'+data.help_text+'", "help_link":"'+data.help_link+'"}');
	
	$('#'+elementID).focus();
        resizeElements();
    }
    
    
    function createWork(oldInputType, elementID) {
	//get the important parts of element
        if (oldInputType=="work") {
            var testStyle = $('#work'+elementID).attr('style');
        }else if (oldInputType=="mathwork") {
            var testStyle = $('#mathwork'+elementID).attr('style');
	}else{var testStyle = $('#'+elementID).attr('style');}
        
	var data = $('#'+elementID).data("options");
	var choice = [];
	for (var i=0;i<5;i++) {
	    choice[i] = $('#'+elementID).data("choice"+(i+1));
	    if (!choice[i]) {
		choice[i] = $('#'+elementID).data("keyword"+(i+1));
	    }
	    //console.log("Create Work Choice "+(i+1)+" = "+choice[i]);
	}
	//make the old input disappear
	$('#'+elementID).remove();
	$('#drawing'+elementID).remove();
	$('#mathwork'+elementID).remove();
	$('#editorBtn-'+elementID).remove();
	
	//Now, create the textarea
        var html = '<div id="work'+ elementID +'" class="highlight img-rounded" data-options="">'+
                        '<div class="work-button img-rounded" style="position:relative;top:40%;left:0;font-size: 20px;text-align: center;">Work Area will be activated for student use...<span style="font-size: 12px;">place answer here.</span>'+
                        '<input id="'+ elementID +'" class="answers highlight" value="" data-options="" type="text" '+
                        'style="width:100px;" title="answer..." name="">'+
                        '</div>'+
                    '</div>'
        
        
        
        
	$( "#default_form" ).append( html );
        $('#work'+elementID).attr('style',testStyle);
        //$('#'+elementID).attr('data-options', '{"answer_id":"'+ options.answer_id + '", "question_number":"'+ options.question_number + '"}');
	
        $('#work'+elementID).attr('data-options', '{"answer_id":"'+ data.answer_id + '", "question_number":"'+ data.question_number + '", "input_type":"work", "points":"'+data.points+'", "help_text":"'+data.help_text+'", "help_link":"'+data.help_link+'"}');
	$('#'+elementID).attr('data-options', '{"answer_id":"'+ data.answer_id + '", "question_number":"'+ data.question_number + '", "input_type":"work", "points":"'+data.points+'", "help_text":"'+data.help_text+'", "help_link":"'+data.help_link+'"}');
	
		for (var j=1; j<6; j++) {
		    if (choice[j-1]) {
			$('#'+elementID).data("choice"+j, choice[j-1]);
			$('#'+elementID).data("keyword"+j, choice[j-1]);
			//console.log("Choice"+j+" saved as: "+choice[j-1]);
		    }
		}
	$('#'+elementID).focus();
        resizeElements();
        //setWorkImage(data.answer_id);
        
    }
    
    
    
    function createMathWork(oldInputType, elementID) {
	//get the important parts of element
        if (oldInputType=="work") {
            var testStyle = $('#work'+elementID).attr('style');
        }else if (oldInputType=="mathwork") {
            var testStyle = $('#mathwork'+elementID).attr('style');
	}else{var testStyle = $('#'+elementID).attr('style');}
        
	var data = $('#'+elementID).data("options");
	var choice = [];
	for (var i=0;i<5;i++) {
	    choice[i] = $('#'+elementID).data("choice"+(i+1));
	    if (!choice[i]) {
		choice[i] = $('#'+elementID).data("keyword"+(i+1));
	    }
	    //console.log("Create Work Choice "+(i+1)+" = "+choice[i]);
	}
	//make the old input disappear
	$('#'+elementID).remove();
	$('#drawing'+elementID).remove();
	$('#work'+elementID).remove();
	$('#editorBtn-'+elementID).remove();
	
	//Now, create the textarea
        var html = '<div id="mathwork'+ elementID +'" class="highlight img-rounded" data-options="">'+
                        '<div class="work-button img-rounded" style="position:relative;top:40%;left:0;font-size: 20px;text-align: center;">Work Area will be activated for student use...<span style="font-size: 12px;">place MATH answer here.</span>'+
                        '<span id="'+ elementID +'" class="answers highlight" data-options=""></span>'+
			'<span id="editorBtn-'+ elementID +'" class="editor-btn btn btn-success btn-xs" style="display: none;position: absolute;z-index: 1;left: 100%;top: 100%;margin: -20px 0 0 -45px;">editor</span>'+
                        '</div>'+
                    '</div>'
        
        
        
        
	$( "#default_form" ).append( html );
        $('#mathwork'+elementID).attr('style',testStyle);
        //$('#'+elementID).attr('data-options', '{"answer_id":"'+ options.answer_id + '", "question_number":"'+ options.question_number + '"}');
	
        $('#mathwork'+elementID).attr('data-options', '{"answer_id":"'+ data.answer_id + '", "question_number":"'+ data.question_number + '", "input_type":"mathwork", "points":"'+data.points+'", "help_text":"'+data.help_text+'", "help_link":"'+data.help_link+'"}');
	$('#'+elementID).attr('data-options', '{"answer_id":"'+ data.answer_id + '", "question_number":"'+ data.question_number + '", "input_type":"mathwork", "points":"'+data.points+'", "help_text":"'+data.help_text+'", "help_link":"'+data.help_link+'"}');
	$('#'+elementID).css({'backgroundColor':'#FFF',});
	$('#'+elementID).mathquill('editable');
	
		for (var j=1; j<6; j++) {
		    if (choice[j-1]) {
			$('#'+elementID).data("choice"+j, choice[j-1]);
			$('#'+elementID).data("keyword"+j, choice[j-1]);
			//console.log("Choice"+j+" saved as: "+choice[j-1]);
		    }
		}
	$('#'+elementID).focus();
        resizeElements();
        //setWorkImage(data.answer_id);
        
    }
    
    
    
    function createMathChem(oldInputType, elementID) {
	//get the important parts of element
        if (oldInputType=="work") {
            var testStyle = $('#work'+elementID).attr('style');
        }else if (oldInputType=="mathwork") {
            var testStyle = $('#mathwork'+elementID).attr('style');
	}else{var testStyle = $('#'+elementID).attr('style');}
        
	var data = $('#'+elementID).data("options");
	var choice = [];
	for (var i=0;i<5;i++) {
	    choice[i] = $('#'+elementID).data("choice"+(i+1));
	    if (!choice[i]) {
		choice[i] = $('#'+elementID).data("keyword"+(i+1));
	    }
	    //console.log("Create Work Choice "+(i+1)+" = "+choice[i]);
	}
	//make the old input disappear
	$('#'+elementID).remove();
	$('#drawing'+elementID).remove();
	$('#work'+elementID).remove();
	$('#mathwork'+elementID).remove();
	$('#editorBtn-'+elementID).remove();
	
	
	var styleList = testStyle.split(' ');
	var editorLeft = parseFloat(styleList[3].split('%')[0])+parseFloat(styleList[7].split('%')[0]);
	var editorTop = parseFloat(styleList[5].split('%')[0])+parseFloat(styleList[9].split('%')[0]);
	var editorStyle = '"display: none; position: absolute; left: '+editorLeft+'%; top: '+editorTop+'%; z-index: 1; margin-left: -45px;"';
	
	
	//Now, create the textarea
        var html = '<span id="'+ elementID +'" class="answers" data-options=""></span>'+
		   '<span id="editorBtn-'+ elementID +'" class="editor-btn btn btn-success btn-xs" style="display: none; position: absolute; left: '+editorLeft+'%; top: '+editorTop+'%; z-index: 1; margin: -9px 0 0 -55px;">editor</span>'
        
        
        
        
	$( "#default_form" ).append( html );
        $('#'+elementID).attr('style',testStyle);
	$('#'+elementID).attr('data-options', '{"answer_id":"'+ data.answer_id + '", "question_number":"'+ data.question_number + '", "input_type":"mathChem", "points":"'+data.points+'", "help_text":"'+data.help_text+'", "help_link":"'+data.help_link+'"}');
	$('#'+elementID).mathquill('editable');
	console.log(testStyle);
	console.log(editorStyle);
	console.log(editorTop);
	
		for (var j=1; j<6; j++) {
		    if (choice[j-1]) {
			$('#'+elementID).data("choice"+j, choice[j-1]);
			$('#'+elementID).data("keyword"+j, choice[j-1]);
			//console.log("Choice"+j+" saved as: "+choice[j-1]);
		    }
		}
	$('#'+elementID).focus();
        resizeElements();
        //setWorkImage(data.answer_id);
        
    }
    
    
    
    function createDrawing(oldInputType, elementID) {
	//get the important parts of element
        if (oldInputType=="work") {
            var testStyle = $('#work'+elementID).attr('style');
        }else if (oldInputType=="mathwork") {
            var testStyle = $('#mathwork'+elementID).attr('style');
	}else{var testStyle = $('#'+elementID).attr('style');}
	
	var data = $('#'+elementID).data("options");
	var choice = [];
	for (var i=0;i<5;i++) {
	    choice[i] = $('#'+elementID).data("choice"+(i+1));
	    if (!choice[i]) {
		choice[i] = $('#'+elementID).data("keyword"+(i+1));
	    }
	    //console.log("Create Textarea Choice "+(i+1)+" = "+choice[i]);
	}
	//make the old input disappear
	$('#'+elementID).remove();
	$('#work'+elementID).remove();
	$('#mathwork'+elementID).remove();
	$('#drawing'+elementID).remove();
	$('#editorBtn-'+elementID).remove();
	//$('#'+elementID).css("display","none");
	//$('#'+elementID).attr('id','noShow');
	
	//Now, create the textarea
	html = "<textarea id='"+ elementID +"' class='answers highlight img-rounded' readonly='readonly' data-options=''></textarea><div id='drawing"+ elementID +"' class='work-button img-rounded'>Drawing Area will be activated for student use. If you don't want this to be auto-graded, assign a point value of zero to the right.</div>"
	
	$( "#default_form" ).append( html );
        $('#'+elementID).attr('style',testStyle+"resize: none;");
        $('#drawing'+elementID).attr('style',testStyle.split('height')[0]+'text-align: center;');
        //$('#'+elementID).attr('data-options', '{"answer_id":"'+ options.answer_id + '", "question_number":"'+ options.question_number + '"}');
	
	$('#'+elementID).attr('data-options', '{"answer_id":"'+ data.answer_id + '", "question_number":"'+ data.question_number + '", "input_type":"drawing", "points":"'+data.points+'", "help_text":"'+data.help_text+'", "help_link":"'+data.help_link+'"}');
	
		for (var j=1; j<6; j++) {
		    if (choice[j-1]) {
			$('#'+elementID).data("choice"+j, choice[j-1]);
			//console.log("Choice"+j+" saved as: "+choice[j-1]);
			$('#'+elementID).data("keyword"+j, choice[j-1]);
		    }
		}
	$('#'+elementID).focus();
        resizeElements();
        
        
    }
    
    
    
    
    function createDefaultInput(oldInputType, elementID, inputType) {
	console.log('oldInputType: '+oldInputType);
	//get the important parts of element
        if (oldInputType=="work") {
            var testStyle = $('#work'+elementID).attr('style');
        }else if (oldInputType=="mathwork") {
            var testStyle = $('#mathwork'+elementID).attr('style');
	}else{var testStyle = $('#'+elementID).attr('style');}
        
	var data = $('#'+elementID).data("options");
	var choice = [];
	for (var i=0;i<5;i++) {
	    choice[i] = $('#'+elementID).data("choice"+(i+1));
	    if (!choice[i]) {
		choice[i] = $('#'+elementID).data("keyword"+(i+1));
	    }
	    //console.log("Create Default Choice "+(i+1)+" = "+choice[i]);
	}
	//make the old input disappear
	$('#'+elementID).remove();
	$('#work'+elementID).remove();
	$('#mathwork'+elementID).remove();
	$('#drawing'+elementID).remove();
	$('#editorBtn-'+elementID).remove();
	//$('#'+elementID).css("display","none");
	//$('#'+elementID).attr('id','noShow');
	
	//Now, create the textarea
	$( "#default_form" ).append( "<input id='"+ elementID +"' class='answers highlight' data-options='' type='"+inputType+"' title='answer...' name=''>" );
        $('#'+elementID).attr('style',testStyle);
        //$('#'+elementID).attr('data-options', '{"answer_id":"'+ options.answer_id + '", "question_number":"'+ options.question_number + '"}');
	
	$('#'+elementID).attr('data-options', '{"answer_id":"'+ data.answer_id + '", "question_number":"'+ data.question_number + '", "input_type":"'+inputType+'", "points":"'+data.points+'", "help_text":"'+data.help_text+'", "help_link":"'+data.help_link+'"}');
	
		for (var j=1; j<6; j++) {
		    if (choice[j-1]) {
			$('#'+elementID).data("choice"+j, choice[j-1]);
			$('#'+elementID).data("keyword"+j, choice[j-1]);
			//console.log("Choice"+j+" saved as: "+choice[j-1]);
		    }
		}
	$('#'+elementID).focus();
	
        resizeElements();
        
	
	//console.log(style);
	//style="position: absolute;z-index: 1000;left: {{ input.left }}%;top: {{ input.top }}%;width: {{ input.width }}%; height: {{ input.height }}%"
    }
    
function changePoints() {
	var inputNumber_id = $('#questionNumber').data("options").answer_id;
	var data = $('#input'+inputNumber_id).data("options");
	var newPoints = $("#points").val();
	console.log("Input Number: "+inputNumber_id+", Data: "+data+", New Point Value: "+newPoints);
	//Dajaxice.myproject.googleapi.updatePoints(updatePoints_callback, {'inputNumber': parseInt(inputNumber_id), 'newPoints': parseInt(newPoints)});
        updatePoints(parseInt(inputNumber_id), parseInt(newPoints));
        
	$('#input'+inputNumber_id).data("options").points = newPoints;
	$('#input'+inputNumber_id).attr('data-options', '{"answer_id":"'+ data.answer_id + '", "question_number":"'+ data.question_number + '", "input_type":"'+data.input_type+'", "points":"'+newPoints+'", "help_text":"'+data.help_text+'", "help_link":"'+data.help_link+'"}');
}

function synchronizeCheckbox() {
	var inputNumber_id = $('#questionNumber').data("options").answer_id;
	if (document.getElementById('showCheckbox').checked == true) {
	    $('#input'+inputNumber_id).prop("checked", true);
	}
	else{$('#input'+inputNumber_id).prop("checked", false);}
	
	var newCorrectAnswer = document.getElementById('showCheckbox').checked;
	updateCorrectAnswer(parseInt(inputNumber_id), (newCorrectAnswer).toString());
	
	
}

function updateHelpInput(helpID) {
	console.log("inside updateHelpInput");
	var inputNumber_id = $('#questionNumber').data("options").answer_id;
	var data = $('#input'+inputNumber_id).data("options");
	var newHelpText = $("#"+helpID).val();
	//Dajaxice.myproject.googleapi.updateHelpText(updateHelpText_callback, {'inputNumber': parseInt(inputNumber_id), 'newHelpText': newHelpText});
        updateHelpText(parseInt(inputNumber_id), newHelpText);
        
	$('#input'+inputNumber_id).data("options").help_text = newHelpText;
	$('#input'+inputNumber_id).attr('data-options', '{"answer_id":"'+ data.answer_id + '", "question_number":"'+ data.question_number + '", "input_type":"'+data.input_type+'", "points":"'+data.points+'", "help_text":"'+newHelpText+'", "help_link":"'+data.help_link+'"}');
        
}

function changeHelpLink(helpID) {
	var inputNumber_id = $('#questionNumber').data("options").answer_id;
	var data = $('#input'+inputNumber_id).data("options");
	var newHelpLink = $("#"+helpID).val();
	
	if(!/^(https?|ftp):\/\//i.test(newHelpLink)) {
		newHelpLink = 'http://'+newHelpLink; // set both the value
	}
	if (!$("#textHelpLink").hasClass('error') && !newHelpLink == '') {
		updateHelpLink(parseInt(inputNumber_id), newHelpLink);
		$('#input'+inputNumber_id).data("options").help_link = newHelpLink;
	}
	
	
	
	/*
	if (!newHelpLink == '') {
	    if(!/^(https?|ftp):\/\//i.test(newHelpLink)) {
		newHelpLink = 'http://'+newHelpLink;
	    }
	    if (isValidURL(newHelpLink)) {
		$("#"+helpID).attr('style','background-color:none; color:black;');
		//Dajaxice.myproject.googleapi.updateHelpLink(updateHelpLink_callback, {'inputNumber': parseInt(inputNumber_id), 'newHelpLink': newHelpLink});
                updateHelpLink(parseInt(inputNumber_id), newHelpLink);
                
		$('#input'+inputNumber_id).data("options").help_link = newHelpLink;
		$('#input'+inputNumber_id).attr('data-options', '{"answer_id":"'+ data.answer_id + '", "question_number":"'+ data.question_number + '", "input_type":"'+data.input_type+'", "points":"'+data.points+'", "help_text":"'+data.help_text+'", "help_link":"'+newHelpLink+'"}');
		//console.log("isValid");
	    }else{
		$("#"+helpID).attr('style','background-color:#F8E0E0; color:red;');
		newHelpLink = "Not a Valid URL";
		$('#input'+inputNumber_id).data("options").help_link = newHelpLink;
		$('#input'+inputNumber_id).attr('data-options', '{"answer_id":"'+ data.answer_id + '", "question_number":"'+ data.question_number + '", "input_type":"'+data.input_type+'", "points":"'+data.points+'", "help_text":"'+data.help_text+'", "help_link":"'+newHelpLink+'"}');
		//console.log("Not Valid");
	    }
	}else{
	    $("#"+helpID).attr('style','background-color:none; color:black;');
	    //Dajaxice.myproject.googleapi.updateHelpLink(updateHelpLink_callback, {'inputNumber': parseInt(inputNumber_id), 'newHelpLink': newHelpLink});
            updateHelpLink(parseInt(inputNumber_id), newHelpLink);
                
	    $('#input'+inputNumber_id).data("options").help_link = newHelpLink;
	    $('#input'+inputNumber_id).attr('data-options', '{"answer_id":"'+ data.answer_id + '", "question_number":"'+ data.question_number + '", "input_type":"'+data.input_type+'", "points":"'+data.points+'", "help_text":"'+data.help_text+'", "help_link":"'+newHelpLink+'"}');
		
	}
	*/
}

    function isValidURL(url){
	var RegExp = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/;
    
	if(RegExp.test(url)){
	    return true;
	}else{
	    return false;
	}
    } 
    

function changeKeyword(keywordID) {
        var optionIDNumber = keywordID.match(/\d+/g);
	var inputNumber_id = $('#questionNumber').data("options").answer_id;
	var data = $('#input'+inputNumber_id).data("options");
	var newKeyword = $("#"+keywordID).val();
	console.log('keyword ID: '+keywordID+' OptionID number: '+optionIDNumber+' Ney Keyword: '+newKeyword);
	//Dajaxice.myproject.googleapi.updateKeyword(updateKeyword_callback, {'inputNumber': parseInt(inputNumber_id), 'optionIDNumber': parseInt(optionIDNumber), 'newKeyword': newKeyword});
        updateKeyword(parseInt(inputNumber_id), parseInt(optionIDNumber), newKeyword);
        
	$('#input'+inputNumber_id).data(keywordID, newKeyword);
}


function updateMulitipleChoice(choiceID) {
        var optionIDNumber = choiceID.match(/\d+/g);
	var inputNumber_id = $('#questionNumber').data("options").answer_id;
	var data = $('#input'+inputNumber_id).data("options");
	var newChoice = $("#"+choiceID).val();
	//console.log('keyword ID: '+keywordID+' OptionID number: '+optionIDNumber+' Ney Keyword: '+newKeyword);
	//Dajaxice.myproject.googleapi.updateChoice(updateChoice_callback, {'inputNumber': parseInt(inputNumber_id), 'optionIDNumber': parseInt(optionIDNumber), 'newChoice': newChoice});
        if (newChoice.length>45){
		alert('Woops, you can only use 45 characters for an answer.')
	}else{
		updateChoice(parseInt(inputNumber_id), parseInt(optionIDNumber), newChoice);
	}
	
        
	$('#input'+inputNumber_id).data(choiceID, newChoice);
	
	if ($('#input'+inputNumber_id+' #option'+optionIDNumber).length) {
	    console.log(choiceID+' exists');
	    $('#input'+inputNumber_id+' #option'+optionIDNumber).text(newChoice)
	}else{
	    console.log(choiceID+' Does not exists');
	    $('#input'+inputNumber_id).append("<option id='option"+optionIDNumber+"' value='option"+optionIDNumber+"' >"+ newChoice +"</option>");
	}
	
}

function updateRadioCorrectAnswer() {
	var inputNumber_id = $('#questionNumber').data("options").answer_id;
	var correctAnswer = $('#multipleChoicePane input[name=correctChoice]:checked').val();
	var newCorrectAnswer = 'option'+correctAnswer;
	console.log("correctAnswer: "+correctAnswer+" newCorrectAnswer: "+newCorrectAnswer);
        // change color to show correct answers
        $(".choice").css({'background-color':'#ffaaaa'});
        $("#choice"+correctAnswer).css({'background-color':'#77ff77'});
	$('#input'+inputNumber_id).val('option'+correctAnswer);
	//Dajaxice.myproject.googleapi.updateCorrectAnswer(updateCorrectAnswer_callback, {'inputNumber': parseInt(inputNumber_id), 'newCorrectAnswer': (newCorrectAnswer).toString()});
        updateCorrectAnswer(parseInt(inputNumber_id), (newCorrectAnswer).toString());
        
}

function changeAnswerSelect(choiceID) {
	var optionSelected = $("#"+choiceID).val();
        var optionValueNumber = optionSelected.match(/\d+/g);
	console.log("choiceID: "+choiceID+", option selected: "+optionSelected+", valueNumber: "+optionValueNumber);
        $(".choice").css({'background-color':'#ffaaaa'});
        $("#choice"+optionValueNumber).css({'background-color':'#77ff77'});
	$(".radioChoice").prop('checked',false);
	$('#multipleChoicePane input[value="'+optionValueNumber+'"]').prop('checked',true);
	for (var i=1;i<6;i++) {
	    console.log('Option Checked Value Number '+i+': '+$('input[value="'+i+'"]').prop('checked'));
	}
}



function showSideBarMenu() {
	$('#sidebar').animate({marginLeft: -210+"px"}, 1000, function(){resizeElements();$("#nav-accordion").attr('style','display: none;');});
	$('#main-content').animate({marginRight: 220+"px", marginLeft: 0}, 1000);
	//$('#main-content').animate({width: (wholeScreenWidth-270)+"px"}, 1000, function(){resizeElements();});
	$('#sidebar-right').animate({marginRight: 0}, 1000);
	$("#hide-question-sidebar-btn").show();
	$("#show-question-sidebar-btn").hide();
}


function hideSideBarMenu() {
	if ($('#sidebar-right').is(":visible")) {
		$('#sidebar-right').animate({marginRight: -220+"px"}, 1000);
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

function resizeInput(answer_id) {
    var question_number = $("#input"+answer_id).data('options').question_number;
    if ($("#input"+answer_id).data('options').input_type == 'work') {
        var element = $("#workinput"+answer_id);
    }else{var element = $("#input"+answer_id);}
    
    var pos = element.position();
    var myx1 = parseInt(pos.left);
    var myy1 = parseInt(pos.top);
    var myx2 = parseInt(element.width()+myx1);
    var myy2 = parseInt(element.height()+myy1);
    //console.log("x1: "+ myx1+" y1: "+myy1+" x2: "+myx2+" y2: "+myy2);
    $("#input"+answer_id).fadeOut(600);
    $("#workinput"+answer_id).fadeOut(600);
    //$('.imgareaselect-outer').css('background-color','rgb(152,128,5)');
    $('.imgareaselect-outer').unbind('click').click(function(){
        $("#input"+answer_id).fadeIn(600);
        $("#workinput"+answer_id).fadeIn(600);
    });
    $( document ).unbind('dblclick').dblclick(function(){
        //console.log('double clicked');
            //console.log(ias.getSelection());
                    //alert('selection is visible');
            if (ias.getSelection().width>0) {
                resizeQuestionElement(ias.getSelection(), answer_id);
            }
    });
    
    
    $( document ).unbind('click').on('click','#createSelection',function() {
            if (ias.getSelection().width>0) {
                resizeQuestionElement(ias.getSelection(), answer_id);
            }
    });
    //  Create its own reset for resetting selection
    
    $(document).unbind('keydown').keydown(function (e) {
        console.log("keydown: "+e.keyCode);
        if (e.keyCode == 13){
            e.preventDefault();
            //alert('selection is visible');
            //console.log("enter area visible: "+$('#enter_area').is(":visible"));
            //console.log(ias.getSelection());
            if (ias.getSelection().width>0) {
                resizeQuestionElement(ias.getSelection(), answer_id);
            }
        }
    });
    
    
        // If nothing's selected, start with a tiny area in the center
        if (!ias.getSelection().width){
            ias.setOptions({ show: true, x1: 0, y1: 0, x2: 0, y2: 0 });
            ias.animateSelection(myx1, myy1, myx2, myy2, 'slow');
        }
        
                //ias.setSelection(myx1, myy1, myx2, myy2);
                //ias.setOptions({ show: true });
                //ias.update();
		
	$('#backgroundImage').unbind('click').click(function(){
		makeImageAreaSelection();
	}).unbind('click').click(function(){ hideSideBarMenu(); });
	
}


function resizeQuestionElement(selection, input_id) {
    //console.log("in resize question");
    whiteFlash();
    ias.cancelSelection();
    
    var imageWidth = $( '#wrapper' ).width();
    leftPercentage = (selection.x1/imageWidth)*100;
    var imageHeight = $( '#wrapper' ).height();
    topPercentage = (selection.y1/imageHeight)*100;
    widthPercentage = (selection.width/imageWidth)*100;
    heightPercentage = (selection.height/imageHeight)*100;
    
    var inputType = $("#input"+input_id).data("options").input_type;
    //console.log(inputType);
    if (inputType=='work') {
        var element = $("#workinput"+input_id);
    }else{var element = $("#input"+input_id);}
    element.css({
                'left': leftPercentage + '%',
                'top': topPercentage+ '%',
                'width': widthPercentage + '%',
                'height': heightPercentage + '%'
        });
    
    $("#input"+input_id).fadeIn(600);
    $("#workinput"+input_id).fadeIn(600);
    
    //submit percentage changes
    updateInputPosition(input_id, parseFloat(leftPercentage), parseFloat(topPercentage), parseFloat(widthPercentage), parseFloat(heightPercentage));
    
    //Then turn back on original selection
    makeImageAreaSelection();
    $('#backgroundImage').unbind('click').click(function(){
		hideSideBarMenu();
	});
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
                $('html, body').animate({
                    scrollTop: (top-100) + 'px'
                }, 2000);
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
                $('html, body').animate({
                    scrollTop: (top-100) + 'px'
                }, 2000);
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
                $('html, body').animate({
                    scrollTop: (top-100) + 'px'
                }, 2000);
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



  /*******************  End of Functions ***************************/





























/**************************   Ajax calls ******************************/








    /************************** Update Input Points  *************************************************************************8*****/
	function updatePoints(inputNumber, newPoints){
		console.log('In updatePoints');
	    
            var csrftoken = getCookie('csrftoken');
	    var uri = updatePointsURL;
            var xhr = new XMLHttpRequest();
            var fd = new FormData();
            
            xhr.open("POST", uri, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    // Handle response.
		    //console.log(xhr.responseText);
		    var data = JSON.parse(xhr.responseText)
		    console.log("Return from updatePoints: "+data);
		    if (data.error) {alert(data.error);}
		    else{}
                }
            };
            fd.append('userInfo_id', userInfo_id_ajax);
            fd.append('inputNumber', inputNumber);
            fd.append('newPoints', newPoints);
	    
            // Initiate a multipart/form-data upload
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
	    xhr.send(fd);
	    //console.log( xhr._object);
        }
	

    /************************** Update Input Points  *************************************************************************8*****/
	function updateHelpText(inputNumber, newHelpText){
		console.log('In updateHelpText');
	    
            var csrftoken = getCookie('csrftoken');
	    var uri = updateHelpTextURL;
            var xhr = new XMLHttpRequest();
            var fd = new FormData();
            
            xhr.open("POST", uri, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    // Handle response.
		    //console.log(xhr.responseText);
		    var data = JSON.parse(xhr.responseText)
		    console.log("Return from updateHelpText: "+data);
		    if (data.error) {alert(data.error);}
		    else{}
                }
            };
            fd.append('userInfo_id', userInfo_id_ajax);
            fd.append('inputNumber', inputNumber);
            fd.append('newHelpText', newHelpText);
	    
            // Initiate a multipart/form-data upload
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
	    xhr.send(fd);
	    //console.log( xhr._object);
        }
	
	
	
    /************************** Update Helplink  *************************************************************************8*****/
	function updateHelpLink(inputNumber, newHelpLink){
		console.log('In updateHelpLink');
	    
            var csrftoken = getCookie('csrftoken');
	    var uri = updateHelpLinkURL;
            var xhr = new XMLHttpRequest();
            var fd = new FormData();
            
            xhr.open("POST", uri, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    // Handle response.
		    //console.log(xhr.responseText);
		    var data = JSON.parse(xhr.responseText)
		    console.log("Return from updateHelpLink: "+data);
		    if (data.error) {alert(data.error);}
		    else{}
                }
            };
            fd.append('userInfo_id', userInfo_id_ajax);
            fd.append('inputNumber', inputNumber);
            fd.append('newHelpLink', newHelpLink);
	    
            // Initiate a multipart/form-data upload
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
	    xhr.send(fd);
	    //console.log( xhr._object);
        }
	
	
	
    /************************** Update Keyword  *************************************************************************8*****/
	function updateKeyword(inputNumber, optionIDNumber, newKeyword){
		console.log('In updateKeyword');
	    
            var csrftoken = getCookie('csrftoken');
	    var uri = updateKeywordURL;
            var xhr = new XMLHttpRequest();
            var fd = new FormData();
            
            xhr.open("POST", uri, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    // Handle response.
		    //console.log(xhr.responseText);
		    var data = JSON.parse(xhr.responseText)
		    console.log("Return from updateKeyword: "+data);
		    if (data.error) {alert(data.error);}
		    else{}
                }
            };
            fd.append('userInfo_id', userInfo_id_ajax);
            fd.append('inputNumber', inputNumber);
            fd.append('optionIDNumber', optionIDNumber);
            fd.append('newKeyword', newKeyword);
	    
            // Initiate a multipart/form-data upload
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
	    xhr.send(fd);
	    //console.log( xhr._object);
        }
	
	
	
    /************************** Update Choice  *************************************************************************8*****/
	function updateChoice(inputNumber, optionIDNumber, newChoice){
		console.log('In updateChoice');
	    
            var csrftoken = getCookie('csrftoken');
	    var uri = updateChoiceURL;
            var xhr = new XMLHttpRequest();
            var fd = new FormData();
            
            xhr.open("POST", uri, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    // Handle response.
		    console.log(xhr.responseText);
		    var data = JSON.parse(xhr.responseText)
		    console.log("Return from updateChoice: "+data);
		    if (data.error) {alert(data.error);}
		    else{}
                }
            };
            fd.append('userInfo_id', userInfo_id_ajax);
            fd.append('inputNumber', inputNumber);
            fd.append('optionIDNumber', optionIDNumber);
            fd.append('newChoice', newChoice);
	    
            // Initiate a multipart/form-data upload
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
	    xhr.send(fd);
	    //console.log( xhr._object);
        }
	
	
	
    /************************** Update Correct Answer  *************************************************************************8*****/
	function updateCorrectAnswer(inputNumber, newCorrectAnswer){
		console.log('In updateCorrectAnswer');
	    
            var csrftoken = getCookie('csrftoken');
	    var uri = updateCorrectAnswerURL;
            var xhr = new XMLHttpRequest();
            var fd = new FormData();
            
            xhr.open("POST", uri, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    // Handle response.
		    //console.log(xhr.responseText);
		    var data = JSON.parse(xhr.responseText)
		    console.log("Return from updateCorrectAnswer: "+data);
		    if (data.error) {alert(data.error);}
		    else{}
                }
            };
            fd.append('userInfo_id', userInfo_id_ajax);
            fd.append('inputNumber', inputNumber);
            fd.append('newCorrectAnswer', newCorrectAnswer);
	    
            // Initiate a multipart/form-data upload
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
	    xhr.send(fd);
	    //console.log( xhr._object);
        }
	
	
	
    /************************** Update Question Number  *************************************************************************8*****/
	function updateQuestionNumber(inputNumber, newQuestionNumber){
		console.log('In updateQuestionNumber');
	    
            var csrftoken = getCookie('csrftoken');
	    var uri = updateQuestionNumberURL;
            var xhr = new XMLHttpRequest();
            var fd = new FormData();
            
            xhr.open("POST", uri, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    // Handle response.
		    //console.log(xhr.responseText);
		    var data = JSON.parse(xhr.responseText)
		    console.log("Return from updateQuestionNumber: "+data);
		    if (data.error) {alert(data.error);}
		    else{
		    
			$("#input"+ data.inputNumber).data("options").question_number = data.newQuestionNumber;
			$("#input"+ data.inputNumber).attr('data-options', '{"answer_id":"'+ data.inputNumber + '", "question_number":"'+ data.newQuestionNumber + '", "input_type":"'+ data.inputType +'", "points":"'+data.points+'", "help_text":"'+data.help_text+'", "help_link":"'+data.help_link+'"}');
			//alert(data.inputNumber);
			
			//update questionTab
			$("#questionTab"+data.inputNumber).attr('data-options', '{"answer_id":"'+ data.inputNumber + '", "question_number":"'+ data.newQuestionNumber + '"}');
			$("#questionTab"+data.inputNumber+" .question_click").html("Question "+data.newQuestionNumber);
		    
		    }
                }
            };
            fd.append('userInfo_id', userInfo_id_ajax);
            fd.append('inputNumber', inputNumber);
            fd.append('newQuestionNumber', newQuestionNumber);
	    
            // Initiate a multipart/form-data upload
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
	    xhr.send(fd);
	    //console.log( xhr._object);
        }
	
	
	
	
    /************************** Image Area Set  Create Input *************************************************************************8*****/
	function imageAreaSet(project_id, pageNumber, inputNumber, left, top, width, height){
		console.log('In imageAreaSet');
	    toggleSpinner();
            var csrftoken = getCookie('csrftoken');
	    var uri = imageAreaSetURL;
            var xhr = new XMLHttpRequest();
            var fd = new FormData();
            
            xhr.open("POST", uri, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    // Handle response.
		    //console.log(xhr.responseText);
		    var data = JSON.parse(xhr.responseText)
		    console.log("Return from imageAreaSet: "+data);
		    if (data.error) {alert(data.error);}
		    else{
			imageAreaSet_callback(data);
			toggleSpinner();
		    }
                }
            };
	    xhr.timeout = 4000;
	    xhr.ontimeout = function () { location.reload(); }
            fd.append('userInfo_id', userInfo_id_ajax);
            fd.append('inputNumber', inputNumber);
            fd.append('project_id', project_id_ajax);
            fd.append('pageNumber', pageNumber);
            fd.append('left', left);
            fd.append('top', top);
            fd.append('width', width);
            fd.append('height', height);
	    
            // Initiate a multipart/form-data upload
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
	    xhr.send(fd);
	    //console.log( xhr._object);
        }
	
	
	
    /************************** Delete Input *************************************************************************8*****/
	function submitDeleteInput(inputNumber, questionNumber){
		console.log('In submitDeleteInput');
	    
            var csrftoken = getCookie('csrftoken');
	    var uri = submitDeleteInputURL;
            var xhr = new XMLHttpRequest();
            var fd = new FormData();
            
            xhr.open("POST", uri, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    // Handle response.
		    //console.log(xhr.responseText);
		    var data = JSON.parse(xhr.responseText)
		    console.log("Return from submitDeleteInput: "+data);
		    if (data.error) {alert(data.error);}
		    else{
			$("#questionTab"+inputNumber).parent().remove();
			$("#input"+inputNumber).remove();
			$("#workinput"+inputNumber).remove();
			$("#mathworkinput"+inputNumber).remove();
		    }
                }
            };
	    xhr.timeout = 4000;
	    xhr.ontimeout = function () { location.reload(); }
            fd.append('userInfo_id', userInfo_id_ajax);
            fd.append('inputNumber', inputNumber);
            fd.append('project_id', project_id_ajax);
            fd.append('pageNumber', pageNumber_ajax);
	    
            // Initiate a multipart/form-data upload
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
	    xhr.send(fd);
	    //console.log( xhr._object);
        }
	
	
	
	
    /************************** Save Workbox Image *************************************************************************8*****/
	function setWorkImage(inputNumber){
		console.log('In setWorkImage');
	    
            var csrftoken = getCookie('csrftoken');
	    var uri = setWorkImageURL;
            var xhr = new XMLHttpRequest();
            var fd = new FormData();
            
            xhr.open("POST", uri, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    // Handle response.
		    //console.log(xhr.responseText);
		    var data = JSON.parse(xhr.responseText)
		    console.log("Return from setWorkImage: "+data);
		    if (data.error) {alert(data.error);}
		    else{
			
		    }
                }
            };
	    xhr.timeout = 4000;
	    xhr.ontimeout = function () { location.reload(); }
            fd.append('userInfo_id', userInfo_id_ajax);
            fd.append('inputNumber', inputNumber);
            fd.append('project_id', project_id_ajax);
            fd.append('pageNumber', pageNumber_ajax);
	    
            // Initiate a multipart/form-data upload
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
	    xhr.send(fd);
	    //console.log( xhr._object);
        }
	
	
	
    /************************** Update Input Type  *************************************************************************8*****/
	function updateInputType(inputNumber, newInputType){
		console.log('In updateInputType');
	    
            var csrftoken = getCookie('csrftoken');
	    var uri = updateInputTypeURL;
            var xhr = new XMLHttpRequest();
            var fd = new FormData();
            
            xhr.open("POST", uri, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    // Handle response.
		    //console.log(xhr.responseText);
		    var data = JSON.parse(xhr.responseText)
		    console.log("Return from updateInputType: "+data);
		    if (data.error) {alert(data.error);}
		    else{}
                }
            };
            fd.append('userInfo_id', userInfo_id_ajax);
            fd.append('inputNumber', inputNumber);
            fd.append('newInputType', newInputType);
            fd.append('project_id', project_id_ajax);
            fd.append('pageNumber', pageNumber_ajax);
	    
            // Initiate a multipart/form-data upload
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
	    xhr.send(fd);
	    //console.log( xhr._object);
        }
	
	
	
	
	
    /************************** Update Input Position *************************************************************************8*****/
	function updateInputPosition(input_id, left, top, width, height){
		console.log('In updateInputPosition');
	    toggleSpinner();
            var csrftoken = getCookie('csrftoken');
	    var uri = updateInputPositionURL;
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
			toggleSpinner();
			if (data.inputType=='work'){
			    updateInputType(input_id, 'work');
			}
		    }
                }
            };
	    xhr.timeout = 4000;
	    xhr.ontimeout = function () { location.reload(); }
            fd.append('userInfo_id', userInfo_id_ajax);
            fd.append('inputNumber', input_id);
            fd.append('left', left);
            fd.append('top', top);
            fd.append('width', width);
            fd.append('height', height);
	    
            // Initiate a multipart/form-data upload
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
	    xhr.send(fd);
	    //console.log( xhr._object);
        }
	
	
	
	
	
	
	
	
	
	
	// Math Chem editor
	$('#editor-tabs a').click(function (e) {
		e.preventDefault()
		$(this).tab('show')
	})
        
	    
	$("#mathTab button, #chemTab button").each(function(){
	    $(this).popover();
	});
        
        
	$("#mathTab button, #chemTab button").click(function(){
		var latex = $(this).data('mathquill');
		var tryTyping = $(this).data('trytyping');
		
		console.log(tryTyping);
		$("#mathChemEditor-modal .modal-body div").mathquill('write',latex);
		if ($("#mathChemEditor-modal .modal-body div .empty:first").length){
			$("#mathChemEditor-modal .modal-body div .empty:first").mousedown().mouseup();
		}else{
			$("#mathChemEditor-modal .modal-body div textarea").focus();
		}
		$("#tryTyping").fadeOut(300, function(){
			$("#tryTyping").html("Or try typing: <span class='text-danger'>"+tryTyping+"</span>").fadeIn(300);
		});
	});
	
	
	
	
        
});  /****************** End of Ajax calls ***************************/