/**
 * Data model
 */
var Playsheet;
var editingEntryID;
var selectedRow;

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
        jQuery('#edit-playsheet-item-time .to-time').prop('disabled', this.id != 'dialog-to-time');
        jQuery('#edit-playsheet-item-time .duration').prop('disabled', this.id == 'dialog-to-time');
    });
    
    jQuery('#edit-playsheet-item-time').on('blur', ':text', function() {
        checkPlaysheetItemTimes();
    });
    
    jQuery('#playsheet-entries').on('click', 'tr', function() {
        var row = jQuery(this);
        selectRow(row.index());
    });
    
    jQuery('#playsheet-entries').on('dblclick', 'tr', function() {
        var row = jQuery(this);
        editPlaysheetEntry(row.index());
    });
    
    renderPlaysheet();
    fillCRTCControl();
    
});

function selectRow(idx) {
    if (selectedRow && selectedRow.index() == idx) {
        selectedRow.removeClass('selectedRow');
        selectedRow = null;
    } else {
        jQuery('#playsheet-entries tbody tr').removeClass('selectedRow')
        selectedRow = jQuery(jQuery('#playsheet-entries tbody tr').get(idx))
            .addClass('selectedRow');
    }
}

function checkPlaysheetItemTimes() {
    var startTimeControl = jQuery('#edit-playsheet-item-time .from-time');
    var endTimeControl = jQuery('#edit-playsheet-item-time .to-time');
    var durationControl = jQuery('#edit-playsheet-item-time .duration');
    var endTypeRadio = jQuery('#edit-playsheet-item-time :checked');
    var programStartTime = getDrupalFormTime('start');
    var startTime = parseTimeToMinutes(startTimeControl.val());
    if (endTypeRadio.prop('id') == 'dialog-to-time') {
        var endTime = parseTimeToMinutes(endTimeControl.val());
        var duration = (endTime - startTime);
        durationControl.val(duration);
    } else {
        var duration = durationControl.val();
        var endTime = startTime + parseInt(duration);
        endTimeControl.val(Playsheet.formatTime(endTime));
    }
}

function renderPlaysheet() {
    var showStart = getDrupalFormTime('start');
    var showEnd = getDrupalFormTime('end');
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

function getDrupalFormTime(dateControlType) {
    var dateControlID = (dateControlType == 'start') ? 'value' : 'value2';
    var dateControl = '#edit-field-playsheet-date-und-0-' + dateControlID;
    var startTime = jQuery(dateControl + '-timeEntry-popup-1').val();
    var Result = parseTimeToMinutes(startTime);
    return (Result);
 }

function moveEntry(idx, change) {
    var selectedIdx = null;
    if (selectedRow) {
        selectedIdx = selectedRow.index();
    }
    playsheetEntries.splice(idx + change, 0, playsheetEntries.splice(idx, 1)[0]);
    renderPlaysheet();
    if (selectedIdx !== null && selectedIdx == idx) {
        selectRow(idx + change);
    }
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
    var Result = getNewEntry();
    if (editingEntryIdx !== null) {
        Result = playsheetEntries[editingEntryIdx];
        Result['changed'] = true;
    } else {
        playsheetEntries.push(Result);
    }
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

    var startTimeControl = jQuery('#edit-playsheet-item-time .from-time');
    Result.startMinutes = parseTimeToMinutes(startTimeControl.val())
        - getDrupalFormTime('start');
    
    renderPlaysheet();
    console.log(Result);
    return (Result);
}

function parseTimeToMinutes(timeString) {
    var Result = '';
    var timeParts = timeString.split(':');
    if (timeParts.length == 2) {
        Result = parseInt(timeParts[0] * 60) + parseInt(timeParts[1]);
    }
    
    return (Result);
}

function getDuration() {
    var Result = null;
    
    var endTypeRadio = jQuery('#edit-playsheet-item-time :checked');
    if (endTypeRadio.prop('id') == 'dialog-to-time') {
        var startTime = parseTimeToMinutes(jQuery('#playsheet-edit-dialog .from-time').val());
        var endTime = parseTimeToMinutes(jQuery('#edit-playsheet-item-time .to-time').val());
        Result = (endTime - startTime);
    } else {
        Result = jQuery('#edit-playsheet-item-time .duration').val();
    }

    return (Result);
}

function checkStartAndEndTimes(startTime, endTime) {
    return (endTime > startTime);
}

function deletePlaysheetEntry(idx) {
    if (idx < playsheetEntries.length) {
        if (confirm("Are you sure you want to delete this entry?")) {
            playsheetEntries.splice(idx, 1);
            renderPlaysheet();
        }
    }
}

function fillEditForm(entry) {
    var programTime = getDrupalFormTime('start') + parseInt(entry.startMinutes);
    var dialog = jQuery('#playsheet-edit-dialog');
    dialog.find('input.from-time').val(Playsheet.formatTime(programTime)); 
    // When we display the dialog, always select the "To:" time
    dialog.find('#dialog-to-time').prop('checked', true);
    programTime += parseInt(entry.duration);
    dialog.find('input.to-time').val(Playsheet.formatTime(programTime)).prop('disabled', false);
    dialog.find('input.duration').val(entry.duration).prop('disabled', true);
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
        startTime: new Date(getDrupalFormTime('start')),
        startMinutes : 0
    };
}
