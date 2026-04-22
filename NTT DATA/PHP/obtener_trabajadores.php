<?php
header("Content-Type: application/json; charset=utf-8");

// Datos de conexión (Asegúrate que coincidan con tu XAMPP)
$conn = new mysqli("localhost", "root", "", "webacces_db");

if ($conn->connect_error) {
    echo json_encode(["error" => "Conexión fallida"]);
    exit;
}

// Verifica que el nombre de la columna sea 'rol' o como lo tengas en tu tabla 'usuarios'
$sql = "SELECT id, nombre FROM usuarios WHERE rol = 'trabajador'";
$result = $conn->query($sql);

$trabajadores = [];
if ($result) {
    while($row = $result->fetch_assoc()) {
        $trabajadores[] = $row;
    }
}

echo json_encode($trabajadores);
$conn->close();
?>