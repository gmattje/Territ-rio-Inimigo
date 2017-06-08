//funções para cada tecla do teclado
$(document).keydown(function(e){
    
    //tecla r - restart ou F5
    if(e.keyCode == 82 || e.keyCode == 116) {
        restart();
        e.keyCode = 0;
        e.returnValue = false;
        return false;
    } 
    
});