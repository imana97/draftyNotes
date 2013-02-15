/**
 * @author Iman Khaghani Far
 * this module updates the view. each view has its own method and can be used in chain
 * dependancy: Jquery 1.6 +
 */

var DnViewUpdater = function(dn) {

    this.currentPad = function() {
        //current pad
        var ppad = dn.getPad(dn.getCurrentPadId());
        $("#current-pad").html(ppad.padName);
        return this;

    }
    
    this.progress = function() {
        $("#progressbar").progressbar({
            value : dn.currentStorage()
        });
        $('#used-space').html(dn.currentStorage());
        return this;
    }
    
    this.pads = function() {
        $('#show-pads').children().remove();
        $.each(dn.getPads(), function(i, pad) {
            var btnTools = '<div class="btn-group pull-right pad-edit-delete" style="display: none;"><button class="btn btn-small btn-primary"><i class="icon-edit icon-white"></i></button><button class="btn btn-small btn-danger"><i class="icon-trash icon-white"></i></button></div>';
            $('#show-pads').append('<div class="show-pads-node" id="' + pad.padId + '"><span><a href="#" class="btn-open-pad">' + pad.padName + '</a></span>' + btnTools + '</div>');
        });
        $("#show-pads").children("#" + dn.getCurrentPadId()).css({
            backgroundColor : "#DCFFBF"
        });
        return this;
    }
    
    this.notesList = function() {
        $("#notes-list").children().remove();
        $.each(dn.getNotes(dn.getCurrentPadId()), function(i, note) {
            var btn = '<button class="btn btn-mini btn-danger pull-right btn-note-delete" style="display:none;"><i class="icon-trash icon-white"></i></button></div>';
            if (note.header.trim() == "") {
                var domNote = '<div class="show-notes-node" id="' + note.noteId + '"><div class="shortern-note-name pull-left"><a class="btn-open-note" href="#">Untitled</a></div>' + btn + '</div>';
            } else {
                var domNote = '<div class="show-notes-node" id="' + note.noteId + '"><div class="shortern-note-name pull-left"><a class="btn-open-note" href="#">' + note.header + '</a></div>' + btn + '</div>';
            }

            var lastNote = $("#notes-list").append(domNote);
            if (dn.getCurrentNoteId == note.noteId) {
                $('#notes-list ' + note.noteId).css({
                    color : 'green'
                });
            }
        });
        //alert(dn.getCurrentNoteId());
        $('.notes-list').children('#' + dn.getCurrentNoteId()).css({
            backgroundColor : "#DCFFBF"
        });
        return this;
    }
    
    this.note = function() {
        var note = dn.getNote(dn.getCurrentNoteId());
        if (note != null) {
            $('#note-header').prop("disabled", false).val(note.header);
            $('#note-body').prop("disabled", false).val(note.body);
        } else {
            $('#note-header').prop("disabled", true).val("Drafty Notes");
            $('#note-body').prop("disabled", true).val("Add or open a new note");
        }
        return this;
    }
}
