<?php

//recebendo dados
$sessao = $_REQUEST['sessao'];
$turno = (int)$_REQUEST['turno'];
$pecaMovimentada = $_REQUEST['pecaMovimentada'];
$campoDestinatario = $_REQUEST['campoDestinatario'];
$casaDestinataria = $_REQUEST['casaDestinataria'];
$ocupacaoCasa = $_REQUEST['ocupacaoCasa'];
$idUnico = md5(time());
    
//criar arquivo
$fp = fopen(__DIR__ ."/jogos/".$sessao."/movimentacaoTurno_".$turno.".txt", "w");
fwrite($fp, $idUnico.",".$pecaMovimentada.",".$campoDestinatario.",".$casaDestinataria.",".$ocupacaoCasa);
fclose($fp);