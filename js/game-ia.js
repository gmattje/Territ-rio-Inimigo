var IAEmVantagem = false;
var casaMaisAvancada = 0;
var pecasQuePodemAtacar = [];
var pecasQuePodemSerAtacadas = [];
var pecasQuePodemMovimentar = [];
var pecasQuePodemMovimentarParaFrente = [];
var casasQuePodemReceberParaquedista = [];
var decisaoDaIA = "";

function jogarIA(acao){
    pecasQuePodemAtacar = [];
    pecasQuePodemMovimentar = [];
    verificaVantagem();
    console.log("IA em vantagem: " + IAEmVantagem);
    if(acao == "action1"){
        verificarPossibilidadesDeAtaque(null);
        verificarPossibilidadesDeMovimentacao();
        console.log("IA pode atacar com: " + pecasQuePodemAtacar);
    } else if(acao == "action2"){
        verificarPossibilidadesDeMovimentacao();
        console.log("IA pode movimentar com: " + pecasQuePodemMovimentar);
        console.log("IA pode movimentar pra frente com: " + pecasQuePodemMovimentarParaFrente);
    } else if(acao == "action3"){
        verificarPossibilidadesDeParaquedista();
        console.log("IA pode posicionar paraquedista em: " + casasQuePodemReceberParaquedista);
    }
    arvoreDeDecisao();
    console.log("IA decidiu: " + decisaoDaIA);
    executaAcao();
}

/* retorna o número da casa ocupada com base no quadrante */
function numeroCasaOcupada(quadrante){
    var casaAtual = quadrante.split('');
    var casaOcupada = casaAtual[1];
    if(casaAtual[2] != undefined){
        casaOcupada += casaAtual[2];
    }
    return casaOcupada;
}

function casasAoEntorno(casaAtual){
    var arrCasasAoEntorno = [];
    var indexCasasAleatoriasCima = casasAleatorias('cima');
    var indexCasasAleatoriasBaixo = casasAleatorias('baixo');
    //verifica cada casa
    $.each(indexCasasAleatoriasCima, function(index, value){
        if(casas['campo-cima'][value].tipo == 'normal' && quantidadeDeMovimentos(casaAtual, value) == "1" && arrCasasAoEntorno.indexOf(value) == -1){
            arrCasasAoEntorno[arrCasasAoEntorno.length] = value;
        }
    });
    $.each(indexCasasAleatoriasBaixo, function(index, value){
        if(casas['campo-baixo'][value].tipo == 'normal' && quantidadeDeMovimentos(casaAtual, value) == "1" && arrCasasAoEntorno.indexOf(value) == -1){
            arrCasasAoEntorno[arrCasasAoEntorno.length] = value;
        }
    });
    return arrCasasAoEntorno;
}

/* encontra o melhor caminho */
function encontraMelhorCaminho(casaAtual, casaDestinoFinal){
    var chegouNoDestino = false;
    var listaAberta = [];
    var listaFechada = [];
    var listaDeCustos = {};
    var listaFiliacao = [];
    var adicinalCustoTotal = 1;
    while(!chegouNoDestino){
        listaDeCustos = {};
        //remove da lista aberta
        var indexCasaAtual = listaAberta.indexOf(casaAtual);
        if(indexCasaAtual > -1){
            listaAberta.splice(indexCasaAtual, 1);
        }
        //inclui na lista fechada
        listaFechada[listaFechada.length] = casaAtual;
        //casas ao entorno
        $.each(casasAoEntorno(casaAtual), function(index, value){
            if(listaAberta.indexOf(value) == -1){
                listaAberta[listaAberta.length] = value;
            }
        });
        listaFiliacao[casaAtual] = casasAoEntorno(casaAtual);
        //trata custos da lista aberta
        $.each(listaAberta, function(index, value){
            listaDeCustos[value] = (quantidadeDeMovimentos(value, casaDestinoFinal)+adicinalCustoTotal);
            if(value == casaDestinoFinal){
                chegouNoDestino = true;
            }
        });
        //ordena pelo menor custo
        var menorCusto = 100;
        $.each(listaDeCustos, function(index, value){
            if(value < menorCusto){
                menorCusto = value;
                casaAtual = index;
            }
        });
        adicinalCustoTotal++;
    }
    return listaFechada;
}

/* Verifica se IA está em vantagem */
function verificaVantagem(){
    
    IAEmVantagem = true;
    
    //primeiro testa se tem peça do inimigo em seu território, a partir da segunda linha (7)
    $.each(pecas, function(index){
        if(this.campoAtual != 0 && this.casaAtual != 0 && this.exercito == "cima") {
            var casaOcupada = numeroCasaOcupada(pecas[index].casaAtual);
            if(casaOcupada >= 7 && casaOcupada <= 10){
                IAEmVantagem = false;
            }
        }
    });
    
    //se continua em vantagem, vê pela quantidade de peças em jogo
    if(IAEmVantagem) {
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
        if(qtdPecasExercitoCima > (qtdPecasExercitoBaixo+3)){
            IAEmVantagem = false;
        }
    }
    
    //se está na casas da 3ª ou 2ª linha considera vantagem
    if(!IAEmVantagem){
        casaMaisAvancada = 10;
        $.each(pecas, function(index){
            //cada peça em jogo do exército
            if(this.campoAtual != 0 && this.casaAtual != 0 && this.exercito == "baixo" && this.tiros != "0") {
                var casaOcupada = numeroCasaOcupada(this.casaAtual);
                if(parseInt(casaOcupada) < parseInt(casaMaisAvancada)){
                    casaMaisAvancada = casaOcupada;
                }
            }
        });
        if(parseInt(casaMaisAvancada) <= 3){
            IAEmVantagem = true;
        }
    }

}

/* verifica quais casas podem receber paraquedista */
function verificarPossibilidadesDeParaquedista(){
    casasQuePodemReceberParaquedista = [];
    //verifica cada casa
    $.each(casas['campo-cima'], function(index){
        if(this.tipo == 'normal' && this.ocupacao1 == '' && casaEstaNoCampoDePouso(pecaSelecionadaCampoAtaque, index) === true && casasQuePodemReceberParaquedista.indexOf(index) == -1){
            casasQuePodemReceberParaquedista[casasQuePodemReceberParaquedista.length] = index;
        }
    });
    $.each(casas['campo-baixo'], function(index){
        if(this.tipo == 'normal' && this.ocupacao1 == '' && casaEstaNoCampoDePouso(pecaSelecionadaCampoAtaque, index) === true && casasQuePodemReceberParaquedista.indexOf(index) == -1){
            casasQuePodemReceberParaquedista[casasQuePodemReceberParaquedista.length] = index;
        }
    });
}

/* verifica quais peças podem movimentar-se */
function verificarPossibilidadesDeMovimentacao(){
    pecasQuePodemMovimentar = [];
    pecasQuePodemMovimentarParaFrente = [];
    $.each(pecas, function(index){
        var casaAtual = this.casaAtual;
        //cada peça em jogo do exército
        if(this.campoAtual != 0 && this.casaAtual != 0 && this.exercito == "baixo") {
            if(this.tipo != "aviao" || (this.tipo == "aviao" && this.gasolina > 0)){
                //verifica cada casa para saber se peça pode se movimentar
                $.each(casas['campo-cima'], function(index2){
                    if(casaAtual != index2 && validaMovimentacaoPeca(index, 'cima', index2, false) === true && pecasQuePodemMovimentar.indexOf(index) == -1){
                        pecasQuePodemMovimentar[pecasQuePodemMovimentar.length] = index;
                        if(parseInt(numeroCasaOcupada(casaAtual)) > parseInt(numeroCasaOcupada(index2)) && pecasQuePodemMovimentarParaFrente.indexOf(index) == -1){
                            pecasQuePodemMovimentarParaFrente[pecasQuePodemMovimentarParaFrente.length] = index;
                        }
                    }
                });
                $.each(casas['campo-baixo'], function(index2){
                    if(casaAtual != index2 && validaMovimentacaoPeca(index, 'baixo', index2, false) === true && pecasQuePodemMovimentar.indexOf(index) == -1){
                        pecasQuePodemMovimentar[pecasQuePodemMovimentar.length] = index;
                        if(parseInt(numeroCasaOcupada(casaAtual)) > parseInt(numeroCasaOcupada(index2)) && pecasQuePodemMovimentarParaFrente.indexOf(index) == -1){
                            pecasQuePodemMovimentarParaFrente[pecasQuePodemMovimentarParaFrente.length] = index;
                        }
                    }
                });
            }
        }
    });
}

/* verifica quais peças podem atacar */
function verificarPossibilidadesDeAtaque(pecasEspecificasParaReceberAtaque){
    pecasQuePodemAtacar = [];
    pecasQuePodemSerAtacadas = [];
    //se para verificar peças que podem atacar adversários específicos
    if(pecasEspecificasParaReceberAtaque != null && pecasEspecificasParaReceberAtaque.length > 0) {
        $.each(pecas, function(index){
            if(this.campoAtual != 0 && this.casaAtual != 0 && this.exercito == "baixo" && this.tiros != "0") {
                selecionaPecaParaTurno(index, false);
                //verifica cada peça inimiga para saber se está no campo de ataque
                $.each(pecasEspecificasParaReceberAtaque, function(index2, value2){
                    if(pecaEstaNoCampoDeAtaque(value2) == true && pecasQuePodemAtacar.indexOf(index) == -1){
                        pecasQuePodemAtacar[pecasQuePodemAtacar.length] = index;
                        if(pecasQuePodemSerAtacadas.indexOf(value2) == -1){
                            pecasQuePodemSerAtacadas[pecasQuePodemSerAtacadas.length] = value2;
                        }
                    }
                });
            }
        });
    }
    
    //se é para verificar todos as possibilidades de ataque   
    if(pecasQuePodemAtacar.length == 0) {
        $.each(pecas, function(index){
            //cada peça em jogo do exército
            if(this.campoAtual != 0 && this.casaAtual != 0 && this.exercito == "baixo" && this.tiros != "0") {
                selecionaPecaParaTurno(index, false);
                //verifica cada peça inimiga para saber se está no campo de ataque
                $.each(pecas, function(index2){
                    if(this.campoAtual != 0 && this.casaAtual != 0 && this.exercito == "cima") {
                        if(this.tipo != "sniper" || (this.tipo == "sniper" && this.tiros != "0")){
                            if(pecaEstaNoCampoDeAtaque(index2) == true && pecasQuePodemAtacar.indexOf(index) == -1){
                                pecasQuePodemAtacar[pecasQuePodemAtacar.length] = index;
                                if(pecasQuePodemSerAtacadas.indexOf(index2) == -1){
                                    pecasQuePodemSerAtacadas[pecasQuePodemSerAtacadas.length] = index2;
                                }
                            }
                        }
                    }
                });
            }
        });
    }
}

/* executa ação decidida pela IA */
function executaAcao(){
    var pecasQuePodemAtacarFiltradas = [];
    var pecasQuePodemMovimentarFiltradas = [];
    var pecasAdversariasMaisAvancadas = [];
    //se decisao da IA é atacar...
    if(decisaoDaIA == "atacar"){
        pecasQuePodemAtacarFiltradas = [];
        pecasAdversariasMaisAvancadas = [];
        //se IA estiver com vantagem
        if(IAEmVantagem || pecasQuePodemAtacar.length == 1){
            //escolhe a melhor peça que irá atacar, no caso deverá ser a que estiver mais próxima do objetivo
            casaMaisAvancada = 10;
            $.each(pecasQuePodemAtacar, function(index, value){
                var casaOcupada = numeroCasaOcupada(pecas[value].casaAtual);
                if(parseInt(casaOcupada) < parseInt(casaMaisAvancada)){
                    casaMaisAvancada = casaOcupada;
                }
            });
            console.log("casa mais avançada que pode atacar ocupada pela IA: " + casaMaisAvancada);
            //elimina peça que não esteja na linha mais avançada
            $.each(pecasQuePodemAtacar, function(index, value){
                var casaOcupada = numeroCasaOcupada(pecas[value].casaAtual);
                if(parseInt(casaOcupada) == parseInt(casaMaisAvancada)){
                    pecasQuePodemAtacarFiltradas[pecasQuePodemAtacarFiltradas.length] = value;
                }
            });
        //se não estiver em vantagem, tentará atacar a peça adversária que estiver mais avançada em seu campo    
        } else {
            casaMaisAvancada = 1;
            $.each(pecas, function(index){
                if(this.campoAtual != 0 && this.casaAtual != 0 && this.exercito == "cima" && this.tipo != "aviao") {
                    var casaOcupada = numeroCasaOcupada(pecas[index].casaAtual);
                    if(parseInt(casaOcupada) > parseInt(casaMaisAvancada) && pecasQuePodemSerAtacadas.indexOf(index) > 0){
                        casaMaisAvancada = casaOcupada;
                    }
                }
            });
            console.log("casa mais avançada ocupada pelo adversário: " + casaMaisAvancada);
            //escolhe as peças inimigas mais avançadas
            $.each(pecas, function(index){
                if(this.campoAtual != 0 && this.casaAtual != 0 && this.exercito == "cima") {
                    var casaOcupada = numeroCasaOcupada(pecas[index].casaAtual);
                    if(parseInt(casaOcupada) == parseInt(casaMaisAvancada)){
                        pecasAdversariasMaisAvancadas[pecasAdversariasMaisAvancadas.length] = index;
                    }
                }
            });
            console.log("melhores peças a serem atacadas: " + pecasAdversariasMaisAvancadas);
            //escolhe peças da IA que podem atacar essas peças adversárias
            verificarPossibilidadesDeAtaque(pecasAdversariasMaisAvancadas);
            pecasQuePodemAtacarFiltradas = pecasQuePodemAtacar;
        }
        //se não consegue atacar nenhuma mais avançada
        if(pecasQuePodemAtacarFiltradas.length == 0){
            decisaoDaIA = "movimentar";
            executaAcao();
        //se tiver mais de 2, remove snipers
        } else if(pecasQuePodemAtacarFiltradas.length > 2){
            var indexSniper1 = pecasQuePodemAtacarFiltradas.indexOf('sniper1CampoBaixo');
            if(indexSniper1 > -1){
                pecasQuePodemAtacarFiltradas.splice(indexSniper1, 1);
            }
            var indexSniper2 = pecasQuePodemAtacarFiltradas.indexOf('sniper2CampoBaixo');
            if(indexSniper2 > -1){
                pecasQuePodemAtacarFiltradas.splice(indexSniper2, 1);
            }
        }
        console.log("melhores peças para atacar: " + pecasQuePodemAtacarFiltradas);
        //seleciona uma peça aleatória para atacar
        var aleatoria = Math.floor(Math.random() * pecasQuePodemAtacarFiltradas.length);
        var pecaAtacante = pecasQuePodemAtacarFiltradas[aleatoria];
        selecionaPecaParaTurno(pecaAtacante, false);
        console.log("selecionado para atacar: " + pecaAtacante);
        //verifica qual peça será atacada
        var pecaASerAtacada = "";
        $.each(pecas, function(index2){
            if(this.campoAtual != 0 && this.casaAtual != 0 && this.exercito == "cima") {
                if(pecasAdversariasMaisAvancadas.indexOf(index2) == -1 && pecaEstaNoCampoDeAtaque(index2) == true){
                    pecaASerAtacada = index2;
                    selecionaPecaParaTurno(index2, false);
                } else if (pecaEstaNoCampoDeAtaque(index2) == true){
                    pecaASerAtacada = index2;
                    selecionaPecaParaTurno(index2, false);
                }
            }
        });
        console.log("selecionado para ser atacada: " + pecaASerAtacada);
        rodaAtaque(false);
        
    //...mas se decisão for se movimentar    
    } else if(decisaoDaIA == "movimentar") {
        pecasQuePodemMovimentarFiltradas = [];
        pecasAdversariasMaisAvancadas = [];
        //escolhe a melhor peça que irá movimentar, no caso deverá ser a que estiver mais próxima do objetivo
        casaMaisAvancada = 10;
        $.each(pecasQuePodemMovimentar, function(index, value){
            var casaOcupada = numeroCasaOcupada(pecas[value].casaAtual);
            if(parseInt(casaOcupada) < parseInt(casaMaisAvancada)){
                casaMaisAvancada = casaOcupada;
            }
        });
        console.log("casa mais avançada que pode mover-se ocupada pela IA: " + casaMaisAvancada);
        if(casaMaisAvancada == 2){
            pecasQuePodemMovimentar = pecasQuePodemMovimentarParaFrente;
        }
        //elimina peça que não esteja na linha mais avançada
        $.each(pecasQuePodemMovimentar, function(index, value){
            var casaOcupada = numeroCasaOcupada(pecas[value].casaAtual);
            if(parseInt(casaOcupada) == parseInt(casaMaisAvancada)){
                pecasQuePodemMovimentarFiltradas[pecasQuePodemMovimentarFiltradas.length] = value;
            }
        });
        if(pecasQuePodemMovimentarFiltradas.length == 0){
            pecasQuePodemMovimentarFiltradas = pecasQuePodemMovimentar;
        }
        console.log("melhores peças para movimentar: " + pecasQuePodemMovimentarFiltradas);
        //seleciona uma peça aleatória para mover-se
        var aleatoria = Math.floor(Math.random() * pecasQuePodemMovimentarFiltradas.length);
        var pecaMovente = pecasQuePodemMovimentarFiltradas[aleatoria];
        console.log("selecionado para mover-se: " + pecaMovente);
        var arrMelhorCaminhoBase1 = encontraMelhorCaminho(pecas[pecaMovente].casaAtual, "c1");
        var arrMelhorCaminhoBase2 = encontraMelhorCaminho(pecas[pecaMovente].casaAtual, "e1");
        var arrMelhorCaminho = [...new Set([...arrMelhorCaminhoBase1 ,...arrMelhorCaminhoBase2])];
        console.log("Melhor caminho identificado passa pelas casas: " + arrMelhorCaminho);
        //verifica qual casa será ocupada
        //se estiver em vatagem prefere avançar a recuar
        var campoASerOcupado = "";
        var casaASerOcupadaProvisoria = "";
        var casaASerOcupada = "";
        var indexCasasAleatoriasCima = casasAleatorias('cima');
        var indexCasasAleatoriasBaixo = casasAleatorias('baixo');
        $.each(indexCasasAleatoriasCima, function(index2, value2){
            if(validaMovimentacaoPeca(pecaMovente, 'cima', value2, false) === true && casaASerOcupada == ""){
                campoASerOcupado = 'cima';
                casaASerOcupadaProvisoria = value2;
                if(IAEmVantagem && (parseInt(casaMaisAvancada) > parseInt(numeroCasaOcupada(value2)) || arrMelhorCaminho.indexOf(value2) !== -1)){
                    casaASerOcupada = value2;
                }
            }
        });
        $.each(indexCasasAleatoriasBaixo, function(index2, value2){
            if(validaMovimentacaoPeca(pecaMovente, 'baixo', value2, false) === true && casaASerOcupada == ""){
                campoASerOcupado = 'baixo';
                casaASerOcupadaProvisoria = value2;
                if(IAEmVantagem && (parseInt(casaMaisAvancada) > parseInt(numeroCasaOcupada(value2)) || arrMelhorCaminho.indexOf(value2) !== -1)){
                    casaASerOcupada = value2;
                }
            }
        });
        if(casaASerOcupada == ""){
            casaASerOcupada = casaASerOcupadaProvisoria;
        }
        //se estiver em vantagem e for para andar para trás, prefere movimentar aviões
        if(IAEmVantagem && parseInt(casaMaisAvancada) < parseInt(numeroCasaOcupada(casaASerOcupada))){
            //se tiver avião possível de se movimentear e o exército já ter perdido pelo menos um revolver
            var revolverPerdido = "";
            $.each(pecas, function(index){
                if(this.exercito == "baixo" && this.tipo == "revolver" && this.campoAtual == 0 && this.casaAtual == 0) {
                    revolverPerdido = index;
                }
            });
            if(revolverPerdido != "" && (pecasQuePodemMovimentar.indexOf('aviao1CampoBaixo') !== -1 || pecasQuePodemMovimentar.indexOf('aviao2CampoBaixo') !== -1)){
                //elimina peça que não seja avião
                var valuesEliminar = [];
                $.each(pecasQuePodemMovimentar, function(index, value){
                    if(value != "aviao1CampoBaixo" && value != "aviao2CampoBaixo"){
                        valuesEliminar[valuesEliminar.length] = value;
                    }
                });
                $.each(valuesEliminar, function(index, value){
                    var indexPeca = pecasQuePodemMovimentar.indexOf(value);
                    if(indexPeca > -1){
                        pecasQuePodemMovimentar.splice(indexPeca, 1);
                    }
                });
                pecasQuePodemMovimentarFiltradas = pecasQuePodemMovimentar;
                console.log("encontrado melhores peças para movimentar: " + pecasQuePodemMovimentarFiltradas);
                //seleciona uma peça aleatória para mover-se
                aleatoria = Math.floor(Math.random() * pecasQuePodemMovimentarFiltradas.length);
                pecaMovente = pecasQuePodemMovimentarFiltradas[aleatoria];
                console.log("selecionado para mover-se: " + pecaMovente);
                //verifica qual casa será ocupada
                //se estiver em vatagem prefere avançar a recuar
                campoASerOcupado = "";
                casaASerOcupadaProvisoria = "";
                casaASerOcupada = "";
                indexCasasAleatoriasCima = casasAleatorias('cima');
                indexCasasAleatoriasBaixo = casasAleatorias('baixo');
                $.each(indexCasasAleatoriasCima, function(index2, value2){
                    if(validaMovimentacaoPeca(pecaMovente, 'cima', value2, false) === true && casaASerOcupada == ""){
                        campoASerOcupado = 'cima';
                        casaASerOcupadaProvisoria = value2;
                        if(IAEmVantagem && parseInt(casaMaisAvancada) > parseInt(numeroCasaOcupada(value2))){
                            casaASerOcupada = value2;
                        }
                    }
                });
                $.each(indexCasasAleatoriasBaixo, function(index2, value2){
                    if(validaMovimentacaoPeca(pecaMovente, 'baixo', value2, false) === true && casaASerOcupada == ""){
                        campoASerOcupado = 'baixo';
                        casaASerOcupadaProvisoria = value2;
                        if(IAEmVantagem && parseInt(casaMaisAvancada) > parseInt(numeroCasaOcupada(value2))){
                            casaASerOcupada = value2;
                        }
                    }
                });
                if(casaASerOcupada == ""){
                    casaASerOcupada = casaASerOcupadaProvisoria;
                }
            }
        }
        console.log("casa a ser ocupada: " + casaASerOcupada);
        gravaMovimentacaoPeca(pecaMovente, campoASerOcupado, casaASerOcupada, 'ocupacao1', false);
        organizaPecas();
    //...mas se decisão for posicionar um paraquedista    
    } else if(decisaoDaIA == "paraquedista") {
        var revolverPerdido = "";
        $.each(pecas, function(index){
            if(this.exercito == "baixo" && this.tipo == "revolver" && this.campoAtual == 0 && this.casaAtual == 0) {
                revolverPerdido = index;
            }
        });
        aleatoria = Math.floor(Math.random() * casasQuePodemReceberParaquedista.length);
        casaASerOcupada = casasQuePodemReceberParaquedista[aleatoria];
        console.log("casa a ser ocupada: " + casaASerOcupada);
        var indexCasasAleatoriasCima = casasAleatorias('cima');
        var indexCasasAleatoriasBaixo = casasAleatorias('baixo');
        if(indexCasasAleatoriasCima.indexOf(casaASerOcupada) !== -1) {
            gravaMovimentacaoPeca(revolverPerdido, 'cima', casaASerOcupada, 'ocupacao1', false);
        } else if(indexCasasAleatoriasBaixo.indexOf(casaASerOcupada) !== -1) {
            gravaMovimentacaoPeca(revolverPerdido, 'baixo', casaASerOcupada, 'ocupacao1', false);
        }
        organizaPecas();
    // ou se para finalizar    
    } else if(decisaoDaIA == "finalizar") {
        cancelaPossibilidadeDeMovimentacao(false);
        console.log("IA finalizou turno");
    }
}

/* árvore de decisão da IA */
function arvoreDeDecisao(){
    decisaoDaIA = "";
    //se tiver como atacar
    if(pecasQuePodemAtacar.length > 0){
        decisaoDaIA = "atacar";
    } else if(pecasQuePodemMovimentar.length > 0) {
        decisaoDaIA = "movimentar";
    } else if(casasQuePodemReceberParaquedista.length > 0) {
        decisaoDaIA = "paraquedista";    
    } else {
        decisaoDaIA = "finalizar";
    }   
}