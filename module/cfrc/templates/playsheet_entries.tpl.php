<?php
$imagePath = url(drupal_get_path('module', 'cfrc') . '/images/');
$options = $variables['options'];
$editable = isset($options['editable']) && $options['editable'];
?>
<table id="playsheet-entries">
<?php if ($editable) { ?>
<caption><button type="button" onclick="editPlaysheetEntry(null);" id="add-row-button">Add row</button></caption>
<?php } ?>
<thead>
    <tr>
    <?php if ($editable) { ?>
        <th class="time-col">Start</th>
    <?php } ?>
        <th class="duration-col">End</th>
        <th class="artist-col">Artist</th>
        <th class="song-col">Song</th>
        <th class="new-col"><img src="<?php print($imagePath . 'NewIcon.png'); ?>" title="New Music"/></th>
        <th class="cancon-col"><img src="<?php print($imagePath . 'CanconIcon.png'); ?>" title="Canadian Content"/></th>
        <th class="instrumental-col"><img src="<?php print($imagePath . 'InstrumentalIcon.png'); ?>" title="Instrumental Music"/></th>
        <th class="hit-col"><img src="<?php print($imagePath . 'Number1Icon.png'); ?>" title="Hit Music"/></th>
        <th class="crtc-col">CRTC</th>
        <th class="language-col">Language</th>
    <?php if ($editable) { ?>
        <th class="actions-col"></th>
    <?php } ?>
    </tr>
    <tr>
    </tr>
</thead>
<tfoot>
	<tr class="totals">
		<th>Totals:</th>
		<th id="total-duration"></th>
		<th colspan="2"></th>
		<th></th>
		<th></th>
		<th></th>
		<th></th>
		<th colspan="3"</th>
	</tr>
</tfoot>
<tbody>
</tbody>
</table>
<script type="text/javascript">
var playsheetEditable = <?php print($editable ? 'true' : 'false'); ?>;
var playsheetEntries = <?php print(json_encode($variables['entries'])); ?>;
var showStart = new Date('<?php print(date('Y-m-d H:i:s', $variables['startdate'])); ?>');
var showEnd = new Date('<?php print(date('Y-m-d H:i:s', $variables['enddate'])); ?>');

var dragRow = {};

</script>
