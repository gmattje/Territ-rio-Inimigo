<?php

//recebendo dados
$sessao = $_REQUEST['sessao'];
$turno = (int)$_REQUEST['turno'];
$pecaAtaque = $_REQUEST['pecaAtaque'];
$pecaDefesa = $_REQUEST['pecaDefesa'];
$idUnico = md5(time());
    
//criar arquivo
$fp = fopen(__DIR__ ."/jogos/".$sessao."/pecasTurno_".$turno.".txt", "w");
fwrite($fp, $idUnico.",".$pecaAtaque.",".$pecaDefesa);
fclose($fp);