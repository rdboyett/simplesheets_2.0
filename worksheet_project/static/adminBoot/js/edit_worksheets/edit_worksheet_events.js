$('document').ready(function(){
    
    
    
    
    
    /*****************************Put Answer info**************************************************/
    $('#default_form').on('focus', '.answers', function () {
        showSideBarMenu();
        var elementID = $(this).attr('id');
	//questionFocus(elementID);
        var questionNumber = $(this).data('options').question_number;
        //highLightQuestionNumber(questionNumber);
    });
    
    
    
    $('#backgroundImage').click(function(){
        //hideSideBarMenu();
        var elementID = $(this).attr('id');
	//hideEverything(elementID);
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
        $("#savedSignal").show();
        setTimeout(function(){$("#savedSignal").hide();},3500);
	changeAnswer(elementID);
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

    
    /*********************************Display User Avatar********************************/
    $( "#small-avatar" ).tooltip({ content: '<img class="img-rounded shadow" src="{% if userInfo.avatar %}{{ userInfo.avatar }}{% else %}{{ MEDIA_URL }}/static/images/menu.png{% endif %}" width="250" height="250" alt="user"/>' });
    
    /***************************************tab highlight and select********************************/
    $(document).on('click', '#user-info', function(){
        //Add popup to edit profile.
    });
    
    $(document).on('click', '#edit-logo-pic', function(){
	$('#user-info').removeClass('tab-highlight');
	$('#edit-logo').addClass('tab-highlight');
    });
    
    /****************************Open side-bar******************************************************/
    $(document).on('click', '#menuLogo', function(){
	toggleSideBarMenu();
    });
    
    $(".page_title").on('click','.x-icon', function(){
        console.log("in delete question");
        var parent = $(this).parent();
        var data = parent.data('options');
        //submitDeleteInput(data.answer_id, data.question_number);
        sureCheck(data.answer_id, data.question_number, 'Are you sure you want to delete this question?', submitDeleteInput);
    });
    
    
    $(".page_title").on('click','.questionTab-holder', function(){
        var data = $(this).data('options');
        $("#input"+data.answer_id).focus();
    });
    
    $(".page_title").on('click','.resize-icon', function(){
        var parent = $(this).parent();
        var data = parent.data('options');
        resizeInput(data.answer_id);
    });
    
    
    $("#button2").click(function(){
        toggleButtons('button2');
        $(this).addClass('selected');
        $("#button1").removeClass('selected');
    });
    
    $("#button1").click(function(){
        toggleButtons('button1');
        $(this).addClass('selected');
        $("#button2").removeClass('selected');
    });
    
    
    
    $(document).on('click','#shade, #X-Sure',function(){
        closePopups();
    });
    
    $("#barLogo").click(function(){
        checkAllAnswersFilled();
    });
    
    
    
    
    
    
    
    
    
    
    
    
    
});