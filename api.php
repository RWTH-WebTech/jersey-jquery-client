<?php
$method = strtoupper(filter_input(INPUT_SERVER, 'REQUEST_METHOD'));
$items = json_decode(file_get_contents('./items.json'));

function xss_protect($str){
    return htmlspecialchars($str, ENT_QUOTES);
}

if($method == 'GET'){
    echo json_encode($items);
} elseif($method == 'POST') {
    $maxId = 0;
    foreach($items as $item){
        if($item->id > $maxId){
            $maxId = $item->id;
        }
    }

    $items[] = [
        'id' => $maxId + 1,
        'name' => xss_protect(filter_input(INPUT_POST, 'name')),
        'description' => xss_protect(filter_input(INPUT_POST, 'description')),
        'bbd' => xss_protect(filter_input(INPUT_POST, 'bbd')),
        'owner' => xss_protect(filter_input(INPUT_POST, 'owner')),
        'ingredients' => xss_protect(filter_input(INPUT_POST, 'ingredients'))
    ];

    echo json_encode(['success' => true]);
} elseif($method == 'DELETE'){
    $id = filter_input(INPUT_GET, 'id', FILTER_SANITIZE_NUMBER_INT);
    $success = false;
    foreach($items as $key => $item){
        if($item->id == $id){
            unset($items[$key]);
            $success = true;
            break;
        }
    }
    echo json_encode(['success' => $success]);
    $items = array_values($items);
}

file_put_contents('./items.json', json_encode($items));
