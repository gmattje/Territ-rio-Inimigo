<?php
header('Access-Control-Allow-Origin: *');

$hojeMenosDois = date("Y-m-d", mktime(0, 0, 0, date("m"), date("d")-2, date("Y")));

$dir = 'jogos';
$diretorios = array_diff(scandir($dir), array('.','..'));

foreach ($diretorios as $key => $nomeDiretorio) {
    $dataSessao = date("Y-m-d", filemtime('jogos/'.$nomeDiretorio));
    //se sessao do jogo tiver 2 dias ou mais, deleta
    if(strtotime($dataSessao) <= $hojeMenosDois){
        delDirTree('jogos/'.$nomeDiretorio);
        unset($diretorios[$key]);
    //se não lista jogadores do jogo        
    } else {
        //se tiver 2 jogadores também não mostra
        if(file_exists("jogos/".$nomeDiretorio."/jogador1.php") && file_exists("jogos/".$nomeDiretorio."/jogador2.php")){
            unset($diretorios[$key]);
        //se existe apenas 1 jogador aguardando            
        } else {
            $fp = fopen("jogos/".$nomeDiretorio."/jogador1.php", "r");
            while(!feof($fp)) {
                $jogador = fgets($fp, 4096);
            }
            fclose ($fp);
            $diretorios[$key] = $diretorios[$key]." (".$jogador.")";
        }
    }
}

function delDirTree($dir) { 
    $files = array_diff(scandir($dir), array('.','..')); 
    foreach ($files as $file) { 
    (is_dir("$dir/$file")) ? delTree("$dir/$file") : unlink("$dir/$file"); 
    } 
    return rmdir($dir); 
}

echo json_encode($diretorios);