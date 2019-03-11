var urlServerTerritorioInimigo = "http://www.corretorhelio.com/testes/ti/_server";
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

$(function(){
    idSessaoServidor = getUrlVars()["sessao"];
    nomesDosJogadoresOnLine();
    sortesDoInicio();
});

function nomesDosJogadoresOnLine(){
    if(idSessaoServidor != undefined) {
        $.ajax({
            type: "GET",
            url: urlServerTerritorioInimigo + "/jogos/" + idSessaoServidor + "/jogador1.txt?_=" + new Date().getTime(),
            success: function (data) {
                if(data != "") {
                    nomeJogadorVermelho = data;
                    $('.barraLateral.esquerda h2.timeA').html(nomeJogadorVermelho);
                }
            }
        });
        $.ajax({
            type: "GET",
            url: urlServerTerritorioInimigo + "/jogos/" + idSessaoServidor + "/jogador2.txt?_=" + new Date().getTime(),
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
            url: urlServerTerritorioInimigo + "/jogos/" + idSessaoServidor + "/sorteInicial.txt?_=" + new Date().getTime(),
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

function enviaDadosServidor(tipo){
    if(idSessaoServidor != undefined) {
        if(tipo === "pecasSelecionadasDoTurno") {
            $.ajax({
                method: "POST",
                url: urlServerTerritorioInimigo + "/pecasDoTurno.php",
                data: {sessao: idSessaoServidor, pecaAtaque: pecaSelecionadaCampoAtaque, pecaDefesa: pecaSelecionadaCampoDefesa, turno: numDoTurno}
            }).error(function(){
                enviaDadosServidor("pecasSelecionadasDoTurno");
            });
        } else if(tipo === "dadosDoTurno") {
            $.ajax({
                method: "POST",
                url: urlServerTerritorioInimigo + "/dadosDoTurno.php",
                data: {sessao: idSessaoServidor, dadoAtaque: numeroDadoAtaque, dadoDefesa: numeroDadoDefesa, tentativaAtaque: numTentativaAtaque, turno: numDoTurno}
            }).error(function(){
                enviaDadosServidor("dadosDoTurno");
            });  
        } else if(tipo === "pecaRemovidaDoTurno") {
            $.ajax({
                method: "POST",
                url: urlServerTerritorioInimigo + "/pecaRemovidaDoTurno.php",
                data: {sessao: idSessaoServidor, pecaRetirada: ultimaPecaRetirada, turno: numDoTurno}
            }).error(function(){
                enviaDadosServidor("pecaRemovidaDoTurno");
            });
        } else if(tipo === "movimentacaoDoTurno") {
            $.ajax({
                method: "POST",
                url: urlServerTerritorioInimigo + "/movimentacaoDoTurno.php",
                data: {sessao: idSessaoServidor, pecaMovimentada: ultimaPecaMovimentada, campoDestinatario: ultimoCampoDestinatario, casaDestinataria: ultimaCasaDestinataria, ocupacaoCasa: ocupacaoUltimaCasaDestino, gasolinaTurno: gasolinaConsumidaTurno, turno: numDoTurno}
            }).error(function(){
                enviaDadosServidor("movimentacaoDoTurno");
            });
        } else if(tipo === "cancelaMovimentacaoDoTurno") {
            $.ajax({
                method: "POST",
                url: urlServerTerritorioInimigo + "/movimentacaoDoTurno.php",
                data: {sessao: idSessaoServidor, pecaMovimentada: 0, campoDestinatario: 0, casaDestinataria: 0, ocupacaoCasa: 0, turno: numDoTurno}
            }).error(function(){
                enviaDadosServidor("cancelaMovimentacaoDoTurno");
            });    
        } else if(tipo === "visaoGeralCasasEPecas") {
            $.ajax({
                method: "POST",
                url: urlServerTerritorioInimigo + "/casasEPecasTurno.php",
                data: {sessao: idSessaoServidor, casas: casas, pecas: pecas, turno: numDoTurno}
            }).error(function(){
                enviaDadosServidor("visaoGeralCasasEPecas");
            });
        }
    }
}

function recebeDadosServidor(tipo){
    
    if(idSessaoServidor != undefined) {
    
        if(tipo === "pecasSelecionadasDoTurno") {
            $.ajax({
                method: "POST",
                url: urlServerTerritorioInimigo + "/jogos/" + idSessaoServidor + "/pecasTurno_" + numDoTurno + ".txt?_=" + new Date().getTime(),
                timeout: tempoSincronizacao,
                statusCode: {
                    200: function(data) {
                        var arrayPecasSelecionadas = data.split(',');
                        if(ultimoIdServidorPecasTurno != arrayPecasSelecionadas[0]){
                            ultimoIdServidorPecasTurno = arrayPecasSelecionadas[0];
                            selecionaPecaParaTurno(arrayPecasSelecionadas[1], true);
                            selecionaPecaParaTurno(arrayPecasSelecionadas[2], true);
                            zeraBarrasLaterais();
                        }
                    }
                }
            });
        } else if(tipo === "dadosDoTurno") {
            if(pecaSelecionadaCampoAtaque != "" && pecaSelecionadaCampoDefesa != "" && rodandoDadosEspelho == false) {
                $.ajax({
                    method: "POST",
                    url: urlServerTerritorioInimigo + "/jogos/" + idSessaoServidor + "/dadosTurno_" + numDoTurno + ".txt?_=" + new Date().getTime(),
                    timeout: tempoSincronizacao,
                    statusCode: {
                        200: function(data) {
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
                    }
                }); 
            }
        } else if(tipo === "pecaRemovidaDoTurno") {
            if(rodandoDadosEspelho == false) {
                $.ajax({
                    method: "POST",
                    url: urlServerTerritorioInimigo + "/jogos/" + idSessaoServidor + "/pecaRetiradaTurno_" + numDoTurno + ".txt?_=" + new Date().getTime(),
                    timeout: tempoSincronizacao,
                    statusCode: {
                        200: function(data) {
                            var arrayPecaRetiradaTurno = data.split(',');
                            if(ultimoIdServidorPecaRetiradaTurno != arrayPecaRetiradaTurno[0]){
                                ultimoIdServidorPecaRetiradaTurno = arrayPecaRetiradaTurno[0];
                                retiraPecaDoTabuleiro(arrayPecaRetiradaTurno[1], true);
                            }
                        }
                    }
                });  
            }    
        } else if(tipo === "movimentacaoDoTurno") {
            if(rodandoDadosEspelho == false) {
                $.ajax({
                    method: "POST",
                    url: urlServerTerritorioInimigo + "/jogos/" + idSessaoServidor + "/movimentacaoTurno_" + numDoTurno + ".txt?_=" + new Date().getTime(),
                    timeout: tempoSincronizacao,
                    statusCode: {
                        200: function(data) {
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
                    }
                });  
            }
        } else if(tipo === "visaoGeralCasasEPecas") {
            $.ajax({
                type: "GET",
                url: urlServerTerritorioInimigo + "/jogos/" + idSessaoServidor + "/casasEPecasTurno_" + numDoTurno + ".xml?_=" + new Date().getTime(),
                dataType: "xml",
                timeout: tempoSincronizacao,
                statusCode: {
                    200: function(xml) {
                        console.log($(xml).find('idUnico').text());
                        if($(xml).find('idUnico').text() != ultimoIdServidorCasasEPecasTurno) {
                            ultimoIdServidorCasasEPecasTurno = $(xml).find('idUnico').text();
                            clearInterval(timerCasasEPecasTurno);
                            //atualiza casas
                            casas['campo-cima']['a1'].ocupacao1  = $(xml).find('casas').find('campo-cima').find('a1').children('ocupacao1').text();
                            casas['campo-cima']['a1'].ocupacao2  = $(xml).find('casas').find('campo-cima').find('a1').children('ocupacao2').text();
                            casas['campo-cima']['a2'].ocupacao1  = $(xml).find('casas').find('campo-cima').find('a2').children('ocupacao1').text();
                            casas['campo-cima']['a2'].ocupacao2  = $(xml).find('casas').find('campo-cima').find('a2').children('ocupacao2').text();
                            casas['campo-cima']['a3'].ocupacao1  = $(xml).find('casas').find('campo-cima').find('a3').children('ocupacao1').text();
                            casas['campo-cima']['a3'].ocupacao2  = $(xml).find('casas').find('campo-cima').find('a3').children('ocupacao2').text();
                            casas['campo-cima']['a4'].ocupacao1  = $(xml).find('casas').find('campo-cima').find('a4').children('ocupacao1').text();
                            casas['campo-cima']['a4'].ocupacao2  = $(xml).find('casas').find('campo-cima').find('a4').children('ocupacao2').text();
                            casas['campo-cima']['a5'].ocupacao1  = $(xml).find('casas').find('campo-cima').find('a5').children('ocupacao1').text();
                            casas['campo-cima']['a5'].ocupacao2  = $(xml).find('casas').find('campo-cima').find('a5').children('ocupacao2').text();
                            casas['campo-baixo']['a6'].ocupacao1  = $(xml).find('casas').find('campo-baixo').find('a6').children('ocupacao1').text();
                            casas['campo-baixo']['a6'].ocupacao2  = $(xml).find('casas').find('campo-baixo').find('a6').children('ocupacao2').text();
                            casas['campo-baixo']['a7'].ocupacao1  = $(xml).find('casas').find('campo-baixo').find('a7').children('ocupacao1').text();
                            casas['campo-baixo']['a7'].ocupacao2  = $(xml).find('casas').find('campo-baixo').find('a7').children('ocupacao2').text();
                            casas['campo-baixo']['a8'].ocupacao1  = $(xml).find('casas').find('campo-baixo').find('a8').children('ocupacao1').text();
                            casas['campo-baixo']['a8'].ocupacao2  = $(xml).find('casas').find('campo-baixo').find('a8').children('ocupacao2').text();
                            casas['campo-baixo']['a9'].ocupacao1  = $(xml).find('casas').find('campo-baixo').find('a9').children('ocupacao1').text();
                            casas['campo-baixo']['a9'].ocupacao2  = $(xml).find('casas').find('campo-baixo').find('a9').children('ocupacao2').text();
                            casas['campo-baixo']['a10'].ocupacao1 = $(xml).find('casas').find('campo-baixo').find('a10').children('ocupacao1').text();
                            casas['campo-baixo']['a10'].ocupacao2 = $(xml).find('casas').find('campo-baixo').find('a10').children('ocupacao2').text();

                            casas['campo-cima']['b1'].ocupacao1  = $(xml).find('casas').find('campo-cima').find('b1').children('ocupacao1').text();
                            casas['campo-cima']['b1'].ocupacao2  = $(xml).find('casas').find('campo-cima').find('b1').children('ocupacao2').text();
                            casas['campo-cima']['b2'].ocupacao1  = $(xml).find('casas').find('campo-cima').find('b2').children('ocupacao1').text();
                            casas['campo-cima']['b2'].ocupacao2  = $(xml).find('casas').find('campo-cima').find('b2').children('ocupacao2').text();
                            casas['campo-cima']['b3'].ocupacao1  = $(xml).find('casas').find('campo-cima').find('b3').children('ocupacao1').text();
                            casas['campo-cima']['b3'].ocupacao2  = $(xml).find('casas').find('campo-cima').find('b3').children('ocupacao2').text();
                            casas['campo-cima']['b4'].ocupacao1  = $(xml).find('casas').find('campo-cima').find('b4').children('ocupacao1').text();
                            casas['campo-cima']['b4'].ocupacao2  = $(xml).find('casas').find('campo-cima').find('b4').children('ocupacao2').text();
                            casas['campo-cima']['b5'].ocupacao1  = $(xml).find('casas').find('campo-cima').find('b5').children('ocupacao1').text();
                            casas['campo-cima']['b5'].ocupacao2  = $(xml).find('casas').find('campo-cima').find('b5').children('ocupacao2').text();
                            casas['campo-baixo']['b6'].ocupacao1  = $(xml).find('casas').find('campo-baixo').find('b6').children('ocupacao1').text();
                            casas['campo-baixo']['b6'].ocupacao2  = $(xml).find('casas').find('campo-baixo').find('b6').children('ocupacao2').text();
                            casas['campo-baixo']['b7'].ocupacao1  = $(xml).find('casas').find('campo-baixo').find('b7').children('ocupacao1').text();
                            casas['campo-baixo']['b7'].ocupacao2  = $(xml).find('casas').find('campo-baixo').find('b7').children('ocupacao2').text();
                            casas['campo-baixo']['b8'].ocupacao1  = $(xml).find('casas').find('campo-baixo').find('b8').children('ocupacao1').text();
                            casas['campo-baixo']['b8'].ocupacao2  = $(xml).find('casas').find('campo-baixo').find('b8').children('ocupacao2').text();
                            casas['campo-baixo']['b9'].ocupacao1  = $(xml).find('casas').find('campo-baixo').find('b9').children('ocupacao1').text();
                            casas['campo-baixo']['b9'].ocupacao2  = $(xml).find('casas').find('campo-baixo').find('b9').children('ocupacao2').text();
                            casas['campo-baixo']['b10'].ocupacao1 = $(xml).find('casas').find('campo-baixo').find('b10').children('ocupacao1').text();
                            casas['campo-baixo']['b10'].ocupacao2 = $(xml).find('casas').find('campo-baixo').find('b10').children('ocupacao2').text();

                            casas['campo-cima']['c1'].ocupacao1  = $(xml).find('casas').find('campo-cima').find('c1').children('ocupacao1').text();
                            casas['campo-cima']['c1'].ocupacao2  = $(xml).find('casas').find('campo-cima').find('c1').children('ocupacao2').text();
                            casas['campo-cima']['c2'].ocupacao1  = $(xml).find('casas').find('campo-cima').find('c2').children('ocupacao1').text();
                            casas['campo-cima']['c2'].ocupacao2  = $(xml).find('casas').find('campo-cima').find('c2').children('ocupacao2').text();
                            casas['campo-cima']['c3'].ocupacao1  = $(xml).find('casas').find('campo-cima').find('c3').children('ocupacao1').text();
                            casas['campo-cima']['c3'].ocupacao2  = $(xml).find('casas').find('campo-cima').find('c3').children('ocupacao2').text();
                            casas['campo-cima']['c4'].ocupacao1  = $(xml).find('casas').find('campo-cima').find('c4').children('ocupacao1').text();
                            casas['campo-cima']['c4'].ocupacao2  = $(xml).find('casas').find('campo-cima').find('c4').children('ocupacao2').text();
                            casas['campo-cima']['c5'].ocupacao1  = $(xml).find('casas').find('campo-cima').find('c5').children('ocupacao1').text();
                            casas['campo-cima']['c5'].ocupacao2  = $(xml).find('casas').find('campo-cima').find('c5').children('ocupacao2').text();
                            casas['campo-baixo']['c6'].ocupacao1  = $(xml).find('casas').find('campo-baixo').find('c6').children('ocupacao1').text();
                            casas['campo-baixo']['c6'].ocupacao2  = $(xml).find('casas').find('campo-baixo').find('c6').children('ocupacao2').text();
                            casas['campo-baixo']['c7'].ocupacao1  = $(xml).find('casas').find('campo-baixo').find('c7').children('ocupacao1').text();
                            casas['campo-baixo']['c7'].ocupacao2  = $(xml).find('casas').find('campo-baixo').find('c7').children('ocupacao2').text();
                            casas['campo-baixo']['c8'].ocupacao1  = $(xml).find('casas').find('campo-baixo').find('c8').children('ocupacao1').text();
                            casas['campo-baixo']['c8'].ocupacao2  = $(xml).find('casas').find('campo-baixo').find('c8').children('ocupacao2').text();
                            casas['campo-baixo']['c9'].ocupacao1  = $(xml).find('casas').find('campo-baixo').find('c9').children('ocupacao1').text();
                            casas['campo-baixo']['c9'].ocupacao2  = $(xml).find('casas').find('campo-baixo').find('c9').children('ocupacao2').text();
                            casas['campo-baixo']['c10'].ocupacao1 = $(xml).find('casas').find('campo-baixo').find('c10').children('ocupacao1').text();
                            casas['campo-baixo']['c10'].ocupacao2 = $(xml).find('casas').find('campo-baixo').find('c10').children('ocupacao2').text();

                            casas['campo-cima']['d1'].ocupacao1  = $(xml).find('casas').find('campo-cima').find('d1').children('ocupacao1').text();
                            casas['campo-cima']['d1'].ocupacao2  = $(xml).find('casas').find('campo-cima').find('d1').children('ocupacao2').text();
                            casas['campo-cima']['d2'].ocupacao1  = $(xml).find('casas').find('campo-cima').find('d2').children('ocupacao1').text();
                            casas['campo-cima']['d2'].ocupacao2  = $(xml).find('casas').find('campo-cima').find('d2').children('ocupacao2').text();
                            casas['campo-cima']['d3'].ocupacao1  = $(xml).find('casas').find('campo-cima').find('d3').children('ocupacao1').text();
                            casas['campo-cima']['d3'].ocupacao2  = $(xml).find('casas').find('campo-cima').find('d3').children('ocupacao2').text();
                            casas['campo-cima']['d4'].ocupacao1  = $(xml).find('casas').find('campo-cima').find('d4').children('ocupacao1').text();
                            casas['campo-cima']['d4'].ocupacao2  = $(xml).find('casas').find('campo-cima').find('d4').children('ocupacao2').text();
                            casas['campo-cima']['d5'].ocupacao1  = $(xml).find('casas').find('campo-cima').find('d5').children('ocupacao1').text();
                            casas['campo-cima']['d5'].ocupacao2  = $(xml).find('casas').find('campo-cima').find('d5').children('ocupacao2').text();
                            casas['campo-baixo']['d6'].ocupacao1  = $(xml).find('casas').find('campo-baixo').find('d6').children('ocupacao1').text();
                            casas['campo-baixo']['d6'].ocupacao2  = $(xml).find('casas').find('campo-baixo').find('d6').children('ocupacao2').text();
                            casas['campo-baixo']['d7'].ocupacao1  = $(xml).find('casas').find('campo-baixo').find('d7').children('ocupacao1').text();
                            casas['campo-baixo']['d7'].ocupacao2  = $(xml).find('casas').find('campo-baixo').find('d7').children('ocupacao2').text();
                            casas['campo-baixo']['d8'].ocupacao1  = $(xml).find('casas').find('campo-baixo').find('d8').children('ocupacao1').text();
                            casas['campo-baixo']['d8'].ocupacao2  = $(xml).find('casas').find('campo-baixo').find('d8').children('ocupacao2').text();
                            casas['campo-baixo']['d9'].ocupacao1  = $(xml).find('casas').find('campo-baixo').find('d9').children('ocupacao1').text();
                            casas['campo-baixo']['d9'].ocupacao2  = $(xml).find('casas').find('campo-baixo').find('d9').children('ocupacao2').text();
                            casas['campo-baixo']['d10'].ocupacao1 = $(xml).find('casas').find('campo-baixo').find('d10').children('ocupacao1').text();
                            casas['campo-baixo']['d10'].ocupacao2 = $(xml).find('casas').find('campo-baixo').find('d10').children('ocupacao2').text();

                            casas['campo-cima']['e1'].ocupacao1  = $(xml).find('casas').find('campo-cima').find('e1').children('ocupacao1').text();
                            casas['campo-cima']['e1'].ocupacao2  = $(xml).find('casas').find('campo-cima').find('e1').children('ocupacao2').text();
                            casas['campo-cima']['e2'].ocupacao1  = $(xml).find('casas').find('campo-cima').find('e2').children('ocupacao1').text();
                            casas['campo-cima']['e2'].ocupacao2  = $(xml).find('casas').find('campo-cima').find('e2').children('ocupacao2').text();
                            casas['campo-cima']['e3'].ocupacao1  = $(xml).find('casas').find('campo-cima').find('e3').children('ocupacao1').text();
                            casas['campo-cima']['e3'].ocupacao2  = $(xml).find('casas').find('campo-cima').find('e3').children('ocupacao2').text();
                            casas['campo-cima']['e4'].ocupacao1  = $(xml).find('casas').find('campo-cima').find('e4').children('ocupacao1').text();
                            casas['campo-cima']['e4'].ocupacao2  = $(xml).find('casas').find('campo-cima').find('e4').children('ocupacao2').text();
                            casas['campo-cima']['e5'].ocupacao1  = $(xml).find('casas').find('campo-cima').find('e5').children('ocupacao1').text();
                            casas['campo-cima']['e5'].ocupacao2  = $(xml).find('casas').find('campo-cima').find('e5').children('ocupacao2').text();
                            casas['campo-baixo']['e6'].ocupacao1  = $(xml).find('casas').find('campo-baixo').find('e6').children('ocupacao1').text();
                            casas['campo-baixo']['e6'].ocupacao2  = $(xml).find('casas').find('campo-baixo').find('e6').children('ocupacao2').text();
                            casas['campo-baixo']['e7'].ocupacao1  = $(xml).find('casas').find('campo-baixo').find('e7').children('ocupacao1').text();
                            casas['campo-baixo']['e7'].ocupacao2  = $(xml).find('casas').find('campo-baixo').find('e7').children('ocupacao2').text();
                            casas['campo-baixo']['e8'].ocupacao1  = $(xml).find('casas').find('campo-baixo').find('e8').children('ocupacao1').text();
                            casas['campo-baixo']['e8'].ocupacao2  = $(xml).find('casas').find('campo-baixo').find('e8').children('ocupacao2').text();
                            casas['campo-baixo']['e9'].ocupacao1  = $(xml).find('casas').find('campo-baixo').find('e9').children('ocupacao1').text();
                            casas['campo-baixo']['e9'].ocupacao2  = $(xml).find('casas').find('campo-baixo').find('e9').children('ocupacao2').text();
                            casas['campo-baixo']['e10'].ocupacao1 = $(xml).find('casas').find('campo-baixo').find('e10').children('ocupacao1').text();
                            casas['campo-baixo']['e10'].ocupacao2 = $(xml).find('casas').find('campo-baixo').find('e10').children('ocupacao2').text();

                            casas['campo-cima']['f1'].ocupacao1  = $(xml).find('casas').find('campo-cima').find('f1').children('ocupacao1').text();
                            casas['campo-cima']['f1'].ocupacao2  = $(xml).find('casas').find('campo-cima').find('f1').children('ocupacao2').text();
                            casas['campo-cima']['f2'].ocupacao1  = $(xml).find('casas').find('campo-cima').find('f2').children('ocupacao1').text();
                            casas['campo-cima']['f2'].ocupacao2  = $(xml).find('casas').find('campo-cima').find('f2').children('ocupacao2').text();
                            casas['campo-cima']['f3'].ocupacao1  = $(xml).find('casas').find('campo-cima').find('f3').children('ocupacao1').text();
                            casas['campo-cima']['f3'].ocupacao2  = $(xml).find('casas').find('campo-cima').find('f3').children('ocupacao2').text();
                            casas['campo-cima']['f4'].ocupacao1  = $(xml).find('casas').find('campo-cima').find('f4').children('ocupacao1').text();
                            casas['campo-cima']['f4'].ocupacao2  = $(xml).find('casas').find('campo-cima').find('f4').children('ocupacao2').text();
                            casas['campo-cima']['f5'].ocupacao1  = $(xml).find('casas').find('campo-cima').find('f5').children('ocupacao1').text();
                            casas['campo-cima']['f5'].ocupacao2  = $(xml).find('casas').find('campo-cima').find('f5').children('ocupacao2').text();
                            casas['campo-baixo']['f6'].ocupacao1  = $(xml).find('casas').find('campo-baixo').find('f6').children('ocupacao1').text();
                            casas['campo-baixo']['f6'].ocupacao2  = $(xml).find('casas').find('campo-baixo').find('f6').children('ocupacao2').text();
                            casas['campo-baixo']['f7'].ocupacao1  = $(xml).find('casas').find('campo-baixo').find('f7').children('ocupacao1').text();
                            casas['campo-baixo']['f7'].ocupacao2  = $(xml).find('casas').find('campo-baixo').find('f7').children('ocupacao2').text();
                            casas['campo-baixo']['f8'].ocupacao1  = $(xml).find('casas').find('campo-baixo').find('f8').children('ocupacao1').text();
                            casas['campo-baixo']['f8'].ocupacao2  = $(xml).find('casas').find('campo-baixo').find('f8').children('ocupacao2').text();
                            casas['campo-baixo']['f9'].ocupacao1  = $(xml).find('casas').find('campo-baixo').find('f9').children('ocupacao1').text();
                            casas['campo-baixo']['f9'].ocupacao2  = $(xml).find('casas').find('campo-baixo').find('f9').children('ocupacao2').text();
                            casas['campo-baixo']['f10'].ocupacao1 = $(xml).find('casas').find('campo-baixo').find('f10').children('ocupacao1').text();
                            casas['campo-baixo']['f10'].ocupacao2 = $(xml).find('casas').find('campo-baixo').find('f10').children('ocupacao2').text();

                            casas['campo-cima']['g1'].ocupacao1  = $(xml).find('casas').find('campo-cima').find('g1').children('ocupacao1').text();
                            casas['campo-cima']['g1'].ocupacao2  = $(xml).find('casas').find('campo-cima').find('g1').children('ocupacao2').text();
                            casas['campo-cima']['g2'].ocupacao1  = $(xml).find('casas').find('campo-cima').find('g2').children('ocupacao1').text();
                            casas['campo-cima']['g2'].ocupacao2  = $(xml).find('casas').find('campo-cima').find('g2').children('ocupacao2').text();
                            casas['campo-cima']['g3'].ocupacao1  = $(xml).find('casas').find('campo-cima').find('g3').children('ocupacao1').text();
                            casas['campo-cima']['g3'].ocupacao2  = $(xml).find('casas').find('campo-cima').find('g3').children('ocupacao2').text();
                            casas['campo-cima']['g4'].ocupacao1  = $(xml).find('casas').find('campo-cima').find('g4').children('ocupacao1').text();
                            casas['campo-cima']['g4'].ocupacao2  = $(xml).find('casas').find('campo-cima').find('g4').children('ocupacao2').text();
                            casas['campo-cima']['g5'].ocupacao1  = $(xml).find('casas').find('campo-cima').find('g5').children('ocupacao1').text();
                            casas['campo-cima']['g5'].ocupacao2  = $(xml).find('casas').find('campo-cima').find('g5').children('ocupacao2').text();
                            casas['campo-baixo']['g6'].ocupacao1  = $(xml.find('casas').find('campo-baixo')).find('g6').children('ocupacao1').text();
                            casas['campo-baixo']['g6'].ocupacao2  = $(xml).find('casas').find('campo-baixo').find('g6').children('ocupacao2').text();
                            casas['campo-baixo']['g7'].ocupacao1  = $(xml).find('casas').find('campo-baixo').find('g7').children('ocupacao1').text();
                            casas['campo-baixo']['g7'].ocupacao2  = $(xml).find('casas').find('campo-baixo').find('g7').children('ocupacao2').text();
                            casas['campo-baixo']['g8'].ocupacao1  = $(xml).find('casas').find('campo-baixo').find('g8').children('ocupacao1').text();
                            casas['campo-baixo']['g8'].ocupacao2  = $(xml).find('casas').find('campo-baixo').find('g8').children('ocupacao2').text();
                            casas['campo-baixo']['g9'].ocupacao1  = $(xml).find('casas').find('campo-baixo').find('g9').children('ocupacao1').text();
                            casas['campo-baixo']['g9'].ocupacao2  = $(xml).find('casas').find('campo-baixo').find('g9').children('ocupacao2').text();
                            casas['campo-baixo']['g10'].ocupacao1 = $(xml).find('casas').find('campo-baixo').find('g10').children('ocupacao1').text();
                            casas['campo-baixo']['g10'].ocupacao2 = $(xml).find('casas').find('campo-baixo').find('g10').children('ocupacao2').text();

                            //atualiza pecas
                            pecas['revolver1CampoCima'].campoAtual = $(xml).find('pecas').find('revolver1CampoCima').children('campoAtual').text();
                            pecas['revolver1CampoCima'].casaAtual = $(xml).find('pecas').find('revolver1CampoCima').children('casaAtual').text();
                            pecas['revolver2CampoCima'].campoAtual = $(xml).find('pecas').find('revolver2CampoCima').children('campoAtual').text();
                            pecas['revolver2CampoCima'].casaAtual = $(xml).find('pecas').find('revolver2CampoCima').children('casaAtual').text();
                            pecas['revolver3CampoCima'].campoAtual = $(xml).find('pecas').find('revolver3CampoCima').children('campoAtual').text();
                            pecas['revolver3CampoCima'].casaAtual = $(xml).find('pecas').find('revolver3CampoCima').children('casaAtual').text();
                            pecas['revolver4CampoCima'].campoAtual = $(xml).find('pecas').find('revolver4CampoCima').children('campoAtual').text();
                            pecas['revolver4CampoCima'].casaAtual = $(xml).find('pecas').find('revolver4CampoCima').children('casaAtual').text();
                            pecas['revolver1CampoBaixo'].campoAtual = $(xml).find('pecas').find('revolver1CampoBaixo').children('campoAtual').text();
                            pecas['revolver1CampoBaixo'].casaAtual = $(xml).find('pecas').find('revolver1CampoBaixo').children('casaAtual').text();
                            pecas['revolver2CampoBaixo'].campoAtual = $(xml).find('pecas').find('revolver2CampoBaixo').children('campoAtual').text();
                            pecas['revolver2CampoBaixo'].casaAtual = $(xml).find('pecas').find('revolver2CampoBaixo').children('casaAtual').text();
                            pecas['revolver3CampoBaixo'].campoAtual = $(xml).find('pecas').find('revolver3CampoBaixo').children('campoAtual').text();
                            pecas['revolver3CampoBaixo'].casaAtual = $(xml).find('pecas').find('revolver3CampoBaixo').children('casaAtual').text();
                            pecas['revolver4CampoBaixo'].campoAtual = $(xml).find('pecas').find('revolver4CampoBaixo').children('campoAtual').text();
                            pecas['revolver4CampoBaixo'].casaAtual = $(xml).find('pecas').find('revolver4CampoBaixo').children('casaAtual').text();
                            pecas['metralhadora1CampoCima'].campoAtual = $(xml).find('pecas').find('metralhadora1CampoCima').children('campoAtual').text();
                            pecas['metralhadora1CampoCima'].casaAtual = $(xml).find('pecas').find('metralhadora1CampoCima').children('casaAtual').text();
                            pecas['metralhadora2CampoCima'].campoAtual = $(xml).find('pecas').find('metralhadora2CampoCima').children('campoAtual').text();
                            pecas['metralhadora2CampoCima'].casaAtual = $(xml).find('pecas').find('metralhadora2CampoCima').children('casaAtual').text();
                            pecas['metralhadora3CampoCima'].campoAtual = $(xml).find('pecas').find('metralhadora3CampoCima').children('campoAtual').text();
                            pecas['metralhadora3CampoCima'].casaAtual = $(xml).find('pecas').find('metralhadora3CampoCima').children('casaAtual').text();
                            pecas['metralhadora1CampoBaixo'].campoAtual = $(xml).find('pecas').find('metralhadora1CampoBaixo').children('campoAtual').text();
                            pecas['metralhadora1CampoBaixo'].casaAtual = $(xml).find('pecas').find('metralhadora1CampoBaixo').children('casaAtual').text();
                            pecas['metralhadora2CampoBaixo'].campoAtual = $(xml).find('pecas').find('metralhadora2CampoBaixo').children('campoAtual').text();
                            pecas['metralhadora2CampoBaixo'].casaAtual = $(xml).find('pecas').find('metralhadora2CampoBaixo').children('casaAtual').text();
                            pecas['metralhadora3CampoBaixo'].campoAtual = $(xml).find('pecas').find('metralhadora3CampoBaixo').children('campoAtual').text();
                            pecas['metralhadora3CampoBaixo'].casaAtual = $(xml).find('pecas').find('metralhadora3CampoBaixo').children('casaAtual').text();
                            pecas['granada1CampoCima'].campoAtual = $(xml).find('pecas').find('granada1CampoCima').children('campoAtual').text();
                            pecas['granada1CampoCima'].casaAtual = $(xml).find('pecas').find('granada1CampoCima').children('casaAtual').text();
                            pecas['granada2CampoCima'].campoAtual = $(xml).find('pecas').find('granada2CampoCima').children('campoAtual').text();
                            pecas['granada2CampoCima'].casaAtual = $(xml).find('pecas').find('granada2CampoCima').children('casaAtual').text();
                            pecas['granada3CampoCima'].campoAtual = $(xml).find('pecas').find('granada3CampoCima').children('campoAtual').text();
                            pecas['granada3CampoCima'].casaAtual = $(xml).find('pecas').find('granada3CampoCima').children('casaAtual').text();
                            pecas['granada4CampoCima'].campoAtual = $(xml).find('pecas').find('granada4CampoCima').children('campoAtual').text();
                            pecas['granada4CampoCima'].casaAtual = $(xml).find('pecas').find('granada4CampoCima').children('casaAtual').text();
                            pecas['granada1CampoBaixo'].campoAtual = $(xml).find('pecas').find('granada1CampoBaixo').children('campoAtual').text();
                            pecas['granada1CampoBaixo'].casaAtual = $(xml).find('pecas').find('granada1CampoBaixo').children('casaAtual').text();
                            pecas['granada2CampoBaixo'].campoAtual = $(xml).find('pecas').find('granada2CampoBaixo').children('campoAtual').text();
                            pecas['granada2CampoBaixo'].casaAtual = $(xml).find('pecas').find('granada2CampoBaixo').children('casaAtual').text();
                            pecas['granada3CampoBaixo'].campoAtual = $(xml).find('pecas').find('granada3CampoBaixo').children('campoAtual').text();
                            pecas['granada3CampoBaixo'].casaAtual = $(xml).find('pecas').find('granada3CampoBaixo').children('casaAtual').text();
                            pecas['granada4CampoBaixo'].campoAtual = $(xml).find('pecas').find('granada4CampoBaixo').children('campoAtual').text();
                            pecas['granada4CampoBaixo'].casaAtual = $(xml).find('pecas').find('granada4CampoBaixo').children('casaAtual').text();
                            pecas['sniper1CampoCima'].campoAtual = $(xml).find('pecas').find('sniper1CampoCima').children('campoAtual').text();
                            pecas['sniper1CampoCima'].casaAtual = $(xml).find('pecas').find('sniper1CampoCima').children('casaAtual').text();
                            pecas['sniper2CampoCima'].campoAtual = $(xml).find('pecas').find('sniper2CampoCima').children('campoAtual').text();
                            pecas['sniper2CampoCima'].casaAtual = $(xml).find('pecas').find('sniper2CampoCima').children('casaAtual').text();
                            pecas['sniper1CampoBaixo'].campoAtual = $(xml).find('pecas').find('sniper1CampoBaixo').children('campoAtual').text();
                            pecas['sniper1CampoBaixo'].casaAtual = $(xml).find('pecas').find('sniper1CampoBaixo').children('casaAtual').text();
                            pecas['sniper2CampoBaixo'].campoAtual = $(xml).find('pecas').find('sniper2CampoBaixo').children('campoAtual').text();
                            pecas['sniper2CampoBaixo'].casaAtual = $(xml).find('pecas').find('sniper2CampoBaixo').children('casaAtual').text();
                            pecas['tanque1CampoCima'].campoAtual = $(xml).find('pecas').find('tanque1CampoCima').children('campoAtual').text();
                            pecas['tanque1CampoCima'].casaAtual = $(xml).find('pecas').find('tanque1CampoCima').children('casaAtual').text();
                            pecas['tanque2CampoCima'].campoAtual = $(xml).find('pecas').find('tanque2CampoCima').children('campoAtual').text();
                            pecas['tanque2CampoCima'].casaAtual = $(xml).find('pecas').find('tanque2CampoCima').children('casaAtual').text();
                            pecas['tanque1CampoBaixo'].campoAtual = $(xml).find('pecas').find('tanque1CampoBaixo').children('campoAtual').text();
                            pecas['tanque1CampoBaixo'].casaAtual = $(xml).find('pecas').find('tanque1CampoBaixo').children('casaAtual').text();
                            pecas['tanque2CampoBaixo'].campoAtual = $(xml).find('pecas').find('tanque2CampoBaixo').children('campoAtual').text();
                            pecas['tanque2CampoBaixo'].casaAtual = $(xml).find('pecas').find('tanque2CampoBaixo').children('casaAtual').text();
                            pecas['aviao1CampoCima'].campoAtual = $(xml).find('pecas').find('aviao1CampoCima').children('campoAtual').text();
                            pecas['aviao1CampoCima'].casaAtual = $(xml).find('pecas').find('aviao1CampoCima').children('casaAtual').text();
                            pecas['aviao2CampoCima'].campoAtual = $(xml).find('pecas').find('aviao2CampoCima').children('campoAtual').text();
                            pecas['aviao2CampoCima'].casaAtual = $(xml).find('pecas').find('aviao2CampoCima').children('casaAtual').text();
                            pecas['aviao1CampoBaixo'].campoAtual = $(xml).find('pecas').find('aviao1CampoBaixo').children('campoAtual').text();
                            pecas['aviao1CampoBaixo'].casaAtual = $(xml).find('pecas').find('aviao1CampoBaixo').children('casaAtual').text();
                            pecas['aviao2CampoBaixo'].campoAtual = $(xml).find('pecas').find('aviao2CampoBaixo').children('campoAtual').text();
                            pecas['aviao2CampoBaixo'].casaAtual = $(xml).find('pecas').find('aviao2CampoBaixo').children('casaAtual').text();

                            //reorganiza pecas
                            organizaPecas();
                            preparaNovoTurno();
                        }
                    }
                }
            });
        }
    
    }
}

function sincronizaServidor(){
    
    if(idSessaoServidor != undefined) {
    
        timerPecasTurno = setInterval(function() {
            if(fimDeJogo == false && vezDoPlayer == false) {
                recebeDadosServidor('pecasSelecionadasDoTurno');
            }
        }, tempoSincronizacao);

        timerDadosTurno = setInterval(function() {
            if(fimDeJogo == false && vezDoPlayer == false) {
                recebeDadosServidor('dadosDoTurno');
            }
        }, tempoSincronizacao);
        
        timerPecaRemovidaDoTurno = setInterval(function() {
            if(fimDeJogo == false && vezDoPlayer == false) {
                recebeDadosServidor('pecaRemovidaDoTurno');
            }
        }, tempoSincronizacao);

        timerMovimentacaoDoTurno = setInterval(function() {
            if(fimDeJogo == false && vezDoPlayer == false) {
                recebeDadosServidor('movimentacaoDoTurno');
            }
        }, tempoSincronizacao);

//        timerCasasEPecasTurno = setInterval(function() {
//            if(fimDeJogo == false && vezDoPlayer == false) {
//                recebeDadosServidor('visaoGeralCasasEPecas');
//            }
//        }, tempoSincronizacao);

    }
    
}