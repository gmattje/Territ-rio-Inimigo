<?php

//recebendo dados
$sessao = $_REQUEST['sessao'];
$turno = (int)$_REQUEST['turno'];
$dadoAtaque = $_REQUEST['dadoAtaque'];
$dadoDefesa = $_REQUEST['dadoDefesa'];
$numTentativa = $_REQUEST['tentativaAtaque'];
$idUnico = md5(time());
    
//criar arquivo
$fp = fopen(__DIR__ ."/jogos/".$sessao."/dadosTurno_".$turno.".txt", "w");
fwrite($fp, $idUnico.",".$numTentativa.",".$dadoAtaque.",".$dadoDefesa);
fclose($fp);