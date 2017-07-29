<?php

//recebendo dados
$sessao = $_REQUEST['sessao'];
$turno = (int)$_REQUEST['turno'];
$arrayData = $_REQUEST;
$arrayData['idUnico'] = md5(time());

// function defination to convert array to xml
function array_to_xml( $data, &$xml_data ) {
    foreach( $data as $key => $value ) {
        if( is_numeric($key) ){
            $key = 'item'.$key; //dealing with <0/>..<n/> issues
        }
        if( is_array($value) ) {
            $subnode = $xml_data->addChild($key);
            array_to_xml($value, $subnode);
        } else {
            $xml_data->addChild("$key",htmlspecialchars("$value"));
        }
    }
}

//gerando arquivo
$xml = new SimpleXMLElement('<?xml version="1.0" ?><territorioinimigo />');
array_to_xml($arrayData, $xml);

$xml->saveXML('jogos/'.$sessao.'/casasEPecasTurno_'.$turno.'.xml');