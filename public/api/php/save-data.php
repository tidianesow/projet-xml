<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Méthode non autorisée']);
    exit;
}

try {
    // Récupérer les données JSON
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (!$data) {
        throw new Exception('Données JSON invalides');
    }
    
    // Créer le document XML
    $xml = new DOMDocument('1.0', 'UTF-8');
    $xml->formatOutput = true;
    
    // Élément racine
    $root = $xml->createElement('whatsapp_platform');
    $xml->appendChild($root);
    
    // Ajouter les utilisateurs
    $usersElement = $xml->createElement('users');
    $root->appendChild($usersElement);
    
    if (isset($data['users']) && is_array($data['users'])) {
        foreach ($data['users'] as $user) {
            $userElement = $xml->createElement('user');
            $userElement->setAttribute('id', htmlspecialchars($user['id']));
            
            $userElement->appendChild($xml->createElement('name', htmlspecialchars($user['name'])));
            $userElement->appendChild($xml->createElement('email', htmlspecialchars($user['email'])));
            $userElement->appendChild($xml->createElement('status', htmlspecialchars($user['status'])));
            
            if (isset($user['avatar'])) {
                $userElement->appendChild($xml->createElement('avatar', htmlspecialchars($user['avatar'])));
            }
            
            if (isset($user['lastSeen'])) {
                $userElement->appendChild($xml->createElement('lastSeen', htmlspecialchars($user['lastSeen'])));
            }
            
            $usersElement->appendChild($userElement);
        }
    }
    
    // Ajouter les contacts
    $contactsElement = $xml->createElement('contacts');
    $root->appendChild($contactsElement);
    
    if (isset($data['contacts']) && is_array($data['contacts'])) {
        foreach ($data['contacts'] as $contact) {
            $contactElement = $xml->createElement('contact');
            $contactElement->setAttribute('id', htmlspecialchars($contact['id']));
            
            $contactElement->appendChild($xml->createElement('userId', htmlspecialchars($contact['userId'])));
            $contactElement->appendChild($xml->createElement('name', htmlspecialchars($contact['name'])));
            $contactElement->appendChild($xml->createElement('status', htmlspecialchars($contact['status'])));
            $contactElement->appendChild($xml->createElement('unreadCount', htmlspecialchars($contact['unreadCount'])));
            
            if (isset($contact['avatar'])) {
                $contactElement->appendChild($xml->createElement('avatar', htmlspecialchars($contact['avatar'])));
            }
            
            if (isset($contact['lastMessage'])) {
                $contactElement->appendChild($xml->createElement('lastMessage', htmlspecialchars($contact['lastMessage'])));
            }
            
            if (isset($contact['lastMessageTime'])) {
                $contactElement->appendChild($xml->createElement('lastMessageTime', htmlspecialchars($contact['lastMessageTime'])));
            }
            
            $contactsElement->appendChild($contactElement);
        }
    }
    
    // Ajouter les groupes
    $groupsElement = $xml->createElement('groups');
    $root->appendChild($groupsElement);
    
    if (isset($data['groups']) && is_array($data['groups'])) {
        foreach ($data['groups'] as $group) {
            $groupElement = $xml->createElement('group');
            $groupElement->setAttribute('id', htmlspecialchars($group['id']));
            
            $groupElement->appendChild($xml->createElement('name', htmlspecialchars($group['name'])));
            $groupElement->appendChild($xml->createElement('admin', htmlspecialchars($group['admin'])));
            $groupElement->appendChild($xml->createElement('unreadCount', htmlspecialchars($group['unreadCount'])));
            
            if (isset($group['description'])) {
                $groupElement->appendChild($xml->createElement('description', htmlspecialchars($group['description'])));
            }
            
            if (isset($group['avatar'])) {
                $groupElement->appendChild($xml->createElement('avatar', htmlspecialchars($group['avatar'])));
            }
            
            if (isset($group['lastMessage'])) {
                $groupElement->appendChild($xml->createElement('lastMessage', htmlspecialchars($group['lastMessage'])));
            }
            
            if (isset($group['lastMessageTime'])) {
                $groupElement->appendChild($xml->createElement('lastMessageTime', htmlspecialchars($group['lastMessageTime'])));
            }
            
            // Ajouter les membres
            if (isset($group['members']) && is_array($group['members'])) {
                $membersElement = $xml->createElement('members');
                foreach ($group['members'] as $memberId) {
                    $memberElement = $xml->createElement('member', htmlspecialchars($memberId));
                    $membersElement->appendChild($memberElement);
                }
                $groupElement->appendChild($membersElement);
            }
            
            $groupsElement->appendChild($groupElement);
        }
    }
    
    // Ajouter les messages
    $messagesElement = $xml->createElement('messages');
    $root->appendChild($messagesElement);
    
    if (isset($data['messages']) && is_array($data['messages'])) {
        foreach ($data['messages'] as $message) {
            $messageElement = $xml->createElement('message');
            $messageElement->setAttribute('id', htmlspecialchars($message['id']));
            
            $messageElement->appendChild($xml->createElement('senderId', htmlspecialchars($message['senderId'])));
            $messageElement->appendChild($xml->createElement('content', htmlspecialchars($message['content'])));
            $messageElement->appendChild($xml->createElement('type', htmlspecialchars($message['type'])));
            $messageElement->appendChild($xml->createElement('timestamp', htmlspecialchars($message['timestamp'])));
            $messageElement->appendChild($xml->createElement('status', htmlspecialchars($message['status'])));
            
            if (isset($message['receiverId'])) {
                $messageElement->appendChild($xml->createElement('receiverId', htmlspecialchars($message['receiverId'])));
            }
            
            if (isset($message['groupId'])) {
                $messageElement->appendChild($xml->createElement('groupId', htmlspecialchars($message['groupId'])));
            }
            
            $messagesElement->appendChild($messageElement);
        }
    }
    
    // Sauvegarder le fichier XML
    $xmlFile = __DIR__ . '/../../data/whatsapp_data.xml';
    
    // Créer le dossier data s'il n'existe pas
    $dataDir = dirname($xmlFile);
    if (!is_dir($dataDir)) {
        mkdir($dataDir, 0755, true);
    }
    
    if ($xml->save($xmlFile)) {
        echo json_encode([
            'success' => true,
            'message' => 'Données sauvegardées avec succès en XML',
            'file' => $xmlFile
        ]);
    } else {
        throw new Exception('Erreur lors de la sauvegarde du fichier XML');
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erreur serveur: ' . $e->getMessage()
    ]);
}
?>
