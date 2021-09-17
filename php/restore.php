<?php
session_start();
$res = "[";
if (isset($_SESSION['results'])) {
    foreach ($_SESSION['results'] as $result) {
        $res .= $result;
        $res .= ",";        
    }
}
if ($res[-1] == ",") {
    $res = substr($res, 0, -1);
}
$res .= "]";
echo $res;