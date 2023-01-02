const differentiator = require('../../lib/node-differentiator');
// $ = window.$;
// MathJax = window.MathJax;

function handleInput(inputFunction) {
    console.log(inputFunction);
    $('#function').attr('disabled', 'disabled');
    $('#derivativeOutput').empty()

    const response = differentiator.getDerivative(inputFunction);
    console.log(response);

    if(response.status == 'success') {
        var html = '';
        html += 'I claim that, ' + response.result;
        html += '<br>';
        for(var i = 0; i < response.story.length; i++) {
            html += response.story[i] + '<br>';
        }
        $('#derivativeOutput').append(html);
        $("#derivativeOutput").css("font-size","95%");
        $("#derivativeOutput").css("color","black");
        MathJax.Hub.Typeset();
    } else {
        $('#derivativeOutput').append('Can\'t understand, sorry :( :(');
        $("#derivativeOutput").css("font-size","100%");
        $("#derivativeOutput").css("color","red");
    }
    $('#function').removeAttr('disabled');

    // $.ajax({
    //     url: '/getDerivative',
    //     type: 'GET',
    //     data: {function: encodeURIComponent(inputFunction)},
    //     success: function(response) {
    //         if(response.status == 'success') {
    //             var html = '';
    //             html += 'I claim that, ' + response.result;
    //             html += '<br>';
    //             for(var i = 0; i < response.story.length; i++) {
    //                 html += response.story[i] + '<br>';
    //             }
    //             $('#derivativeOutput').append(html);
    //             $("#derivativeOutput").css("font-size","95%");
    //             $("#derivativeOutput").css("color","black");
    //             MathJax.Hub.Typeset();
    //         } else {
    //             $('#derivativeOutput').append('Can\'t understand, sorry :( :(');
    //             $("#derivativeOutput").css("font-size","100%");
    //             $("#derivativeOutput").css("color","red");
    //         }
    //     },
    //     error: function(){
    //         alert('Something Went Wrong!');
    //     },
    // });
}

$(document).ready(function() {
    const initialInput = [
        '(1 + sin(x)) ^ 3',
        'ln(sqrt(x) + 1)',
        '10 * (x + tan(x))'
      ][Math.floor(Math.random() * 3)];
    
    $('#function').val(initialInput);
    $('#inputForm').submit(function(e) {
        e.preventDefault();
        var inputFunction = $('#function').val();
        handleInput(inputFunction);
    });
    $('#inputForm').submit();
});
