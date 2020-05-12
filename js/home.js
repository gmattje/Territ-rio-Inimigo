var urlServerTerritorioInimigo = "http://www.corretorhelio.com/testes/territorioInimigo/_server";
var sessao = "";
var nomeJogador1on = "";
var nomeJogador1off = "";
var nomeJogador2off = "";
var faseSelecionada = "";
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

    $("a.btn-jogar").on("click", function(){
        dialog1.dialog("open");
        buscaSessoesOnline();
    });
    
    $("select#sessao").on("change", function(){
        $('#form-novo-jogo .sessao-off').addClass('oculto');
        $('#form-novo-jogo .sessao-on').addClass('oculto');
        if($(this).val() == "novo-off") {
            $('#form-novo-jogo .sessao-off').removeClass('oculto');
        } else {
            $('#form-novo-jogo .sessao-on').removeClass('oculto');            
        }
    });

    $("label.fase").on("click", function(){
        $("label.fase").removeClass('selected');
        $(this).addClass('selected');
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
                var sessaoReduzida = "on-line: " + data[i].substr(0, 8) + " " + arraySessao[1];
                if($('#sessao option[value="' + arraySessao[0] + '"]').length === 0) {
                    $('#sessao').append($('<option></option>').val(arraySessao[0]).html(sessaoReduzida));
                }
            });
        }
    });
}

function validaDados(){
    sessao = $("form #sessao").val();
    nomeJogador1on = $("form #player1-on").val();
    nomeJogador1off = $("form #player1-off").val();
    nomeJogador2off = $("form #player2-off").val();
    faseSelecionada = $("form input[name='fase']:checked").val();
    if(sessao == ""){
        alert('Antes de começar, defina a sessão');
        return false;
    } else if((sessao == "novo-on" || sessao == "novo-ia") && nomeJogador1on == "") {
        alert('Antes de começar, digite o seu nome');
        return false;
    } else if(sessao != "novo-on" && sessao != "novo-off" && sessao != "novo-ia" && nomeJogador1on == "") { 
        alert('Antes de começar, digite o seu nome');
        return false;    
    } else if(sessao == "novo-off" && (nomeJogador1off == "" || nomeJogador2off == "")){
        alert('Antes de começar, digite o nome dos dois jogadores');
        return false;    
    } else {
        preparaSessao();
    }
}

function preparaSessao(){
    //se for para criar novo jogo off-line
    if(sessao == "novo-off" || sessao == "novo-ia"){
        iniciaGame();
    //se for para criar novo jogo on-line
    } else if(sessao == "novo-on"){
        $.ajax({
            type: "GET",
            url: urlServerTerritorioInimigo + "/novoJogo.php?_=" + new Date().getTime(),
            data: {player1: nomeJogador1on},
            success: function (data) {
                sessao = data;
                aguardandoOutroJogador();
            }
        });
    } else {
        $.ajax({
            type: "GET",
            url: urlServerTerritorioInimigo + "/novoJogo.php?_=" + new Date().getTime(),
            data: {sessao: sessao, player2: nomeJogador1on},
            success: function (data) {
                iniciaGame();
            }
        });
    }
}

function aguardandoOutroJogador() {
    var sessaoReduzida = sessao.substr(0, 8) + " (" + nomeJogador1on + ")";
    $("#form-novo-jogo").dialog('close');
    dialog2.dialog("open");
    $("#aguardando-jogador").html("Agora você precisa aguardar um outro jogador na sessão que você criou: <br/><strong>" + sessaoReduzida + "</strong>");
    timerNovoJogo = setInterval(function(){
        var arraySessao = sessao.split(" ");
        $.ajax({
            type: "GET",
            url: urlServerTerritorioInimigo + "/jogos/" + arraySessao[0] + "/jogador2.php?_=" + new Date().getTime(),
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
    $('#form-novo-jogo .nome-jogador.sessao-off').removeClass('oculto');
    $('#form-novo-jogo .nome-jogador.sessao-on').addClass('oculto');
    $.ajax({
        type: "GET",
        url: urlServerTerritorioInimigo + "/excluiJogo.php?_=" + new Date().getTime(),
        data: {sessao: sessao}
    });
}

function iniciaGame(){
    if(sessao == "novo-off"){
        window.location.href = "game.html?pl1=" + nomeJogador1off +"&pl2=" + nomeJogador2off + "&fase=" + faseSelecionada;
    } else if(sessao == "novo-ia"){
        window.location.href = "game.html?pl1=" + nomeJogador1on +"&pl2=Computador&fase=" + faseSelecionada; 
    } else {
        window.location.href = "game.html?sessao=" + sessao + "&player=" + nomeJogador1on;
    }
}
