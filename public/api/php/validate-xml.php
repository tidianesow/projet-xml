<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

try {
    $xmlFile = __DIR__ . '/../../data/whatsapp_data.xml';
    $xsdFile = __DIR__ . '/../../schema/whatsapp-platform.xsd';
    
    if (!file_exists($xmlFile)) {
        throw new Exception('Fichier XML non trouvé');
    }
    
    if (!file_exists($xsdFile)) {
        throw new Exception('Fichier XSD non trouvé');
    }
    
    // Créer un document DOM pour la validation
    $dom = new DOMDocument();
    $dom->load($xmlFile);
    
    // Valider contre le schéma XSD
    libxml_use_internal_errors(true);
    $isValid = $dom->schemaValidate($xsdFile);
    
    if ($isValid) {
        echo json_encode([
            'success' => true,
            'valid' => true,
            'message' => 'Le fichier XML est valide selon le schéma XSD'
        ]);
    } else {
        $errors = libxml_get_errors();
        $errorMessages = [];
        
        foreach ($errors as $error) {
            $errorMessages[] = trim($error->message);
        }
        
        echo json_encode([
            'success' => true,
            'valid' => false,
            'message' => 'Le fichier XML n\'est pas valide',
            'errors' => $errorMessages
        ]);
    }
    
    libxml_clear_errors();
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erreur serveur: ' . $e->getMessage()
    ]);
}
?>
