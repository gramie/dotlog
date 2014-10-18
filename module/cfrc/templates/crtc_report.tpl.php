<?php 
dpm($variables);
$stats = $variables['stats'];

$categories = array(
    'New' => 'newsong',
    'CanCon' => 'cancon',
    'Instrumental' => 'instrumental',
    'Hit' => 'hit',
    );
?>
<div class="report-timespan">From: 
    <?php print(date('Y-m-d', $variables['timespan']['from'])); ?>
 To: 
    <?php print(date('Y-m-d', $variables['timespan']['to'])); ?>
</div>
<fieldset>
    <legend>Statistics</legend>
    <div>There were <?php print(count($variables['playsheets'])); ?> playsheets</div>
    <div>There were <?php print(count($variables['entries'])); ?> entries</div>
    <div><?php print($stats['songcount']); ?> were songs</div>
    <div><?php print(count($variables['entries']) - $stats['songcount']); ?> were spoken word</div>
    <dl>
        <dt>Spoken word</dt>
        <dd><?php print($stats['spoken']); ?> minutes</dd>
<?php foreach($categories as $name => $id) { ?>
        <dt><?php print($name); ?></dt>
        <dd><?php print($stats[$id]); ?> 
            (<?php print(round($stats[$id]/$stats['songcount']*100)); ?>%)
        </dd>
<?php } ?>
    </dl>
</fieldset>
