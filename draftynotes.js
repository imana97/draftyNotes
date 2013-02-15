/**
 * @author Iman Khaghani Far
 * this is the draftynotes module
 * requirement: Jquery
 */

var DraftyNotes = function() {

    //init user object
    var userObj = localStorage.dn_user ? JSON.parse(localStorage.dn_user) : {};

    //init note container
    var notesObj = {};

    //init settings
    var settings = localStorage.dn_settings ? JSON.parse(localStorage.dn_settings) : {
        currentPadId : 0,
        currentNoteId : 0,
        numberOfNotes : 0,
        currentFont : 'default'
    };

    this.setCurrentPadId = function(padId) {
        settings.currentPadId = padId;
        settings.currentNoteId=-1;
        _persist('settings');
        return this;
    }
    this.setCurrentNoteId = function(noteId) {
        settings.currentNoteId = noteId;
        _persist('settings');
    }
    this.setCurrentFont = function(font) {
        settings.currentFont = font;
        return this;
    }
    /*
     * Set User method creates the user object and initiate an empty array for user pads.
     * Note: This only create one user, and before creating, deletes all the local storage data!
     */
    this.setUser = function(userId, name, email) {
        if (!userObj.userId) {
            //clear local storage
            localStorage.clear();
            userObj.userId = userId;
            userObj.name = name;
            userObj.email = email;
            userObj.pads = [];
            //set init- default pad
            this.setPad('General', 'disabled');

            _persist('user');
            //persist data
            _message('User Initiated', 'alert');
            //alert that a new user were created
        }
        return this;
        // for chaining
    }
    function _padAI() {
        var id = 0;
        var max = 0;
        for (var p in userObj.pads) {
            id = userObj.pads[p].padId;
            if (id > max) {
                max = id;
            }
        }
        return max + 1;
    }

    /*
     * Set pad method create a new pad and assign it to the current user object.
     * Note: this will not work if you do not initiate a user first.
     */
    this.setPad = function(padName, padDesc) {
        //check local storage
        if ((this.currentStorage() < 99) && (userObj.userId)) {
            var pad = {
                padId : _padAI(), //create id for path larger than the larger padId
                padName : padName,
                padDesc : padDesc,
                notesKey : [] //initiate array for the notes key of the pad
            };
            settings.currentPadId = pad.padId;
            userObj.pads.push(pad);
            _persist('settings');
            _persist('user');
        } else {
            _message('There is not Space for a new pad', 'alert');
        }
        return this;
    }
    /*
     * Set Note method creates a new note and assign it to the specified pad (padId)
     */
    this.setNote = function(header, body) {
        if (this.currentStorage() < 95) {
            var note = {
                noteId : settings.numberOfNotes,
                header : header,
                body : body,
                tasks : [],
            };
            userObj.pads[_padIdInd(settings.currentPadId)].notesKey.push(note.noteId);
            settings.currentNoteId = note.noteId;
            settings.numberOfNotes++;
            notesObj = note;
            _persist('user');
            _persist('settings');
            _persist('notes', 'dn_notes_' + note.noteId);
        } else {
            _message('There is not Space for a new note', 'alert');
        }
        return this;
        // for chaining
    }
    /*
     * Set Task method create a new task and assign it to the current note id (current Note Id)
     */
    this.setTask = function(task, detail) {
        if (this.currentStorage() < 99) {

            notesObj = _getNoteObj(settings.currentNoteId);
            var task = {
                taskId : notesObj.tasks.length,
                task : task,
                detail : detail
            };
            notesObj.tasks.push(task);
            _persist('notes', 'dn_notes_' + settings.currentNoteId);
        } else {
            _message('There is not Space for a new task', 'alert');
        }
    }
    //get
    this.getPads = function() {
        return userObj.pads;
    }
    this.getPad = function(padId) {
        for (var p in userObj.pads) {
            if (userObj.pads[p].padId == padId) {
                return userObj.pads[p];
            }
        }
    }
    function _padIdInd(padId) {
        for (var p in userObj.pads) {
            if (userObj.pads[p].padId == padId) {
                return p;
            }
        }
    }
    
    


    this.getNotes = function(padId) {
        var notes = [];
        for (var key in userObj.pads[_padIdInd(padId)].notesKey) {
            notes.push(_getNoteObj(userObj.pads[_padIdInd(padId)].notesKey[key]));
        }
        return notes;
    }
    
    this.getNote=function(noteId){
        return _getNoteObj(noteId);
    }

    this.getTasks = function(nodeId) {
        var note = _getNoteObj(noteId);
        return note.tasks;
    }

    this.getCurrentPadId = function() {
        return settings.currentPadId;
    }

    this.getCurrentNoteId = function() {
        return settings.currentNoteId;
    }

    this.getCurrentFont = function() {
        return settings.currentFont;
    }
    //delete
    this.deleteTask = function(taskId) {
        noteObj = _getNoteObj(settings.currentNoteId);
        noteObj.tasks.splice(taskId, 1);
        _persist('notes', 'dn_notes_' + settings.currentNoteId);
        return this;
    }
    
    function _notesKeyValueInd(padInd,value){
        for (var v in userObj.pads[padInd].notesKey){
            if (userObj.pads[padInd].notesKey==value){
                return v;
            }
        }
    }

    this.deleteNote = function(noteId) {
        if(settings.currentNoteId==noteId){
            settings.currentNoteId=0;
            _persist('settings');
        }
        localStorage.removeItem('dn_notes_' + noteId);
        var tmpInd = userObj.pads[_padIdInd(settings.currentPadId)].notesKey.indexOf(parseInt(noteId));
        var pp= userObj.pads[_padIdInd(settings.currentPadId)].notesKey.splice(tmpInd, 1);
        _persist('user');
        return this;
    }

    this.deletePad = function(padId) {
        if (userObj.pads.length < 2) {
            _message('Error: You can not delete all pads!', 'alert');
            return false;
        } else {
            if (confirm('Are you sure you want to delete this pad?\nNotice: All notes and tasks in this pad will be removed permanently!')) {
                if (settings.currentPadId == padId) {
                    settings.currentPadId = userObj.pads[0].padId;
                    _persist('settings');
                }
                for (var i in userObj.pads[_padIdInd(padId)].notesKey) {
                    localStorage.removeItem('dn_notes_' + userObj.pads[_padIdInd(padId)].notesKey[i]);
                }
                userObj.pads.splice(_padIdInd(padId), 1);
                _persist('user');
            } else {
                return false;
            }

            return true;
        }
    }
    //edit
    this.editTask = function(taskId, task, detail) {
        noteObj = _getNoteObj(settings.currentNoteId);
        noteObj.tasks[taskId].task = task;
        noteObj.tasks[taskId].detail = detail;
        _persist('notes', 'dn_notes_' + settings.currentNoteId);
        return this;
    }

    this.editNote = function(header, body) {
        notesObj = _getNoteObj(settings.currentNoteId);
        notesObj.header = header;
        notesObj.body = body;
        _persist('notes', 'dn_notes_' + settings.currentNoteId);
        return this;
    }

    this.editPad = function(padId, name, desc) {
        userObj.pads[_padIdInd(padId)].padName = name;
        userObj.pads[_padIdInd(padId)].padDesc = desc;
        _persist('user');
        return this;
    }
    //get the object of the requsted note from storage
    function _getNoteObj(noteId) {
        return JSON.parse(localStorage.getItem('dn_notes_' + noteId));
    }

    //persist objects
    function _persist(obj, key) {
        switch(obj) {
            case 'user':
                localStorage.dn_user = JSON.stringify(userObj);
                _message('User Obj persisted', 'log');
                break;
            case 'notes':
                localStorage.setItem(key, JSON.stringify(notesObj));
                _message('notes persisted - '+JSON.stringify(notesObj), 'log');
                break;
            case 'settings':
                localStorage.dn_settings = JSON.stringify(settings);
                _message('settings persisted', 'log');
                break;
        }

    }

    var sync = function() {

    }
    //utilities
    //export all data
    this.export = function() {
        var exp = {};
        //code here
        return exp;
    }
    // import all data
    this.import = function(imp) {
        //code here
        return this;

    }
    //messages
    function _message(msg, type) {
        type = type || 'alert';
        if (type == 'alert') {
            alert(msg);
        }
        if (type == 'log') {
            console.log(msg);
        }

    }

    //get storage
    this.currentStorage = function() {
        var storageSize = 2542878;
        var curr = (1024 * 1024 * 5 - unescape(encodeURIComponent(JSON.stringify(localStorage))).length) - 2700000;
        var currStorage = 100 - parseInt(((curr * 100) / storageSize));
        if (currStorage < 0) {
            return 0;
        } else {
            return currStorage;
        }
    }
} // end of module

