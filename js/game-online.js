var urlServerTerritorioInimigo = "http://www.corretorhelio.com/testes/territorioInimigo/_server";
var tempoSincronizacao = 3000; //a cada 3 segundos
var idSessaoServidor = "";
var ultimoIdServidorPecasTurno = "";
var ultimoIdServidorDadosTurno = "";
var ultimoIdServidorPecaRetiradaTurno = "";
var ultimoIdServidorMovimentacaoTurno = "";
var ultimoIdServidorCasasEPecasTurno = "";
var timerPecasTurno = "";
var timerDadosTurno = "";
var timerPecaRemovidaDoTurno = "";
var timerMovimentacaoDoTurno = "";
var timerCasasEPecasTurno = "";
var rodandoDadosEspelho = false;
var integridadeServidor = true;

$(function(){
    idSessaoServidor = getUrlVars()["sessao"];
    nomesDosJogadoresOnLine();
    sortesDoInicio();
});

function nomesDosJogadoresOnLine(){
    if(idSessaoServidor != undefined) {
        $.ajax({
            type: "GET",
            url: urlServerTerritorioInimigo + "/jogos/" + idSessaoServidor + "/jogador1.php?_=" + new Date().getTime(),
            success: function (data) {
                if(data != "") {
                    nomeJogadorVermelho = data;
                    $('.barraLateral.esquerda h2.timeA').html(nomeJogadorVermelho);
                }
            }
        });
        $.ajax({
            type: "GET",
            url: urlServerTerritorioInimigo + "/jogos/" + idSessaoServidor + "/jogador2.php?_=" + new Date().getTime(),
            success: function (data) {
                if(data != "") {
                    nomeJogadorAzul = data;
                    $('.barraLateral.direita h2.timeB').html(nomeJogadorAzul);
                }
            }
        });
    }
}

function sortesDoInicio(){
    if(idSessaoServidor != undefined) {
        $.ajax({
            type: "GET",
            url: urlServerTerritorioInimigo + "/jogos/" + idSessaoServidor + "/sorteInicial.php?_=" + new Date().getTime(),
            success: function (data) {
                if(data != "") {
                    arrayDados = data.split(',');
                    numeroDadoInicialJogador1 = arrayDados[0];
                    numeroDadoInicialJogador2 = arrayDados[1];
                    desafioSecretoJogador1 = arrayDados[2];
                    desafioSecretoJogador2 = arrayDados[3];
                    sincronizaServidor();
                }
            }
        }).error(function(){
            sortesDoInicio();
        });
    }
}

function enviaDadosServidor(tipo, numTurno){
    integridadeServidor = true;
    if(idSessaoServidor != undefined) {
        if(tipo === "pecasSelecionadasDoTurno") {
            $.ajax({
                method: "POST",
                url: urlServerTerritorioInimigo + "/pecasDoTurno.php",
                data: {sessao: idSessaoServidor, pecaAtaque: pecaSelecionadaCampoAtaque, pecaDefesa: pecaSelecionadaCampoDefesa, turno: numTurno}
            }).error(function(){
                enviaDadosServidor("pecasSelecionadasDoTurno", numTurno);
            }).done(function(){
                recebeDadosServidor("pecasSelecionadasDoTurno", numTurno, true);
                setTimeout(function(){
                    if(!integridadeServidor){
                        enviaDadosServidor("pecasSelecionadasDoTurno", numTurno);
                    }
                }, tempoSincronizacao);
            });
        } else if(tipo === "dadosDoTurno") {
            $.ajax({
                method: "POST",
                url: urlServerTerritorioInimigo + "/dadosDoTurno.php",
                data: {sessao: idSessaoServidor, dadoAtaque: numeroDadoAtaque, dadoDefesa: numeroDadoDefesa, tentativaAtaque: numTentativaAtaque, turno: numTurno}
            }).error(function(){
                enviaDadosServidor("dadosDoTurno");
            }).done(function(){
                recebeDadosServidor("dadosDoTurno", numTurno, true);
                setTimeout(function(){
                    if(!integridadeServidor){
                        enviaDadosServidor("dadosDoTurno", numTurno);
                    }
                }, tempoSincronizacao);
            });  
        } else if(tipo === "pecaRemovidaDoTurno") {
            $.ajax({
                method: "POST",
                url: urlServerTerritorioInimigo + "/pecaRemovidaDoTurno.php",
                data: {sessao: idSessaoServidor, pecaRetirada: ultimaPecaRetirada, turno: numTurno}
            }).error(function(){
                enviaDadosServidor("pecaRemovidaDoTurno", numTurno);
            }).done(function(){
                recebeDadosServidor("pecaRemovidaDoTurno", numTurno, true);
                setTimeout(function(){
                    if(!integridadeServidor){
                        enviaDadosServidor("pecaRemovidaDoTurno", numTurno);
                    }
                }, tempoSincronizacao);
            });
        } else if(tipo === "movimentacaoDoTurno") {
            $.ajax({
                method: "POST",
                url: urlServerTerritorioInimigo + "/movimentacaoDoTurno.php",
                data: {sessao: idSessaoServidor, pecaMovimentada: ultimaPecaMovimentada, campoDestinatario: ultimoCampoDestinatario, casaDestinataria: ultimaCasaDestinataria, ocupacaoCasa: ocupacaoUltimaCasaDestino, gasolinaTurno: gasolinaConsumidaTurno, turno: numTurno}
            }).error(function(){
                enviaDadosServidor("movimentacaoDoTurno", numTurno);
            }).done(function(){
                recebeDadosServidor("movimentacaoDoTurno", numTurno, true);
                setTimeout(function(){
                    if(!integridadeServidor){
                        enviaDadosServidor("movimentacaoDoTurno", numTurno);
                    }
                }, tempoSincronizacao);
            });
        } else if(tipo === "cancelaMovimentacaoDoTurno") {
            $.ajax({
                method: "POST",
                url: urlServerTerritorioInimigo + "/movimentacaoDoTurno.php",
                data: {sessao: idSessaoServidor, pecaMovimentada: 0, campoDestinatario: 0, casaDestinataria: 0, ocupacaoCasa: 0, turno: numTurno}
            }).error(function(){
                enviaDadosServidor("cancelaMovimentacaoDoTurno", numTurno);
            }).done(function(){
                recebeDadosServidor("cancelaMovimentacaoDoTurno", numTurno, true);
                setTimeout(function(){
                    if(!integridadeServidor){
                        enviaDadosServidor("cancelaMovimentacaoDoTurno", numTurno);
                    }
                }, tempoSincronizacao);
            });    
        } else if(tipo === "visaoGeralCasasEPecas") {
            $.ajax({
                method: "POST",
                url: urlServerTerritorioInimigo + "/casasEPecasTurno.php",
                data: {sessao: idSessaoServidor, casas: casas, pecas: pecas, turno: numTurno}
            }).error(function(){
                enviaDadosServidor("visaoGeralCasasEPecas", numTurno);
            }).done(function(){
                recebeDadosServidor("visaoGeralCasasEPecas", numTurno, true);
                setTimeout(function(){
                    if(!integridadeServidor){
                        enviaDadosServidor("visaoGeralCasasEPecas", numTurno);
                    }
                }, tempoSincronizacao);
            });
        }
    }
}

function recebeDadosServidor(tipo, numTurno, apenasVerificaArquivoServidor){
    
    if(idSessaoServidor != undefined) {
    
        if(tipo === "pecasSelecionadasDoTurno") {
            $.ajax({
                method: "POST",
                url: urlServerTerritorioInimigo + "/jogos/" + idSessaoServidor + "/pecasTurno_" + numTurno + ".php?_=" + new Date().getTime(),
                timeout: tempoSincronizacao,
                statusCode: {
                    200: function(data) {
                        if(!apenasVerificaArquivoServidor){
                            var arrayPecasSelecionadas = data.split(',');
                            if(ultimoIdServidorPecasTurno != arrayPecasSelecionadas[0]){
                                ultimoIdServidorPecasTurno = arrayPecasSelecionadas[0];
                                selecionaPecaParaTurno(arrayPecasSelecionadas[1], true);
                                selecionaPecaParaTurno(arrayPecasSelecionadas[2], true);
                                zeraBarrasLaterais();
                            }
                        }
                    },
                    404: function() {
                        integridadeServidor = false;
                        console.log("Arquivo das peças selecionadas do turno " + numTurno + " não está no servidor.");
                    }
                }
            });
        } else if(tipo === "dadosDoTurno") {
            if(pecaSelecionadaCampoAtaque != "" && pecaSelecionadaCampoDefesa != "" && rodandoDadosEspelho == false) {
                $.ajax({
                    method: "POST",
                    url: urlServerTerritorioInimigo + "/jogos/" + idSessaoServidor + "/dadosTurno_" + numTurno + ".php?_=" + new Date().getTime(),
                    timeout: tempoSincronizacao,
                    statusCode: {
                        200: function(data) {
                            if(!apenasVerificaArquivoServidor){
                                var arrayDadosTurno = data.split(',');
                                if(ultimoIdServidorDadosTurno != arrayDadosTurno[0]){
                                    ultimoIdServidorDadosTurno = arrayDadosTurno[0];
                                    rodandoDadosEspelho = true;
                                    numTentativaAtaque = arrayDadosTurno[1];
                                    numeroDadoAtaque = arrayDadosTurno[2];
                                    numeroDadoDefesa = arrayDadosTurno[3];
                                    rodaAtaque(true);
                                    setTimeout(function(){
                                        rodandoDadosEspelho = false;
                                    }, 4000);
                                }
                            }
                        },
                        404: function() {
                            integridadeServidor = false;
                            console.log("Arquivo dos dados do turno " + numTurno + " não está no servidor.");
                        }
                    }
                }); 
            }
        } else if(tipo === "pecaRemovidaDoTurno") {
            if(rodandoDadosEspelho == false) {
                $.ajax({
                    method: "POST",
                    url: urlServerTerritorioInimigo + "/jogos/" + idSessaoServidor + "/pecaRetiradaTurno_" + numTurno + ".php?_=" + new Date().getTime(),
                    timeout: tempoSincronizacao,
                    statusCode: {
                        200: function(data) {
                            if(!apenasVerificaArquivoServidor){
                                var arrayPecaRetiradaTurno = data.split(',');
                                if(ultimoIdServidorPecaRetiradaTurno != arrayPecaRetiradaTurno[0]){
                                    ultimoIdServidorPecaRetiradaTurno = arrayPecaRetiradaTurno[0];
                                    retiraPecaDoTabuleiro(arrayPecaRetiradaTurno[1], true);
                                }
                            }
                        },
                        404: function() {
                            integridadeServidor = false;
                            console.log("Arquivo da peça removida do turno " + numTurno + " não está no servidor.");
                        }
                    }
                });  
            }    
        } else if(tipo === "movimentacaoDoTurno") {
            if(rodandoDadosEspelho == false) {
                $.ajax({
                    method: "POST",
                    url: urlServerTerritorioInimigo + "/jogos/" + idSessaoServidor + "/movimentacaoTurno_" + numTurno + ".php?_=" + new Date().getTime(),
                    timeout: tempoSincronizacao,
                    statusCode: {
                        200: function(data) {
                            if(!apenasVerificaArquivoServidor){
                                var arrayMovimentacaoTurno = data.split(',');
                                if(ultimoIdServidorMovimentacaoTurno != arrayMovimentacaoTurno[0]){
                                    ultimoIdServidorMovimentacaoTurno = arrayMovimentacaoTurno[0];
                                    if(arrayMovimentacaoTurno[1] == 0 && arrayMovimentacaoTurno[2] == 0 && arrayMovimentacaoTurno[3] == 0 && arrayMovimentacaoTurno[4] == 0) {
                                        cancelaPossibilidadeDeMovimentacao(true);
                                    } else {
                                        gasolinaConsumidaTurno = arrayMovimentacaoTurno[5];
                                        gravaMovimentacaoPeca(arrayMovimentacaoTurno[1], arrayMovimentacaoTurno[2], arrayMovimentacaoTurno[3], arrayMovimentacaoTurno[4], true);
                                    }
                                }
                            }
                        },
                        404: function() {
                            integridadeServidor = false;
                            console.log("Arquivo da movimentação do turno " + numTurno + " não está no servidor.");
                        }
                    }
                });  
            }
        }
    
    }
}

function sincronizaServidor(){
    
    if(idSessaoServidor != undefined) {
    
        timerPecasTurno = setInterval(function() {
            if(fimDeJogo == false && vezDoPlayer == false) {
                recebeDadosServidor('pecasSelecionadasDoTurno', numDoTurno, false);
            }
        }, tempoSincronizacao);

        timerDadosTurno = setInterval(function() {
            if(fimDeJogo == false && vezDoPlayer == false) {
                recebeDadosServidor('dadosDoTurno', numDoTurno, false);
            }
        }, tempoSincronizacao);
        
        timerPecaRemovidaDoTurno = setInterval(function() {
            if(fimDeJogo == false && vezDoPlayer == false) {
                recebeDadosServidor('pecaRemovidaDoTurno', numDoTurno, false);
            }
        }, tempoSincronizacao);

        timerMovimentacaoDoTurno = setInterval(function() {
            if(fimDeJogo == false && vezDoPlayer == false) {
                recebeDadosServidor('movimentacaoDoTurno', numDoTurno, false);
            }
        }, tempoSincronizacao);

    }
    
}