<?php 
$stats = $variables['stats'];

$categories = cfrc_getStatCategories();
$header = array_values($categories);
array_unshift($header, 'Date');
$rows = array();
foreach($stats as $statDate => $statRow) {
    $newRow = array(
        $statDate
        );
    foreach($categories as $catID => $catName) {
        $newRow[] = $statRow[$catID];
    }
    $rows[] = $newRow;
}

?>
<div class="report-timespan">From: 
    <?php print(date('Y-m-d', $variables['timespan']['from'])); ?>
 To: 
    <?php print(date('Y-m-d', $variables['timespan']['to'])); ?>
</div>
<fieldset>
    <legend>Statistics</legend>
    <div>There were <?php print(count($variables['playsheets'])); ?> playsheets</div>
    <div><?php print(theme('table', array(
        'header' => $header,
        'rows' => $rows,
        ))); ?>
        
            (<?php //if ($songCount) { print(round($stats[$id]/$songCount*100)); } ?>%)
</fieldset>
