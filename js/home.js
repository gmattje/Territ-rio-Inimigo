var urlServerTerritorioInimigo = "http://www.minias.com.br/testes/ti/Territorio-Inimigo-Server";
var sessao = "";
var nomeJogador = "";
var timerNovoJogo = "";
var dialog1, dialog2, form;

$(function() {
    
    dialog1 = $("#form-novo-jogo").dialog({
        autoOpen: false,
        width: 350,
        modal: true,
        buttons: {
            "Iniciar partida!": validaDados,
            Cancelar: function() {
                cancelaAguardandoOutroJogador();
                dialog1.dialog( "close" );
            }
        },
        close: function() {
            form[0].reset();
        }
    });
    
    dialog2 = $("#aguardando-jogador").dialog({
        autoOpen: false,
        width: 350,
        modal: true,
        buttons: {
            Cancelar: function() {
                cancelaAguardandoOutroJogador();
                dialog2.dialog( "close" );
            }
        }
    });

    form = dialog1.find("form").on( "submit", function(event) {
        event.preventDefault();
        validaDados();
    });

    $("a.btn-jogar").on( "click", function(){
        dialog1.dialog("open");
        buscaSessoesOnline();
    });

});

function buscaSessoesOnline(){
    $.ajax({
        type: "GET",
        url: urlServerTerritorioInimigo + "/listarJogos.php?_=" + new Date().getTime(),
        dataType: "json",
        success: function (data) {
            $.each(data, function(i) {
                var arraySessao = data[i].split(" ");
                var sessaoReduzida = data[i].substr(0, 8) + " " + arraySessao[1];
                $('#sessao').append($('<option></option>').val(arraySessao[0]).html(sessaoReduzida));
            });
        }
    });
}

function validaDados(){
    sessao = $("form #sessao").val();
    nomeJogador = $("form #player").val();
    if(sessao == "" || nomeJogador == ""){
        alert('Antes de começar, defina a sessão on-line e escreva seu nome');
    } else {
        preparaSessao();
    }
}

function preparaSessao(){
    //se for para criar novo jogo
    if(sessao == "novo"){
        $.ajax({
            type: "GET",
            url: urlServerTerritorioInimigo + "/novoJogo.php?_=" + new Date().getTime(),
            data: {player1: nomeJogador},
            success: function (data) {
                sessao = data;
                aguardandoOutroJogador();
            }
        });
    } else {
        $.ajax({
            type: "GET",
            url: urlServerTerritorioInimigo + "/novoJogo.php?_=" + new Date().getTime(),
            data: {sessao: sessao, player2: nomeJogador},
            success: function (data) {
                iniciaGame();
            }
        });
    }
}

function aguardandoOutroJogador() {
    var sessaoReduzida = sessao.substr(0, 8) + " (" + nomeJogador + ")";
    $("#form-novo-jogo").dialog('close');
    dialog2.dialog("open");
    $("#aguardando-jogador").html("Agora você precisa aguardar um outro jogador na sessão que você criou: <br/><strong>" + sessaoReduzida + "</strong>");
    timerNovoJogo = setInterval(function(){
        var arraySessao = sessao.split(" ");
        $.ajax({
            type: "GET",
            url: urlServerTerritorioInimigo + "/jogos/" + arraySessao[0] + "/jogador2.txt?_=" + new Date().getTime(),
            success: function (data) {
                if(data != ""){
                    $("#aguardando-jogador").html("Muito bem, o jogador <strong>" + data + "</strong> entrou na sessão");
                    $(".ui-dialog .ui-dialog-buttonpane").remove();
                    setTimeout(function(){
                        iniciaGame();
                    }, 1500);
                }
            }
        });
    }, 3000);
}

function cancelaAguardandoOutroJogador(){
    clearInterval(timerNovoJogo);
    $.ajax({
        type: "GET",
        url: urlServerTerritorioInimigo + "/excluiJogo.php?_=" + new Date().getTime(),
        data: {sessao: sessao}
    });
}

function iniciaGame(){
    window.location.href = "game.html?sessao=" + sessao + "&player=" + nomeJogador;
}
