//recupera variáveis

//turno
var turnoAtacante = "cima";
var turnoDefesa = "baixo";

//pecas selecionadas
var pecaSelecionadaCampoAtaque = "";
var pecaSelecionadaCampoDefesa = "";

//se jogo está rolando
var varPlay = false;

//função de inicialização
function init(){
    reorganizaTabuleiro();
    populaCampos();
    ativaRecuperacaoDeDados();
    ativaControlesMouseu();
}

//calcula tamanho das casas e organiza tabuleiro
function reorganizaTabuleiro(){
    //zera tudo
    $('#palco').removeAttr('style');
    $('#palco .campo').removeAttr('style');
    $('#palco .campo .casa').removeAttr('style');
    //refaz calculos
    $('#palco').css('width',getDocWidth()+'px');
    var tamanhoCampoW = $('#palco .campo').width();
    var tamanhoCampoH = ($('#palco').height()/2)-5 //desconta a metade do tamanho da divisao
    var margemCampoL = (getDocWidth()-tamanhoCampoW)/2;
    var tamanhoCasasW = (tamanhoCampoW/7)-1;
    var tamanhoCasasH = tamanhoCampoH/5;
    $('#palco .campo .casa').css('width',tamanhoCasasW+'px').css('height',tamanhoCasasH+'px');
    $('#palco .campo').css('margin-left',margemCampoL+'px');
}

//coloca as pecas em seus lugares
function populaCampos(){
    //varre pecas
    $.each(pecas, function(index){ 
        var tipoPeca = this.tipo;
        var campoPeca = this.campoAtual;
        var casaOcupada = this.casaAtual;
        $('#pecas .' + tipoPeca + '.' + campoPeca).clone().appendTo('.campo.' + campoPeca + ' .casa.' +casaOcupada).attr('id',index);
        casas['campo-'+campoPeca][casaOcupada].ocupacao1 = index;
    });
}

function ativaRecuperacaoDeDados() {

    $('#palco .casa .peca').mouseover(function(){
        var peca = $(this).attr('id');
        var campo = pecas[peca].exercito;
        exibeDadosPeca(peca, campo);
    });
    
    $('#palco .casa .peca').mouseleave(function(){
        zeraBarrasLaterais();
    });

}

function zeraBarrasLaterais(){
    $('.barraLateral .infos h3.nomePeca').empty();
    $('.barraLateral .infos div.vidas').empty();
    $('.barraLateral .infos div.gasolina').empty();
    $('.barraLateral .infos div.imagem-demo').empty();
    $('.barraLateral .infos div.movimentacao').empty();
    $('.barraLateral .infos div.alcance').empty();
    $('.barraLateral .infos div.dano').empty();
    $('.barraLateral .infos div.tiros').empty();
    $('.barraLateral .infos div.adicional').empty();
    if(pecaSelecionadaCampoAtaque != "") {
        exibeDadosPeca(pecaSelecionadaCampoAtaque, turnoAtacante);
    }    
    if(pecaSelecionadaCampoDefesa != "") {
        exibeDadosPeca(pecaSelecionadaCampoDefesa, turnoDefesa);
    }
}

function exibeDadosPeca(peca, campo){
    $('.barraLateral.campo-' + campo + ' .infos h3.nomePeca').html(pecas[peca].nome);
    $('.barraLateral.campo-' + campo + ' .infos div.imagem-demo').html('<img src="pecas/' + pecas[peca].tipo + '-demo.png">');
    $('.barraLateral.campo-' + campo + ' .infos div.movimentacao').html('Movimentação: ' + pecas[peca].movimentacao);
    $('.barraLateral.campo-' + campo + ' .infos div.alcance').html('Alcance: ' + pecas[peca].alcance);
    $('.barraLateral.campo-' + campo + ' .infos div.dano').html('Dano: ' + pecas[peca].dano + ' vida(s)');
    if(pecas[peca].adicional != undefined) {
        $('.barraLateral.campo-' + campo + ' .infos div.adicional').html('Adicional: ' + pecas[peca].adicional);
    }
    var tentativas = '';
    if(pecas[peca].tiros == '-1'){
        tentativas += 'Infinitos, podendo tentar ' + pecas[peca].tentativas + ' vez(es) por turno'
    } else {
        tentativas += pecas[peca].tiros + ' tiro(s), podendo tentar ' + pecas[peca].tentativas + ' vez(es) por turno'
    }
    $('.barraLateral.campo-' + campo + ' .infos div.tiros').html('Tiros: ' + tentativas);

    //informacoes variaveis
    if(pecas[peca].gasolina <= 0){
        $('.barraLateral.campo-' + campo + ' .infos div.gasolina').html('Sem combustível');
    } else {
        $('.barraLateral.campo-' + campo + ' .infos div.gasolina').empty();
        for(var i=1;i<=pecas[peca].gasolina;i++){
            $('<div>').prependTo('.barraLateral.campo-' + campo + ' .infos div.gasolina').addClass('gas');
        } 
    }
    if(pecas[peca].vida == '-1'){
        $('.barraLateral.campo-' + campo + ' .infos div.vidas').html('Vidas infinitas');
    } else {
        $('.barraLateral.campo-' + campo + ' .infos div.vidas').empty();
        for(var i=1;i<=pecas[peca].vida;i++){
            $('<div>').prependTo('.barraLateral.campo-' + campo + ' .infos div.vidas').addClass('vida');
        } 
    }
}

function ativaControlesMouseu(){
    
    //seleciona pecas para o turno
    $('#palco .casa').click(function(){
        var arrCampo = $(this).parent().attr('class').split(' ');
        var campo = arrCampo[1];
        var arrCasa = $(this).attr('class').split(' ');
        var casa = arrCasa[1];
        var ocupada = casas['campo-' + campo][casa].ocupacao1;
        if(ocupada !== "") {
            if(turnoAtacante == "cima" && pecas[ocupada].exercito == "baixo" && pecaSelecionadaCampoAtaque == "") {
                alert('É preciso selecionar sua peça primeiro');
                return false;
            } else if(turnoAtacante == "baixo" && pecas[ocupada].exercito == "cima" && pecaSelecionadaCampoAtaque == "") {
                alert('É preciso selecionar sua peça primeiro');
                return false;
            } else {
                if((pecaSelecionadaCampoAtaque == "") || (pecaSelecionadaCampoAtaque != "" && pecas[ocupada].exercito == turnoAtacante)) {
                    $('.campo.' + turnoAtacante + ' .casa').removeClass('selecionada').removeClass('ataque');
                    $('.campo.' + turnoDefesa + ' .casa').removeClass('selecionada').removeClass('defesa');
                    $(this).addClass('selecionada ataque');
                    pecaSelecionadaCampoAtaque = ocupada;
                    pecaSelecionadaCampoDefesa = "";
                } else {
                    $('.campo.' + turnoDefesa + ' .casa').removeClass('selecionada').removeClass('defesa');
                    $(this).addClass('selecionada defesa');
                    pecaSelecionadaCampoDefesa = ocupada;
                }
            }
        }
        if(pecaSelecionadaCampoAtaque !== "" && pecaSelecionadaCampoDefesa !== "") {
            habilitaIniciarTurno();
        } else {
            desabilitaIniciarTurno();
        }
    });
    
    //clique para rodar ataque
    $('.barraLateral .btnAtaque').click(function(){
        rodaAtaque();
    });
    
    //seleciona peca para movimentar-se
    $("#palco .campo .casa").sortable({
        connectWith: ".casa",
        cursor: "move",
        over: function(event, ui) { 
            $(".casa").removeClass("hover");
            $(this).addClass("hover");
        },
        beforeStop: function(){
            $(".casa").removeClass("hover");
        }
    }).disableSelection();

    $("#palco .campo .casa").on("sortreceive", function(e, ui){
        var arrayCasaDestino = e.currentTarget.className.split(" ");
        var casa = arrayCasaDestino[1];
        var arrayCampo = $(e.currentTarget).parent().attr('class').split(" ");
        var campo = arrayCampo[1];
        var idPecaMovimentada = ui.item.attr('id');
        console.log(campo, casa, idPecaMovimentada);
        //com todos os dados valida movimentacao
    });
    
}

function habilitaIniciarTurno(){
    $('.barraLateral.campo-' + turnoAtacante + ' .btnAtaque').addClass('visible');
}

function desabilitaIniciarTurno(){
    $('.barraLateral.campo-' + turnoAtacante + ' .btnAtaque').removeClass('visible');
}

function rodaAtaque(){
    //joga os dados
    $('.barraLateral .btnAtaque').removeClass('visible');
    var numeroDadoAtaque = Math.floor(Math.random() * 6 + 1);
    var numeroDadoDefesa = Math.floor(Math.random() * 6 + 1);
    if(numeroDadoAtaque > numeroDadoDefesa) {
        alert('Ataque venceu');
        if(pecas[pecaSelecionadaCampoDefesa].vida != '-1') {
            pecas[pecaSelecionadaCampoDefesa].vida = pecas[pecaSelecionadaCampoDefesa].vida-pecas[pecaSelecionadaCampoAtaque].dano;
            if(pecas[pecaSelecionadaCampoDefesa].vida <= 0) {
                casas['campo-'+pecas[pecaSelecionadaCampoDefesa].campoAtual][pecas[pecaSelecionadaCampoDefesa].casaAtual].ocupada = "";
                pecas[pecaSelecionadaCampoDefesa].casaAtual = 0;
                $('.casa.selecionada.defesa').empty();
            }
        }
    } else {
        alert('Defesa venceu');
    }
    preparaNovoTurno();    
}

function preparaNovoTurno(){
    $('.casa').removeClass('selecionada').removeClass('ataque').removeClass('defesa');
    pecaSelecionadaCampoAtaque = "";
    pecaSelecionadaCampoDefesa = "";
    zeraBarrasLaterais();
    if(turnoAtacante == "cima") {
        turnoAtacante = "baixo";
        turnoDefesa = "cima";
    } else {
        turnoAtacante = "cima";
        turnoDefesa = "baixo";
    }
}

function muted(status){
    
}

function restart(confirmacao){
    if(confirmacao == true) {
        if(confirm('Deseja realmente reiniciar?')) { 
            window.location.reload(true);
        }
    } else { 
        window.location.reload(true);
    }
}

//width do body
function getDocWidth(){
    var width = (
    'innerWidth' in window? window.innerWidth :
    document.compatMode!=='BackCompat'? document.documentElement.clientWidth :
    document.body.clientWidth
    );
    //menos tamanho das barras laterais
    width = width-300;
    return width;
}

//height do body
function getDocHeight(){
    var height = (
    'innerHeight' in window? window.innerHeight :
    document.compatMode!=='BackCompat'? document.documentElement.clientHeight :
    document.body.clientHeight
    );
    return height;
}

function gameOver(){  
    alert('GAME OVER');
    restart(false);
}