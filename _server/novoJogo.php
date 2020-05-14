<?php
header('Access-Control-Allow-Origin: *');

//se veio nome do jogador 1
if(isset($_REQUEST['player1'])) {
    
    $nomeJogador1 = $_REQUEST['player1'];
    $faseSelecionada = $_REQUEST['fase'];

    //setando nova sessão
    $idNovaSessao = md5(time());

    //criando diretorio da sessao
    mkdir("jogos/".$idNovaSessao, 0777, true);

    //criar arquivo jogador 1
    $conteudo = "<?php header('Access-Control-Allow-Origin: *'); ?>\r\n".$nomeJogador1;
    $file = "jogos/".$idNovaSessao."/jogador1.php";
    file_put_contents($file, $conteudo);

    //criar arquivo da fase
    $conteudo = "<?php header('Access-Control-Allow-Origin: *'); ?>\r\n".$faseSelecionada;
    $file = "jogos/".$idNovaSessao."/fase.php";
    file_put_contents($file, $conteudo);

    echo $idNovaSessao;

//se veio nome do jogador 2 e sessao online
} else if(isset($_REQUEST['player2']) AND isset($_REQUEST['sessao'])) {
    
    $idNovaSessao = $_REQUEST['sessao'];
    $nomeJogador2 = $_REQUEST['player2'];
    
    //criar arquivo jogador 2
    $conteudo = "<?php header('Access-Control-Allow-Origin: *'); ?>\r\n".$nomeJogador2;
    $file = "jogos/".$idNovaSessao."/jogador2.php";
    file_put_contents($file, $conteudo);
    
    //joga dados para definir o iniciante
    $sorteInicial = implode(",", sorteInicial());
    $conteudo = "<?php header('Access-Control-Allow-Origin: *'); ?>\r\n".$sorteInicial;
    $file = "jogos/".$idNovaSessao."/sorteInicial.php";
    file_put_contents($file, $conteudo);

    echo $idNovaSessao;
    
//se veio solicitando a fase escolhida
} else if(isset($_REQUEST['fase']) AND isset($_REQUEST['sessao'])) {

    $idNovaSessao = $_REQUEST['sessao'];
    $faseSelecionada = "fase-1";

    if(file_exists("jogos/".$idNovaSessao."/fase.php")){
        $fp = fopen("jogos/".$idNovaSessao."/fase.php", "r");
        while(!feof($fp)) {
            $faseSelecionada = fgets($fp, 4096);
        }
        fclose ($fp);
    }

    echo $faseSelecionada;

}

function sorteInicial(){
    $dadoJogador1 = rand(1, 6);
    $dadoJogador2 = rand(1, 6);
    $objetivoSecretoJogador1 = rand(1, 10);
    $objetivoSecretoJogador2 = rand(1, 10);
    if($dadoJogador1 == $dadoJogador2){
        return sorteInicial();
    } else {
        return array($dadoJogador1, $dadoJogador2, $objetivoSecretoJogador1, $objetivoSecretoJogador2);
    }
}