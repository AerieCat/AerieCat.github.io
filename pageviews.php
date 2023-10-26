<?php
$counterFile = "pageviews.txt"; // File to store the page view count

// Read the current page view count
if (file_exists($counterFile)) {
    $count = intval(file_get_contents($counterFile));
} else {
    $count = 0;
}

// Increment the count for each page load
$count++;

// Update the page view count in the file
file_put_contents($counterFile, $count);

// Return the count for display
echo $count;
?>