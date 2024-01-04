<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST["name"];
    $quote = $_POST["quote"];
    $date = date("mdy"); // Get current date in format MMDDYY

    if (strlen($quote) > 50) {
        echo "Message must be shorter, stop copy pasting your advertising in here!";
        exit;
    }

    $undesiredPatterns = array(
        '/\bbitcoin\b/i',
        '/\bcrypto\b/i',
        '/\bmoney\b/i',
        '/\bshops\b/i',
        '/\bemail\b/i',
        '/\bskype\b/i',
        '/\bbuy\b/i',
        '/\bUSD\b/i',
        '/\bSEO\b/i',
        '/\bleads\b/i',
        '/\b@\b/i',
        '/\bwww\b/i',
        '/\bfounder\b/i',
        '/\bCEO\b/i',
        '/\bhttp(s)?:\/\/\S+/i',  // Check for any links
    );

    foreach ($undesiredPatterns as $pattern) {
        if (preg_match($pattern, $quote)) {
            echo "Stop advertising stuff in my guestbook >:c (sorry legitimate people trying to have fun, people kept putting crypto stuff in here)";
            exit;
        }
    }

    $entry = array(
        "quote" => $quote,
        "author" => $name,
        "date" => $date
    );

    $jsonFile = "randoms.json";
    $jsonArray = array();

    if (file_exists($jsonFile)) {
        $jsonArray = json_decode(file_get_contents($jsonFile), true);
    }

    // Check rate limit for the current user
    $userKey = md5($_SERVER['REMOTE_ADDR']); // You can change this identifier if needed

    $rateLimitFile = "ratelimit.txt";
    $rateLimitSeconds = 300; // 5 minutes

    if (file_exists($rateLimitFile)) {
        $rateLimitData = json_decode(file_get_contents($rateLimitFile), true);

        if (isset($rateLimitData[$userKey]) && time() - $rateLimitData[$userKey] < $rateLimitSeconds) {
            echo "Rate limit exceeded. Please wait a moment.";
            exit;
        }
    }

    // Proceed with form processing

    array_push($jsonArray, $entry);
    file_put_contents($jsonFile, json_encode($jsonArray, JSON_PRETTY_PRINT));

    // Update rate limit data
    $rateLimitData[$userKey] = time();
    file_put_contents($rateLimitFile, json_encode($rateLimitData));

    // Redirect back to the form page or any other page you want
    header("Location: index");
    exit;
}
?>
