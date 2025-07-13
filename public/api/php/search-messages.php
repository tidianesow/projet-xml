<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

try {
    $searchTerm = isset($_GET['q']) ? trim($_GET['q']) : '';
    $userId = isset($_GET['userId']) ? trim($_GET['userId']) : '';
    
    if (empty($searchTerm)) {
        throw new Exception('Terme de recherche requis');
    }
    
    $xmlFile = __DIR__ . '/../../data/whatsapp_data.xml';
    
    if (!file_exists($xmlFile)) {
        throw new Exception('Fichier XML non trouvé');
    }
    
    // Charger le fichier XML avec SimpleXML
    $xml = simplexml_load_file($xmlFile);
    
    if ($xml === false) {
        throw new Exception('Erreur lors du chargement du fichier XML');
    }
    
    $results = [];
    
    // Rechercher dans les messages
    if (isset($xml->messages->message)) {
        foreach ($xml->messages->message as $message) {
            $content = (string)$message->content;
            $senderId = (string)$message->senderId;
            $receiverId = isset($message->receiverId) ? (string)$message->receiverId : '';
            $groupId = isset($message->groupId) ? (string)$message->groupId : '';
            
            // Vérifier si le message contient le terme de recherche
            if (stripos($content, $searchTerm) !== false) {
                // Vérifier si l'utilisateur est impliqué dans cette conversation
                if (empty($userId) || $senderId === $userId || $receiverId === $userId || 
                    (!empty($groupId) && isUserInGroup($xml, $groupId, $userId))) {
                    
                    $results[] = [
                        'id' => (string)$message['id'],
                        'senderId' => $senderId,
                        'receiverId' => $receiverId,
                        'groupId' => $groupId,
                        'content' => $content,
                        'type' => (string)$message->type,
                        'timestamp' => (string)$message->timestamp,
                        'status' => (string)$message->status
                    ];
                }
            }
        }
    }
    
    echo json_encode([
        'success' => true,
        'results' => $results,
        'count' => count($results),
        'searchTerm' => $searchTerm
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erreur serveur: ' . $e->getMessage()
    ]);
}

function isUserInGroup($xml, $groupId, $userId) {
    if (isset($xml->groups->group)) {
        foreach ($xml->groups->group as $group) {
            if ((string)$group['id'] === $groupId) {
                if (isset($group->members->member)) {
                    foreach ($group->members->member as $member) {
                        if ((string)$member === $userId) {
                            return true;
                        }
                    }
                }
                break;
            }
        }
    }
    return false;
}
?>
