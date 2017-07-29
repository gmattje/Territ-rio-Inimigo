<?php

//se veio nome do jogador 1
if(isset($_REQUEST['player1'])) {
    
    $nomeJogador1 = $_REQUEST['player1'];

    //setando nova sessão
    $idNovaSessao = md5(time());

    //criando diretorio da sessao
    mkdir(__DIR__ ."/jogos/".$idNovaSessao, 0777);

    //criar arquivo jogador 1
    $fp = fopen(__DIR__ ."/jogos/".$idNovaSessao."/jogador1.txt", "w");
    fwrite($fp, $nomeJogador1);
    fclose($fp);

//se veio nome do jogador 2 e sessao online
} else if(isset($_REQUEST['player2']) AND isset($_REQUEST['sessao'])) {
    
    $idNovaSessao = $_REQUEST['sessao'];
    $nomeJogador2 = $_REQUEST['player2'];
    
    //criar arquivo jogador 2
    $fp = fopen(__DIR__ ."/jogos/".$idNovaSessao."/jogador2.txt", "w");
    fwrite($fp, $nomeJogador2);
    fclose($fp);
    
    //joga dados para definir o iniciante
    $sorteInicial = implode(",", sorteInicial());
    $fp = fopen(__DIR__ ."/jogos/".$idNovaSessao."/sorteInicial.txt", "w");
    fwrite($fp, $sorteInicial);
    fclose($fp);
    
}

function sorteInicial(){
    $dadoJogador1 = rand(1, 6);
    $dadoJogador2 = rand(1, 6);
    $objetivoSecretoJogador1 = rand(1, 10);
    $objetivoSecretoJogador2 = rand(1, 10);
    if($dadoJogador1 == $dadoJogador2){
        return defineIniciante();
    } else {
        return array($dadoJogador1, $dadoJogador2, $objetivoSecretoJogador1, $objetivoSecretoJogador2);
    }
}

echo $idNovaSessao;