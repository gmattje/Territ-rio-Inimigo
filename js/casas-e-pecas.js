//casas
var casas = {
    'campo-cima': {
        'a1': {
            tipo: 'aeroporto',
            ocupada: ''
        },
        'b1': {
            tipo: 'montanha',
            ocupada: ''
        },
        'c1': {
            tipo: 'normal',
            ocupada: ''
        },
        'd1': {
            tipo: 'base',
            ocupada: ''
        },
        'e1': {
            tipo: 'normal',
            ocupada: ''
        },
        'f1': {
            tipo: 'montanha',
            ocupada: ''
        },
        'g1': {
            tipo: 'aeroporto',
            ocupada: ''
        },
        'a2': {
            tipo: 'montanha',
            ocupada: ''
        },
        'b2': {
            tipo: 'normal',
            ocupada: ''
        },
        'c2': {
            tipo: 'montanha',
            ocupada: ''
        },
        'd2': {
            tipo: 'normal',
            ocupada: ''
        },
        'e2': {
            tipo: 'montanha',
            ocupada: ''
        },
        'f2': {
            tipo: 'normal',
            ocupada: ''
        },
        'g2': {
            tipo: 'montanha',
            ocupada: ''
        },
        'a3': {
            tipo: 'normal',
            ocupada: ''
        },
        'b3': {
            tipo: 'montanha',
            ocupada: ''
        },
        'c3': {
            tipo: 'normal',
            ocupada: ''
        },
        'd3': {
            tipo: 'montanha',
            ocupada: ''
        },
        'e3': {
            tipo: 'normal',
            ocupada: ''
        },
        'f3': {
            tipo: 'montanha',
            ocupada: ''
        },
        'g3': {
            tipo: 'normal',
            ocupada: ''
        },
        'a4': {
            tipo: 'montanha',
            ocupada: ''
        },
        'b4': {
            tipo: 'normal',
            ocupada: ''
        },
        'c4': {
            tipo: 'montanha',
            ocupada: ''
        },
        'd4': {
            tipo: 'normal',
            ocupada: ''
        },
        'e4': {
            tipo: 'montanha',
            ocupada: ''
        },
        'f4': {
            tipo: 'normal',
            ocupada: ''
        },
        'g4': {
            tipo: 'montanha',
            ocupada: ''
        },
        'a5': {
            tipo: 'normal',
            ocupada: ''
        },
        'b5': {
            tipo: 'montanha',
            ocupada: ''
        },
        'c5': {
            tipo: 'normal',
            ocupada: ''
        },
        'd5': {
            tipo: 'montanha',
            ocupada: ''
        },
        'e5': {
            tipo: 'normal',
            ocupada: ''
        },
        'f5': {
            tipo: 'montanha',
            ocupada: ''
        },
        'g5': {
            tipo: 'normal',
            ocupada: ''
        }
    },
    'campo-baixo': {
        'a1': {
            tipo: 'normal',
            ocupada: ''
        },
        'b1': {
            tipo: 'montanha',
            ocupada: ''
        },
        'c1': {
            tipo: 'normal',
            ocupada: ''
        },
        'd1': {
            tipo: 'montanha',
            ocupada: ''
        },
        'e1': {
            tipo: 'normal',
            ocupada: ''
        },
        'f1': {
            tipo: 'montanha',
            ocupada: ''
        },
        'g1': {
            tipo: 'normal',
            ocupada: ''
        },
        'a2': {
            tipo: 'montanha',
            ocupada: ''
        },
        'b2': {
            tipo: 'normal',
            ocupada: ''
        },
        'c2': {
            tipo: 'montanha',
            ocupada: ''
        },
        'd2': {
            tipo: 'normal',
            ocupada: ''
        },
        'e2': {
            tipo: 'montanha',
            ocupada: ''
        },
        'f2': {
            tipo: 'normal',
            ocupada: ''
        },
        'g2': {
            tipo: 'montanha',
            ocupada: ''
        },
        'a3': {
            tipo: 'normal',
            ocupada: ''
        },
        'b3': {
            tipo: 'montanha',
            ocupada: ''
        },
        'c3': {
            tipo: 'normal',
            ocupada: ''
        },
        'd3': {
            tipo: 'montanha',
            ocupada: ''
        },
        'e3': {
            tipo: 'normal',
            ocupada: ''
        },
        'f3': {
            tipo: 'montanha',
            ocupada: ''
        },
        'g3': {
            tipo: 'normal',
            ocupada: ''
        },
        'a4': {
            tipo: 'montanha',
            ocupada: ''
        },
        'b4': {
            tipo: 'normal',
            ocupada: ''
        },
        'c4': {
            tipo: 'montanha',
            ocupada: ''
        },
        'd4': {
            tipo: 'normal',
            ocupada: ''
        },
        'e4': {
            tipo: 'montanha',
            ocupada: ''
        },
        'f4': {
            tipo: 'normal',
            ocupada: ''
        },
        'g4': {
            tipo: 'montanha',
            ocupada: ''
        },
        'a5': {
            tipo: 'aeroporto',
            ocupada: ''
        },
        'b5': {
            tipo: 'montanha',
            ocupada: ''
        },
        'c5': {
            tipo: 'normal',
            ocupada: ''
        },
        'd5': {
            tipo: 'base',
            ocupada: ''
        },
        'e5': {
            tipo: 'normal',
            ocupada: ''
        },
        'f5': {
            tipo: 'montanha',
            ocupada: ''
        },
        'g5': {
            tipo: 'aeroporto',
            ocupada: ''
        }
    }
}

//pecas do tabuleiro
var pecas = {
    'revolver1CampoCima': {
        nome: 'Soldado com Revolver',
        tipo: 'revolver',
        exercito: 'cima',
        campoAtual: 'cima',
        casaAtual: 'a5',
        vida: 1,
        dano: 1,
        tiros: -1,
        tentativas: 1,
        movimentacao: 'Apenas entre montanhas',
        alcance: '1 casa'
    },
    'revolver2CampoCima': {
        nome: 'Soldado com Revolver',
        tipo: 'revolver',
        exercito: 'cima',
        campoAtual: 'cima',
        casaAtual: 'c5',
        vida: 1,
        dano: 1,
        tiros: -1,
        tentativas: 1,
        movimentacao: 'Apenas entre montanhas',
        alcance: '1 casa'
    },
    'revolver3CampoCima': {
        nome: 'Soldado com Revolver',
        tipo: 'revolver',
        exercito: 'cima',
        campoAtual: 'cima',
        casaAtual: 'e5',
        vida: 1,
        dano: 1,
        tiros: -1,
        tentativas: 1,
        movimentacao: 'Apenas entre montanhas',
        alcance: '1 casa'
    },
    'revolver4CampoCima': {
        nome: 'Soldado com Revolver',
        tipo: 'revolver',
        exercito: 'cima',
        campoAtual: 'cima',
        casaAtual: 'g5',
        vida: 1,
        dano: 1,
        tiros: -1,
        tentativas: 1,
        movimentacao: 'Apenas entre montanhas',
        alcance: '1 casa'
    },
    'revolver1CampoBaixo': {
        nome: 'Soldado com Revolver',
        tipo: 'revolver',
        exercito: 'baixo',
        campoAtual: 'baixo',
        casaAtual: 'a1',
        vida: 1,
        dano: 1,
        tiros: -1,
        tentativas: 1,
        movimentacao: 'Apenas entre montanhas',
        alcance: '1 casa'
    },
    'revolver2CampoBaixo': {
        nome: 'Soldado com Revolver',
        tipo: 'revolver',
        exercito: 'baixo',
        campoAtual: 'baixo',
        casaAtual: 'c1',
        vida: 1,
        dano: 1,
        tiros: -1,
        tentativas: 1,
        movimentacao: 'Apenas entre montanhas',
        alcance: '1 casa'
    },
    'revolver3CampoBaixo': {
        nome: 'Soldado com Revolver',
        tipo: 'revolver',
        exercito: 'baixo',
        campoAtual: 'baixo',
        casaAtual: 'e1',
        vida: 1,
        dano: 1,
        tiros: -1,
        tentativas: 1,
        movimentacao: 'Apenas entre montanhas',
        alcance: '1 casa'
    },
    'revolver4CampoBaixo': {
        nome: 'Soldado com Revolver',
        tipo: 'revolver',
        exercito: 'baixo',
        campoAtual: 'baixo',
        casaAtual: 'g1',
        vida: 1,
        dano: 1,
        tiros: -1,
        tentativas: 1,
        movimentacao: 'Apenas entre montanhas',
        alcance: '1 casa'
    },
    'metralhadora1CampoCima': {
        nome: 'Soldado com Metralhadora',
        tipo: 'metralhadora',
        exercito: 'cima',
        campoAtual: 'cima',
        casaAtual: 'b4',
        vida: 2,
        dano: 1,
        tiros: -1,
        tentativas: 1,
        movimentacao: 'Apenas entre montanhas',
        alcance: '1 casa'
    },
    'metralhadora2CampoCima': {
        nome: 'Soldado com Metralhadora',
        tipo: 'metralhadora',
        exercito: 'cima',
        campoAtual: 'cima',
        casaAtual: 'd4',
        vida: 2,
        dano: 1,
        tiros: -1,
        tentativas: 1,
        movimentacao: 'Apenas entre montanhas',
        alcance: '1 casa'
    },
    'metralhadora3CampoCima': {
        nome: 'Soldado com Metralhadora',
        tipo: 'metralhadora',
        exercito: 'cima',
        campoAtual: 'cima',
        casaAtual: 'f4',
        vida: 2,
        dano: 1,
        tiros: -1,
        tentativas: 1,
        movimentacao: 'Apenas entre montanhas',
        alcance: '1 casa'
    },
    'metralhadora1CampoBaixo': {
        nome: 'Soldado com Metralhadora',
        tipo: 'metralhadora',
        exercito: 'baixo',
        campoAtual: 'baixo',
        casaAtual: 'b2',
        vida: 2,
        dano: 1,
        tiros: -1,
        tentativas: 1,
        movimentacao: 'Apenas entre montanhas',
        alcance: '1 casa'
    },
    'metralhadora2CampoBaixo': {
        nome: 'Soldado com Metralhadora',
        tipo: 'metralhadora',
        exercito: 'baixo',
        campoAtual: 'baixo',
        casaAtual: 'd2',
        vida: 2,
        dano: 1,
        tiros: -1,
        tentativas: 1,
        movimentacao: 'Apenas entre montanhas',
        alcance: '1 casa'
    },
    'metralhadora3CampoBaixo': {
        nome: 'Soldado com Metralhadora',
        tipo: 'metralhadora',
        exercito: 'baixo',
        campoAtual: 'baixo',
        casaAtual: 'f2',
        vida: 2,
        dano: 1,
        tiros: -1,
        tentativas: 1,
        movimentacao: 'Apenas entre montanhas',
        alcance: '1 casa'
    },
    'granada1CampoCima': {
        nome: 'Soldado com Granada',
        tipo: 'granada',
        exercito: 'cima',
        campoAtual: 'cima',
        casaAtual: 'a3',
        vida: 2,
        dano: 1,
        tiros: -1,
        tentativas: 1,
        movimentacao: 'Apenas entre montanhas',
        alcance: 'Até 2 casas, podendo ser sobre as montanhas'
    },
    'granada2CampoCima': {
        nome: 'Soldado com Granada',
        tipo: 'granada',
        exercito: 'cima',
        campoAtual: 'cima',
        casaAtual: 'c3',
        vida: 2,
        dano: 1,
        tiros: -1,
        tentativas: 1,
        movimentacao: 'Apenas entre montanhas',
        alcance: 'Até 2 casas, podendo ser sobre as montanhas'
    },
    'granada3CampoCima': {
        nome: 'Soldado com Granada',
        tipo: 'granada',
        exercito: 'cima',
        campoAtual: 'cima',
        casaAtual: 'e3',
        vida: 2,
        dano: 1,
        tiros: -1,
        tentativas: 1,
        movimentacao: 'Apenas entre montanhas',
        alcance: 'Até 2 casas, podendo ser sobre as montanhas'
    },
    'granada4CampoCima': {
        nome: 'Soldado com Granada',
        tipo: 'granada',
        exercito: 'cima',
        campoAtual: 'cima',
        casaAtual: 'g3',
        vida: 2,
        dano: 1,
        tiros: -1,
        tentativas: 1,
        movimentacao: 'Apenas entre montanhas',
        alcance: 'Até 2 casas, podendo ser sobre as montanhas'
    },
    'granada1CampoBaixo': {
        nome: 'Soldado com Granada',
        tipo: 'granada',
        exercito: 'baixo',
        campoAtual: 'baixo',
        casaAtual: 'a3',
        vida: 2,
        dano: 1,
        tiros: -1,
        tentativas: 1,
        movimentacao: 'Apenas entre montanhas',
        alcance: 'Até 2 casas, podendo ser sobre as montanhas'
    },
    'granada2CampoBaixo': {
        nome: 'Soldado com Granada',
        tipo: 'granada',
        exercito: 'baixo',
        campoAtual: 'baixo',
        casaAtual: 'c3',
        vida: 2,
        dano: 1,
        tiros: -1,
        tentativas: 1,
        movimentacao: 'Apenas entre montanhas',
        alcance: 'Até 2 casas, podendo ser sobre as montanhas'
    },
    'granada3CampoBaixo': {
        nome: 'Soldado com Granada',
        tipo: 'granada',
        exercito: 'baixo',
        campoAtual: 'baixo',
        casaAtual: 'e3',
        vida: 2,
        dano: 1,
        tiros: -1,
        tentativas: 1,
        movimentacao: 'Apenas entre montanhas',
        alcance: 'Até 2 casas, podendo ser sobre as montanhas'
    },
    'granada4CampoBaixo': {
        nome: 'Soldado com Granada',
        tipo: 'granada',
        exercito: 'baixo',
        campoAtual: 'baixo',
        casaAtual: 'g3',
        vida: 2,
        dano: 1,
        tiros: -1,
        tentativas: 1,
        movimentacao: 'Apenas entre montanhas',
        alcance: 'Até 2 casas, podendo ser sobre as montanhas'
    },
    'sniper1CampoCima': {
        nome: 'Atirador de Elite (Sniper)',
        tipo: 'sniper',
        exercito: 'cima',
        campoAtual: 'cima',
        casaAtual: 'b1',
        vida: 2,
        dano: 2,
        tiros: 2,
        tentativas: 1,
        movimentacao: 'Não se movimenta',
        alcance: 'Qualquer casa no seu território'
    },
    'sniper2CampoCima': {
        nome: 'Atirador de Elite (Sniper)',
        tipo: 'sniper',
        exercito: 'cima',
        campoAtual: 'cima',
        casaAtual: 'f1',
        vida: 2,
        dano: 2,
        tiros: 2,
        tentativas: 1,
        movimentacao: 'Não se movimenta',
        alcance: 'Qualquer casa no seu território'
    },
    'sniper1CampoBaixo': {
        nome: 'Atirador de Elite (Sniper)',
        tipo: 'sniper',
        exercito: 'baixo',
        campoAtual: 'baixo',
        casaAtual: 'b5',
        vida: 2,
        dano: 2,
        tiros: 2,
        tentativas: 1,
        movimentacao: 'Não se movimenta',
        alcance: 'Qualquer casa no seu território'
    },
    'sniper2CampoBaixo': {
        nome: 'Atirador de Elite (Sniper)',
        tipo: 'sniper',
        exercito: 'baixo',
        campoAtual: 'baixo',
        casaAtual: 'f5',
        vida: 2,
        dano: 2,
        tiros: 2,
        tentativas: 1,
        movimentacao: 'Não se movimenta',
        alcance: 'Qualquer casa no seu território'
    },
    'tanque1CampoCima': {
        nome: 'Tanque de Guerra',
        tipo: 'tanque',
        exercito: 'cima',
        campoAtual: 'cima',
        casaAtual: 'c1',
        vida: 3,
        dano: 2,
        tiros: 1,
        tentativas: 2,
        movimentacao: 'Apenas entre montanhas',
        alcance: 'Exclusivamente a 2 linha a sua frente',
        adicional: 'Esta peça só sai do tabuleiro quando esgotada suas vidas'
    },
    'tanque2CampoCima': {
        nome: 'Tanque de Guerra',
        tipo: 'tanque',
        exercito: 'cima',
        campoAtual: 'cima',
        casaAtual: 'e1',
        vida: 3,
        dano: 2,
        tiros: 1,
        tentativas: 2,
        movimentacao: 'Apenas entre montanhas',
        alcance: 'Exclusivamente a 2 linha a sua frente',
        adicional: 'Esta peça só sai do tabuleiro quando esgotada suas vidas'
    },
    'tanque1CampoBaixo': {
        nome: 'Tanque de Guerra',
        tipo: 'tanque',
        exercito: 'baixo',
        campoAtual: 'baixo',
        casaAtual: 'c5',
        vida: 3,
        dano: 2,
        tiros: 1,
        tentativas: 2,
        movimentacao: 'Apenas entre montanhas',
        alcance: 'Exclusivamente a 2 linha a sua frente',
        adicional: 'Esta peça só sai do tabuleiro quando esgotada suas vidas'
    },
    'tanque2CampoBaixo': {
        nome: 'Tanque de Guerra',
        tipo: 'tanque',
        exercito: 'baixo',
        campoAtual: 'baixo',
        casaAtual: 'e5',
        vida: 3,
        dano: 2,
        tiros: 1,
        tentativas: 2,
        movimentacao: 'Apenas entre montanhas',
        alcance: 'Exclusivamente a 2 linha a sua frente',
        adicional: 'Esta peça só sai do tabuleiro quando esgotada suas vidas'
    },
    'aviao1CampoCima': {
        nome: 'Avião Caça Militar',
        tipo: 'aviao',
        exercito: 'cima',
        campoAtual: 'cima',
        casaAtual: 'a1',
        vida: -1,
        dano: 3,
        tiros: 1,
        tentativas: 3,
        gasolina: 6,
        movimentacao: 'Até 6 casas podendo ser sobre as montanhas',
        alcance: 'Qualquer das 8 casas ao seu redor ou a casa abaixo',
        adicional: 'Esta peça só sai do tabuleiro quando esgotado seus tiros e em qualquer casa ao seu alcance pode-se repor uma peça do tipo Soldado com Revolver, se uma peça desta já tiver sido perdida pelo exército'
    },
    'aviao2CampoCima': {
        nome: 'Avião Caça Militar',
        tipo: 'aviao',
        exercito: 'cima',
        campoAtual: 'cima',
        casaAtual: 'g1',
        vida: -1,
        dano: 3,
        tiros: 1,
        tentativas: 3,
        gasolina: 6,
        movimentacao: 'Até 6 casas podendo ser sobre as montanhas',
        alcance: 'Qualquer das 8 casas ao seu redor ou a casa abaixo',
        adicional: 'Esta peça só sai do tabuleiro quando esgotado seus tiros e em qualquer casa ao seu alcance pode-se repor uma peça do tipo Soldado com Revolver, se uma peça desta já tiver sido perdida pelo exército'
    },
    'aviao1CampoBaixo': {
        nome: 'Avião Caça Militar',
        tipo: 'aviao',
        exercito: 'baixo',
        campoAtual: 'baixo',
        casaAtual: 'a5',
        vida: -1,
        dano: 3,
        tiros: 1,
        tentativas: 3,
        gasolina: 6,
        movimentacao: 'Até 6 casas podendo ser sobre as montanhas',
        alcance: 'Qualquer das 8 casas ao seu redor ou a casa abaixo',
        adicional: 'Esta peça só sai do tabuleiro quando esgotado seus tiros e em qualquer casa ao seu alcance pode-se repor uma peça do tipo Soldado com Revolver, se uma peça desta já tiver sido perdida pelo exército'
    },
    'aviao2CampoBaixo': {
        nome: 'Avião Caça Militar',
        tipo: 'aviao',
        exercito: 'baixo',
        campoAtual: 'baixo',
        casaAtual: 'g5',
        vida: -1,
        dano: 3,
        tiros: 1,
        tentativas: 3,
        gasolina: 6,
        movimentacao: 'Até 6 casas podendo ser sobre as montanhas',
        alcance: 'Qualquer das 8 casas ao seu redor ou a casa abaixo',
        adicional: 'Esta peça só sai do tabuleiro quando esgotado seus tiros e em qualquer casa ao seu alcance pode-se repor uma peça do tipo Soldado com Revolver, se uma peça desta já tiver sido perdida pelo exército'
    }
}