<?php

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
$x= (float) $_POST["x"];
$y= (float) str_replace(",", ".", $_POST["y"]);
$r= (float) $_POST["r"];

$isHit = pointInArea($x, $y, $r);
$stringIsHit = $isHit ? "true" : "false";

date_default_timezone_set('UTC');
$date = new DateTime();
$currentTime = date('Y/m/d H:i:s', $date->getTimestamp() - $offset*60);
$executionTime = round(microtime(true) - $_SERVER['REQUEST_TIME_FLOAT'], 8);

$jsonData = '{' .
  "\"x\": \"$x\", " .
  "\"y\": \"$y\"," .
  "\"r\": \"$r\", " .
  "\"currentTime\": \"$currentTime\", " .
  "\"executionTime\": \"$executionTime\", " .
  "\"hit\": $stringIsHit" .
  "}";

echo $jsonData;
?>