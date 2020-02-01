<?php
header('Access-Control-Allow-Origin: *');

//se veio sessao
if(isset($_REQUEST['sessao'])) {
    
    $idNovaSessao = $_REQUEST['sessao'];

    if(file_exists('jogos/'.$idNovaSessao)) {
        delDirTree('jogos/'.$idNovaSessao);
    }
    
}

function delDirTree($dir) { 
    $files = array_diff(scandir($dir), array('.','..')); 
    foreach ($files as $file) { 
    (is_dir("$dir/$file")) ? delTree("$dir/$file") : unlink("$dir/$file"); 
    } 
    return rmdir($dir); 
}