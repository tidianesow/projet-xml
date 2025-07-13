# Documentation PHP - Plateforme de Discussion XML

## Architecture PHP

La plateforme utilise PHP avec la librairie SimpleXML comme spécifié dans le cahier des charges du Pr Ibrahima FALL.

## Structure des Fichiers PHP

### 📁 `/public/api/php/`

1. **`save-data.php`** - Sauvegarde des données en XML
2. **`load-data.php`** - Chargement des données depuis XML avec SimpleXML
3. **`validate-xml.php`** - Validation XML contre le schéma XSD
4. **`search-messages.php`** - Recherche dans les messages
5. **`export-data.php`** - Export des données (XML, JSON, CSV)

### 📁 `/public/data/`
- **`whatsapp_data.xml`** - Fichier de stockage principal

## Fonctionnalités PHP Implémentées

### ✅ Gestion XML avec SimpleXML
\`\`\`php
// Chargement des données
$xml = simplexml_load_file($xmlFile);

// Parcours des éléments
foreach ($xml->messages->message as $message) {
    $content = (string)$message->content;
}
\`\`\`

### ✅ Sauvegarde avec DOMDocument
\`\`\`php
// Création du document XML
$xml = new DOMDocument('1.0', 'UTF-8');
$xml->formatOutput = true;

// Ajout d'éléments
$userElement = $xml->createElement('user');
$userElement->setAttribute('id', $userId);
\`\`\`

### ✅ Validation XSD
\`\`\`php
// Validation contre le schéma
$dom = new DOMDocument();
$dom->load($xmlFile);
$isValid = $dom->schemaValidate($xsdFile);
\`\`\`

### ✅ Recherche Avancée
- Recherche dans le contenu des messages
- Filtrage par utilisateur
- Recherche dans les groupes

### ✅ Export Multi-formats
- **XML** : Format natif
- **JSON** : Pour l'interopérabilité
- **CSV** : Pour l'analyse de données

## Endpoints API PHP

### POST `/api/php/save-data.php`
Sauvegarde les données en XML
\`\`\`json
{
  "users": [...],
  "contacts": [...],
  "groups": [...],
  "messages": [...]
}
\`\`\`

### GET `/api/php/load-data.php`
Charge les données depuis XML
\`\`\`json
{
  "success": true,
  "data": {
    "users": [...],
    "contacts": [...],
    "groups": [...],
    "messages": [...]
  }
}
\`\`\`

### GET `/api/php/validate-xml.php`
Valide le XML contre le XSD
\`\`\`json
{
  "success": true,
  "valid": true,
  "message": "Le fichier XML est valide"
}
\`\`\`

### GET `/api/php/search-messages.php?q=terme&userId=user1`
Recherche dans les messages
\`\`\`json
{
  "success": true,
  "results": [...],
  "count": 5,
  "searchTerm": "terme"
}
\`\`\`

### GET `/api/php/export-data.php?format=json`
Export des données (xml|json|csv)

## Sécurité

- **Échappement HTML** : `htmlspecialchars()`
- **Validation des entrées** : Vérification des données JSON
- **Gestion des erreurs** : Try-catch avec messages d'erreur appropriés
- **Headers CORS** : Configuration pour l'accès depuis le frontend

## Conformité au Cahier des Charges

✅ **Utilisation de PHP** : Implémentation complète en PHP  
✅ **Librairie SimpleXML** : Utilisée pour le chargement des données  
✅ **Stockage XML** : Toutes les données stockées en XML  
✅ **Validation** : XSD et DTD implémentés  
✅ **Gestion complète** : Contacts, groupes, messages, profils  

## Installation PHP

1. **Serveur Web** : Apache/Nginx avec PHP 7.4+
2. **Extensions requises** :
   - `php-xml` (SimpleXML, DOMDocument)
   - `php-json`
   - `php-mbstring`

3. **Configuration** :
\`\`\`bash
# Vérifier les extensions
php -m | grep -E "(xml|json|mbstring)"

# Permissions sur le dossier data
chmod 755 public/data/
chmod 666 public/data/whatsapp_data.xml
\`\`\`

Cette implémentation PHP respecte parfaitement les exigences du projet DSS-XML et utilise les technologies demandées par le Pr Ibrahima FALL.
