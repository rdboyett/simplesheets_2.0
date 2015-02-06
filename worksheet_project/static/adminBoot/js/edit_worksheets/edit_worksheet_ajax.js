$('document').ready(function(){




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
		    //console.log(xhr.responseText);
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
			$("#questionTab"+questionNumber).remove();
			$("#input"+inputNumber).remove();
			$("#workinput"+inputNumber).remove();
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
	
	
	
        
        
        
        
});