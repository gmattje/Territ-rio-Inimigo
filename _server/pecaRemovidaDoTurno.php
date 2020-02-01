<?php
header('Access-Control-Allow-Origin: *');

//recebendo dados
$sessao = $_REQUEST['sessao'];
$turno = (int)$_REQUEST['turno'];
$pecaRetirada = $_REQUEST['pecaRetirada'];
$idUnico = md5(time());
    
//criar arquivo
$conteudo = "<?php header('Access-Control-Allow-Origin: *'); ?>\r\n".$idUnico.",".$pecaRetirada;
$file = "jogos/".$sessao."/pecaRetiradaTurno_".$turno.".php";
file_put_contents($file, $conteudo);