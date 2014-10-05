<table id="program-listing">
	<thead>
		<tr>
			<th colspan="2">Search: <input type="text" class="table-search-edit" id="program-name-search-edit"/></th>
		</tr>
		<tr>
			<th>Program Name</th>
			<th>Host(s)</th>
		</tr>
	</thead>
	<tbody>
		<?php foreach($variables['programs'] as $program) { ?>
		<tr>
			<td><?php print(l($program->title, 'node/' . $program->nid)); ?></td>
			<td>
			<?php
				$hostnames = array();
				foreach($program->field_hosts[LANGUAGE_NONE] as $host) {
					$hostnames[] = l($variables['users'][$host['target_id']], 'user/' . $host['target_id']);
				}
				$links = implode(', ', $hostnames);
				print($links);
			?>
			</td>
		<?php } ?>			
		</tr>
	</tbody>
</table>
<?php
//pr($variables);
