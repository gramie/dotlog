<?php
class RadioProgram {
	var $users = array();
	var $programs = array();
	
	function getPrograms() {
	    $query = new EntityFieldQuery();
		$query
			->entityCondition('entity_type', 'node')
			->entityCondition('bundle', 'show')
	        ->propertyCondition('status', 1)
			->execute();
		
		$programNIDs = array();
		if (is_array($query->ordered_results)) {
			foreach($query->ordered_results as $result) {
				$programNIDs[] = $result->entity_id;
			} 
		}
		$this->programs = entity_load('node', $programNIDs);
	}
	
	function getUsers() {
	    $query = new EntityFieldQuery();
		$query
			->entityCondition('entity_type', 'user')
	        ->propertyCondition('status', 1)
			->execute();

		$userIDs = array();
		if (is_array($query->ordered_results)) {
			foreach($query->ordered_results as $result) {
				$userIDs[] = $result->entity_id;
			} 
		}
		$users = entity_load('user', $userIDs);
		$this->users = array();
		foreach($users as $user) {
			$wrapper = entity_metadata_wrapper('user', $user);
			$firstname = $wrapper->field_first_name->value();
			$lastname = $wrapper->field_last_name->value();
			$username = ($firstname != '') ? "$firstname $lastname" : $lastname;
			$this->users[$user->uid] = $username;
		}
	}
}
