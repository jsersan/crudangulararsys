<?php
// backend-php/config.php · Valores por defecto para desarrollo (MAMP). SIN secretos.
$config = [
    'db' => [
        'host'    => 'lldn292.servidoresdns.net',   // host de arsys
        'port'    => '3306',                       // puerto
        'name'    => 'qaot591',                   // base de datos
        'user'    => 'qaot591',                    // usuario
        'pass'    => 'Jss12aoz',                   // contraseña   
        'charset' => 'utf8mb4',
    ],
    'cors_origins' => ['http://localhost:4200'],
];

// Si existe config.local.php (servidor de producción), sobrescribe estos valores
$local = __DIR__ . '/config.local.php';
if (is_file($local)) {
    $override = require $local;
    if (is_array($override)) {
        $config = array_replace_recursive($config, $override);
    }
}

return $config;