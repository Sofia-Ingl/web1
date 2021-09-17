<?php
session_start();
$res = "[";
if (isset($_SESSION['results'])) {
    foreach ($_SESSION['results'] as $result) {
        $res .= $result;
        $res .= ",";        
    }
}
if (strcmp(substr($res,strlen($res)),",")) {
    $res = substr($res, 0, -1);
}
$res .= "]";
echo $res;