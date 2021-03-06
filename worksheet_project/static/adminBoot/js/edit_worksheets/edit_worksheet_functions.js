$('document').ready(function(){




function questionFocus(elementID) {
        //alert('here');
        $('.typeMenu').hide();
        var IDnum = elementID.match(/\d+/g);
        $('#'+elementID).css('z-index','1002');
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



function hideEverything(elementID) {
        //alert('background');
        $('.answers').blur();
        var IDnum = elementID.match(/\d+/g);
        $('#'+elementID).css('z-index','1000');
        $('#questionMenu').hide("slow");
        $('.typePane').hide("slow");
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
	//alert(inputNumber_id);
	//Dajaxice.myproject.googleapi.updateQuestionNumber(updateQuestionNumber_callback, {'inputNumber': inputNumber_id, 'newQuestionNumber': newQuestionNumber});
        updateQuestionNumber(inputNumber_id, newQuestionNumber);
        
}
/*
    function updateQuestionNumber_callback(data){
	$("#input"+ data.inputNumber).data("options").question_number = data.newQuestionNumber;
	$("#input"+ data.inputNumber).attr('data-options', '{"answer_id":"'+ data.inputNumber + '", "question_number":"'+ data.newQuestionNumber + '", "input_type":"'+ data.inputType +'", "points":"'+data.points+'", "help_text":"'+data.help_text+'", "help_link":"'+data.help_link+'"}');
	//alert(data.inputNumber);
    }
*/

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
        }else{
            var newCorrectAnswer = $('#'+elementID).val();
        }
        console.log("correct answer with change: "+newCorrectAnswer);
	//alert(inputNumber_id);
	//Dajaxice.myproject.googleapi.updateCorrectAnswer(updateCorrectAnswer_callback, {'inputNumber': parseInt(inputNumber_id), 'newCorrectAnswer': (newCorrectAnswer).toString()});
        updateCorrectAnswer(parseInt(inputNumber_id), (newCorrectAnswer).toString());
        
}
/*
    function updateCorrectAnswer_callback(data){
	//alert(data.inputNumber);
    }
*/

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
	else if ((inputType == 'text' || inputType == 'number' || inputType == 'checkbox') && (oldInputType == 'textarea' || oldInputType == 'select' || oldInputType == 'work')) {
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
/*
    function updateInputType_callback(data) {
	//console.log("Update Callback Complete");
    }
*/



    /****************************Create Inputs Area*********************************/
    function createTextarea(oldInputType, elementID) {
	//get the important parts of element
        if (oldInputType=="work") {
            var testStyle = $('#work'+elementID).attr('style');
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
    
    function createDefaultInput(oldInputType, elementID, inputType) {
	//get the important parts of element
        if (oldInputType=="work") {
            var testStyle = $('#work'+elementID).attr('style');
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
/*
    function updatePoints_callback(data) {
	//code
    }
*/

function synchronizeCheckbox() {
	var inputNumber_id = $('#questionNumber').data("options").answer_id;
	if (document.getElementById('showCheckbox').checked == true) {
	    $('#input'+inputNumber_id).prop("checked", true);
	}
	else{$('#input'+inputNumber_id).prop("checked", false);}
}

function updateHelpInput(helpID) {
	var inputNumber_id = $('#questionNumber').data("options").answer_id;
	var data = $('#input'+inputNumber_id).data("options");
	var newHelpText = $("#"+helpID).val();
	//Dajaxice.myproject.googleapi.updateHelpText(updateHelpText_callback, {'inputNumber': parseInt(inputNumber_id), 'newHelpText': newHelpText});
        updateHelpText(parseInt(inputNumber_id), newHelpText);
        
	$('#input'+inputNumber_id).data("options").help_text = newHelpText;
	$('#input'+inputNumber_id).attr('data-options', '{"answer_id":"'+ data.answer_id + '", "question_number":"'+ data.question_number + '", "input_type":"'+data.input_type+'", "points":"'+data.points+'", "help_text":"'+newHelpText+'", "help_link":"'+data.help_link+'"}');
        
}
/*
    function updateHelpText_callback(data) {
	//code
    }
*/

function changeHelpLink(helpID) {
	var inputNumber_id = $('#questionNumber').data("options").answer_id;
	var data = $('#input'+inputNumber_id).data("options");
	var newHelpLink = $("#"+helpID).val();
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
}
/*
    function updateHelpLink_callback(data) {
	//code
    }
*/

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
/*
    function updateKeyword_callback(data) {
	console.log("Keyword Update complete");
    }
*/


function updateMulitipleChoice(choiceID) {
        var optionIDNumber = choiceID.match(/\d+/g);
	var inputNumber_id = $('#questionNumber').data("options").answer_id;
	var data = $('#input'+inputNumber_id).data("options");
	var newChoice = $("#"+choiceID).val();
	//console.log('keyword ID: '+keywordID+' OptionID number: '+optionIDNumber+' Ney Keyword: '+newKeyword);
	//Dajaxice.myproject.googleapi.updateChoice(updateChoice_callback, {'inputNumber': parseInt(inputNumber_id), 'optionIDNumber': parseInt(optionIDNumber), 'newChoice': newChoice});
        updateChoice(parseInt(inputNumber_id), parseInt(optionIDNumber), newChoice);
        
	$('#input'+inputNumber_id).data(choiceID, newChoice);
	
	if ($('#input'+inputNumber_id+' #option'+optionIDNumber).length) {
	    console.log(choiceID+' exists');
	    $('#input'+inputNumber_id+' #option'+optionIDNumber).text(newChoice)
	}else{
	    console.log(choiceID+' Does not exists');
	    $('#input'+inputNumber_id).append("<option id='option"+optionIDNumber+"' value='option"+optionIDNumber+"' >"+ newChoice +"</option>");
	}
	
}
/*
    function updateChoice_callback(data) {
	console.log("Choice Update complete");
    }
*/

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

function toggleSideBarMenu() {
	var wholeScreenWidth = $('body').width();
	if ($('#sidebar-content').is(":visible")) {
	    $('#wrapper-holder').animate({width: (wholeScreenWidth)+"px"}, 1000);
	    $('#app-bar-content').animate({width: (wholeScreenWidth)+"px"}, 1000, function(){resizeElements();});
	    $('#sidebar-content').hide("slow");
	}
	else{
	    $('#wrapper-holder').animate({width: (wholeScreenWidth-270)+"px"}, 1000);
	    $('#app-bar-content').animate({width: (wholeScreenWidth-270)+"px"}, 1000, function(){resizeElements();});
	    $('#sidebar-content').attr('style','display:block;');
	}
}


function showSideBarMenu() {
	var wholeScreenWidth = $('body').width();
	$('#wrapper-holder').animate({width: (wholeScreenWidth-270)+"px"}, 1000);
	//$('#app-bar-content').animate({width: (wholeScreenWidth-270)+"px"}, 1000, function(){resizeElements();});
	//$('#sidebar-content').attr('style','display:block;');
}


function hideSideBarMenu() {
	var wholeScreenWidth = $('body').width();
	if ($('#sidebar-content').is(":visible")) {
	    $('#wrapper-holder').animate({width: (wholeScreenWidth)+"px"}, 1000);
	    $('#app-bar-content').animate({width: (wholeScreenWidth)+"px"}, 1000, function(){resizeElements();});
	    $('#sidebar-content').hide("slow");
	}
}

function whiteFlash() {
    $("#flash").show();
    $("#flash").fadeOut(400);
}

function highLightQuestionNumber(questionNumber) {
    $(".questionTab-holder").removeClass('highlight-questionTab');
    $("#questionTab"+questionNumber).addClass('highlight-questionTab');
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

    
function toggleButtons(button) {
    if ($('#questionList').is(":visible") && button == 'button2') {
        $("#questionList").fadeOut(600);
        $("#question-Info-Holder").fadeIn(600);
    }
    else if ($('#question-Info-Holder').is(":visible") && button == 'button1'){
        $("#questionList").fadeIn(600);
        $("#question-Info-Holder").fadeOut(600);
    }
}
    


    /***************************** Sure Checks and Callbacks ************************************************************************/
    function sureCheck(answer_id, question_number, sureText, callback) {
	$("#text-holder-sure").html(sureText);
	$("#shade").fadeIn(600);
	$("#areYouSurePopup").fadeIn(600);
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
    
    
    /***************************** Generic Checks and Callbacks ************************************************************************/
    function genericCheck(callbackData, sureText, button1, button2, callback1, callback2) {
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
    }
    
    
function closePopups() {
    $("#shade").fadeOut(600);
    $(".popup").fadeOut(600);
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





});