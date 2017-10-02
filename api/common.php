<?php

function getUserInfo($db, $token, $parameters) {
    $session = $db->query("SELECT user, expires from geoshare.sessions WHERE pID='" . $token . "'")->fetch_assoc();
    if($session["expires"]) $user = $session["user"]; else $user = null;
    $owner = $db->query("SELECT ID from geoshare.users WHERE username='" . $parameters["username"] . "'")->fetch_assoc()["ID"];
return array("user" => $user, "owner" => $owner);
}

function splitQuery($str) {
    $result = array();
    foreach(explode("&", $str) as $item) {
        if($item != "") {
            $param = explode("=", $item);
            if($param[0] != "" && $param[1] != "") {
                $result[$param[0]] = $param[1];
            }
        }
    }
    return $result;
}

function getRequestDetails() {
    print_r($_SERVER);
    switch(isset(getallheaders()["Content-Type"])? getallheaders()["Content-Type"] : "") {
        default:
        case "application/json":
            $data = json_decode(file_get_contents('php://input'), true);
            break;
        case "application/x-www-form-urlencoded":
            $data = splitQuery(file_get_contents('php://input'));
            break;
        case "multipart/form-data": //TODO: requires POST?
            if($_SERVER['REQUEST_METHOD'] != "POST" || $_SERVER[SCRIPT_NAME] != "/api/user/index.php") {
                http_response_code(400);
                die();
            } else {
                $data = null;
            }
            break;
    }
    $parameters = splitQuery($_SERVER['QUERY_STRING']);
    $token = isset(getallheaders()["REST_API_TOKEN"])? getallheaders()["REST_API_TOKEN"] : false;
    return array("data" => $data, "parameters" => $parameters, "token" => $token);
}

function connectToDB() {
    $db = new mysqli("192.168.1.145", "geoshare", "GeoShare.Apps2016", "geoshare", "3306");
    if($db->connect_error) {
        http_response_code(500);
        die("Connection failed!");
    }
    return $db;
}

// TODO: check for token expiry!
// TODO: include passkey constant added in by .htaccess so that requests direct to /api/user/?id=568 return 400/403? or just RedirectMatch 404 the php files?
// TODO: shares, friendships, groups, profile pics