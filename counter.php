<?php
    $counterFile = 'view_count.txt';
    $currentCount = (int) file_get_contents($counterFile);
    $newCount = $currentCount + 1;
    file_put_contents($counterFile, $newCount);
    echo $newCount;
?>
