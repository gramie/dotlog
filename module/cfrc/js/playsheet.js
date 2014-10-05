Playsheet = function(tableID, editable) {
	this.table = jQuery('#' + tableID);
};


Playsheet.prototype.renderTableFooter = function(playsheetItems) {
    var totalRow = '<tr>';
    
    var totals = this.getTotals(playsheetItems);
    var timeCols = 2;
    totalRow += '<th>Totals:</th>';
    
    if (playsheetEditable) {
        totalRow += '<th>' + this.formatTime(totals.spokenDuration) + '</th>';
    } else {
        totalRow += '<th></th>';
        timeCols = 1;
    }
    totalRow += '<th colspan="' + timeCols + '"></th>'
            + '<th>' + this.formatTime(totals.newsong) + '<br />'
                     + this.getPercent(totals.newsong, totals.allMusic) + '%' + '<br />'
                     + 'New' + '</th>'
            + '<th>' + this.formatTime(totals.cancon) + '<br />'
                     + this.getPercent(totals.cancon, totals.allMusic) + '%' + '<br />'
                     + 'CanCon' + '</th>'
            + '<th>' + this.formatTime(totals.instrumental) + '<br />'
                     + this.getPercent(totals.instrumental, totals.allMusic) + '%' + '<br />'
                     + 'Instr' + '</th>'
            + '<th>' + this.formatTime(totals.hit) + '<br />'
                     + this.getPercent(totals.hit, totals.allMusic) + '%' + '<br />'
                     + 'Hit' + '</th>'
            + '<th></th>'
            + '<th></th>';
    if (playsheetEditable) {
        totalRow += '<th></th>';
    }
    totalRow += '</tr>';
    this.table.find('tfoot').html(totalRow);
};

Playsheet.prototype.getPercent = function(part, all) {
    if (all == 0) {
        return (0);
    }
    return (Math.floor((part/all) * 100));
}

Playsheet.prototype.getTotals = function(playsheetItems) {
    var totals = {
        cancon: 0,
        hit: 0,
        instrumental: 0,
        newsong: 0,
        allMusic: 0,
        spokenDuration: 0
    };
    for(var i = 0; i < playsheetItems.length; i++) {
        var item = playsheetItems[i];

        if (item.crtc >= 20 && item.crtc <= 39) {
            // This is music
            if (item.newsong) {
                totals.newsong++;
            }
            if (item.hit) {
                totals.hit++;
            }
            if (item.cancon) {
                totals.cancon++;
            }
            if (item.instrumental) {
                totals.instrumental++;
            }
            totals.allMusic++;
        } else {
            // This is Spoken Word
            totals.spokenDuration += item.duration;
        }
    }
    return (totals);
}

Playsheet.prototype.fillPlaysheetGrid = function(data, startTime, endTime) {
	var tableData = '';
    for(var i = 0; i < data.length; i++) {
        // Fill the row
        tableData += this.formatRow(data, i);
    }
    this.table.find('tbody').html(tableData);
    this.renderTableFooter(data);
};

Playsheet.prototype.formatRow = function(data, i) {
    var row = data[i];
    var newsong = row.newsong? 'checked="1"' : '';
    var cancon = row.cancon? 'checked="1"' : '';
    var instrumental = row.instrumental? 'checked="1"' : '';
    var hit = row.hit? 'checked="1"' : '';
    var rowclass = (i % 2 == 0) ? 'even' : 'odd';
    var Result = '<tr class="' + rowclass + '">';
    if (playsheetEditable) {
        Result += '<td>' + this.formatTime(row.startTime) + '</td>'
    }   
    Result += '<td>' + this.formatTime(row.duration) + '</td>'
        + '<td>' + row.artist + '</td>'
        + '<td>' + row.song + '</td>'
        + '<td class="check-column"><input type="checkbox" disabled="disabled" class="new-check" ' + newsong + '" /></td>'
        + '<td class="check-column"><input type="checkbox" disabled="disabled" class="cancon-check" ' + cancon + '" /></td>'
        + '<td class="check-column"><input type="checkbox" disabled="disabled" class="instrumental-check" ' + instrumental + '" /></td>'
        + '<td class="check-column"><input type="checkbox" disabled="disabled" class="hit-check" ' + hit + '" /></td>'
        + '<td>' + row.crtc + '</td>'
        + '<td>' + row.language + '</td>';
    if (playsheetEditable) {
        Result += '<td><div class="playsheet-buttons">';
        Result += '<button type="button" onclick="editPlaysheetEntry(' + i + ');" title="Edit entry">&#9998;</button>';
        Result += '<button type="button" onclick="deletePlaysheetEntry(' + i + ');" title="Delete entry"><span style="color:red;">&#10007;</span></button>';
        if (i > 0) {
    		Result += '<button type="button"  onclick="moveEntry(' + i + ', -1);" title="Move up one row">&#8593;</button>';
        } else {
            Result += '<button type="button" >&nbsp;</button>';
        }
        if (i < (data.length -1)) {
    		Result += '<button type="button" onclick="moveEntry(' + i + ', +1);" title="Move down one row">&#8595;</button>';
    	} else {
    	    Result += '<button type="button">&nbsp;</button>';
        }
		Result += '</div></td>';
	}
	Result += '</tr>';
	return (Result);
};

/**
 * Take a time and format it as HH:MM, with leading zeroes
 *
 * This can handle the parameter as a Date object or an integer number of minutes
 *
 * @param Date or integer time
 * @result string the time as a string in 24-hour time
 */
Playsheet.prototype.formatTime = function(time) {
    if (time.getHours) {
        var hours = time.getHours();
    } else {
        var hours = Math.floor(time / 60);
    }
    if (time.getMinutes) {
        var mins = time.getMinutes();
    } else {
        var mins = time % 60;
    }
    return (this.padNumber(hours, 2) + ':' + this.padNumber(mins, 2));
}

Playsheet.prototype.padNumber = function(num, length) {
    var s = Array(length).join("0") + num;
    return (s.substr(s.length - length));
};

Playsheet.prototype.convertStringToMinutes = function(timestring) {
	if (timestring == '') {
		timestring = 0;
	}
    var parts = timestring.split(':');
    if (parts.length == 2) {
        var result = parseInt(parts[0]) * 60 + parseInt(parts[1]);
    } else {
        var result = parseInt(timestring, 10);
    }
    return (result);
};

Playsheet.prototype.enableSaveButtons = function(buttonText, enabled) {
    jQuery("#playsheet-edit-dialog .ui-dialog-buttonpane button:contains('Save')")
        .attr('disabled', !enabled); 
}
