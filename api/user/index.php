<?php

include "../common.php";

/* SET RESPONSE HEADERS */
header("Access-Control-Allow-Orgin: *");
header("Access-Control-Allow-Methods: GET, POST, PATCH, DELETE");
header("Content-Type: application/json");

/* EXTRACT REQUEST DETAILS */
$requestArray = getRequestDetails();
$data = $requestArray["data"];
$parameters = $requestArray["parameters"];
$token = $requestArray["token"];

/* CONNECT TO DB */
$db = connectToDB();

/* PROCESS REQUEST */
switch($_SERVER['REQUEST_METHOD']) {
    case "GET":
        /* 403 ANY REQUESTS FOR A USER LIST */
        if(!isset($parameters["username"]) /*&& !isset($parameters["email"]) TODO: find by email address */) {
            http_response_code(403);
            break;
        }

        /* CHECK AUTHORISATION */
        $info = getUserInfo($db, $token, $parameters);
        if(!$token || !$info["user"]) {
            http_response_code(401);
            break;
        }

        /* FIND USER, ENCRYPT THE ID */
        $result = $db->query("SELECT * FROM geoshare.users WHERE username='" . $parameters["username"] . "'");
        if($result->num_rows > 0) {
            /* USER FOUND */
            $return = $result->fetch_assoc();

            /* REMOVE FIELDS THE USER SHOULDN'T SEE */
            unset($return["ID"], $return["pass_hash"]);
            if($info["user"] != $info["owner"]) unset($return["created"], $return["modified"], $return["findByEmail"]);
            if(false) unset($return["email"]); // TODO: require friendship to show email address?

            /* RETURN USER ARRAY AS JSON OBJECT */
            echo json_encode($return);
            http_response_code(200);
        } else {
            /* USER DOES NOT EXIST */
            http_response_code(404);
        }
        break;

    case "POST":
        /* CATCH INVALID DATA - CHECKS FOR UNSET/OOB VALUES, FAKED EMAILS (TODO:CRUDE?) OR A SUPPLIED ID */
        if(!isset($data["username"], $data["email"], $data["password"]) || isset($parameters["username"]) || strlen($data["username"]) > 25 || strlen($data["email"]) > 45 || preg_match("/^.*?@.*?\.(co\.uk|com|net|org)$/", $data["email"]) === 0) {
            http_response_code(400);
            break;
        }

        /* EXECUTE SQL */
        $statement = $db->prepare("INSERT INTO geoshare.users(username, email, pass_hash) VALUES(?, ?, ?)");
        $statement->bind_param("sss", $data["username"], $data["email"], password_hash($data["password"], PASSWORD_BCRYPT));
        if($statement->execute()) {
            /* SUCCESS! SEND CLIENT A LINK TO THE CREATED USER */
            header("Location: https://geoshare.appsbystudio.co.uk/api/user/" . $data["username"]);
            http_response_code(201);
        } else {
            /* OOPS! ERROR */
            if(preg_match("/Duplicate entry '(.*?)' for key '(.*?)'/", $db->error, $match) === 1) {
                /* DUPLICATE USER */
                unset($data["password"]);
                echo json_encode(array("error" => "duplicate", "duplicate" => explode("_", $match[2])[0], "request" => $data));
                http_response_code(409);
            } else http_response_code(500);
        }
        break;

    case "PATCH":
        /* CATCH INVALID DATA */
        if(!isset($parameters["username"]) || !$data || isset($data["email"]) && (strlen($data["email"]) > 45 || preg_match("/^.*?@.*?\.(co\.uk|com|net|org)$/", $data["email"]) === 0)) {
            http_response_code(400);
            break;
        }

        /* CHECK AUTHORISATION */
        $info = getUserInfo($db, $token, $parameters);
        if(!$token || $info["user"] != $info["owner"] || $info["user"] == null) {
            http_response_code(401);
            break;
        }

        /* REMOVE ALL BUT WHITELISTED FIELDS FROM INPUT DATA */
        $data = array_intersect_key($data, array_flip(array("email", "findByEmail")));
        // TODO: password changing

        /* CONSTRUCT QUERY */
        $query = "UPDATE geoshare.users SET ";
        $iterator = new CachingIterator(new ArrayIterator($data));
        foreach($iterator as $field => $value) $query .= $field . "='" . $value . ($iterator->hasNext()? "', " : "' ");
        $query .= "WHERE username='" . $parameters["username"] . "'";

        /* EXECUTE AND RETURN RESULT TO USER */
        http_response_code($db->query($query)? 200 : 500);
        break;

    case "DELETE":
        /* CATCH INVALID DATA */
        if(!isset($parameters["username"])) {
            http_response_code(400);
            break;
        }

        /* CHECK AUTHORISATION */
        $info = getUserInfo($db, $token, $parameters);
        if(!$token || $info["user"] != $info["owner"] || $info["user"] == null) {
            http_response_code(401);
            break;
        }

        /* EXECUTE AND RETURN RESULT TO USER */
        http_response_code($db->multi_query("DELETE FROM geoshare.sessions WHERE user='" . $info["owner"] . "'; DELETE FROM geoshare.users WHERE username='" . $parameters["username"] . "'" ) ? 200 : 500);
        break;

    default:
        http_response_code(405);
        break;
}