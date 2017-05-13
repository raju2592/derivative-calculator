$ = window.$;
MathJax = window.MathJax;

function handleInput(inputFunction) {
    $('#function').attr('disabled', 'disabled');
    $('#derivativeOutput').empty()
    $.ajax({
        url: '/getDerivative',
        type: 'GET',
        data: {function: encodeURIComponent(inputFunction)},
        success: function(response) {
            var html = '';
            html += 'Derivative of the give function is ' + response.result;
            html += '<br>';
            for(var i = 0; i < response.story.length; i++) {
                html += '<p>' + response.story[i] + '</p>' + '<br>'
            }
            $('#derivativeOutput').append(html);
            $("#derivativeOutput").css("font-size","100%");
            MathJax.Hub.Typeset();
            $('#function').removeAttr('disabled');
        },
        error: function(){

        },
    });
}

$(document).ready(function() {
    $('#inputForm').submit(function(e) {
        e.preventDefault();
        var inputFunction = $('#function').val();
        handleInput(inputFunction);
    });
});
