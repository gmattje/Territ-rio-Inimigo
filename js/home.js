var nomeJogador1 = "";
var nomeJogador2 = "";
var dialog, form;

$(function() {
    
    dialog = $("#form-novo-jogo").dialog({
        autoOpen: false,
        height: 400,
        width: 350,
        modal: true,
        buttons: {
            "Iniciar partida!": validaDados,
            Cancelar: function() {
                dialog.dialog( "close" );
            }
        },
        close: function() {
            form[0].reset();
        }
    });

    form = dialog.find("form").on( "submit", function(event) {
        event.preventDefault();
        validaDados();
    });

    $("a.btn-jogar").on( "click", function(){
        dialog.dialog("open");
    });

});

function validaDados(){
    nomeJogador1 = $("form #player1").val();
    nomeJogador2 = $("form #player2").val();
    if(nomeJogador1 == "" || nomeJogador2 == ""){
        alert('Defina o nome de todos os jogadores');
    } else if (nomeJogador1 == nomeJogador2) {
        alert('Defina nomes diferentes para os jogadores');
    } else {
        iniciaGame();
    }
}

function iniciaGame(){
    window.location.href = "game.html?pl1=" + nomeJogador1 + "&pl2=" + nomeJogador2;
}
