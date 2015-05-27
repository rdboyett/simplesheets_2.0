$(document).ready(function(){
    
    $(function () {
        $('[data-toggle="popover"]').popover()
    })
    
    
    
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

    
    
    
    
    
    
    
    
    var opts = {
        lines: 11, // The number of lines to draw
        length: 7, // The length of each line
        width: 3, // The line thickness
        radius: 11, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#000', // #rgb or #rrggbb or array of colors
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: '50%', // Top position relative to parent
        left: '50%' // Left position relative to parent
    };
    var target = document.getElementById('class-spinner');
    var spinner = new Spinner(opts).spin(target);
    
    
    $(".content-panel").click(function(){
	$(this).toggleClass('active');
	$(this).find( ".checkButton" ).toggleClass('fa-check-square-o').toggleClass('fa-square-o');
	checkActive();
    });
    
    function checkActive() {
	if($(".content-panel.active").length<1){
	    if (!$(".assign_btn").hasClass('disabled')) {
		console.log('disabling');
		$("#new-worksheet").addClass('disabled').toggleClass('btn-primary').toggleClass('btn-success');
		$("#unassign-worksheet-btn").addClass('disabled').toggleClass('btn-primary').toggleClass('btn-danger');
	    }
	}else{
	    if ($(".assign_btn").hasClass('disabled')) {
		console.log('enabling');
		$("#new-worksheet").removeClass('disabled').toggleClass('btn-primary').toggleClass('btn-success');
		$("#unassign-worksheet-btn").removeClass('disabled').toggleClass('btn-primary').toggleClass('btn-danger');
	    }
	}
    }
    
    $(".class-button").click(function(){
	var modalID = $(this).closest('.modal.fade').attr('id');
	var actionBtnID = $(this).closest('.modal.fade').find('.action-btn').attr('id');
	
	$(this).toggleClass('btn-primary').toggleClass('btn-success');
	$(this).find( ".classCheckButton" ).toggleClass('fa-check-square-o').toggleClass('fa-square-o');
	checkClassSelected(modalID, actionBtnID);
    });
    
    function checkClassSelected(modalID, buttonID) {
	if($("#"+modalID+" .class-button.btn-success").length<1){
	    if (!$("#"+buttonID).hasClass('disabled')) {
		$("#"+buttonID).addClass('disabled').toggleClass('btn-primary').toggleClass('btn-success');
	    }
	}else{
	    if ($("#"+buttonID).hasClass('disabled')) {
		$("#"+buttonID).removeClass('disabled').toggleClass('btn-primary').toggleClass('btn-success');
	    }
	}
    }
    
    
    $("#assignThis-button").click(function(){
	if($("#assign-worksheets .class-button.btn-success").length>0){
	    //get the project id's
	    var projectIDList = [];
	    var count = 0;
	    $(".content-panel.active").each(function(){
		projectIDList[count]=$(this).data("options").worksheet_id;
		count++;
	    });
	    console.log(projectIDList);
	    
	    //get the class id's
	    var classIDList = [];
	    count = 0;
	    $("#assign-worksheets .class-button.btn-success").each(function(){
		classIDList[count]=$(this).data("options").class_id;
		count++;
	    });
	    console.log(classIDList);
	    sendAssignments("assign-worksheets", projectIDList, classIDList, "assign")
	}
    });
    
    $("#unassignThis-button").click(function(){
	if($("#unassign-worksheets .class-button.btn-success").length>0){
	    //get the project id's
	    var projectIDList = [];
	    var count = 0;
	    $(".content-panel.active").each(function(){
		projectIDList[count]=$(this).data("options").worksheet_id;
		count++;
	    });
	    console.log(projectIDList);
	    
	    //get the class id's
	    var classIDList = [];
	    count = 0;
	    $("#unassign-worksheets .class-button.btn-success").each(function(){
		classIDList[count]=$(this).data("options").class_id;
		count++;
	    });
	    console.log(classIDList);
	    sendAssignments("unassign-worksheets", projectIDList, classIDList, "unassign")
	}
    });
    
    
    
    function sendAssignments(modalID, projectIDList, classIDList, bAssign) {
	var formData = {"projectIDList":projectIDList, "classIDList":classIDList, "bAssign": bAssign};
	$.ajax({
	    type: "POST",
	    data: formData,
	    url: sendAssignmentsURL,
	    success:  function(data, textStatus, jqXHR)
	    {
		console.log(data);
		$('#'+modalID).modal('hide');
	    },
	    error: function (jqXHR, textStatus, errorThrown)
	    {
		console.log(errorThrown);
	    }
	 });
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
});
