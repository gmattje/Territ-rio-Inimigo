<?php
header('Access-Control-Allow-Origin: *');

//recebendo dados
$sessao = $_REQUEST['sessao'];
$turno = (int)$_REQUEST['turno'];
$dadoAtaque = $_REQUEST['dadoAtaque'];
$dadoDefesa = $_REQUEST['dadoDefesa'];
$numTentativa = $_REQUEST['tentativaAtaque'];
$idUnico = md5(time());
    
//criar arquivo
$conteudo = "<?php header('Access-Control-Allow-Origin: *'); ?>\r\n".$idUnico.",".$numTentativa.",".$dadoAtaque.",".$dadoDefesa;
$file = "jogos/".$sessao."/dadosTurno_".$turno.".php";
file_put_contents($file, $conteudo);