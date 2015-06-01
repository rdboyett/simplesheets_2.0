$(document).ready(function(){
    
    
    
    
    $('#sidebar').animate({marginLeft: -210+"px"}, 1000, function(){$("#nav-accordion").attr('style','display: none;');});
    $('#main-content').animate({marginRight: 0+"px", marginLeft: 0}, 1000);
    
    
    
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
    
    function checkAnswers() {
        $.ajax({
            method: "POST",
            url: liveMonitorAnswersURL,
            data: liveMonitorData,
            timeout: 4000,
            dataType: "json",
        })
            .done(function( data ) {
                //console.log( data );
                if (data.answers) {
                    for (var i=0;i<data.answers.length;i++) {
                        //console.log(data.answers[i].id);
                        //console.log(data.answers[i].bCorrect);
                        if ($("#"+data.answers[i].id).length) {
			    if (data.answers[i].grade) {
				if (parseFloat(data.answers[i].grade)>69) {
				    $("#"+data.answers[i].id).removeClass('danger').addClass('success');
				}else{
				    $("#"+data.answers[i].id).removeClass('success').addClass('danger');
				}
				$("#"+data.answers[i].id).html('<span>'+ data.answers[i].grade.toFixed(2) +'%</span>');
			    }else if (data.answers[i].bCorrect) {
                                $("#"+data.answers[i].id).html('<i class="fa fa-check fa-lg text-success"></i>');
                            }else{
                                $("#"+data.answers[i].id).html('<i class="fa fa-close fa-lg text-danger"></i>');
                            }
                            resetTimer();
                        }
                    }
                }
            });
    }
    
    
    
    // check every 3s for 30s
    // check every 10s for 90s
    // check every 30s for 5 min
    // check every 5 min for 20 min
    // check every 20 min for 1 hr
    // check every 1hr for 24 hrs
    // then it stops
    
    var counter = 1,
    timeLength=[10,9,10,4,3,2,25],
    timeLengthCounter = 0,
    intervalNeeded=3000;
    var controlledInterval = function() {
		//console.log("this time: "+ time +" through long refresh.");
		//Check and give update number of tweets for click to refresh...
		checkAnswers();
		//console.log("This is the time: "+counter+" for controlled timer with timeLength: "+timeLength[timeLengthCounter]+" and interval: "+(intervalNeeded/1000)+" seconds.");
		counter++;
		if (counter > timeLength[timeLengthCounter]) {
		    clearInterval(restartInterval);
                    if (intervalNeeded <= 30000) {
                        intervalNeeded = parseInt(intervalNeeded * timeLength[timeLengthCounter] / 3);
                    }else{
                        intervalNeeded = parseInt(intervalNeeded * timeLength[timeLengthCounter]);
                    }
                    
		    restartInterval = setInterval(controlledInterval, intervalNeeded);
                    counter=1;
                    timeLengthCounter++;
		}
    }
    
    
    function resetTimer() {
        counter = 1,
        timeLengthCounter = 0,
        intervalNeeded=3000;
	clearInterval(restartInterval);
        restartInterval = setInterval(controlledInterval, intervalNeeded);
    }
    
    
    var restartInterval = setInterval(controlledInterval, intervalNeeded);
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
});