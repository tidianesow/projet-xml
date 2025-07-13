<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

try {
    $format = isset($_GET['format']) ? strtolower($_GET['format']) : 'xml';
    $xmlFile = __DIR__ . '/../../data/whatsapp_data.xml';
    
    if (!file_exists($xmlFile)) {
        throw new Exception('Fichier XML non trouvé');
    }
    
    switch ($format) {
        case 'json':
            exportToJSON($xmlFile);
            break;
        case 'csv':
            exportToCSV($xmlFile);
            break;
        case 'xml':
        default:
            exportXML($xmlFile);
            break;
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erreur serveur: ' . $e->getMessage()
    ]);
}

function exportXML($xmlFile) {
    header('Content-Type: application/xml');
    header('Content-Disposition: attachment; filename="whatsapp_data.xml"');
    readfile($xmlFile);
}

function exportToJSON($xmlFile) {
    $xml = simplexml_load_file($xmlFile);
    $json = json_encode($xml, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    
    header('Content-Type: application/json');
    header('Content-Disposition: attachment; filename="whatsapp_data.json"');
    echo $json;
}

function exportToCSV($xmlFile) {
    $xml = simplexml_load_file($xmlFile);
    
    header('Content-Type: text/csv');
    header('Content-Disposition: attachment; filename="whatsapp_messages.csv"');
    
    $output = fopen('php://output', 'w');
    
    // En-têtes CSV
    fputcsv($output, ['ID', 'Expéditeur', 'Destinataire', 'Groupe', 'Contenu', 'Type', 'Horodatage', 'Statut']);
    
    // Messages
    if (isset($xml->messages->message)) {
        foreach ($xml->messages->message as $message) {
            fputcsv($output, [
                (string)$message['id'],
                (string)$message->senderId,
                isset($message->receiverId) ? (string)$message->receiverId : '',
                isset($message->groupId) ? (string)$message->groupId : '',
                (string)$message->content,
                (string)$message->type,
                (string)$message->timestamp,
                (string)$message->status
            ]);
        }
    }
    
    fclose($output);
}
?>
