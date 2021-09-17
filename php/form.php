<?php

session_start();


function validate($x, $y, $r) {
    $MAX_Y = 3;
    $MIN_Y = -5;
    $xs = array(-5, -4, -3, -2, -1, 0, 1, 2, 3);
    $rs = array(1, 1.5, 2, 2.5, 3);
    if (is_numeric($x) && is_numeric(str_replace(",", ".", $y)) && is_numeric($r)) {
        $x= (float) $x;
        $y= (float) str_replace(",", ".", $y);
        $r= (float) $r;
        if ($y>=$MIN_Y && $y<=$MAX_Y && in_array($x, $xs) && in_array($r, $rs)) {
            return true;
        }
    }
    return false;
}

function pointInTriangle($x, $y, $r) {
    return $x>=0 && $y<=0 && $y>= -$r + 2*$x;
}

function pointInRectangle($x, $y, $r) {
    return $x<=0 && $y>=0 && $x>=-$r && $y<=$r/2;
}

function pointInCircle($x, $y, $r) {
    return $x<=0 && $y<=0 && $y>= -sqrt(($r*$r)/4 - $x*$x);
}


function pointInArea($x, $y, $r) {
    return pointInTriangle($x, $y, $r) || pointInRectangle($x, $y, $r) || pointInCircle($x, $y, $r);
}

$offset = $_POST["timezone"];
$valid = validate($_POST["x"], $_POST["y"], $_POST["r"]);
$x= 0;
$y= 0;
$r= 0;
if ($valid) {
    $x= (float) $_POST["x"];
    $y= (float) str_replace(",", ".", $_POST["y"]);
    $r= (float) $_POST["r"];
}


$isHit = pointInArea($x, $y, $r);
$stringIsHit = $isHit ? "true" : "false";

date_default_timezone_set('UTC');
$date = new DateTime();
$currentTime = date('Y/m/d H:i:s', $date->getTimestamp() - $offset*60);
$executionTime = round(microtime(true) - $_SERVER['REQUEST_TIME_FLOAT'], 8);

$jsonData = '{' .
  "\"valid\": $valid, " .
  "\"x\": \"$x\", " .
  "\"y\": \"$y\"," .
  "\"r\": \"$r\", " .
  "\"currentTime\": \"$currentTime\", " .
  "\"executionTime\": \"$executionTime\", " .
  "\"hit\": $stringIsHit" .
  "}";

if (!isset($_SESSION['results'])) {
    $_SESSION['results'] = array();
  }
if ($valid) array_push($_SESSION['results'], $jsonData);

echo $jsonData;