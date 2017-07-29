<?php

//recebendo dados
$sessao = $_REQUEST['sessao'];
$turno = (int)$_REQUEST['turno'];
$pecaRetirada = $_REQUEST['pecaRetirada'];
$idUnico = md5(time());
    
//criar arquivo
$fp = fopen(__DIR__ ."/jogos/".$sessao."/pecaRetiradaTurno_".$turno.".txt", "w");
fwrite($fp, $idUnico.",".$pecaRetirada);
fclose($fp);