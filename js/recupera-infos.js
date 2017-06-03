$(document).ready(function (){

    function zeraBarrasLaterais(){
        $('.barraLateral .infos h3.nomePeca').empty();
        $('.barraLateral .infos div.vidas').empty();
        $('.barraLateral .infos div.imagem-demo').empty();
        $('.barraLateral .infos div.movimentacao').empty();
        $('.barraLateral .infos div.alcance').empty();
        $('.barraLateral .infos div.dano').empty();
        $('.barraLateral .infos div.tiros').empty();
        $('.barraLateral .infos div.adicional').empty();
    }

    $('#palco .casa').mouseover(function(){
        var arrCampo = $(this).parent().attr('class').split(' ');
        var campo = arrCampo[1];
        var arrCasa = $(this).attr('class').split(' ');
        var casa = arrCasa[1];
        var ocupada = casas['campo-' + campo][casa].ocupada;
        if(ocupada !== "") {
            $('.barraLateral.campo-' + campo + ' .infos h3.nomePeca').html(pecas[ocupada].nome);
            $('.barraLateral.campo-' + campo + ' .infos div.imagem-demo').html('<img src="pecas/' + pecas[ocupada].tipo + '-demo.png">');
            $('.barraLateral.campo-' + campo + ' .infos div.movimentacao').html('Movimentação: ' + pecas[ocupada].movimentacao);
            $('.barraLateral.campo-' + campo + ' .infos div.alcance').html('Alcance: ' + pecas[ocupada].alcance);
            $('.barraLateral.campo-' + campo + ' .infos div.dano').html('Dano: ' + pecas[ocupada].dano + ' vida(s)');
            if(pecas[ocupada].adicional != undefined) {
                $('.barraLateral.campo-' + campo + ' .infos div.adicional').html('Adicional: ' + pecas[ocupada].adicional);
            }
            var tentativas = '';
            if(pecas[ocupada].tiros == '-1'){
                tentativas += 'Infinitos, podendo tentar ' + pecas[ocupada].tentativas + ' vez(es) por turno'
            } else {
                tentativas += pecas[ocupada].tiros + ' tiro(s), podendo tentar ' + pecas[ocupada].tentativas + ' vez(es) por turno'
            }
            $('.barraLateral.campo-' + campo + ' .infos div.tiros').html('Tiros: ' + tentativas);
            
            //informacoes variaveis
            if(pecas[ocupada].vida == '-1'){
                $('.barraLateral.campo-' + campo + ' .infos div.vidas').html('Vidas infinitas');
            } else {
                $('.barraLateral.campo-' + campo + ' .infos div.vidas').empty();
                for(var i=1;i<=pecas[ocupada].vida;i++){
                    $('<div>').prependTo('.barraLateral.campo-' + campo + ' .infos div.vidas').addClass('vida');
                } 
            }
        }
    });
    
    $('#palco .casa').mouseleave(function(){
        zeraBarrasLaterais();
    });

});