<?php
header('Access-Control-Allow-Origin: *');

//recebendo dados
$sessao = $_REQUEST['sessao'];
$turno = (int)$_REQUEST['turno'];
$pecaAtaque = $_REQUEST['pecaAtaque'];
$pecaDefesa = $_REQUEST['pecaDefesa'];
$idUnico = md5(time());
    
//criar arquivo
$conteudo = "<?php header('Access-Control-Allow-Origin: *'); ?>\r\n".$idUnico.",".$pecaAtaque.",".$pecaDefesa;
$file = "jogos/".$sessao."/pecasTurno_".$turno.".php";
file_put_contents($file, $conteudo);