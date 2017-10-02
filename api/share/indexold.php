<?php

/* SET RESPONSE HEADERS */
header("Access-Control-Allow-Orgin: *");
header("Access-Control-Allow-Methods: GET, POST, PATCH, DELETE");
header("Content-Type: application/json");
http_response_code(410);
/*
/* EXTRACT REQUEST DETAILS *
$data = json_decode(file_get_contents('php://input'), true);
$parameters = array();
foreach(explode("&", $_SERVER['QUERY_STRING']) as $item) {
    if($item != "") {
        $param = explode("=", $item);
        if($param[0] != "" && $param[1] != "") {
            $parameters[$param[0]] = $param[1];
        }
    }
}

/* CONNECT TO DB *
$db = new mysqli("192.168.1.145", "geoshare", "GeoShare.Apps2016", "geoshare", "3306");
if($db->connect_error) {
    http_response_code(500);
    die("Connection failed!");
}

/* PROCESS REQUEST *
switch($_SERVER['REQUEST_METHOD']) {
    case "GET":
        /* 403 ANY REQUESTS FOR A USER LIST *
        if(!isset($parameters["id"]) && !isset($parameters["username"]) && !isset($parameters["email"])) {
            http_response_code(403);
            break;
        }

        /* FIND USER, ENCRYPT THE ID *
        $where = isset($parameters["id"])? "ID=AES_DECRYPT(UNHEX('" . $parameters["id"] . "'), 'GeoShare.idPa55Phrase')" : "";
        $where .= isset($parameters["username"])? ($where != ""? " AND " : "") . "username=" . $parameters["username"] : "";
        $where .= isset($parameters["email"])? ($where != ""? " AND " : "") . "email=" . $parameters["email"] : "";
        $result = $db->query("SELECT HEX(AES_ENCRYPT(ID, 'GeoShare.idPa55Phrase')) AS ID, username, email FROM geoshare.users WHERE " . $where);
        if($result->num_rows > 0) {
            /* USER FOUND. RETURN USER ARRAY AS JSON OBJECT *
            echo json_encode($result->fetch_assoc());
            http_response_code(200);
        } else {
            /* USER DOES NOT EXIST *
            http_response_code(404);
        }
        break;

    case "POST":
        /* CATCH INVALID DATA - CHECKS FOR UNSET/OOB VALUES, FAKED EMAILS(CRUDE!) OR A SUPPLIED ID *
        if(!isset($data["username"]) || strlen($data["username"]) > 25 || !isset($data["email"]) || strlen($data["email"]) > 45 || preg_match("/^.*?@.*?\.(co\.uk|com|net|org)$/", $data["email"]) === 0 || !isset($data["password"]) || isset($parameters["id"])) {
            http_response_code(400);
            echo json_encode(array("error" => "Malformed Request"));
            break;
        }

        /* EXECUTE SQL *
        $statement = $db->prepare("INSERT INTO geoshare.users(username, email, pass_hash) VALUES(?, ?, ?)");
        $statement->bind_param("sss", $data["username"], $data["email"], password_hash($data["password"], PASSWORD_BCRYPT));
        if($statement->execute()) {
            /* SUCCESS! SEND CLIENT A LINK TO THE CREATED USER *
            $result = $db->query("SELECT HEX(AES_ENCRYPT(ID, 'GeoShare.idPa55Phrase')) AS ID FROM geoshare.users WHERE ID=" . $db->insert_id)->fetch_assoc();
            header("Location: https://geoshare.appsbystudio.co.uk/api/user/" . $result["ID"]);
            http_response_code(201);
        } else {
            /* OOPS! ERROR *
            if(preg_match("/Duplicate entry '(.*?)' for key '(.*?)'/", $db->error, $match) === 1) {
                /* DUPLICATE USER *
                $data["password"] = null;
                echo json_encode(array("error" => "duplicate", "duplicate" => explode("_", $match[2])[0], "data" => $data));
                http_response_code(409);
            } else {
                /* OTHER *
                http_response_code(500);
            }
        }
        break;

    case "PATCH":
        http_response_code(501);
        break;

    case "DELETE":
        http_response_code(501);
        break;

    default:
        http_response_code(405);
        break;
}

// such that    GET /api/user/568 -> GET /api/user/?id=568      include passkey constant added in by .htaccess so that requests direct to /api/user/?id=568 return 400/403?
*/