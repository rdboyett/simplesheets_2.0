$(document).ready(function(){
    
      $("#download-btn").click(function(){
            /*
        $('table').table2CSV({
          documentName: currentProjectTitle+' grades.csv',
          delivery: 'download',
          header:['Student','ID #','Average']
        });
        */
            var $this = $(this);
            var projectID = $this.data('options').projectID;
            var filename = currentProjectTitle+' grades.csv';
            
            $.ajax({
                  method: "POST",
                  url: csvDownloadURL,
                  data: { projectID:projectID, classID:'allClasses' },
                  dataType: "text"
            })
                  .done(function( response ) {
                        console.log(response);
                        download(filename, response);
                  });
            
      });
      
      $(".downloadCSV-btn").click(function(){
            //var parent = $(this).parents('.panel-heading').next();
            var className = $(this).prev().prev().text();
            var projectID = $(this).data('options').projectID;
            var classID = $(this).data('options').classID;
            var filename = currentProjectTitle+' - '+className+' grades.csv';
            /*
            parent.find('table').table2CSV({
                  documentName: currentProjectTitle+' - '+className+' grades.csv',
                  delivery: 'download',
                  header:['Student','ID #','Average']
            });
            */
            $.ajax({
                  method: "POST",
                  url: csvDownloadURL,
                  data: { projectID:projectID, classID:classID },
                  dataType: "text"
            })
                  .done(function( response ) {
                        console.log(response);
                        download(filename, response);
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
    
    
    
      $('.collapse').on('show.bs.collapse', function(event){
            $(this).parent().find(".fa-angle-double-down").removeClass("fa-angle-double-down").addClass("fa-angle-double-up");
            $(this).parent().find(".panel-heading").addClass('active');
            
      }).on('hide.bs.collapse', function(){
            $(this).parent().find(".fa-angle-double-up").removeClass("fa-angle-double-up").addClass("fa-angle-double-down");
            $(this).parent().find(".panel-heading").removeClass('active');
      });
      
      
      
      $('.panel-heading a').click(function(){
            var link = $(this).attr('href');
            window.location.href = link;
      });
      
      
      $('.unloaded').click(function(){
            var $this = $(this);
            if ($this.hasClass('unloaded')) {
                  var tableHolder = $(this).next().children('div');
                  tableHolder.hide();
                  var spinner = $(this).next().children('.faa-spin');
                  var classID = $(this).data('options').classID;
                  var projectID = $(this).data('options').projectID;
                        
                  $.ajax({
                        method: "POST",
                        url: ajaxMonitorURL,
                        data: { classID: classID, projectID:projectID },
                        dataType: "html"
                  })
                        .done(function( response ) {
                            console.log(response);
                            tableHolder.html(response)
                            spinner.fadeOut(300, function(){tableHolder.fadeIn(300);});
                            $this.removeClass('unloaded');
                            $this.find('button').fadeIn(300);
                            $("#download-btn").fadeIn(300);
                        });
            }
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


    function download(filename, text) {
        var pom = document.createElement('a');
        pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        pom.setAttribute('download', filename);
      
        pom.style.display = 'none';
        document.body.appendChild(pom);
      
        pom.click();
      
        document.body.removeChild(pom);
    }

