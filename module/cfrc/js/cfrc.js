/**
 * Data model
 */
var Playsheet;
var editingEntryID;

jQuery(document).ready(function () {
    var options = {
        defaultLanguage : jQuery('#edit-field-language input').val()
    };
   	Playsheet = new Playsheet('playsheet-entries', true);
    jQuery('#playsheet-node-form').submit(function() {
        // Copy the contents of the table into a hidden field so they can be saved when the form
        // is submitted
        var newEntries = JSON.stringify(playsheetEntries);
        jQuery('#playsheet-node-form input[name=entries-value]').val(newEntries, null, 2);
        //return(false);
    });
    
    jQuery('#edit-playsheet-item-time :radio.time-radio').click(function() {
        var enabledText = '';
        jQuery('#edit-playsheet-item-time :text').prop('disabled', true);
        if (this.id == 'dialog-to-time') {
            enabledText = '.to-time';
        } else {
            enabledText = '.duration';
        }
        jQuery('#edit-playsheet-item-time ' + enabledText).prop('disabled', false);
    });
    
    renderPlaysheet();
    fillCRTCControl();
    
});

function renderPlaysheet() {
    var showStart = getDrupalFormDateTime('start');
    var showEnd = getDrupalFormDateTime('end');
    Playsheet.fillPlaysheetGrid(playsheetEntries, showStart, showEnd);
}

function fillCRTCControl() {
    var CRTCControl = jQuery('#playsheet-edit-dialog .crtc');
    var options = '<option value=""></option>';
    for(var key in crtcValues) {
        options += '<option value="' + key + '">' + '[' + key + '] ' + crtcValues[key] + '</option>';
    }
    CRTCControl.html(options);
}

function getDrupalFormDateTime(dateControlType) {
    var dateControlID = (dateControlType == 'start') ? 'value' : 'value2';
    var dateControl = '#edit-field-playsheet-date-und-0-' + dateControlID;
    var startDate = jQuery(dateControl + '-datepicker-popup-0').val();
    var startTime = jQuery(dateControl + '-timeEntry-popup-1').val();
    var Result = new Date(startDate + ' ' + startTime);
    return (Result);
 }

function moveEntry(idx, change) {
    playsheetEntries.splice(idx + change, 0, playsheetEntries.splice(idx, 1)[0]);
    renderPlaysheet();
}

function editPlaysheetEntry(entryIdx) {
    var entry = null;

    editingEntryIdx = entryIdx;
    if (entryIdx == null) {
        entry = getNewEntry();
    } else {
        entry =  playsheetEntries[entryIdx];
    }
    fillEditForm(entry);
    
    var dialogTitle = 'Add new playsheet entry';
    if (entryIdx !== null) {
        dialogTitle = 'Edit playsheet entry';
    }

    jQuery('#playsheet-edit-dialog').dialog({
            title: dialogTitle,
            modal: true,
            width: 600,
            buttons: [
                { text: "Cancel", click: closePlaysheetEditDialog },
                { text: "Save", click: function() { if (saveEditedEntry()) { closePlaysheetEditDialog(); } } },
                { text: "Save and Add", click: function() { saveEditedEntry(); editPlaysheetEntry(null); } }
            ]
    });
}

function closePlaysheetEditDialog() {
    jQuery('#playsheet-edit-dialog').dialog('close');
}

function saveEditedEntry() {
    var Result = {};
    Result.id = editingEntryIdx;
    var duration = getDuration();
    if (duration) {
        Result.duration = duration;
    } else {
        return (false);
    }
    Result.artist = jQuery('#playsheet-edit-dialog .artist').val();
    Result.song = jQuery('#playsheet-edit-dialog .song').val();
    Result.crtc = jQuery('#playsheet-edit-dialog .crtc').val();
    Result.language = jQuery('#playsheet-edit-dialog .language').val();
    Result.newsong = jQuery('#playsheet-edit-dialog .newsong').prop('checked');
    Result.hit = jQuery('#playsheet-edit-dialog .hit').prop('checked');
    Result.instrumental = jQuery('#playsheet-edit-dialog .instrumental').prop('checked');
    Result.cancon = jQuery('#playsheet-edit-dialog .cancon').prop('checked');
    if (editingEntryIdx !== null) {
        playsheetEntries[editingEntryIdx] = Result;
    } else {
        playsheetEntries.push(Result);
    }
    renderPlaysheet();
    console.log(Result);
    return (Result);
}

function parseTime(timeString) {
    var Result = '';
    
    var dateString = new Date().toDateString();
    Result = new Date(dateString + ' ' + timeString);

    return (Result);
}

function getDuration() {
    var Result = null;
    
    var startTime = parseTime(jQuery('#playsheet-edit-dialog .from-time').val());
    var endTime = parseTime(jQuery('#playsheet-edit-dialog .to-time').val());
    if (endTime >= startTime) {
        Result = Math.round((endTime.getTime() - startTime.getTime()) / 60000);
    } else {
        alert("Please enter valid start and end times");
    }
    return (Result);
}

function checkStartAndEndTimes(startTime, endTime) {
    return (endTime > startTime);
}

function deletePlaysheetEntry(idx) {
    if (idx < playsheetEntries.length) {
        playsheetEntries.splice(idx, 1);
        renderPlaysheet();
    }
}

function fillEditForm(entry) {
    var dialog = jQuery('#playsheet-edit-dialog');
    var startTime = entry.startTime;
    dialog.find('input.from-time').val(Playsheet.padNumber(startTime.getHours(), 2) 
        + ':' 
        + Playsheet.padNumber(startTime.getMinutes(), 2));
    var endTime = new Date(startTime.getTime() + entry.duration * 60000);
    dialog.find('input.to-time').val(Playsheet.padNumber(endTime.getHours(), 2) 
        + ':' 
        + Playsheet.padNumber(endTime.getMinutes(), 2));
    dialog.find('span.duration').text(entry.duration);
    dialog.find('input.song').val(entry.song);
    dialog.find('input.artist').val(entry.artist);
    dialog.find('input.newsong').prop('checked', entry.newsong);
    dialog.find('input.cancon').prop('checked', entry.cancon);
    dialog.find('input.instrumental').prop('checked', entry.instrumental);
    dialog.find('input.hit').prop('checked', entry.hit);
    dialog.find('select.crtc').val(entry.crtc);
    dialog.find('input.language').val(entry.language);
}

function getNewEntry() {
    return {
        id : null,
        duration: 0,
        artist : '',
        song : '',
        crtc : null,
        language : 'English',
        newsong : false,
        hit : false,
        instrumental : false,
        cancon : false,
        startTime: new Date(getDrupalFormDateTime('start'))
    };
}
