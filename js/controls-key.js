//funções para cada tecla do teclado
$(document).keydown(function(e){
    
    //tecla r - restart
    if(e.keyCode == 82) {
        restart(true);
    }
    
    //tecla esc
    if (e.keyCode == 27) {
        pause();
    }
    
    //tecla cima
    if (e.keyCode == 38) {
        frente();
    }
    
    //tecla baixo
    if (e.keyCode == 40) {
        play();
    }
    
    //tecla esquerda
    if (e.keyCode == 37) {
        esquerda();
    }
    
    //tecla direita
    if (e.keyCode == 39) {
        direita();
    }   
    
});