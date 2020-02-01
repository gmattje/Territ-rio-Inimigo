<?php
header('Access-Control-Allow-Origin: *');

//recebendo dados
$sessao = $_REQUEST['sessao'];
$turno = (int)$_REQUEST['turno'];
$pecaMovimentada = $_REQUEST['pecaMovimentada'];
$campoDestinatario = $_REQUEST['campoDestinatario'];
$casaDestinataria = $_REQUEST['casaDestinataria'];
$ocupacaoCasa = $_REQUEST['ocupacaoCasa'];
$gasolinaTurno = (int)$_REQUEST['gasolinaTurno'];
$idUnico = md5(time());
    
//criar arquivo
$conteudo = "<?php header('Access-Control-Allow-Origin: *'); ?>\r\n".$idUnico.",".$pecaMovimentada.",".$campoDestinatario.",".$casaDestinataria.",".$ocupacaoCasa.",".$gasolinaTurno;
$file = "jogos/".$sessao."/movimentacaoTurno_".$turno.".php";
file_put_contents($file, $conteudo);