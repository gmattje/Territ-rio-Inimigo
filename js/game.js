//recupera variáveis

//tamanho das casas
var tamanhoCasasW = 0;
var tamanhoCasasH = 0;

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
    organizaPecas();
    ativaControlesMouse();
}

//calcula tamanho das casas e organiza tabuleiro
function reorganizaTabuleiro(){
    //zera tudo
    $('#plano-inferior').removeAttr('style');
    $('#palco').removeAttr('style');
    $('#palco .campo').removeAttr('style');
    //refaz calculos
    $('#plano-inferior').css('width',getDocWidth()+'px');
    $('#palco').css('width',getDocWidth()+'px');
    var tamanhoCampoW = $('#palco .campo').width();
    var tamanhoCampoH = ($('#palco').height()/2)-5 //desconta a metade do tamanho da divisao
    var margemCampoL = (getDocWidth()-tamanhoCampoW)/2;
    tamanhoCasasW = (tamanhoCampoW/7)-1;
    tamanhoCasasH = tamanhoCampoH/5;
    $('#palco .campo .casa').css('width',tamanhoCasasW+'px').css('height',tamanhoCasasH+'px');
    $('#palco .campo').css('margin-left',margemCampoL+'px');
}

//coloca as pecas em seus lugares
function organizaPecas(){
    //zera
    $('#palco .casa .peca').remove();
    $.each(casas['campo-cima'], function(index){
        casas['campo-cima'][index].ocupacao1 = "";
        casas['campo-cima'][index].ocupacao2 = "";
    });
    $.each(casas['campo-baixo'], function(index){
        casas['campo-baixo'][index].ocupacao1 = "";
        casas['campo-baixo'][index].ocupacao2 = "";
    });
    
    //varre pecas
    $.each(pecas, function(index){ 
        var tipoPeca = this.tipo;
        var campoPeca = this.exercito;
        var campoOcupado = this.campoAtual;
        var casaOcupada = this.casaAtual;
        //se a peça já não tenha sido perdida pelo exercito
        if(campoOcupado !== 0 && casaOcupada !== 0) { 
            var novaPeca = $('#pecas .' + tipoPeca + '.' + campoPeca).clone().appendTo('.campo.' + campoOcupado + ' .casa.' +casaOcupada).attr('id',index).attr('onclick','selecionaPecaParaTurno("' + index + '")');
            this.xAtual = $(novaPeca).offset().left;
            this.yAtual = $(novaPeca).offset().top;
            if(casas['campo-'+campoOcupado][casaOcupada].ocupacao1 == "") {
                casas['campo-'+campoOcupado][casaOcupada].ocupacao1 = index;
            } else if(casas['campo-'+campoOcupado][casaOcupada].ocupacao2 == "") {
                casas['campo-'+campoOcupado][casaOcupada].ocupacao2 = index;
                $('.campo.' + campoOcupado + ' .casa.' + casaOcupada).addClass('ocupacaoDupla');
            }
        }
    });
    
    ativaRecuperacaoDeDados();
    
}

function ativaRecuperacaoDeDados() {

    $('#palco .casa .peca').mouseover(function(){
        var peca = $(this).attr('id');
        var campo = pecas[peca].exercito;
        exibeDadosPeca(peca, campo);
        exibeRaioDeAtaque(peca);
    });
    
    $('#palco .casa .peca').mouseleave(function(){
        zeraBarrasLaterais();
        zeraRaioDeAtaque();
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

function exibeRaioDeAtaque(peca){
    zeraRaioDeAtaque();
    var wCasa = 0;
    var hCasa = 0;
    var x1Alcance = 0;
    var x2Alcance = 0;
    var y1Alcance = 0;
    var y2Alcance = 0;
    var posicaoRaioX = 0;
    var posicaoRaioY = 0;
    var tamanhoRaioW = 0;
    var tamanhoRaioH = 0; 
    
    if(pecas[peca].tipo == "tanque") {
        tamanhoRaioW = tamanhoCasasW*7;
        tamanhoRaioH = tamanhoCasasH;
        posicaoRaioX = $('.casa.a1').offset().left-tamanhoCasasW;
        posicaoRaioY = 0;
        if(pecas[peca].exercito == "cima"){
            posicaoRaioY = pecas[peca].yAtual+(tamanhoCasasH*2);
        } else {
            posicaoRaioY = pecas[peca].yAtual-(tamanhoCasasH*2);
        }
    } else if(pecas[peca].tipo == "sniper") {
        tamanhoRaioW = tamanhoCasasW*7;
        tamanhoRaioH = tamanhoCasasH*5;
        posicaoRaioX = $('.casa.a1').offset().left-tamanhoCasasW;
        posicaoRaioY = 0;
        if(pecas[peca].exercito == "cima"){
            posicaoRaioY = $('.casa.a1').offset().top;
        } else {
            posicaoRaioY = $('.casa.a5').offset().top+tamanhoCasasH;
        }
    } else {
        if(pecas[peca].tipo == "aviao" || pecas[peca].tipo == "revolver" || pecas[peca].tipo == "metralhadora"){
            var alcance = 1;
        } else if(pecas[peca].tipo == "granada") {
            var alcance = 2;
        }
        wCasa = tamanhoCasasW*alcance;
        hCasa = tamanhoCasasH*alcance;
        x1Alcance = Math.round(pecas[peca].xAtual-wCasa);
        x2Alcance = Math.round(pecas[peca].xAtual+wCasa);
        y1Alcance = Math.round(pecas[peca].yAtual-hCasa);
        y2Alcance = Math.round(pecas[peca].yAtual+hCasa);
        posicaoRaioX = (x1Alcance-tamanhoCasasW)-2;
        posicaoRaioY = y1Alcance;
        tamanhoRaioW = (x2Alcance-x1Alcance)+tamanhoCasasW;
        tamanhoRaioH = (y2Alcance-y1Alcance)+tamanhoCasasH; 
    }
    $('#raio-ataque').removeClass('hidden').css('width',tamanhoRaioW).css('height',tamanhoRaioH).css('left',posicaoRaioX).css('top',posicaoRaioY);
}

function zeraRaioDeAtaque(){
    $('#raio-ataque').addClass('hidden');
}

function selecionaPecaParaTurno(peca){
    
    if(turnoAtacante == "cima" && pecas[peca].exercito == "baixo" && pecaSelecionadaCampoAtaque == "") {
        alert('É preciso selecionar sua peça primeiro');
        return false;
    } else if(turnoAtacante == "baixo" && pecas[peca].exercito == "cima" && pecaSelecionadaCampoAtaque == "") {
        alert('É preciso selecionar sua peça primeiro');
        return false;
    } else {
        if((pecaSelecionadaCampoAtaque == "") || (pecaSelecionadaCampoAtaque != "" && pecas[peca].exercito == turnoAtacante)) {
            $('.campo.' + turnoAtacante + ' .casa').removeClass('selecionada').removeClass('ataque');
            $('.campo.' + turnoDefesa + ' .casa').removeClass('selecionada').removeClass('defesa');
            $('.campo.' + pecas[peca].campoAtual + ' .casa.' + pecas[peca].casaAtual).addClass('selecionada ataque');
            pecaSelecionadaCampoAtaque = peca;
            pecaSelecionadaCampoDefesa = "";
        } else {
            $('.campo.' + turnoDefesa + ' .casa').removeClass('selecionada').removeClass('defesa');
            $('.campo.' + pecas[peca].campoAtual + ' .casa.' + pecas[peca].casaAtual).addClass('selecionada defesa');
            pecaSelecionadaCampoDefesa = peca;
        }
    }
    if(pecaSelecionadaCampoAtaque !== "" && pecaSelecionadaCampoDefesa !== "") {
        habilitaIniciarTurno();
    } else {
        desabilitaIniciarTurno();
    }
    
}

function ativaControlesMouse(){
    
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
        //deixa sempre o novo em primeiro para validacao de movimento
        $('.casa.' + casa + ' div.peca').each(function(index){
            if(index == 0 && $(this).attr('id') != idPecaMovimentada) {
                ui.item.after($(this));
            }
        });
        //com todos os dados valida movimentacao
        validaMovimentacaoPeca(idPecaMovimentada, campo, casa);
    });
    
}

function validaMovimentacaoPeca(peca, campoDestino, casaDestino){
    //validacoes do sniper
    if(pecas[peca].tipo == "sniper") {
        retornaMovimentoDaPeca(peca, 'Os atiradores de elite não podem se mover');
    }
    //validacoes do aviao
    if(pecas[peca].tipo == "aviao") {
        //valida quantidade de casas movimentadas
        var movimentos = quantidadeDeCasasMovimentada(peca);
        if(pecas[peca].gasolina >= movimentos) {
            //verifica casa livre
            if(casas['campo-' + campoDestino][casaDestino].ocupacao1 != "" && casas['campo-' + campoDestino][casaDestino].ocupacao2 != "") {
                retornaMovimentoDaPeca(peca, 'Esta casa está ocupada');
            } else if(casas['campo-' + campoDestino][casaDestino].ocupacao1 != "" && casas['campo-' + campoDestino][casaDestino].ocupacao2 == "") {
                pecas[peca].gasolina = pecas[peca].gasolina - movimentos;
                GravaMovimentacaoPeca(peca, campoDestino, casaDestino, 'ocupacao2');
            } else if(casas['campo-' + campoDestino][casaDestino].ocupacao1 == "") {
                pecas[peca].gasolina = pecas[peca].gasolina - movimentos;
                GravaMovimentacaoPeca(peca, campoDestino, casaDestino, 'ocupacao1');
            }
        } else {
            retornaMovimentoDaPeca(peca, 'Este avião não tem gasolina o suficiente');
        }
    }
    //validacoes de outras pecas
    if(pecas[peca].tipo != "sniper" && pecas[peca].tipo != "aviao") {
        //valida quantidade de casas movimentadas
        var movimentos = quantidadeDeCasasMovimentada(peca);
        if(movimentos == 1) {
            if(casas['campo-' + campoDestino][casaDestino].tipo == "montanha"){
                retornaMovimentoDaPeca(peca, 'Esta peça não pode se mover sobre montanhas');
            } else if(casas['campo-' + campoDestino][casaDestino].tipo == "base"){
                retornaMovimentoDaPeca(peca, 'Esta peça não pode se mover sobre as bases');
            } else {
                if(casas['campo-' + campoDestino][casaDestino].ocupacao1 != ""){
                    retornaMovimentoDaPeca(peca, 'Esta casa está ocupada');
                } else {
                    GravaMovimentacaoPeca(peca, campoDestino, casaDestino, 'ocupacao1');
                }
            }
        } else {
            retornaMovimentoDaPeca(peca, 'Este peça pode mover-se uma casa por vez');
        }
    }
}

function quantidadeDeCasasMovimentada(peca) {
    var widthCasa = Math.round(tamanhoCasasW);
    var heightCasa = Math.round(tamanhoCasasH);
    var xFinal = Math.round($('#' + peca + '.peca').offset().left);
    var yFinal = Math.round($('#' + peca + '.peca').offset().top);
    var xAtual = Math.round(pecas[peca].xAtual);
    var yAtual = Math.round(pecas[peca].yAtual);
    
    //calcula quantidades de movimentos eixo x
    var qtdX = Math.round(Math.abs(xFinal-xAtual)/widthCasa);
    var qtdY = Math.round(Math.abs(yFinal-yAtual)/heightCasa);
    
    //se andou na diagonal, conta apenas 1 movimento
    var total = 0
    if(qtdX == 1 && qtdY == 1) {
        total = 1;
    } else {
        total = qtdX+qtdY;
    }
    return total;
}

function GravaMovimentacaoPeca(peca, campoDestino, casaDestino, ocupacao){
    
    //desocupa casa anterior
    if(casas['campo-' + pecas[peca].campoAtual][pecas[peca].casaAtual].ocupacao1 = peca) {
        casas['campo-' + pecas[peca].campoAtual][pecas[peca].casaAtual].ocupacao1 = "";
    } else if(casas['campo-' + pecas[peca].campoAtual][pecas[peca].casaAtual].ocupacao2 = peca) {
        casas['campo-' + pecas[peca].campoAtual][pecas[peca].casaAtual].ocupacao2 = "";
    }
    $('.campo.' + pecas[peca].campoAtual + ' .casa.' + pecas[peca].casaAtual).removeClass('ocupacaoDupla');
    
    //ocupa nova casa
    casas['campo-' + campoDestino][casaDestino][ocupacao] = peca;
    pecas[peca].campoAtual = campoDestino;
    pecas[peca].casaAtual = casaDestino;
    pecas[peca].xAtual = $('#' + peca + '.peca').offset().left;
    pecas[peca].yAtual = $('#' + peca + '.peca').offset().top; 
    //se nova casa estiver com duas ocupacoes
    if(casas['campo-' + campoDestino][casaDestino].ocupacao1 != "" && casas['campo-' + campoDestino][casaDestino].ocupacao2 != "") {
        $('.campo.' + campoDestino + ' .casa.' + casaDestino).addClass('ocupacaoDupla');
    } else {
        $('.campo.' + campoDestino + ' .casa.' + casaDestino).removeClass('ocupacaoDupla');
    }
    
}

function retornaMovimentoDaPeca(peca, motivo){
    organizaPecas();
    zeraBarrasLaterais();
    alert("Movimento não permitido: " + motivo);
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
                if(casas['campo-'+pecas[pecaSelecionadaCampoDefesa].campoAtual][pecas[pecaSelecionadaCampoDefesa].casaAtual].ocupacao1 == pecaSelecionadaCampoDefesa) {
                    casas['campo-'+pecas[pecaSelecionadaCampoDefesa].campoAtual][pecas[pecaSelecionadaCampoDefesa].casaAtual].ocupacao1 = "";
                } else if(casas['campo-'+pecas[pecaSelecionadaCampoDefesa].campoAtual][pecas[pecaSelecionadaCampoDefesa].casaAtual].ocupacao2 == pecaSelecionadaCampoDefesa) {
                    casas['campo-'+pecas[pecaSelecionadaCampoDefesa].campoAtual][pecas[pecaSelecionadaCampoDefesa].casaAtual].ocupacao2 = "";
                }
                pecas[pecaSelecionadaCampoDefesa].campoAtual = 0;
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

function restart(){
    if(confirm('Deseja realmente reiniciar?')) { 
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