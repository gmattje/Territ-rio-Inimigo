//recupera variáveis

//tamanho do palco
var palcoWidth = getDocWidth();
var palcoHeight = getDocHeight();

//tamanho avião
var airplaneWidth = 0;
var airplaneHeight = 0;
var air_x1 = 0;
var air_x2 = 0;
var air_y1 = 0;
var air_y2 = 0;

//tamanho passagem avião
var tamanhoPassagem = 0;

//movimentação
//máximo movimentação avião
var deslocamento = 'desligado';
var pes = 0;
var maxMovDireita = 0;
var maxMovEsquerda = 0;
var movimentacao = 0; //mover em pixel a cada interação
var velocidadeMovimentacao = 0;
var movendoAirplane = false;
var velocidade = 0;
var modeloAviao = 'P-40';

//avião P-40
switch (modeloAviao){
    case 'P-40':
    movimentacao = parseFloat(15);
    velocidadeMovimentacao = parseFloat(20);
    break;
    case 'Boing':
    movimentacao = parseFloat(5); 
    velocidadeMovimentacao = parseFloat(20);
    break;
    case 'Caça':
    movimentacao = parseFloat(10); 
    velocidadeMovimentacao = parseFloat(10);
    break;
}

//objetos
var objects = new Array();
var objectsMaximos = new Array();
var encontroX = false;
var encontroY = false;

//lifes
var lifes = new Array();
var lifesMaximos = new Array();

//fuels
var fuels = new Array();
var fuelsMaximos = new Array();

//nuvens
var clouds = new Array();
var cloudsMaximos = new Array();

//colisoes
var colisoes = 0;

//vidas
var vidas = 0;

//pontuacao
var pontos = 0;

//cash
var cash = 0;

//gasolina/diesel
var fuel = 0; //porcento (%)

//se jogo está rolando
var varPlay = false;

//função de inicialização
function init(qtdVidas, valorVelocidade){
    //setando vidas
    varLife(qtdVidas);
    //setando gasolina
    varFuel(40);
    //setando velocidade
    velocidade = valorVelocidade;
    //tamanho palco
    $('#palco').css('width',getDocWidth()+'px');
    $('#planoSuperior').css('width',getDocWidth()+'px');
    //recupera dados dos possíveis obstáculos
    dadosObjetos();
    //dados dos lifes
    dadosLifes();
    //dados dos fuels
    dadosFuels();
    //dados das núvens
    dadosClouds();
    //calculando dados do avião
    dadosAviao();
    //primeira linha de obstáculos
    criaLinhaObstaculos(3);
    //primeira linha de nuvens
    criaLinhaNuvens(3);
}

function play(){
    if(varPlay == false) {
        varPlay = true;
        $('#panelPause').css('display','none');
        muted(false);
        if(deslocamento == 'desligado') {
            ligaAviao();
            var aguardar = "4000";
        } else {
            var aguardar = "0";
        }
        setTimeout(function(){
            //potuação
            timerPontuacao = setInterval('pontuacao(5)', ((velocidade*10)/4));
            //cash
            timerCash = setInterval('varCash(2)', (velocidade*5));
            //gasolina
            timerFuel = setInterval('varFuel(-1)', (velocidade*4));
            //cria linha obstaculos
            timerCriaObstaculos = setInterval('criaLinhaObstaculos(1)', (velocidade*6));
            //cria linha lifes
            timerCriaLifes = setInterval('criaLifes()', (velocidade*30));
            //cria linha fuels
            timerCriaFuels = setInterval('criaFuels()', (velocidade*12));
            //rolagem obstaculos
            timerRolaObstaculos = setInterval('rolagemObstaculos()', velocidade);
            //cria linha de núvens
            timerCriaNuvens = setInterval('criaLinhaNuvens(1)', (velocidade*3));
            //rolagem nuvens
            timerRolaNuvens = setInterval('rolagemNuvens()', velocidade);
            //limpa palco
            timerLimpaPalco = setInterval('limpaPalco()', velocidade);
            //controle colisao
            timerControleColisao = setInterval('controleColisao()', velocidade);            
        }, aguardar);       
    }
}

function pause(){
    if((varPlay == true) && (aviaoAutorizaPausar() == true)) {
        varPlay = false;
        $('#panelPause').css('display','block');
        muted(true);
        clearInterval(timerPontuacao);
        clearInterval(timerCash);
        clearInterval(timerFuel);
        clearInterval(timerCriaObstaculos);
        clearInterval(timerCriaLifes);
        clearInterval(timerCriaFuels);
        clearInterval(timerRolaObstaculos);
        clearInterval(timerCriaNuvens);
        clearInterval(timerRolaNuvens);
        clearInterval(timerLimpaPalco);
        clearInterval(timerControleColisao);        
    }
}

function muted(status){
    document.getElementById('audio-p40-partida').muted = status;
    document.getElementById('audio-p40-subindo').muted = status;
    document.getElementById('audio-p40-voando').muted = status;
    document.getElementById('audio-p40-explosao').muted = status;
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
    //menos tamanho da barra lateral
    width = width-150;
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

//dados sobre obstáculos
function dadosObjetos(){
    var numObjects = 0;
    $('#objects').children('.object').each(function(i){
        var tamanhoObject = $(this).children('img').css('width').replace('px','');
        objects[numObjects] = tamanhoObject;
        numObjects++; 
    });
}

//dados sobre lifes
function dadosLifes(){
    var numLifes = 0;
    $('#objects_other').children('.life').each(function(i){
        var tamanhoLife = $(this).children('img').css('width').replace('px','');
        lifes[numLifes] = tamanhoLife;
        numLifes++; 
    });
}

//dados sobre fuels
function dadosFuels(){
    var numFuels = 0;
    $('#objects_other').children('.fuel').each(function(i){
        var tamanhoFuel = $(this).children('img').css('width').replace('px','');
        fuels[numFuels] = tamanhoFuel;
        numFuels++; 
    });
}

//dados sobre nuvens
function dadosClouds(){
    var numNuvens = 0;
    $('#objects_other').children('.cloud').each(function(i){
        var tamanhoCloud = $(this).children('img').css('width').replace('px','');
        clouds[numNuvens] = tamanhoCloud;
        numNuvens++; 
    });
}

//dados sobre avião
function dadosAviao(){
    airplaneWidth = $('#airplane').css('width').replace('px','');
    airplaneHeight = $('#airplane').css('height').replace('px','');
    air_x1 = $('#airplane').offset().left;
    air_x2 = air_x1+parseFloat(airplaneWidth);
    air_y1 = $('#airplane').offset().top;
    air_y2 = air_y1+parseFloat(airplaneHeight);
    tamanhoPassagem = parseFloat(airplaneWidth)+parseFloat(airplaneWidth*(50/100));
    maxMovDireita = parseFloat(parseFloat(palcoWidth/2)-parseFloat(airplaneWidth/2));
    //maxMovDireita = parseFloat(maxMovDireita-parseFloat(airplaneWidth/2));
    maxMovEsquerda = parseFloat(parseFloat(palcoWidth/2)-parseFloat(airplaneWidth/2));
    //maxMovEsquerda = parseFloat(maxMovEsquerda+parseFloat(airplaneWidth/2));
    maxMovEsquerda = "-"+parseFloat(maxMovEsquerda);
}

function aviaoAutorizaPausar(){
    var autoriza = true;
    if(pes == 0) {
        autoriza = false;
    }
    return autoriza;
}

function ligaAviao(){  
    frente();
    document.getElementById('audio-p40-partida').play();
    setTimeout(function(){
        decolaAviao(); 
    }, 4000);
}

function decolaAviao(){
    $('#airplaneContent').removeClass('pes'+pes);
    pes = 10;
    $('#airplaneContent').addClass('pes'+pes);
    document.getElementById('audio-p40-subindo').play();
    setTimeout(function(){
       voando();        
    }, 13000);
}

function voando(){
    $('#airplaneContent').removeClass('pes'+pes);
    pes = 1000;
    $('#airplaneContent').addClass('pes'+pes);
    document.getElementById('audio-p40-voando').play();
    setInterval(function(){
        document.getElementById('audio-p40-voando').currentTime = 0;
    }, 4318);
}

function desligaAviao(){  
    if(varPlay == true){
        deslocamento = 'desligado';
        $('#airplaneContent').removeClass('frente').removeClass('esquerda').removeClass('direita').addClass('desligado');
        muted(true);
        pousaAviao();
    }
}

function pousaAviao(){
    $('#airplaneContent').removeClass('pes'+pes);
    pes = 0;
    $('#airplaneContent').addClass('pes'+pes);
    velocidade = velocidade*2;
    setTimeout(function(){
        velocidade = 0;
        clearInterval(timerPontuacao);
        clearInterval(timerCash);
        clearInterval(timerFuel);
        clearInterval(timerCriaObstaculos);
        clearInterval(timerCriaFuels);
        clearInterval(timerRolaObstaculos);
        clearInterval(timerRolaNuvens);
        clearInterval(timerControleColisao);        
    }, 2000);
    setTimeout(function(){
       gameOver(false); 
    }, 3000);
}

function explodeAviao(){
    document.getElementById('audio-p40-partida').muted = true;
    document.getElementById('audio-p40-subindo').muted = true;
    document.getElementById('audio-p40-voando').muted = true;
    document.getElementById('audio-p40-explosao').play();    
    $('#airplaneContent').removeClass('frente').removeClass('esquerda').removeClass('direita').addClass('explosion');
    $('#airplaneContent #airplanePropeller').css("display","none");
    $('#airplaneContent #airplaneSmoke').css("display","none");
    $('#airplaneContent #airplaneFire').css("display","none");
}

//movimentação avião para esquerda
//function esquerda(){
//    if(movendoAirplane == false) {
//        //testa se a próxima será maior ou igual a máxima
//        var marginAtual = $('#airplane').css('margin-left');
//        marginAtual = parseFloat(marginAtual.replace('px',''));
//        if((marginAtual-movimentacao) >= maxMovEsquerda){
//            movendoAirplane = true;
//            $('#airplane').animate({marginLeft:'-='+movimentacao+'px'}, 0, function(){
//                 movendoAirplane = false;
//                 posicaoAbsolutaAirplane(esquerda);
//            });
//        }        
//    }
//}

function esquerda(){
    if((varPlay == true) && (deslocamento != 'desligado') && (pes >= 10)){
        if(deslocamento == 'direita') {
            frente();
        } else {
            deslocamento = 'esquerda';
            $('#airplaneContent').removeClass('frente').addClass('esquerda');
            deslocaEsquerda();
        }
    }
}

function deslocaEsquerda(){
    if((varPlay == true) && (deslocamento != 'desligado') && (movendoAirplane == false)) {
        if(deslocamento == 'esquerda') {
            //testa se a próxima será maior ou igual a máxima
            var marginAtual = $('#airplaneContent').css('margin-left');
            marginAtual = parseFloat(marginAtual.replace('px',''));
            if((marginAtual-movimentacao) >= maxMovEsquerda){
                movendoAirplane = true;
                $('#airplaneContent').animate({marginLeft:'-='+movimentacao+'px'}, velocidadeMovimentacao, function(){
                     movendoAirplane = false;
                     deslocaEsquerda();
                     posicaoAbsolutaAirplane();
                });
            } else {
                frente();
            }
        } else {
            return false;
        }
    }
}

//movimentação avião para direita
//function direita(){
//    if(movendoAirplane == false) {
//        //testa se a próxima será menor que a máxima
//        var marginAtual = $('#airplane').css('margin-left');
//        marginAtual = parseFloat(marginAtual.replace('px',''));
//        if((marginAtual+movimentacao) < maxMovDireita){
//            movendoAirplane = true;
//            $('#airplane').animate({marginLeft:'+='+movimentacao+'px'}, 0, function(){
//                 movendoAirplane = false;
//                 posicaoAbsolutaAirplane(direita);
//            });
//        }        
//    }
//}

function direita(){
    if((varPlay == true) && (deslocamento != 'desligado') && (pes >= 10)){
        if(deslocamento == 'esquerda') {
            frente();
        } else {            
            deslocamento = 'direita';
            $('#airplaneContent').removeClass('frente').addClass('direita');
            deslocaDireita();
        }
    }
}

function deslocaDireita(){
    if((varPlay == true) && (deslocamento != 'desligado') && (movendoAirplane == false)) {
        if(deslocamento == 'direita') {
            //testa se a próxima será menor que a máxima
            var marginAtual = $('#airplaneContent').css('margin-left');
            marginAtual = parseFloat(marginAtual.replace('px',''));
            if((marginAtual+movimentacao) < maxMovDireita){
                movendoAirplane = true;
                $('#airplaneContent').animate({marginLeft:'+='+movimentacao+'px'}, velocidadeMovimentacao, function(){
                     movendoAirplane = false;
                     deslocaDireita();
                     posicaoAbsolutaAirplane();
                });
            } else {
                frente();
            }
        } else {
            return false;
        }
    }
}

function frente(){
    if(varPlay == true){
        deslocamento = 'frente';
        $('#airplaneContent').removeClass('desligado').removeClass('esquerda').removeClass('direita').addClass('frente');
    }
}

function efeitosAirplane(){
    if(vidas <= 3) {
        $('#airplaneContent #airplaneSmoke').css("display","block");
    } else {
        $('#airplaneContent #airplaneSmoke').css("display","none");
    }
    if(vidas <= 2) {
        $('#airplaneContent #airplaneFire').css("display","block");
    } else {
        $('#airplaneContent #airplaneFire').css("display","none");
    }
}

//function posicaoAbsolutaAirplane(direcao){
//    if(direcao == esquerda) {
//        air_x1 = air_x1-movimentacao;
//        air_x2 = parseFloat(air_x1)+parseFloat(airplaneWidth);
//    } else if (direcao == direita) {
//        air_x1 = air_x1+movimentacao;
//        air_x2 = parseFloat(air_x1)+parseFloat(airplaneWidth);
//    }    
//    //air_y1 = $('#airplane').offset().top;
//    //air_y2 = parseFloat(air_y1)+parseFloat(airplaneHeight);
//}

function posicaoAbsolutaAirplane(){
    air_x1 = $('#airplane').offset().left;
    air_x2 = parseFloat(air_x1)+parseFloat($('#airplane').css('width').replace('px',''));    
    //air_y1 = $('#airplane').offset().top;
    //air_y2 = parseFloat(air_y1)+parseFloat(airplaneHeight);
}

//criando linhas de obstáculos aleatórios
function criaLinhaObstaculos(quantidade){       
    //cria quantas linhas foram solicitadas
    for(var i=0; i<quantidade; i++) {
        //cria elemento linha
        var novaLinha = $('<div>').prependTo('#obstaculos').addClass('linha').css('margin-bottom','550px');;
        //elementos
        var primeiroElemento = true;
        var tamMax = palcoWidth;
        while(tamMax > 0) {
            indexElemento = indexObstaculoAleatorio(tamMax);
            if(primeiroElemento == true) {
                var inicioAletorio = Math.floor((Math.random()*(tamanhoPassagem+parseFloat(tamanhoPassagem*(25/100)))));
                tamMax = tamMax-inicioAletorio-objects[indexElemento];
                if(tamMax >= 0) {
                    $('#obj'+indexElemento).clone().appendTo(novaLinha).css('margin-left',inicioAletorio).removeClass('crash').addClass('object');
                }
                primeiroElemento = false;
            } else {
                tamMax = tamMax-tamanhoPassagem-objects[indexElemento];
                if(tamMax >= 0) {
                    $('#obj'+indexElemento).clone().appendTo(novaLinha).css('margin-left',tamanhoPassagem).removeClass('crash').addClass('object');
                }
            }        
        }
    }
}

//escolhe elemento aleatorio com tamanho máximo
function indexObstaculoAleatorio(tamanhoMaximo){
    var numObjects = 0;
    $.each(objects, function( index, value ){
        if(parseFloat(value) <= parseFloat(tamanhoMaximo)) {
            objectsMaximos[numObjects] = index;
            numObjects++;
        }
    });
    var quantidadeObstaculos = objectsMaximos.length;
    var elementoAleatorio = Math.floor((Math.random()*quantidadeObstaculos));
    return objectsMaximos[elementoAleatorio];
}

//criando fuel
function criaLifes(){
    //cria elemento linha
    var novaLinha = $('<div>').prependTo('#obstaculos').addClass('linha').css('margin-bottom','300px');
    //elementos
    var tamMax = palcoWidth;
    indexLife = indexLifeAleatorio(tamMax);
    var inicioAletorio = Math.floor((Math.random()*tamMax))-lifes[indexLife];
    if(inicioAletorio < 0) {
        inicioAletorio = 0;
    }
    tamMax = tamMax-inicioAletorio-lifes[indexLife];
    if(tamMax >= 0) {
        $('#life'+indexLife).clone().appendTo(novaLinha).css('margin-left',inicioAletorio);
    }
}

//escolhe elemento aleatorio com tamanho máximo
function indexLifeAleatorio(tamanhoMaximo){
    var numObjects = 0;
    $.each(lifes, function( index, value ){
        if(parseFloat(value) <= parseFloat(tamanhoMaximo)) {
            lifesMaximos[numObjects] = index;
            numObjects++;
        }
    });
    var quantidadeLifes = lifesMaximos.length;
    var elementoAleatorio = Math.floor((Math.random()*quantidadeLifes));
    return lifesMaximos[elementoAleatorio];
}

//criando fuel
function criaFuels(){
    //cria elemento linha
    var novaLinha = $('<div>').prependTo('#obstaculos').addClass('linha').css('margin-bottom','300px');
    //elementos
    var tamMax = palcoWidth;
    indexFuel = indexFuelAleatorio(tamMax);
    var inicioAletorio = Math.floor((Math.random()*tamMax))-fuels[indexFuel];
    if(inicioAletorio < 0) {
        inicioAletorio = 0;
    }
    tamMax = tamMax-inicioAletorio-fuels[indexFuel];
    if(tamMax >= 0) {
        $('#fuel'+indexFuel).clone().appendTo(novaLinha).css('margin-left',inicioAletorio);
    }
}

//escolhe elemento aleatorio com tamanho máximo
function indexFuelAleatorio(tamanhoMaximo){
    var numObjects = 0;
    $.each(fuels, function( index, value ){
        if(parseFloat(value) <= parseFloat(tamanhoMaximo)) {
            fuelsMaximos[numObjects] = index;
            numObjects++;
        }
    });
    var quantidadeFuels = fuelsMaximos.length;
    var elementoAleatorio = Math.floor((Math.random()*quantidadeFuels));
    return fuelsMaximos[elementoAleatorio];
}

//rolagem dos obstáculos
function rolagemObstaculos(){
    $('#obstaculos').animate({bottom:'-=10%'}, velocidade, 'linear');
}

//criando linhas de nuvens
function criaLinhaNuvens(quantidade){       
    //cria quantas linhas foram solicitadas
    for(var i=0; i<quantidade; i++) {
        //cria elemento linha
        var novaLinha = $('<div>').prependTo('#nuvens').addClass('linha');
        //elementos
        var primeiroElemento = true;
        var tamMax = palcoWidth;
        while(tamMax > 0) {
            indexNuvem = indexNuvemAleatorio(tamMax);
            if(primeiroElemento == true) {
                var inicioAletorio = Math.floor((Math.random()*(tamanhoPassagem+parseFloat(tamanhoPassagem*(25/100)))));
                tamMax = tamMax-inicioAletorio-clouds[indexNuvem];
                if(tamMax >= 0) {
                    $('#cloud'+indexNuvem).clone().appendTo(novaLinha).css('margin-left',inicioAletorio);
                }
                primeiroElemento = false;
            } else {
                tamMax = tamMax-tamanhoPassagem-clouds[indexNuvem];
                if(tamMax >= 0) {
                    $('#cloud'+indexNuvem).clone().appendTo(novaLinha).css('margin-left',tamanhoPassagem);
                }
            }        
        }
    }
}

//escolhe elemento aleatorio com tamanho máximo
function indexNuvemAleatorio(tamanhoMaximo){
    var numObjects = 0;
    $.each(clouds, function( index, value ){
        if(parseFloat(value) <= parseFloat(tamanhoMaximo)) {
            cloudsMaximos[numObjects] = index;
            numObjects++;
        }
    });
    var quantidadeClouds = cloudsMaximos.length;
    var elementoAleatorio = Math.floor((Math.random()*quantidadeClouds));
    return cloudsMaximos[elementoAleatorio];
}

//rolagem dos obstáculos
function rolagemNuvens(){
    $('#nuvens').animate({bottom:'-=15%'}, velocidade, 'linear');
}

//limpa objetos já passados
function limpaPalco(){
    //limpa palco
    var ultimaLinhaObj = $('#obstaculos').children('div.linha:last');
    if(ultimaLinhaObj.offset().top > palcoHeight) {
        var heightUltimaLinhaObj = ultimaLinhaObj.css('height');
        ultimaLinhaObj.css('height',heightUltimaLinhaObj).empty();
    }
    //limpa nuvens
    var ultimaLinhaNuvem = $('#nuvens').children('div.linha:last');
    if(ultimaLinhaNuvem.offset().top > palcoHeight) {
        var heightUltimaLinhaNuvens = ultimaLinhaNuvem.css('height');
        ultimaLinhaNuvem.css('height',heightUltimaLinhaNuvens).empty();
    }
}

function controleColisao(){
    $('.linha').each(function(){
        if($(this).offset().top >= 0 && $(this).offset().top < palcoHeight) {
            $(this).children('.object').each(function(){
                var objWidth = $(this).children('img').css('width').replace('px','');
                var objHeight = $(this).children('img').css('height').replace('px','');
                var obj_x1 = $(this).children('img').offset().left; 
                var obj_x2 = parseFloat(obj_x1)+parseFloat(objWidth);
                var obj_y1 = $(this).children('img').offset().top; 
                var obj_y2 = parseFloat(obj_y1)+parseFloat(objHeight);
                if($(this).attr('class') != "crash") {
                    if(parseFloat(obj_y2) > parseFloat(air_y1)) {
                        //caso batida na esquerda
                        if((parseFloat(obj_x2) > parseFloat(air_x1)) && (parseFloat(obj_x1) < parseFloat(air_x1)) && (parseFloat(obj_y2) <= parseFloat(air_y2))) {
                            colidiu($(this));                
                        }
                        //caso batida toda esquerda
                        else if((parseFloat(obj_x2) > parseFloat(air_x1)) && (parseFloat(obj_x1) < parseFloat(air_x1)) && (parseFloat(obj_y1) > parseFloat(air_y1))) {
                            colidiu($(this));                
                        }
                        //caso batida na direia
                        else if((parseFloat(obj_x2) > parseFloat(air_x2)) && (parseFloat(obj_x1) < parseFloat(air_x2)) && (parseFloat(obj_y2) <= parseFloat(air_y2))) {
                            colidiu($(this)); 
                        }
                        //caso batida toda direita
                        else if((parseFloat(obj_x2) > parseFloat(air_x2)) && (parseFloat(obj_x1) < parseFloat(air_x2)) && (parseFloat(obj_y1) > parseFloat(air_y1))) {
                            colidiu($(this));                
                        }
                        //caso batida em todo obstáculo
                        else if((parseFloat(obj_x2) < parseFloat(air_x2)) && (parseFloat(obj_x1) > parseFloat(air_x1)) && (parseFloat(obj_y2) < parseFloat(air_y2))) {
                            colidiu($(this)); 
                        }
                    }
                }
            }); 
        }
    })
}

function colidiu(elemento){
    //confere novamente se objato já não tinha sido atingido
    if(elemento.attr('class') != "crash") {
        //se for objeto comum
        if(elemento.attr('class') == "object") {
            elemento.addClass('crash');         
            varLife(-1);
            pontuacao(-20);
            //pisca avião
            $('#airplaneContent #airplaneImpact').css("display","block");
            setTimeout(function(){
                $('#airplaneContent #airplaneImpact').css("display","none");
            }, 1000);
            efeitosAirplane();
            return;
        }
        //se for life
        if(elemento.attr('class') == "object life") {
            varLife(1);
            pontuacao(10);
            elemento.addClass('crash');
            return;
        }
        //se for combustível
        if(elemento.attr('class') == "object fuel") {
            varFuel(10);
            pontuacao(10);
            elemento.addClass('crash');
            return;
        }
    }      
}

function pontuacao(valor){
    pontos = pontos + valor;
    if(pontos < 0) {
        pontos = 0;
    }
    exibePontuacao();
    //se perdeu pontos
    if(valor < 0) {
        exibePontuacaoNegativa(valor);
    }
}

function exibePontuacaoNegativa(valor){
    if(valor < 0) {
        var perdeuPonto = $('<div>').appendTo('#palco').addClass('pontoNegativo').html(valor);
        perdeuPonto.css('bottom','0px');
        perdeuPonto.animate({bottom:palcoHeight}, 2000, function(){
            perdeuPonto.remove();
        });
    }
}

function exibePontuacao(){
    $('#pontos').html(pontos+" Pontos");
}

function varCash(valor){
    cash = cash + valor;
    if(cash < 0) {
        cash = 0;
    }
    exibeCash();
}

function exibeCash(){
    $('#cash').html("$ "+cash+",00");
}

function varLife(valor){
    vidas = vidas + valor;
    if(vidas < 1) {
        gameOver(true);
    }
    if(vidas > 8) {
        vidas = 8;
    }
    efeitosAirplane();
    $('#vidas').empty();
    for(var i=1;i<=vidas;i++){
        $('<div>').prependTo('#vidas').addClass('vida').attr('id','vida_'+i);
    }    
}

function varFuel(valor){
    fuel = fuel + valor;
    if(fuel < 0) {
        fuel = 0;
    }
    if(fuel > 100) {
        fuel = 100;
    }
    if(fuel == 0) {
        desligaAviao();
    }
    exibeFuel();
}

function exibeFuel(){
    $('#barFuel').css("height",fuel+"%");
}

function gameOver(explode){  
    if(explode == true) {
        explodeAviao();
    }
    alert('GAME OVER - Você fez '+pontos+' pontos.');
    restart(false);
}