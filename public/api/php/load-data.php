<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Méthode non autorisée']);
    exit;
}

try {
    $xmlFile = __DIR__ . '/../../data/whatsapp_data.xml';
    
    // Vérifier si le fichier existe
    if (!file_exists($xmlFile)) {
        // Créer un fichier XML par défaut
        createDefaultXMLFile($xmlFile);
    }
    
    // Charger le fichier XML avec SimpleXML
    $xml = simplexml_load_file($xmlFile);
    
    if ($xml === false) {
        throw new Exception('Erreur lors du chargement du fichier XML');
    }
    
    // Convertir les données XML en tableau PHP
    $data = [
        'users' => [],
        'contacts' => [],
        'groups' => [],
        'messages' => []
    ];
    
    // Charger les utilisateurs
    if (isset($xml->users->user)) {
        foreach ($xml->users->user as $user) {
            $userData = [
                'id' => (string)$user['id'],
                'name' => (string)$user->name,
                'email' => (string)$user->email,
                'status' => (string)$user->status
            ];
            
            if (isset($user->avatar)) {
                $userData['avatar'] = (string)$user->avatar;
            }
            
            if (isset($user->lastSeen)) {
                $userData['lastSeen'] = (string)$user->lastSeen;
            }
            
            $data['users'][] = $userData;
        }
    }
    
    // Charger les contacts
    if (isset($xml->contacts->contact)) {
        foreach ($xml->contacts->contact as $contact) {
            $contactData = [
                'id' => (string)$contact['id'],
                'userId' => (string)$contact->userId,
                'name' => (string)$contact->name,
                'status' => (string)$contact->status,
                'unreadCount' => (int)$contact->unreadCount
            ];
            
            if (isset($contact->avatar)) {
                $contactData['avatar'] = (string)$contact->avatar;
            }
            
            if (isset($contact->lastMessage)) {
                $contactData['lastMessage'] = (string)$contact->lastMessage;
            }
            
            if (isset($contact->lastMessageTime)) {
                $contactData['lastMessageTime'] = (string)$contact->lastMessageTime;
            }
            
            $data['contacts'][] = $contactData;
        }
    }
    
    // Charger les groupes
    if (isset($xml->groups->group)) {
        foreach ($xml->groups->group as $group) {
            $groupData = [
                'id' => (string)$group['id'],
                'name' => (string)$group->name,
                'admin' => (string)$group->admin,
                'unreadCount' => (int)$group->unreadCount,
                'members' => []
            ];
            
            if (isset($group->description)) {
                $groupData['description'] = (string)$group->description;
            }
            
            if (isset($group->avatar)) {
                $groupData['avatar'] = (string)$group->avatar;
            }
            
            if (isset($group->lastMessage)) {
                $groupData['lastMessage'] = (string)$group->lastMessage;
            }
            
            if (isset($group->lastMessageTime)) {
                $groupData['lastMessageTime'] = (string)$group->lastMessageTime;
            }
            
            // Charger les membres
            if (isset($group->members->member)) {
                foreach ($group->members->member as $member) {
                    $groupData['members'][] = (string)$member;
                }
            }
            
            $data['groups'][] = $groupData;
        }
    }
    
    // Charger les messages
    if (isset($xml->messages->message)) {
        foreach ($xml->messages->message as $message) {
            $messageData = [
                'id' => (string)$message['id'],
                'senderId' => (string)$message->senderId,
                'content' => (string)$message->content,
                'type' => (string)$message->type,
                'timestamp' => (string)$message->timestamp,
                'status' => (string)$message->status
            ];
            
            if (isset($message->receiverId)) {
                $messageData['receiverId'] = (string)$message->receiverId;
            }
            
            if (isset($message->groupId)) {
                $messageData['groupId'] = (string)$message->groupId;
            }
            
            $data['messages'][] = $messageData;
        }
    }
    
    echo json_encode([
        'success' => true,
        'data' => $data,
        'message' => 'Données chargées avec succès depuis XML'
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erreur serveur: ' . $e->getMessage()
    ]);
}

function createDefaultXMLFile($xmlFile) {
    $dataDir = dirname($xmlFile);
    if (!is_dir($dataDir)) {
        mkdir($dataDir, 0755, true);
    }
    
    $defaultXML = '<?xml version="1.0" encoding="UTF-8"?>
<whatsapp_platform>
    <users>
        <user id="user1">
            <name>Tidiane Sow</name>
            <email>tidiane@example.com</email>
            <status>online</status>
        </user>
    </users>
    <contacts>
        <contact id="contact1">
            <userId>user2</userId>
            <name>Ibrahima Fall</name>
            <status>online</status>
            <lastMessage>Salut, comment ça va ?</lastMessage>
            <lastMessageTime>14:30</lastMessageTime>
            <unreadCount>2</unreadCount>
        </contact>
        <contact id="contact2">
            <userId>user3</userId>
            <name>Fatou Diop</name>
            <status>offline</status>
            <lastMessage>À bientôt !</lastMessage>
            <lastMessageTime>12:15</lastMessageTime>
            <unreadCount>0</unreadCount>
        </contact>
    </contacts>
    <groups>
        <group id="group1">
            <name>Projet DSS-XML</name>
            <description>Groupe de travail pour le projet</description>
            <admin>user1</admin>
            <members>
                <member>user1</member>
                <member>user2</member>
                <member>user3</member>
                <member>user4</member>
            </members>
            <lastMessage>Réunion demain à 14h</lastMessage>
            <lastMessageTime>16:45</lastMessageTime>
            <unreadCount>1</unreadCount>
        </group>
    </groups>
    <messages>
        <message id="msg1">
            <senderId>user2</senderId>
            <receiverId>user1</receiverId>
            <content>Salut, comment ça va ?</content>
            <type>text</type>
            <timestamp>2025-01-12T14:30:00Z</timestamp>
            <status>read</status>
        </message>
        <message id="msg2">
            <senderId>user1</senderId>
            <receiverId>user2</receiverId>
            <content>Ça va bien, merci ! Et toi ?</content>
            <type>text</type>
            <timestamp>2025-01-12T14:32:00Z</timestamp>
            <status>delivered</status>
        </message>
    </messages>
</whatsapp_platform>';
    
    file_put_contents($xmlFile, $defaultXML);
}
?>
