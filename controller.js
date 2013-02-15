/**
 * @author Iman Khaghani Far
 * this is the drafty note controller for web browser
 * notes: updates can not have events
 */

//test
//localStorage.clear();

//configuration

var config={};
config.google={};
config.google.clientId="836717628404.apps.googleusercontent.com";
config.google.redirectURI="http://127.0.0.1:8020/draftyNotes/auth.html";
config.google.scope="https://www.googleapis.com/auth/userinfo.profile+https://www.googleapis.com/auth/userinfo.email";
config.google.LoginURL="https://accounts.google.com/o/oauth2/auth?client_id="+config.google.clientId+"&redirect_uri="+config.google.redirectURI+"&scope="+config.google.scope+"&response_type=token";

//////

$(function() {

    //create draftynote instance
    var dn = new DraftyNotes();

    //setup user
    dn.setUser(1, 'Iman Khaghani Far', 'iman@gmail.com');

    //setup update view module
    var update = new DnViewUpdater(dn);

    //intialize the view
    update.pads().currentPad().progress().notesList().note();

    // initialize the view pad

    //events
    //show edit delete pad buttons
    $('.show-pads-node').live('mouseover', function() {
        $(this).children().show();
    });
    //hide edit delete pad buttons
    $('.show-pads-node').live('mouseout', function() {
        $(this).children('div').hide();
    });

    // click edit pad button
    $('.show-pads-node .btn-group .btn-primary').live('click', function() {
        var padNameObj = $(this).parent().parent().children('span');
        var padName = padNameObj.children('a').html();
        var tmp = '<div class="input-append"><input maxlength="30" class="span4" id="appendedInputButton" type="text" value="' + padName + '"><button class="btn" id="save-edit-pad" type="button">Save!</button></div>';
        padNameObj.html(tmp);
        $(".pad-edit-delete").children().hide();
        
    });
    // click save edit
    $('#save-edit-pad').live('click', function() {
            var padId = $(this).parent().parent().parent().attr('id');
            var padName = $(this).parent().children('.span4').val();
            dn.editPad(padId, padName, 'disabled');
            $(".pad-edit-delete").children().show();
            $(this).parent().parent().html('<a href="#" class="btn-open-pad">'+padName+'</a>');
            update.currentPad().progress();
        });

    //click delete pad button
    $('.show-pads-node .btn-group .btn-danger').live('click', function() {
        var padId = $(this).parent().parent().attr('id');
        dn.deletePad(padId);
        update.pads().progress().currentPad().notesList();
    });

    // create new pad
    $('#btn-createPad').click(function() {
        if ($('#txt-newPadName').val().trim()==''){
            alert('Pad name cannot be empty');
            return false;
        }
        dn.setPad($('#txt-newPadName').val(), 'disabled');
        $('#txt-newPadName').val('');
        update.pads().currentPad().notesList();
    });
    //open pad
    $('.btn-open-pad').live('click', function() {
        dn.setCurrentPadId(parseInt($(this).parent().parent().attr('id')));
        update.pads().currentPad().notesList().note();
        $('#myPadsModal').modal('hide');
    });

    ////////////////////////////////////////
    //show note delete button
    $('.show-notes-node').live('mouseover', function() {
        $(this).children('.btn-danger').show();
    });
    //hide note delete button
    $('.show-notes-node').live('mouseout', function() {
        $(this).children('.btn-danger').hide();
    });
    //create new note
    $('#btn-add-note').click(function() {
        dn.setNote('', '');
        update.note();
        update.notesList().progress();
    });
    //require revision
    //save and update header changes
    $('#note-header').on("keyup", function() {
        dn.editNote($('#note-header').val(), $('#note-body').val());
        update.notesList();
    });
    //save and update body changes
    $('#note-body').on("keyup", function() {
        dn.editNote($('#note-header').val(), $('#note-body').val());
        update.notesList();
    });
    //opening a node
    $('.btn-open-note').live("click", function() {
        dn.setCurrentNoteId($(this).parent().parent().attr('id'));
        update.note().notesList();
    });

    //delete a note
    $('.btn-note-delete').live('click', function() {
        dn.deleteNote($(this).parent().attr('id'));
        update.notesList().note().progress();
    });

    //page events
    // delete all data - local storage
    $('#sync-data').click(function() {
        
        // if no token- redirect to login with google
        if (!localStorage.googleToken){
            window.location=config.google.LoginURL;
        }else{
            $("#sync-data").removeClass("btn-danger").addClass("btn-warning").html('Next Sync in:<span id="next-sync-time-span"><span> S');
        }
    });
    
    //open close notes
    $("#note-list-controller").toggle(
        function(){
        $("#note-list-body").hide("slow");
    },
    function(){
       $("#note-list-body").show("slow"); 
    }
    );

});
// end of jquery