var IAEmVantagem = false;
var pecasQuePodemAtacar = [];
var pecasQuePodemMovimentar = [];
var decisaoDaIA = "";

function jogarIA(acao){
    pecasQuePodemAtacar = [];
    pecasQuePodemMovimentar = [];
    verificaVantagem();
    console.log("IA em vantagem: " + IAEmVantagem);
    if(acao == "action1"){
        verificarPossibilidadesDeAtaque(null);
        console.log("IA pode atacar com: " + pecasQuePodemAtacar);
    } else if(acao == "action2"){
        verificarPossibilidadesDeMovimentacao();
        console.log("IA pode movimentar com: " + pecasQuePodemMovimentar);
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
        casaOcupada =+ casaAtual[2];
    }
    return casaOcupada;
}

/* Verifica se IA está em vantagem */
function verificaVantagem(){
    
    IAEmVantagem = true;
    
    //primeiro testa de tem peça do inimigo em seu território
    $.each(pecas, function(index){
        if(this.campoAtual != 0 && this.casaAtual != 0 && this.exercito == "cima") {
            var casaOcupada = numeroCasaOcupada(pecas[index].casaAtual);
            if(casaOcupada >= 6 && casaOcupada <= 10){
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
        if(qtdPecasExercitoCima > qtdPecasExercitoBaixo){
            IAEmVantagem = false;
        }
    }

}

/* verifica quais peças podem movimentar-se */
function verificarPossibilidadesDeMovimentacao(){
//    pecasQuePodemMovimentar = [];
//    $.each(pecas, function(index){
//        //cada peça em jogo do exército
//        if(this.campoAtual != 0 && this.casaAtual != 0 && this.exercito == "baixo" && this.tiros != "0") {
//            selecionaPecaParaTurno(index, false);
//            //verifica cada peça inimiga para saber se está no campo de ataque
//            $.each(pecas, function(index2){
//                if(this.campoAtual != 0 && this.casaAtual != 0 && this.exercito == "cima") {
//                    if(pecaEstaNoCampoDeAtaque(index2) == true && pecasQuePodemAtacar.indexOf(index) == -1){
//                        pecasQuePodemAtacar[pecasQuePodemAtacar.length] = index;
//                    }
//                }
//            });
//        }
//    });
}

/* verifica quais peças podem atacar */
function verificarPossibilidadesDeAtaque(pecasEspecificasParaReceberAtaque){
    pecasQuePodemAtacar = [];
    //se é para verificar todos as possibilidades de ataque
    if(pecasEspecificasParaReceberAtaque == null || pecasEspecificasParaReceberAtaque.length == 0) {
        $.each(pecas, function(index){
            //cada peça em jogo do exército
            if(this.campoAtual != 0 && this.casaAtual != 0 && this.exercito == "baixo" && this.tiros != "0") {
                selecionaPecaParaTurno(index, false);
                //verifica cada peça inimiga para saber se está no campo de ataque
                $.each(pecas, function(index2){
                    if(this.campoAtual != 0 && this.casaAtual != 0 && this.exercito == "cima") {
                        if(pecaEstaNoCampoDeAtaque(index2) == true && pecasQuePodemAtacar.indexOf(index) == -1){
                            pecasQuePodemAtacar[pecasQuePodemAtacar.length] = index;
                        }
                    }
                });
            }
        });
    //se para verificar as peças que podem atacar adversários específicos    
    } else {
        $.each(pecas, function(index){
            if(this.campoAtual != 0 && this.casaAtual != 0 && this.exercito == "baixo" && this.tiros != "0") {
                selecionaPecaParaTurno(index, false);
                //verifica cada peça inimiga para saber se está no campo de ataque
                $.each(pecas, function(index2){
                    if(pecasEspecificasParaReceberAtaque.indexOf(index2) != -1 && this.campoAtual != 0 && this.casaAtual != 0 && this.exercito == "cima") {
                        if(pecaEstaNoCampoDeAtaque(index2) == true && pecasQuePodemAtacar.indexOf(index) == -1){
                            pecasQuePodemAtacar[pecasQuePodemAtacar.length] = index;
                        }
                    }
                });
            }
        });
    }
}

/* executa ação decidida pela IA */
function executaAcao(){
    //se decisao da IA é atacar...
    if(decisaoDaIA == "atacar"){
        var casaMaisAvancada = 0;
        var pecasQuePodemAtacarFiltradas = [];
        var pecasAdversariasMaisAvancadas = [];
        //se IA estiver com vantagem
        if(IAEmVantagem){
            //escolhe a melhor peça que irá atacar, no caso deverá ser a que estiver mais próxima do objetivo
            casaMaisAvancada = 10;
            $.each(pecasQuePodemAtacar, function(index, value){
                var casaOcupada = numeroCasaOcupada(pecas[value].casaAtual);
                if(casaOcupada < casaMaisAvancada){
                    casaMaisAvancada = casaOcupada;
                }
            });
            console.log("casa mais avançada ocupada pela IA: " + casaMaisAvancada);
            //elimina peça que não esteja na linha mais avançada
            $.each(pecasQuePodemAtacar, function(index, value){
                var casaOcupada = numeroCasaOcupada(pecas[value].casaAtual);
                if(casaOcupada == casaMaisAvancada){
                    pecasQuePodemAtacarFiltradas[pecasQuePodemAtacarFiltradas.length] = value;
                }
            });
        //se não estiver em vantagem, tentará atacar a peça adversária que estiver mais avançada em seu campo    
        } else {
            casaMaisAvancada = 1;
            $.each(pecas, function(index){
                if(this.campoAtual != 0 && this.casaAtual != 0 && this.exercito == "cima") {
                    var casaOcupada = numeroCasaOcupada(pecas[index].casaAtual);
                    if(casaOcupada > casaMaisAvancada){
                        casaMaisAvancada = casaOcupada;
                    }
                }
            });
            console.log("casa mais avançada ocupada pelo adversário: " + casaMaisAvancada);
            //escolhe as peças inimigas mais avançadas
            $.each(pecas, function(index){
                if(this.campoAtual != 0 && this.casaAtual != 0 && this.exercito == "cima") {
                    var casaOcupada = numeroCasaOcupada(pecas[index].casaAtual);
                    if(casaOcupada == casaMaisAvancada){
                        pecasAdversariasMaisAvancadas[pecasAdversariasMaisAvancadas.length] = index;
                    }
                }
            });
            console.log("melhores peças a serem atacadas: " + pecasAdversariasMaisAvancadas);
            //escolhe peças da IA que podem atacar essas peças adversárias
            verificarPossibilidadesDeAtaque(pecasAdversariasMaisAvancadas);
            pecasQuePodemAtacarFiltradas = pecasQuePodemAtacar;
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
                if(pecaEstaNoCampoDeAtaque(index2) == true){
                    pecaASerAtacada = index2;
                    selecionaPecaParaTurno(index2, false);
                }
            }
        });
        console.log("selecionado para ser atacada: " + pecaASerAtacada);
        rodaAtaque(false);
        
    //...mas se decisão for se movimentar    
    } else if(decisaoDaIA == "movimentar") {
     
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
    } else {
        decisaoDaIA = "finalizar";
    }   
}