//recupera variáveis

//tamanho do palco
var palcoWidth = getDocWidth();
var palcoHeight = getDocHeight();

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
    //tamanho palco
    $('#palco').css('width',getDocWidth()+'px');
    organizaCasas();
    populaCampos();
    ativaControles();
//    console.log(casas);
//    console.log(pecas);
}

//calcula tamanho das casas e organiza tabuleiro
function organizaCasas(){
    var tamanhoCampoW = $('#palco .campo').width();
    var tamanhoCampoH = ($('#palco').height()/2)-5 //desconta a metade do tamanho da divisao
    var margemCampoL = (palcoWidth-tamanhoCampoW)/2;
    var tamanhoCasasW = tamanhoCampoW/7;
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
        $('#pecas .' + tipoPeca + '.' + campoPeca).clone().appendTo('.campo.' + campoPeca + ' .casa.' +casaOcupada);
        casas['campo-'+campoPeca][casaOcupada].ocupada = index;
    });
}

function ativaControles(){
    
    //seleciona pecas para o turno
    $('#palco .casa').click(function(){
        var arrCampo = $(this).parent().attr('class').split(' ');
        var campo = arrCampo[1];
        var arrCasa = $(this).attr('class').split(' ');
        var casa = arrCasa[1];
        var ocupada = casas['campo-' + campo][casa].ocupada;
        if(ocupada !== "") {
            if(turnoAtacante == "cima" && pecas[ocupada].exercito == "baixo" && pecaSelecionadaCampoAtaque == "") {
                alert('É preciso selecionar sua peça primeiro');
                return false;
            } else if(turnoAtacante == "baixo" && pecas[ocupada].exercito == "cima" && pecaSelecionadaCampoAtaque == "") {
                alert('É preciso selecionar sua peça primeiro');
                return false;
            } else {
                if(pecaSelecionadaCampoAtaque == "") {
                    $(this).addClass('selecionada ataque');
                    pecaSelecionadaCampoAtaque = ocupada;
                } else {
                    $('.campo.' + turnoDefesa + ' .casa').removeClass('selecionada').removeClass('defesa');
                    $(this).addClass('selecionada defesa');
                    pecaSelecionadaCampoDefesa = ocupada;
                }
            }
        }
        if(pecaSelecionadaCampoAtaque !== "" && pecaSelecionadaCampoDefesa !== "") {
            habilitaIniciarTurno();
        }
    });
    
    $('.barraLateral .btnAtaque').click(function(){
        rodaAtaque();
    })
    
}

function habilitaIniciarTurno(){
    $('.barraLateral.campo-' + turnoAtacante + ' .btnAtaque').addClass('visible');
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
    if(turnoAtacante == "cima") {
        turnoAtacante = "baixo";
        turnoDefesa = "cima";
    } else {
        turnoAtacante = "cima";
        turnoDefesa = "baixo";
    }
}

function pause(){
    if((varPlay == true) && (aviaoAutorizaPausar() == true)) {
        varPlay = false;
        $('#panelPause').css('display','block');
        muted(true);        
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