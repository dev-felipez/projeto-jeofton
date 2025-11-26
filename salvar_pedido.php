<?php
$nome = $_POST['nome'] ?? '';
$pedido = $_POST['pedido'] ?? '';

if ($nome && $pedido) {
    $data = date('Y-m-d H:i:s');
    $registro = "Data: $data\nCliente: $nome\nPedido: $pedido\n-------------------------\n";
    file_put_contents("pedidos.txt", $registro, FILE_APPEND | LOCK_EX);
    echo "OK";
    exit;
}

http_response_code(400);
echo "Dados inválidos";