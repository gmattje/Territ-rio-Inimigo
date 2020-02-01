//tempo de jogo
var timerGeral = new Date;
setInterval(function() {
    var totalSeconds = Math.round((new Date - timerGeral) / 1000, 0);
    var minutes = Math.floor(totalSeconds/60);
    var seconds = totalSeconds - minutes * 60;
    $('#palco .infos-gerais .timer').text(minutes + "m " + seconds + "s");
}, 1000);

//recupera variáveis

var nomeJogadorVermelho = "VERMELHO";
var nomeJogadorAzul = "AZUL";
var nomeJogadorCampeao = "";
var numeroDadoInicialJogador1 = 0;
var numeroDadoInicialJogador2 = 0;
var desafioSecretoLigado = true;
var desafioSecretoJogador1 = 0;
var desafioSecretoJogador2 = 0;

//tamanhos tabuleiro
var marginLeftCampos = 0;
var tamanhoDivisaoH = 0;
var tamanhoCasasW = 0;
var tamanhoCasasH = 0;

//turno
var timerMovimentacao = "";
var timerParaquedista = "";
var numDoTurno = 0;
var turnoEminenteFimObj1Jogador1 = 0;
var turnoEminenteFimObj1Jogador2 = 0;
var turnoEminenteFimObj2Jogador1 = 0;
var turnoEminenteFimObj2Jogador2 = 0;
var turnoVencedor = "";
var bloqueioEscolhaParaquedista = false;
var turnoAtacante = "";
var turnoDefesa = "";
var rodandoAnimacaoAtaque = false;
var pecasQuePodemMovimentarNoTurno = [];

//pecas selecionadas
var pecaParaReposicao = "";
var pecaSelecionadaCampoAtaque = "";
var pecaSelecionadaCampoDefesa = "";
var numeroDadoAtaque = 0;
var numeroDadoDefesa = 0;
var numTentativaAtaque = 0;

//se jogo está rolando
var fimDeJogo = false;
var vezDoPlayer = false;
var ultimaPecaRetirada = "";
var ultimaPecaMovimentada = "";
var ultimoCampoDestinatario = "";
var ultimaCasaDestinataria = "";
var ocupacaoUltimaCasaDestino = "";
var gasolinaConsumidaTurno = 0;

//função de inicialização
function init(){
    reorganizaTabuleiro();
    organizaPecas();
    ativaControlesMouse();
    nomesDosJogadoresOffLine();
    rodaSorteInicial();
    if(getUrlVars()["pl1"] != undefined && getUrlVars()["pl2"] == "Computador") {
        desativaDesafioSecreto();
    }
}

function desativaDesafioSecreto(){
    desafioSecretoLigado = false;
    $('.desafioSecreto').remove();
}

function nomesDosJogadoresOffLine(){
    //se for jogo off-line
    if(getUrlVars()["pl1"] != undefined && getUrlVars()["pl2"] != undefined) {
        nomeJogadorVermelho = getUrlVars()["pl1"];
        nomeJogadorAzul = getUrlVars()["pl2"];
        $('.barraLateral.esquerda h2.timeA').html(nomeJogadorVermelho);
        $('.barraLateral.direita h2.timeB').html(nomeJogadorAzul);
    //se for jogo on-line bloqueia desafio secreto do adversário
    } else {
        if(nomeJogadorVermelho == getUrlVars()["player"]){
            $('.barraLateral .desafioSecreto.timeB').attr('onclick', 'mensagemDeErro("Você não pode ver o desafio secreto do seu adversário até o final da partida.")');
        } else if(nomeJogadorAzul == getUrlVars()["player"]){
            $('.barraLateral .desafioSecreto.timeA').attr('onclick', 'mensagemDeErro("Você não pode ver o desafio secreto do seu adversário até o final da partida.")');
        }
    }
}

function rodaSorteInicial(){
    $("#sorte-inicial .jogador1 .nome-jogador").html(nomeJogadorVermelho);
    $("#sorte-inicial .jogador2 .nome-jogador").html(nomeJogadorAzul);
    $("#sorte-inicial").dialog({
        closeOnEscape: false,
        modal: true,
        buttons: {},
        open: function(event, ui) {
            $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
        }
    });
    //joga os dados
    if((getUrlVars()["pl1"] != undefined && getUrlVars()["pl2"] != undefined) || numeroDadoInicialJogador1 == 0){
        numeroDadoInicialJogador1 = Math.floor(Math.random() * 6 + 1);
    }
    if((getUrlVars()["pl1"] != undefined && getUrlVars()["pl2"] != undefined) || numeroDadoInicialJogador2 == 0){
        numeroDadoInicialJogador2 = Math.floor(Math.random() * 6 + 1);
    }
    //escolhe desafio secreto
    if((getUrlVars()["pl1"] != undefined && getUrlVars()["pl2"] != undefined) || desafioSecretoJogador1 == 0){
        desafioSecretoJogador1 = Math.floor(Math.random() * 10 + 1);
    }
    if((getUrlVars()["pl1"] != undefined && getUrlVars()["pl2"] != undefined) || desafioSecretoJogador2 == 0){
        desafioSecretoJogador2 = Math.floor(Math.random() * 10 + 1);
    }
    $('#sorte-inicial .dado-jogador').empty();
    $('#dados .dado.dado-ataque-gif').clone().appendTo('#sorte-inicial .jogador1 .dado-jogador');
    $('#dados .dado.dado-ataque-gif').clone().appendTo('#sorte-inicial .jogador2 .dado-jogador');
    //resultados dos dados
    setTimeout(function(){
        $('#sorte-inicial .dado-jogador').empty();
        $('#dados .dado.dado-ataque-' + numeroDadoInicialJogador1).clone().appendTo('#sorte-inicial .jogador1 .dado-jogador');
        $('#dados .dado.dado-ataque-' + numeroDadoInicialJogador2).clone().appendTo('#sorte-inicial .jogador2 .dado-jogador');
        if(numeroDadoInicialJogador1 > numeroDadoInicialJogador2){
            $("#sorte-inicial .jogador1 .nome-jogador").addClass('iniciante');
            turnoAtacante = "baixo";
            turnoDefesa = "cima";
        } else if(numeroDadoInicialJogador1 < numeroDadoInicialJogador2){
            $("#sorte-inicial .jogador2 .nome-jogador").addClass('iniciante');
            turnoAtacante = "cima";
            turnoDefesa = "baixo";
        }
    }, 3000);
    setTimeout(function(){
        //se deu empate
        if(numeroDadoInicialJogador1 == numeroDadoInicialJogador2) {
            rodaSorteInicial();
        //se teve vencedor    
        } else {
            preparaNovoTurno();
            mostraObjetivosSecretos();
            $("#sorte-inicial").dialog('close');
        }
    }, 6000);
    
}

//calcula tamanho das casas e organiza tabuleiro
function reorganizaTabuleiro(){
    //zera tudo
    $('#plano-inferior').removeAttr('style');
    $('#palco').removeAttr('style');
    $('#palco .campo').removeAttr('style');
    $('#palco .campo .coordenada').removeAttr('style');
    //refaz calculos
    $('#plano-inferior').css('width',(getDocWidth()-300)+'px');
    $('#palco').css('width',(getDocWidth()-300)+'px');
    var tamanhoCampoW = $('#palco .campo').width();
    var tamanhoCampoH = ($('#palco').height()/2)-($('#titulo-game').height()/2)-15-20 //desconta a metade dos tamanhos da divisao, titulo, painel geral e coordenadas
    tamanhoCasasW = (tamanhoCampoW/7)-(40/7)-2;
    tamanhoCasasH = tamanhoCampoH/5;
    //tamanhoCasasW = tamanhoCasasH; //descomentar esta linha para tabueiro ficar com as casas quadradas
    //tamanhoCampoW = (tamanhoCasasW*7)+45;  //descomentar esta linha para tabueiro ficar com as casas quadradas
    marginLeftCampos = (getDocWidth()-300-tamanhoCampoW)/2;
    tamanhoDivisaoH = $('#palco .divisao').height();
    //$('#palco .campo').width(tamanhoCampoW);  //descomentar esta linha para tabueiro ficar com as casas quadradas
    $('#palco .campo .coordenada.letra').css('width',tamanhoCasasW+'px');
    $('#palco .campo .coordenada.numeral').css('height',tamanhoCasasH+'px').css('line-height',tamanhoCasasH+'px');
    $('#palco .campo .casa').css('width',tamanhoCasasW+'px').css('height',tamanhoCasasH+'px');
    $('#palco .campo').css('margin-left',marginLeftCampos+'px');
	$.each(casas['campo-cima'], function(index){
		if(this.tipo != "normal"){
			$('#palco .campo .casa.'+index).addClass(this.tipo);
		}
    });
    $.each(casas['campo-baixo'], function(index){
        if(this.tipo != "normal"){
			$('#palco .campo .casa.'+index).addClass(this.tipo);
		}
    });
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
        if(campoOcupado != 0 && casaOcupada != 0) { 
            var novaPeca = $('#pecas .' + tipoPeca + '.' + campoPeca).clone().appendTo('.campo.' + campoOcupado + ' .casa.' +casaOcupada).attr('id',index).attr('onclick','selecionaPecaParaTurno("' + index + '", false)');
            if(casas['campo-'+campoOcupado][casaOcupada].ocupacao1 == "") {
                casas['campo-'+campoOcupado][casaOcupada].ocupacao1 = index;
            } else if(casas['campo-'+campoOcupado][casaOcupada].ocupacao2 == "") {
                casas['campo-'+campoOcupado][casaOcupada].ocupacao2 = index;
                $('.campo.' + campoOcupado + ' .casa.' + casaOcupada).addClass('ocupacaoDupla');
            }
        }
    });
    
    gravaPosicoesPecas();
    ativaRecuperacaoDeDados();
    
}

function gravaPosicoesPecas() {
    $.each(pecas, function(index){
        
        var wCasa = 0;
        var hCasa = 0;
        var x1Alcance = 0;
        var x2Alcance = 0;
        var y1Alcance = 0;
        var y2Alcance = 0;
        
        //se a peça já não tenha sido perdida pelo exercito
        if(this.campoAtual != 0 && this.casaAtual != 0) {
            
            //grava x e y da posicao atual
            //faz o calculo pela casa ocupada para tratar raios de pecas que estajam dentro da mesma casa
            this.xAtual = $('.casa.' + this.casaAtual).position().left;
            this.yAtual = $('.casa.' + this.casaAtual).offset().top;
            
            //grava raios de ataque
            if(this.tipo == "tanque") {
                this.alcanceAtualW = tamanhoCasasW*7;
                this.alcanceAtualH = tamanhoCasasH;
                this.alcanceAtualX = $('.casa.a1').position().left+marginLeftCampos;
                if(this.exercito == "cima"){
                    this.alcanceAtualY = this.yAtual+(tamanhoCasasH*2);
                } else {
                    this.alcanceAtualY = this.yAtual-(tamanhoCasasH*2);
                }
                //correções pela proximidade com a divisão
                if(this.casaAtual == "b4" || this.casaAtual == "d4" || this.casaAtual == "f4" || this.casaAtual == "a5" || this.casaAtual == "c5" || this.casaAtual == "e5" || this.casaAtual == "g5"){
                    this.alcanceAtualY = this.alcanceAtualY+tamanhoDivisaoH;
                } else if(this.casaAtual == "a6" || this.casaAtual == "c6" || this.casaAtual == "e6" || this.casaAtual == "g6" || this.casaAtual == "b7" || this.casaAtual == "d7" || this.casaAtual == "f7"){
                    this.alcanceAtualY = this.alcanceAtualY-tamanhoDivisaoH;
                }
            } else if(this.tipo == "sniper") {
                this.alcanceAtualW = tamanhoCasasW*7;
                this.alcanceAtualH = tamanhoCasasH*5;
                this.alcanceAtualX = $('.casa.a1').position().left+marginLeftCampos;
                if(this.exercito == "cima"){
                    this.alcanceAtualY = $('.casa.a1').offset().top;
                } else {
                    this.alcanceAtualY = $('.casa.a5').offset().top+tamanhoCasasH+tamanhoDivisaoH;
                }
            } else {
                if(this.tipo == "aviao" || this.tipo == "revolver" || this.tipo == "metralhadora"){
                    var alcance = 1;
                } else if(this.tipo == "granada") {
                    var alcance = 2;
                }
                wCasa = tamanhoCasasW*alcance;
                hCasa = tamanhoCasasH*alcance;
                x1Alcance = Math.round(this.xAtual-wCasa);
                x2Alcance = Math.round(this.xAtual+wCasa);
                y1Alcance = Math.round(this.yAtual-hCasa);
                y2Alcance = Math.round(this.yAtual+hCasa);
                this.alcanceAtualX = x1Alcance+marginLeftCampos;
                this.alcanceAtualY = y1Alcance;
                this.alcanceAtualW = (x2Alcance-x1Alcance)+tamanhoCasasW;
                this.alcanceAtualH = (y2Alcance-y1Alcance)+tamanhoCasasH;
                //correções alcance 1 em decorrência das bordas das DIVs
                if(alcance == 1) {
                    this.alcanceAtualX = this.alcanceAtualX-2;
                //correções pela proximidade com a divisão
                } else if(alcance == 2) {
                    this.alcanceAtualX --;
                    if(this.casaAtual == "a4" || this.casaAtual == "b4" || this.casaAtual == "c4" || this.casaAtual == "d4" || this.casaAtual == "e4" || this.casaAtual == "f4" || this.casaAtual == "g4" || this.casaAtual == "a7" || this.casaAtual == "b7" || this.casaAtual == "c7" || this.casaAtual == "d7" || this.casaAtual == "e7" || this.casaAtual == "f7" || this.casaAtual == "g7"){
                        this.alcanceAtualH = this.alcanceAtualH+tamanhoDivisaoH;
                        if(this.casaAtual == "a7" || this.casaAtual == "b7" || this.casaAtual == "c7" || this.casaAtual == "d7" || this.casaAtual == "e7" || this.casaAtual == "f7" || this.casaAtual == "g7"){
                            this.alcanceAtualY = this.alcanceAtualY-tamanhoDivisaoH;
                        }
                    }
                }
                if(this.casaAtual == "a5" || this.casaAtual == "b5" || this.casaAtual == "c5" || this.casaAtual == "d5" || this.casaAtual == "e5" || this.casaAtual == "f5" || this.casaAtual == "g5" || this.casaAtual == "a6" || this.casaAtual == "b6" || this.casaAtual == "c6" || this.casaAtual == "d6" || this.casaAtual == "e6" || this.casaAtual == "f6" || this.casaAtual == "g6"){
                    this.alcanceAtualH = this.alcanceAtualH+tamanhoDivisaoH; 
                    if(this.casaAtual == "a6" || this.casaAtual == "b6" || this.casaAtual == "c6" || this.casaAtual == "d6" || this.casaAtual == "e6" || this.casaAtual == "f6" || this.casaAtual == "g6"){
                        this.alcanceAtualY = this.alcanceAtualY-tamanhoDivisaoH;
                    }
                }
            }
            
        }
    });
}

function verificarPossibilidadesDeMovimentacaoGeral(exercito){
    pecasQuePodemMovimentarNoTurno = [];
    $.each(pecas, function(index){
        //cada peça em jogo do exército
        if(this.campoAtual != 0 && this.casaAtual != 0 && this.exercito == exercito) {
            if(this.tipo != "aviao" || (this.tipo == "aviao" && this.gasolina > 0)){
                //verifica cada casa para saber se peça pode se movimentar
                $.each(casas['campo-cima'], function(index2){
                    if(this.casaAtual != index2 && validaMovimentacaoPeca(index, 'cima', index2, true) === true && pecasQuePodemMovimentarNoTurno.indexOf(index) == -1){
                        pecasQuePodemMovimentarNoTurno[pecasQuePodemMovimentarNoTurno.length] = index;
                    }
                });
                $.each(casas['campo-baixo'], function(index2){
                    if(this.casaAtual != index2 && validaMovimentacaoPeca(index, 'baixo', index2, true) === true && pecasQuePodemMovimentarNoTurno.indexOf(index) == -1){
                        pecasQuePodemMovimentarNoTurno[pecasQuePodemMovimentarNoTurno.length] = index;
                    }
                });
            }
        }
    });
}

function verificaFimDePartida(){
    
    var desafiosSecretosJogador1 = 0;
    var desafiosSecretosJogador2 = 0;
    
    //se algum exército ficou sem movimentação, o outro é campeão
    verificarPossibilidadesDeMovimentacaoGeral('cima');
    if(pecasQuePodemMovimentarNoTurno.length == 0){
        fimDeJogo = true;
        nomeJogadorCampeao = nomeJogadorAzul;
        gameOver('Exército inimigo ficou sem possibilidades de movimentação');
    }
    verificarPossibilidadesDeMovimentacaoGeral('baixo');
    if(pecasQuePodemMovimentarNoTurno.length == 0){
        fimDeJogo = true;
        nomeJogadorCampeao = nomeJogadorVermelho;
        gameOver('Exército inimigo ficou sem possibilidades de movimentação');
    }
    
    $.each(pecas, function(index){
        //se a peça já não tenha sido perdida pelo exercito
        if(this.campoAtual != 0 && this.casaAtual != 0) {
            //se a peça esta no ultimo nivel do exercito inimigo
            if(this.exercito == "cima" && (this.casaAtual == casasQueIndicamVitoriaCampoBaixo1 || this.casaAtual == casasQueIndicamVitoriaCampoBaixo2)){
                if(turnoEminenteFimObj1Jogador1 == 0 || turnoEminenteFimObj1Jogador1 < numDoTurno) {
                    turnoEminenteFimObj1Jogador1 = numDoTurno+1;
                } else if(turnoEminenteFimObj1Jogador1 > 0 && numDoTurno == turnoEminenteFimObj1Jogador1) {
                    fimDeJogo = true;
                    nomeJogadorCampeao = nomeJogadorVermelho;
                    gameOver('Vitória por invasão da base inimiga');
                }               
            } else if(this.exercito == "baixo" && (this.casaAtual == casasQueIndicamVitoriaCampoCima1 || this.casaAtual == casasQueIndicamVitoriaCampoCima2)){
                if(turnoEminenteFimObj1Jogador2 == 0 || turnoEminenteFimObj1Jogador2 < numDoTurno) {
                    turnoEminenteFimObj1Jogador2 = numDoTurno+1;
                } else if(turnoEminenteFimObj1Jogador2 > 0 && numDoTurno == turnoEminenteFimObj1Jogador2) {
                    fimDeJogo = true;
                    nomeJogadorCampeao = nomeJogadorAzul;
                    gameOver('Vitória por invasão da base inimiga');
                }               
            }
            if(desafioSecretoLigado){
                //se suas peças estão cumprindo o desafio secreto
                if(this.exercito == "cima"){
                    if(desafioSecretoJogador1 > 0 && objetivos['campo-cima'][desafioSecretoJogador1][this.casaAtual] == this.tipo){
                        desafiosSecretosJogador1++;
                        if((turnoEminenteFimObj2Jogador1 == 0 || turnoEminenteFimObj2Jogador1 < numDoTurno) && desafiosSecretosJogador1 === 2){
                            turnoEminenteFimObj2Jogador1 = numDoTurno+1;
                        } else if(turnoEminenteFimObj2Jogador1 > 0 && numDoTurno == turnoEminenteFimObj2Jogador1 && desafiosSecretosJogador1 === 2){   
                            fimDeJogo = true;
                            nomeJogadorCampeao = nomeJogadorVermelho;
                            gameOver('Vitória por cumprimento do desafio secreto');
                        }
                    }
                } else {
                    if(desafioSecretoJogador2 > 0 && objetivos['campo-baixo'][desafioSecretoJogador2][this.casaAtual] == this.tipo){
                        desafiosSecretosJogador2++;
                        if((turnoEminenteFimObj2Jogador2 == 0 || turnoEminenteFimObj2Jogador2 < numDoTurno) && desafiosSecretosJogador2 === 2){
                            turnoEminenteFimObj2Jogador2 = numDoTurno+1;
                        } else if(turnoEminenteFimObj2Jogador2 > 0 && numDoTurno == turnoEminenteFimObj2Jogador2 && desafiosSecretosJogador2 === 2){
                            fimDeJogo = true;
                            nomeJogadorCampeao = nomeJogadorAzul;
                            gameOver('Vitória por cumprimento do desafio secreto');
                        }
                    }
                }
            }
        }
    });   
    
    
    
}

function mostraObjetivosSecretos(){
    $('.barraLateral.campo-cima .desafioSecreto').html(objetivos['campo-cima'][desafioSecretoJogador1].texto);
    $('.barraLateral.campo-baixo .desafioSecreto').html(objetivos['campo-baixo'][desafioSecretoJogador2].texto);
}

function ativaRecuperacaoDeDados() {
    $('#palco .casa .peca').mouseover(function(){
        if(bloqueioEscolhaParaquedista == false) {
            var peca = $(this).attr('id');
            var campo = pecas[peca].exercito;
            exibeDadosPeca(peca, campo);
            exibeRaioDeAtaque(peca);
        }
    });
    $('#palco .casa .peca').mouseleave(function(){
        if(bloqueioEscolhaParaquedista == false) {
            zeraBarrasLaterais();
            zeraRaioDeAtaque();
        }
    });
}

function exibeResultadosGerais(){
    var qtdPecasExercitoCima = 0;
    var qtdPecasExercitoBaixo = 0;
    $.each(pecas, function(index){
        //se a peça já não tenha sido perdida pelo exercito
        if(this.campoAtual != 0 && this.casaAtual != 0) {
            if(this.exercito == "cima") {
                qtdPecasExercitoCima++;
            } else {
                qtdPecasExercitoBaixo++;
            }
        }
    });
    $('#palco .infos-gerais .turno').html(' | Turno atual: ' + numDoTurno);
    $('#palco .infos-gerais .exercitos').html(" | Peças restantes do exército vermelho: " + qtdPecasExercitoCima + " | Peças restantes do exército azul: " + qtdPecasExercitoBaixo);
}

function exibeDadosPeca(peca, campo){
    $('.barraLateral.campo-' + campo + ' .infosPeca').addClass('visible');
    $('.barraLateral.campo-' + campo + ' .infos h3.nomePeca').html(pecas[peca].nome);
    $('.barraLateral.campo-' + campo + ' .infos div.imagem-demo').empty();
    $('#pecas .peca.' + pecas[peca].tipo + '.demo').clone().appendTo('.barraLateral.campo-' + campo + ' .infos div.imagem-demo');
    $('.barraLateral.campo-' + campo + ' .infos div.movimentacao').html('<strong>Movimentação:</strong> ' + pecas[peca].movimentacao);
    $('.barraLateral.campo-' + campo + ' .infos div.alcance').html('<strong>Alcance:</strong> ' + pecas[peca].alcance);
    $('.barraLateral.campo-' + campo + ' .infos div.dano').html('<strong>Dano:</strong> ' + pecas[peca].dano + ' vida(s)');
    if(pecas[peca].adicional != undefined) {
        $('.barraLateral.campo-' + campo + ' .infos div.adicional').html('<strong>Adicional:</strong> ' + pecas[peca].adicional);
    }
    var tentativas = '';
    if(pecas[peca].tiros == '-1'){
        tentativas += 'Infinitos, podendo tentar ' + pecas[peca].tentativas + ' vez(es) por turno'
    } else {
        tentativas += pecas[peca].tiros + ' tiro(s), podendo tentar ' + pecas[peca].tentativas + ' vez(es) por turno'
    }
    $('.barraLateral.campo-' + campo + ' .infos div.tiros').html('<strong>Tiros:</strong> ' + tentativas);

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

function zeraBarrasLaterais(){
    $('.barraLateral .infosPeca').removeClass('visible');
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

function exibeRaioDeAtaque(peca){
    if(pecas[peca].exercito == turnoAtacante && pecas[peca].tiros != "0"){
        zeraRaioDeAtaque();
        $('#raio-ataque').removeClass('hidden').css('width',pecas[peca].alcanceAtualW).css('height',pecas[peca].alcanceAtualH).css('left',pecas[peca].alcanceAtualX).css('top',pecas[peca].alcanceAtualY);
    } else if(pecas[peca].exercito == turnoAtacante && pecas[peca].tiros == "0" && pecas[peca].tipo == "aviao" && bloqueioEscolhaParaquedista == true){
        zeraRaioDeAtaque();
        $('#raio-ataque').removeClass('hidden').addClass('campoParaquedista').css('width',pecas[peca].alcanceAtualW).css('height',pecas[peca].alcanceAtualH).css('left',pecas[peca].alcanceAtualX).css('top',pecas[peca].alcanceAtualY);
    }
}

function zeraRaioDeAtaque(){
    $('#raio-ataque').addClass('hidden').removeClass('campoParaquedista');
}

function selecionaPecaParaTurno(peca, espelhoOutroJogador){
    if(turnoVencedor != "verificando") {
        if (vezDoPlayer == false && espelhoOutroJogador == false) {
            mensagemDeErro('Não é a sua vez de jogar');
        //só seleciona se turno ainda não tem resultado
        } else if(turnoVencedor == "") {
            if((turnoAtacante == "cima" && pecas[peca].exercito == "baixo" && pecaSelecionadaCampoAtaque == "") || (turnoAtacante == "baixo" && pecas[peca].exercito == "cima" && pecaSelecionadaCampoAtaque == "")) {
                mensagemDeErro('É preciso selecionar sua peça primeiro');
                return false;   
            } else {
                if((pecaSelecionadaCampoAtaque == "") || (pecaSelecionadaCampoAtaque != "" && pecas[peca].exercito == turnoAtacante)) {
                    if(pecas[peca].tiros == "0") { 
                        mensagemDeErro('Esta peça não pode mais atacar');
                        return false;
                    } else {
                        $('.campo .casa.selecionada.ataque').removeClass('selecionada').removeClass('ataque');
                        $('.campo .casa.selecionada.defesa').removeClass('selecionada').removeClass('defesa');
                        $('.campo.' + pecas[peca].campoAtual + ' .casa.' + pecas[peca].casaAtual).addClass('selecionada ataque');
                        pecaSelecionadaCampoAtaque = peca;
                        pecaSelecionadaCampoDefesa = "";
                    }
                } else {
                    //valida se a peca está no campo de ataque
                    if(espelhoOutroJogador == false && pecaEstaNoCampoDeAtaque(peca) == false) {
                        mensagemDeErro('Esta peça está fora do raio de ataque');
                        return false;
                    } else {    
                        $('.campo .casa.selecionada.defesa').removeClass('selecionada').removeClass('defesa');
                        $('.campo.' + pecas[peca].campoAtual + ' .casa.' + pecas[peca].casaAtual).addClass('selecionada defesa');
                        pecaSelecionadaCampoDefesa = peca;
                    }
                }
            }
            if(pecaSelecionadaCampoAtaque !== "" && pecaSelecionadaCampoDefesa !== "" && vezDoPlayer == true) {
                enviaDadosServidor("pecasSelecionadasDoTurno");
                habilitaIniciarTurno();
            } else {
                desabilitaIniciarTurno();
            }
        }
    }
}

function pecaEstaNoCampoDeAtaque(peca) {
    var raio_x1 = pecas[pecaSelecionadaCampoAtaque].alcanceAtualX; 
    var raio_x2 = raio_x1+pecas[pecaSelecionadaCampoAtaque].alcanceAtualW;
    var raio_y1 = pecas[pecaSelecionadaCampoAtaque].alcanceAtualY; 
    var raio_y2 = raio_y1+pecas[pecaSelecionadaCampoAtaque].alcanceAtualH;
    var peca_x1 = Math.round(pecas[peca].xAtual);
    var peca_x2 = Math.round(pecas[peca].xAtual+tamanhoCasasW);
    var peca_y1 = Math.round(pecas[peca].yAtual);
    var peca_y2 = Math.round(pecas[peca].yAtual+tamanhoCasasH);
    if(pecas[peca].tipo != "aviao" && raio_x1 <= (peca_x1 + marginLeftCampos) && raio_y1 <= (peca_y1 + tamanhoDivisaoH) && raio_y2 > peca_y1 && raio_x2 > (peca_x1 + marginLeftCampos) && (raio_y2 + tamanhoDivisaoH) >= peca_y2) {
        return true;
    } else {
        return false;
    }
}

function ativaControlesMouse(){
    
    //clique para rodar ataque
    $('.barraLateral .btnAtaque').click(function(){
        rodaAtaque(false);
    });
    
    //seleciona casa para pouso do paraquedista
    $('#palco .casa').click(function(){
        if(bloqueioEscolhaParaquedista){
            var classesCampo = $(this).parent().attr('class').split(' ');
            var classes = $(this).attr('class').split(' ');
            var campo = classesCampo[1];
            var casa = classes[1];
            if(!casaEstaNoCampoDePouso(pecaSelecionadaCampoAtaque, casa)){
                mensagemDeErro('Esta casa não está no campo de pouso do paraquedista');
            } else {
                if(casas['campo-'+campo][casa].ocupacao1 != "" || casas['campo-'+campo][casa].ocupacao2 != ""){
                    mensagemDeErro('Esta casa já está ocupada');
                } else if (casas['campo-'+campo][casa].tipo != "normal") {
                    mensagemDeErro('Esta peça não pode ser colocada nesta casa');
                } else {
                    repoePecaNoTabuleiro(pecaParaReposicao, casa);
                }                
            }
        }
    });
    
    //seleciona peca para movimentar-se
    $("#palco .campo .casa").sortable({
        revert: '100',
        connectWith: ".casa",
        cursor: "move",
        over: function(event, ui) { 
            $(".casa").removeClass("hover");
            $(this).addClass("hover");
        },
        beforeStop: function(){
            $(".casa").removeClass("hover");
        },
        start: function(event, ui) {
            ui.item[0].oldclick = ui.item[0].onclick;
            ui.item[0].onclick = null;     
        },
        stop: function(event, ui) {
            ui.item[0].onclick = ui.item[0].oldclick;
        }
    }).disableSelection();
    //acao após mover peça
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
        var validaMovimento = validaMovimentacaoPeca(idPecaMovimentada, campo, casa, false);
        if(validaMovimento != true){
            retornaMovimentoDaPeca(idPecaMovimentada, validaMovimento);
        } else {
            var movimentos = quantidadeDeMovimentos(pecas[idPecaMovimentada].casaAtual, casa);
            if(pecas[idPecaMovimentada].tipo == "aviao") {
                if(pecas[idPecaMovimentada].gasolina >= movimentos) {
                    if(casas['campo-' + campo][casa].ocupacao1 != "" && casas['campo-' + campo][casa].ocupacao2 == "") {
                        gravaMovimentacaoPeca(idPecaMovimentada, campo, casa, 'ocupacao2', false);
                    } else if(casas['campo-' + campo][casa].ocupacao1 == "") {
                        gravaMovimentacaoPeca(idPecaMovimentada, campo, casa, 'ocupacao1', false);
                    }
                }
            }
            //validacoes de outras pecas
            if(pecas[idPecaMovimentada].tipo != "sniper" && pecas[idPecaMovimentada].tipo != "aviao") {
                if(movimentos == 1) {
                    if(casas['campo-' + campo][casa].tipo != "montanha" && casas['campo-' + campo][casa].tipo != "base"){
                        if(casas['campo-' + campo][casa].ocupacao1 != "" && pecas[casas['campo-' + campo][casa].ocupacao1].tipo == "aviao"){
                            gravaMovimentacaoPeca(idPecaMovimentada, campo, casa, 'ocupacao2', false);    
                        } else {
                            gravaMovimentacaoPeca(idPecaMovimentada, campo, casa, 'ocupacao1', false);
                        }
                    }
                }
            }
        }
    });
    
}

function validaMovimentacaoPeca(peca, campoDestino, casaDestino, ignoraTurno){
    validado = true;
    var casasPossives = casasAleatorias(campoDestino);
    if(casasPossives.indexOf(casaDestino) == -1){
        validado = 'A casa '+ casaDestino +' não pertence ao campo '+ campoDestino;
    } else if (bloqueioEscolhaParaquedista == true) {
        validado = 'O jogo está suspenso para escolha do pouso do paraquedista';
    } else if (pecas[peca].exercito != turnoAtacante && ignoraTurno != true) {    
        validado = 'Você só pode mover uma peça em seu turno';
    } else {
        //validacoes do sniper
        if(pecas[peca].tipo == "sniper") {
            validado = 'Os atiradores de elite não podem se mover';
            //validacoes do aviao
        } else if(pecas[peca].tipo == "aviao") {
            //valida quantidade de casas movimentadas
            var movimentos = quantidadeDeMovimentos(pecas[peca].casaAtual, casaDestino);
            if(pecas[peca].gasolina >= movimentos) {
                //verifica casa livre
                if(casas['campo-' + campoDestino][casaDestino].ocupacao1 != "" && casas['campo-' + campoDestino][casaDestino].ocupacao2 != "") {
                    validado = 'Esta casa está ocupada';
                } 
            } else {
                validado = 'Este avião não tem gasolina o suficiente';
            }
        //validacoes de outras pecas
        } else if(pecas[peca].tipo != "sniper" && pecas[peca].tipo != "aviao") {
            //valida quantidade de casas movimentadas
            var movimentos = quantidadeDeMovimentos(pecas[peca].casaAtual, casaDestino);
            if(movimentos == 1) {
                if(casas['campo-' + campoDestino][casaDestino].tipo == "montanha"){
                    validado = 'Esta peça não pode se mover sobre montanhas';
                } else if(casas['campo-' + campoDestino][casaDestino].tipo == "base"){
                    validado = 'Esta peça não pode se mover sobre as bases';
                } else if(casas['campo-' + campoDestino][casaDestino].tipo == "aeroporto"){
                    validado = 'Esta peça não pode se mover sobre os aeroportos';    
                } else {
                    if(casas['campo-' + campoDestino][casaDestino].ocupacao1 != "" && pecas[casas['campo-' + campoDestino][casaDestino].ocupacao1].tipo != "aviao"){
                        validado = 'Esta casa está ocupada';
                    }
                }
            } else {
                validado = 'Esta peça pode mover-se uma casa por vez';
            }
        }
        return validado;
    }
}

function quantidadeDeMovimentos(casaInicial, casaFinal) {
    if(casaInicial == "" || casaInicial == null || casaInicial == undefined || casaFinal == "" || casaFinal == null || casaFinal == undefined){
        console.log('Para receber a quantidade de casas movimentadas é necessário informar a casa inicial e a casa final');
        return false;
    }
    var widthCasa = Math.round(tamanhoCasasW);
    var heightCasa = Math.round(tamanhoCasasH);
    var xFinal = Math.round($('.casa.' + casaFinal).position().left);
    var yFinal = Math.round($('.casa.' + casaFinal).offset().top);
    var xAtual = Math.round($('.casa.' + casaInicial).position().left);
    var yAtual = Math.round($('.casa.' + casaInicial).offset().top);
    
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

function gravaMovimentacaoPeca(peca, campoDestino, casaDestino, ocupacao, espelhoOutroJogador){
    
    if(pecas[peca].vida == 0) {
        repoePecaNoTabuleiro(peca, casaDestino);
        return false;
    }
    
    ultimaPecaMovimentada = peca;
    ultimoCampoDestinatario = campoDestino;
    ultimaCasaDestinataria = casaDestino;
    ocupacaoUltimaCasaDestino = ocupacao;
    if(pecas[peca].tipo == "aviao") {
        if(espelhoOutroJogador == false) {
            gasolinaConsumidaTurno = quantidadeDeMovimentos(pecas[peca].casaAtual, casaDestino);
            pecas[peca].gasolina = pecas[peca].gasolina - gasolinaConsumidaTurno;
        } else {
            pecas[peca].gasolina = pecas[peca].gasolina - gasolinaConsumidaTurno;
        }
    }
    
    $('.casa').removeClass('selecionada').removeClass('ataque').removeClass('defesa');
    
    //desocupa casa anterior
    if(pecas[ultimaPecaMovimentada].campoAtual != 0 && pecas[ultimaPecaMovimentada].casaAtual != 0){
        if(casas['campo-' + pecas[ultimaPecaMovimentada].campoAtual][pecas[ultimaPecaMovimentada].casaAtual].ocupacao1 = peca) {
            casas['campo-' + pecas[ultimaPecaMovimentada].campoAtual][pecas[ultimaPecaMovimentada].casaAtual].ocupacao1 = "";
        } else if(casas['campo-' + pecas[ultimaPecaMovimentada].campoAtual][pecas[ultimaPecaMovimentada].casaAtual].ocupacao2 = peca) {
            casas['campo-' + pecas[ultimaPecaMovimentada].campoAtual][pecas[ultimaPecaMovimentada].casaAtual].ocupacao2 = "";
        }
        $('.campo.' + pecas[ultimaPecaMovimentada].campoAtual + ' .casa.' + pecas[ultimaPecaMovimentada].casaAtual).removeClass('ocupacaoDupla');
    }
    
    //ocupa nova casa
    casas['campo-' + ultimoCampoDestinatario][ultimaCasaDestinataria][ocupacaoUltimaCasaDestino] = ultimaPecaMovimentada;
    pecas[ultimaPecaMovimentada].campoAtual = ultimoCampoDestinatario;
    pecas[ultimaPecaMovimentada].casaAtual = ultimaCasaDestinataria;
    //se nova casa estiver com duas ocupacoes
    if(casas['campo-' + ultimoCampoDestinatario][ultimaCasaDestinataria].ocupacao1 != "" && casas['campo-' + ultimoCampoDestinatario][ultimaCasaDestinataria].ocupacao2 != "") {
        $('.campo.' + ultimoCampoDestinatario + ' .casa.' + ultimaCasaDestinataria).addClass('ocupacaoDupla');
    } else {
        $('.campo.' + ultimoCampoDestinatario + ' .casa.' + ultimaCasaDestinataria).removeClass('ocupacaoDupla');
    }
    
    if(espelhoOutroJogador == false) {
        //envia para servidor
        enviaDadosServidor("movimentacaoDoTurno");
        gravaPosicoesPecas();
    } else {
        organizaPecas();
    }
    
    //nova posicao da peca e novo raio de ataque
    zeraRaioDeAtaque();
    //como última ação do turno, gera outro turno
    preparaNovoTurno();
}

function retornaMovimentoDaPeca(peca, motivo){
    organizaPecas();
    zeraBarrasLaterais();
    mensagemDeErro("Movimento não permitido: " + motivo);
}

function habilitaIniciarTurno(){
    $('.barraLateral.campo-' + turnoAtacante + ' .btnAtaque').addClass('visible');
}

function desabilitaIniciarTurno(){
    $('.barraLateral.campo-' + turnoAtacante + ' .btnAtaque').removeClass('visible');
}

function rodaAtaque(espelhoOutroJogador){
    turnoVencedor = "verificando";
    if(numTentativaAtaque == 0) {
        numTentativaAtaque = 1;
    }
    //retira tiro da peça que atacou
    if(pecas[pecaSelecionadaCampoAtaque].tiros > 0){
        pecas[pecaSelecionadaCampoAtaque].tiros = pecas[pecaSelecionadaCampoAtaque].tiros - 1;
    }
    //joga os dados
    var vencedor = "";
    if(numeroDadoAtaque == 0 || espelhoOutroJogador == false) {
        numeroDadoAtaque = Math.floor(Math.random() * 6 + 1);
    }
    if(numeroDadoDefesa == 0 || espelhoOutroJogador == false) {
        numeroDadoDefesa = Math.floor(Math.random() * 6 + 1);
    }
    $('.barraLateral .btnAtaque').removeClass('visible');
    $('.barraLateral .dados').addClass('visible');
    $('.barraLateral .dados').empty();
    $('#dados .dado.dado-ataque-gif').clone().appendTo('.barraLateral.campo-' + turnoAtacante + ' .dados');
    $('#dados .dado.dado-defesa-gif').clone().appendTo('.barraLateral.campo-' + turnoDefesa + ' .dados');
    //resultados dos dados
    var tempoExibicaoResultadoAtaque = 2000;
    var tempoExibicaoResultadoDefesa = 3000;
    if(espelhoOutroJogador){
        tempoExibicaoResultadoAtaque = 500;
        tempoExibicaoResultadoDefesa = 1500;
    }
    setTimeout(function(){
        $('.barraLateral.campo-' + turnoAtacante + ' .dados').empty();
        $('#dados .dado.dado-ataque-' + numeroDadoAtaque).clone().appendTo('.barraLateral.campo-' + turnoAtacante + ' .dados');
    }, tempoExibicaoResultadoAtaque);
    setTimeout(function(){
        $('.barraLateral.campo-' + turnoDefesa + ' .dados').empty();
        $('#dados .dado.dado-defesa-' + numeroDadoDefesa).clone().appendTo('.barraLateral.campo-' + turnoDefesa + ' .dados');
    }, tempoExibicaoResultadoDefesa); 
    if(espelhoOutroJogador == false){
        enviaDadosServidor("dadosDoTurno");
    }
    setTimeout(function(){
        //se ataque venceu
        if(numeroDadoAtaque > numeroDadoDefesa) {
            vencedor = "ataque";
            //roda animação
            animacaoAtaqueBemSucedido();
            if(pecas[pecaSelecionadaCampoDefesa].vida != '-1') {
                pecas[pecaSelecionadaCampoDefesa].vida = pecas[pecaSelecionadaCampoDefesa].vida-pecas[pecaSelecionadaCampoAtaque].dano;
                if(pecas[pecaSelecionadaCampoDefesa].vida <= 0) {
                    retiraPecaDoTabuleiro(pecaSelecionadaCampoDefesa, espelhoOutroJogador);
                    exibeResultadosGerais();
                }
            }
        //se defesa venceu    
        } else {
            if(pecas[pecaSelecionadaCampoAtaque].tentativas > 1 && pecas[pecaSelecionadaCampoAtaque].tentativas > numTentativaAtaque){
                if(espelhoOutroJogador == false) {
                    numTentativaAtaque = numTentativaAtaque + 1;
                    rodaAtaque(espelhoOutroJogador);
                }
                return false;
            } else {
                vencedor = "defesa";
            }
        }
        $('.casa').removeClass('selecionada').removeClass('ataque').removeClass('defesa');
        resultadoDoTurno(vencedor);
    }, 4000);
}

function animacaoAtaqueBemSucedido(){
    var tipoAtacante = pecas[pecaSelecionadaCampoAtaque].tipo;
    if(tipoAtacante == "granada" || tipoAtacante == "tanque"){
        rodandoAnimacaoAtaque = true;
        $('#'+pecaSelecionadaCampoDefesa).addClass('atacada-granada-tanque');
        setTimeout(function(){
            $('#'+pecaSelecionadaCampoDefesa).removeClass('atacada-granada-tanque');
            rodandoAnimacaoAtaque = false;
        }, 1000);
    }
    if(tipoAtacante == "aviao"){
        rodandoAnimacaoAtaque = true;
        $('#'+pecaSelecionadaCampoDefesa).addClass('atacada-aviao');
        setTimeout(function(){
            $('#'+pecaSelecionadaCampoDefesa).removeClass('atacada-aviao');
            rodandoAnimacaoAtaque = false;
        }, 1000);
    }
}

function resultadoDoTurno(resultado){
    //alert(resultado + " venceu");
    $('.barraLateral .dados').removeClass('visible');
    turnoVencedor = resultado;
    //se peça de ataque for aviao
    if(pecas[pecaSelecionadaCampoAtaque].tipo == "aviao"){
        liberaParaquedista();
    } else {
        liberaMovimentacao();
        if(turnoAtacante == "baixo" && getUrlVars()["pl1"] != undefined && getUrlVars()["pl2"] == "Computador") {
            organizaPecas();
            verificaFimDePartida();
            setTimeout(function(){
                jogarIA('action2');
            }, 1000);
        }
    }
}

function retiraPecaDoTabuleiro(peca, espelhoOutroJogador){
    
    if(rodandoAnimacaoAtaque == false){
    
        ultimaPecaRetirada = peca;

        if(pecas[ultimaPecaRetirada].campoAtual != 0 && pecas[ultimaPecaRetirada].casaAtual != 0){
            if(casas['campo-'+pecas[ultimaPecaRetirada].campoAtual][pecas[ultimaPecaRetirada].casaAtual].ocupacao1 == ultimaPecaRetirada) {
                casas['campo-'+pecas[ultimaPecaRetirada].campoAtual][pecas[ultimaPecaRetirada].casaAtual].ocupacao1 = "";
            } else if(casas['campo-'+pecas[ultimaPecaRetirada].campoAtual][pecas[ultimaPecaRetirada].casaAtual].ocupacao2 == ultimaPecaRetirada) {
                casas['campo-'+pecas[ultimaPecaRetirada].campoAtual][pecas[ultimaPecaRetirada].casaAtual].ocupacao2 = "";
            }
            $('.casa.' + pecas[ultimaPecaRetirada].casaAtual).removeClass('ocupacaoDupla');
            $('.casa.' + pecas[ultimaPecaRetirada].casaAtual + ' #' + ultimaPecaRetirada + '.peca').remove();
            pecas[ultimaPecaRetirada].campoAtual = 0;
            pecas[ultimaPecaRetirada].casaAtual = 0;
        }

        //envia servidor
        if(espelhoOutroJogador == false){
            enviaDadosServidor("pecaRemovidaDoTurno");
        }

        organizaPecas();
    
    } else {
        setTimeout(function(){
            retiraPecaDoTabuleiro(peca, espelhoOutroJogador);
        }, 1000);
    }
}

function repoePecaNoTabuleiro(peca, casa){
    var campo = "";
    var ocupacao = "";
    $.each(casas['campo-cima'], function(index){
        if(casa == index){
            campo = "cima";
        }
    });
    $.each(casas['campo-baixo'], function(index){
        if(casa == index){
            campo = "baixo";
        }
    });
    if(casas['campo-' + campo][casa].ocupacao1 == "") {
        ocupacao = "ocupacao1";
    } else {
        ocupacao = "ocupacao2";
    }
    
    pecas[peca].campoAtual = campo;
    pecas[peca].casaAtual = casa;
    pecas[peca].vida = 1;
    pecaParaReposicao = "";
    
    gravaMovimentacaoPeca(peca, campo, casa, ocupacao, false);
}

function liberaParaquedista(){
    //ve se exercito atacante tem pelo menos um revolver perdido
    var revolverPerdido = "";
    $.each(pecas, function(index){
        if(this.exercito == turnoAtacante && this.tipo == "revolver" && this.campoAtual == 0 && this.casaAtual == 0) {
            revolverPerdido = index;
        }
    });
    if(revolverPerdido == ""){
        alert("O exército não teve peça do tipo revolver perdida, então não tem o que repor");
        retiraPecaDoTabuleiro(pecaSelecionadaCampoAtaque, false);
        liberaMovimentacao();
    } else {
        bloqueioEscolhaParaquedista = true;
        pecaParaReposicao = revolverPerdido;
        $('#palco .casa').addClass('selecionavel');
        exibeRaioDeAtaque(pecaSelecionadaCampoAtaque);
        var segundosParaquedista = 10;
        timerParaquedista = setInterval(function(){
            $('.barraLateral.campo-' + turnoAtacante + ' .timer').addClass('visible').html(segundosParaquedista + ' segundos para posicionar um paraquedista');
            segundosParaquedista--;
            if(segundosParaquedista < 0){
                preparaNovoTurno();
            }
        }, 1000);
        if(turnoAtacante == "baixo" && getUrlVars()["pl1"] != undefined && getUrlVars()["pl2"] == "Computador") {
            setTimeout(function(){
                jogarIA('action3');
            }, 1000);
        }
    }
}

function casaEstaNoCampoDePouso(pecaAviao, casa) {
    var raio_x1 = pecas[pecaAviao].alcanceAtualX; 
    var raio_x2 = raio_x1+pecas[pecaAviao].alcanceAtualW;
    var raio_y1 = pecas[pecaAviao].alcanceAtualY; 
    var raio_y2 = raio_y1+pecas[pecaAviao].alcanceAtualH;
    var xCasa = $('.casa.' + casa).position().left;
    var yCasa = $('.casa.' + casa).offset().top;
    var casa_x1 = Math.round(xCasa+marginLeftCampos);
    var casa_x2 = Math.round(xCasa+tamanhoCasasW);
    var casa_y1 = Math.round(yCasa+tamanhoDivisaoH);
    var casa_y2 = Math.round(yCasa+tamanhoCasasH);
    if(raio_x1 <= (casa_x1 + marginLeftCampos) && raio_y1 <= (casa_y1 + tamanhoDivisaoH) && raio_y2 > casa_y1 && raio_x2 > (casa_x1 + marginLeftCampos) && (raio_y2 + tamanhoDivisaoH) >= casa_y2) {
        return true;
    } else {
        return false;
    }
}

function liberaMovimentacao(){
    var segundosMovimentacao = 10;
    timerMovimentacao = setInterval(function(){
        $('.barraLateral.campo-' + turnoAtacante + ' .timer').addClass('visible').attr('onclick', 'cancelaPossibilidadeDeMovimentacao(false);').html(segundosMovimentacao + ' segundos para movimentar uma de suas peças');
        segundosMovimentacao--;
        if(segundosMovimentacao < 0){
            preparaNovoTurno();
        }
    }, 1000);
}

function cancelaPossibilidadeDeMovimentacao(espelhoOutroJogador){
    if(getUrlVars()["pl1"] == undefined && getUrlVars()["pl2"] == undefined && vezDoPlayer == true) {
        //envia para servidor
        enviaDadosServidor("cancelaMovimentacaoDoTurno");
        preparaNovoTurno();
    } else if((getUrlVars()["pl1"] != undefined && getUrlVars()["pl2"] != undefined) || espelhoOutroJogador == true) {
        preparaNovoTurno();
    }
}

function preparaNovoTurno(){
    clearInterval(timerMovimentacao);
    clearInterval(timerParaquedista);
    $('#palco .casa').removeClass('selecionavel');
    $('.barraLateral .dados').removeClass('visible');
    $('.barraLateral .timer').removeClass('visible').removeAttr('onclick');
    if(bloqueioEscolhaParaquedista){
        bloqueioEscolhaParaquedista = false;
        retiraPecaDoTabuleiro(pecaSelecionadaCampoAtaque, false);
    }
    pecaParaReposicao = "";
    pecaSelecionadaCampoAtaque = "";
    pecaSelecionadaCampoDefesa = "";
    zeraBarrasLaterais();
    zeraRaioDeAtaque();
    numDoTurno = numDoTurno+1;
    turnoVencedor = "";
    numeroDadoAtaque = 0;
    numeroDadoDefesa = 0;
    numTentativaAtaque = 0;
    if(turnoAtacante == "cima") {
        turnoAtacante = "baixo";
        turnoDefesa = "cima";
        if(nomeJogadorVermelho != getUrlVars()["player"]){
            vezDoPlayer = true;
            if(getUrlVars()["pl1"] == undefined && getUrlVars()["pl2"] == undefined) {
                mostraMensagemJogador('Sua vez de jogar!');
            }
        } else {
            vezDoPlayer = false;
        }
    } else {
        turnoAtacante = "cima";
        turnoDefesa = "baixo";
        if(nomeJogadorAzul != getUrlVars()["player"]){
            vezDoPlayer = true;
            if(getUrlVars()["pl1"] == undefined && getUrlVars()["pl2"] == undefined) {
                mostraMensagemJogador('Sua vez de jogar!');
            }
        } else {
            vezDoPlayer = false;
        }
    }
    $('.barraLateral .infos .time').removeClass('naVez');
    if(turnoAtacante == "cima"){
        $('.barraLateral .infos .time.timeA').addClass('naVez');
    } else {
        if(getUrlVars()["pl1"] != undefined && getUrlVars()["pl2"] == "Computador") {
            setTimeout(function(){
                jogarIA('action1');
            }, 1000);
        }
        $('.barraLateral .infos .time.timeB').addClass('naVez');
    }
    exibeResultadosGerais();
    verificaFimDePartida();
}

function mostraMensagemJogador(mensagem){
    $('#mensagens-jogador').html(mensagem).addClass('visible');
    setTimeout(function(){
        $('#mensagens-jogador').removeClass('visible');
    }, 1500);
}

function muted(status){
    
}

function restart(){
    if(fimDeJogo == false) {
        if(confirm('Deseja realmente reiniciar?')) { 
            window.location.reload(true);
        }
    } else {
        window.location.reload(true);
    }
}

function gameOver(motivo){  
    fimDeJogo = true;
    $(".barraLateral .desafioSecreto").removeClass('oculto');
    $("#mensagem-final span.mensagem").html('Acabou, ' + nomeJogadorCampeao + ' ganhou o jogo!<br>' + motivo);
    
    $("#mensagem-final").dialog({
        closeOnEscape: false,
        modal: true,
        buttons: {
          'Jogar novamente!': restart,
          'Sair': function(){
              window.location.href = "index.html";
          }
        },
        open: function(event, ui) {
            $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
            //se for jogo online oculta opção de jogar novamente
            if(getUrlVars()["pl1"] == undefined && getUrlVars()["pl2"] == undefined) {
                $(".ui-dialog-buttonset button:first-of-type").hide();
            }
        }
    });
}

function mensagemDeErro(mensagem){
    $("#mensagem-erro span.mensagem").html(mensagem);
    $("#mensagem-erro").dialog({
        modal: true,
        buttons: {
          'Entendido!': function() {
            $( this ).dialog( "close" );
          }
        }
    });
}

//width do body
function getDocWidth(){
//    var width = (
//    'innerWidth' in window? window.innerWidth :
//    document.compatMode!=='BackCompat'? document.documentElement.clientWidth :
//    document.body.clientWidth
//    );
//    return width;
    return $('html').innerWidth();
}

//height do body
function getDocHeight(){
//    var height = (
//    'innerHeight' in window? window.innerHeight :
//    document.compatMode!=='BackCompat'? document.documentElement.clientHeight :
//    document.body.clientHeight
//    );
//    return height;
    return $('html').innerHeight();
}

//variaveis do navegador
function getUrlVars(){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function casasAleatorias(campo) {
    if(campo == "" || campo == null || campo == undefined){
        console.log('Para retornar um array aleatório de casas, é necessário informar o campo');
        return false;
    }
    var indexCasasCima = ['a1','a2','a3','a4','a5','b1','b2','b3','b4','b5','c1','c2','c3','c4','c5','d1','d2','d3','d4','d5','e1','e2','e3','e4','e5','f1','f2','f3','f4','f5','g1','g2','g3','g4','g5'];
    var indexCasasBaixo = ['a6','a7','a8','a9','a10','b6','b7','b8','b9','b10','c6','c7','c8','c9','c10','d6','d7','d8','d9','d10','e6','e7','e8','e9','e10','f6','f7','f8','f9','f10','g6','g7','g8','g9','g10'];
    if(campo == "cima"){
        for (var j, x, i = indexCasasCima.length; i; j = parseInt(Math.random() * i), x = indexCasasCima[--i], indexCasasCima[i] = indexCasasCima[j], indexCasasCima[j] = x);
        return indexCasasCima;
    } else if(campo == "baixo"){
        for (var j, x, i = indexCasasBaixo.length; i; j = parseInt(Math.random() * i), x = indexCasasBaixo[--i], indexCasasBaixo[i] = indexCasasBaixo[j], indexCasasBaixo[j] = x);
        return indexCasasBaixo;
    }
}