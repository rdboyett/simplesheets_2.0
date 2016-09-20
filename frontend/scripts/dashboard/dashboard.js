
var History = require('history');
var $ = require('jquery');
var csrftoken;

function init() {
    function getCookie(name) {
        var cookieValue = null,
            cookies,
            i,
            cookie;
        if (document.cookie && document.cookie !== '') {
            cookies = document.cookie.split(';');
            for (i = 0; i < cookies.length; i++) {
                cookie = $.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    csrftoken = getCookie('csrftoken');

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader('X-CSRFToken', csrftoken);
            }
        },
    });


    //Load folders async
    // Assign handlers immediately after making the request,
    // and remember the jqxhr object for this request
    function getFolderData(getFolderURL, folderID) {
        // console.log(history.length);
        if (typeof (history.pushState) != "undefined") {
            var jqxhr = $.get( getFolderURL, function() {
                $("#iconDiv").fadeIn(100);
                history.pushState("", "", '/getFolder/'+folderID);
                $("#newFolder-form input[name='parent_id']").val(folderID);
            })
            .done(function( html ) {
                console.log( html );
                $("#main-content .wrapper").html(html);
            })
            .fail(function() {
                console.log( "error" );
            })
            .always(function() {
                // console.log( "finished" );
                $("#iconDiv").fadeOut(100);
            });

        }else {
            window.location.href = getFolderURL;
	    }
    }

    $(document).on("click",".getFolder",function(e){
        var getFolderURL = $(this).data('options').getFolderURL;
        var folderID = $(this).data('options').folderID;
        console.log(getFolderURL);
        getFolderData(getFolderURL, folderID);
    });

    $(document).on('click', '.worksheetListTitle', function(e) {
        $('.popover').remove();
        const data = $(this).parent().find('.getFolder').data('options');
        const getFolderURL = data.getFolderURL;
        const folderID = data.folderID;
        console.log(getFolderURL);
        getFolderData(getFolderURL, folderID);
    });

    $('.moveItem').click(function(){
        console.log('clicke moveItem');
    });
} // End of init()


window.FOLDERS = {
    init: init,
};

if ( $("#dashboard").length ) {
    window.FOLDERS.init();
}
