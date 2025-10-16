<?php
// Script para actualizar automáticamente la lista de imágenes
// Este archivo se puede ejecutar manualmente o con webhooks de GitHub

function scanDirectory($dir) {
    $files = [];
    if (is_dir($dir)) {
        $handle = opendir($dir);
        while (($file = readdir($handle)) !== false) {
            if ($file != '.' && $file != '..' && !is_dir($dir . '/' . $file)) {
                $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
                if (in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
                    $files[] = $file;
                }
            }
        }
        closedir($handle);
    }
    return $files;
}

$images = [
    'experts' => scanDirectory('images/experts'),
    'projects' => scanDirectory('images/projects'),
    'clients' => scanDirectory('images/clients')
];

$json = json_encode($images, JSON_PRETTY_PRINT);
file_put_contents('images/images.json', $json);

echo "Images list updated successfully!\n";
echo "Found " . count($images['experts']) . " expert images\n";
echo "Found " . count($images['projects']) . " project images\n";
echo "Found " . count($images['clients']) . " client images\n";
?>

