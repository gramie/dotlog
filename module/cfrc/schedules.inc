<?php
class RadioSchedule {
    function getSchedule($startTime, $endTime) {
    	$dateFormat = 'Y-m-d H:i:s';
		$startText = date($dateFormat, $startTime);
		$endText = date($dateFormat, $endTime);
		
	    $query = new EntityFieldQuery();
		//dpm("From $startText to $endText");
		$query
			->entityCondition('entity_type', 'node')
			->entityCondition('bundle', 'playsheet')
	        ->propertyCondition('status', 1)
			->fieldCondition('field_playsheet_date', 'value', array($startText, $endText), 'BETWEEN')
			->fieldOrderBy('field_playsheet_date', 'value', 'ASC')
			->execute();
			//dpm($query);
		
		$playsheetNIDs = array();
		foreach($query->ordered_results as $playsheet) {
			$playsheetNIDs[] = $playsheet->entity_id;
		}
		return (entity_load('node', $playsheetNIDs));
    }
}
