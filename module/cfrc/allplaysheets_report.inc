<?php
function cfrc_allPlaysheetsForm() {
    if (isset($_SESSION['allPlaysheets_report'])) {
        $submitted = $_SESSION['allPlaysheets_report'];
        unset($_SESSION['allPlaysheets_report']);
    }
    $form['#submit'][] = 'cfrc_allPlaysheetsFormSubmit';
    
    $form['start-date'] = array(
        '#type' => 'date_select',
        '#title' => t('Broadcast date'),
        '#date_format' => 'Y-m-d',
        '#date_label_position' => 'within',
        '#date_year_range' => '-10:+0',
        '#date_timezone' => 'America/New_York',
        );

    if (isset($submitted)) {
        $form['start-date']['#default_value'] = $submitted['start-date'];
        $form['end-date']['#default_value'] = $submitted['end-date'];
        $form['#suffix'] = _cfrc_getAllPlaysheetsReport($submitted);
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

function cfrc_allPlaysheetsFormSubmit($form, &$form_state) {
    $_SESSION['allPlaysheets_report'] = $form_state['values'];
}

function _cfrc_getAllPlaysheetsReport($values) {
    $Result = '';
    
    $fromDate = strtotime($values['start-date']);
    $toDate = strtotime($values['end-date']);
    $diff = ceil(($toDate - $fromDate)/(60*60*24));
    $Result .= "$diff days";
    
    $playsheets = array();
    foreach(_cfrc_getPlaysheets($fromDate, $toDate) as $playsheet) {
        $wrapper = entity_metadata_wrapper('node', $playsheet);
        $bdate = date('Y-m-d', $wrapper->field_playsheet_date->value);
        $playsheets[$bdate][] = $playsheet;
    }
    
    $header = array('Title', 'Date');

    return ($Result);
}

