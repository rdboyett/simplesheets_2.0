$(document).ready(function(){
    
      $("#download-btn").click(function(){
        $('table').table2CSV({
          documentName: '{{ currentProject.title }} grades.csv',
          delivery: 'download',
          header:['Student','Average']
        });
      });
    
      $(function () {
          $('[data-toggle="popover"]').popover()
      })
      
      
      
    $("#uploadGoogleDriveGrades-form").ajaxForm({
            beforeSubmit: function(arr, $form, options) {
                $("#uploadGoogleDriveGrades-btn").html('<i class="fa fa-refresh fa-spin"></i>');
                $("#uploadGoogleDriveGrades-btn").toggleClass('disabled');
            },
            success:       function(responseText){
                console.log(responseText);
                if (responseText.error) {
                    alert(responseText.error);
                }else {
                    $("#uploadGoogleDriveGrades-btn").html('');
                    $("#uploadGoogleDriveGrades-btn").toggleClass('disabled');
                    var popup  = window.open("about:blank", "_blank"); // the about:blank is to please Chrome, and _blank to please Firefox
                    popup.location = responseText.link;
                }
            },
            dataType:  'json',
            timeout:   4000 
        });
    
      
      
      
      
});