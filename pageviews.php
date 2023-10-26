<?php
$counterFile = "pageviews.txt"; // File to store the page view count

// Read the current page view count
if (file_exists($counterFile)) {
    $count = intval(file_get_contents($counterFile)); // Read the count from the file and convert it to an integer
} else {
    $count = 0; // If the file doesn't exist, initialize the count to 0
}

// Increment the count for each page load
$count++;

// Update the page view count in the file
if (file_put_contents($counterFile, $count) === false) {
    // Log an error if the file write operation fails
    error_log("Failed to update page view count in $counterFile");
}

// Return the count for display
if ($count === false) {
    // Log an error if reading the count fails
    error_log("Failed to read page view count from $counterFile");
} else {
    echo $count; // Output the page view count for display
}
?>
