<?php
function cfrc_crtcSummaryForm() {
    if (isset($_SESSION['CRTC_report'])) {
        $submitted = $_SESSION['CRTC_report'];
        unset($_SESSION['CRTC_report']);
    }
    $form['#submit'][] = 'cfrc_crtcSummaryFormSubmit';
    
    $form['start-date'] = array(
        '#type' => 'date_popup',
        '#title' => t('Start date'),
        '#date_format' => 'Y-m-d',
        '#date_label_position' => 'within',
        '#date_year_range' => '-10:+0',
        '#date_timezone' => 'America/New_York',
        );
    $form['end-date'] = array(
        '#type' => 'date_popup',
        '#title' => t('End date'),
        '#date_format' => 'Y-m-d',
        '#date_label_position' => 'within',
        '#date_year_range' => '-10:+0',
        '#date_timezone' => 'America/New_York',
        );

    if (isset($submitted)) {
        $form['start-date']['#default_value'] = $submitted['start-date'];
        $form['end-date']['#default_value'] = $submitted['end-date'];
        $form['#suffix'] = _cfrc_getCRTCReport($submitted);
    } else {
        $form['start-date']['#default_value'] = date('Y-m-d');
        $form['end-date']['#default_value'] = date('Y-m-d');
    }        
    
    $form['submit'] = array(
        '#type' => 'submit',
        '#value' => t('View report'),
	);
    return ($form);
}

function cfrc_crtcSummaryFormSubmit($form, &$form_state) {
    $_SESSION['CRTC_report'] = $form_state['values'];
}

function _cfrc_getCRTCReport($values) {
    $Result = '';
    
    $fromDate = strtotime($values['start-date']);
    $toDate = strtotime($values['end-date']);
    $diff = ceil(($toDate - $fromDate)/(60*60*24));
    $Result .= "$diff days";
    
    $playsheets = _cfrc_getPlaysheets($fromDate, $toDate);
    $nids = array();
    foreach($playsheets as $sheet) {
        $nids[] = $sheet->nid;
    }
    $entries = cfrc_getPlaysheetEntries($nids, true);
    
    $Result .= theme('crtc_report', array(
        'timespan' => array('from' => $fromDate, 'to' => $toDate),
        'playsheets' => $playsheets,
        'entries' => $entries,
        'stats' => _cfrc_getCRTCStats($entries))
    );

    return ($Result);
}

function _cfrc_getCRTCStats($entryNIDs) {
    $Result = array();
    
        
    
    foreach(node_load_multiple($entryNIDs) as $node) {
        $wrapper = entity_metadata_wrapper('node', $node);
        $playsheet = $wrapper->field_playsheet->value();
        $playsheetWrapper = entity_metadata_wrapper('node', $playsheet);
        $psDate = $playsheetWrapper->field_playsheet_date->value();
        $entryDate = substr($psDate['value'], 0, 10);
        if (!isset($Result[$entryDate])) {
            $Result[$entryDate] = array();
            foreach(cfrc_getStatCategories() as $id => $title) {
                $Result[$entryDate][$id] = 0;
            }
        }

        $crtc = $wrapper->field_crtc->value();
        if ($crtc >= 20 && $crtc <= 39) {
            // music
            foreach($wrapper->field_categories->value() as $cat) {
                $Result[$entryDate][$cat] = $Result[$entryDate][$cat] +1;
            }
            $Result[$entryDate]['songcount'] = $Result[$entryDate]['songcount'] +1;
        } else {
            $Result[$entryDate]['spoken'] = $Result[$entryDate]['spoken'] + $wrapper->field_duration->value();
        }
    }
    ksort($Result);
    return ($Result);
}

function cfrc_getStatCategories() {
    $Result = array(
        'spoken' => 'Spoken Word',
        'songcount' => 'Song Count',
        'newsong' => 'New',
        'cancon' => 'CanCon',
        'instrumental' => 'Instrumental',
        'hit' => 'Hit',
    );
    return ($Result);
}
    

