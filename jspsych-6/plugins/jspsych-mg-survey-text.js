/**
 * jspsych-survey-text
 * a jspsych plugin for free response survey questions
 *
 * Josh de Leeuw
 *
 * documentation: docs.jspsych.org
 *
 */


jsPsych.plugins['mg-survey-text'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'survey-text',
    description: '',
    parameters: {
      questions: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        array: true,
        pretty_name: 'Questions',
        default: undefined,
        nested: {
          prompt: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Prompt',
            default: undefined,
            description: 'Prompts for the subject to response'
          },
          value: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Value',
            array: true,
            default: null,
            description: 'The strings will be used to populate the response fields with editable answers.'
          },
          rows: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: 'Rows',
            array: true,
            default: 1,
            description: 'The number of rows for the response text box.'
          },
          columns: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: 'Columns',
            array: true,
            default: 3,
            description: 'The number of columns for the response text box.'
          }
        }
      },
      end_prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'End Prompt',
        default: null,
        description: 'The text that appears at the end of the text box.'
      },
      preamble: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Preamble',
        default: null,
        description: 'HTML formatted string to display at the top of the page above all the questions.'
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Continue',
        description: 'The text that appears on the button to finish the trial.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {
    var plugin_id_name = "jspsych-mg-survey-text";
    var plugin_id_selector = '#' + plugin_id_name;
    var _join = function( /*args*/ ) {
      var arr = Array.prototype.slice.call(arguments, _join.length);
      return arr.join(separator = '-');
    }

    if (typeof trial.questions[0].rows == 'undefined') {
      trial.questions[0].rows = [];
      for (var i = 0; i < trial.questions.length; i++) {
        trial.questions[i].rows.push(1);
      }
    }
    if (typeof trial.questions[0].columns == 'undefined') {
      trial.questions[0].columns = [];
      for (var i = 0; i < trial.questions.length; i++) {
        trial.questions[i].columns.push(40);
      }
    }
    if (typeof trial.questions[0].value == 'undefined') {
      trial.questions[0].value = [];
      for (var i = 0; i < trial.questions.length; i++) {
        trial.questions[i].value.push("");
      }
    }


    var html = '';
    // bring it lower on screen

    html += '<div style="padding-top:60px;">';
    // show preamble text
    if(trial.preamble !== null){
      html += '<div id="jspsych-survey-text-preamble" class="jspsych-survey-text-preamble">'+trial.preamble+'</div>';
    }
    // add questions
    for (var i = 0; i < trial.questions.length; i++) {
      html += '<div id="jspsych-survey-text-"'+i+'" class="jspsych-survey-text-question" style="margin: 2em 0em;">';
      html += '<p class="jspsych-survey-text">' + trial.questions[i].prompt + '</p>';
      html += '<textarea name="#jspsych-survey-text-response-' + i + '" rows="1"  cols="3" maxlength="3" autofocus></textarea>';
      if(trial.end_prompt !== null){
        html += trial.end_prompt;
      }
      html += '</div></div>';
    }


    // validation: only allow numbers in text box
    $(document).ready(function () {
      $('textarea').keypress(function(e) {
        var a = [];
        var k = e.which;
        for (i = 48; i < 58; i++)
          a.push(i);
        if (!(a.indexOf(k)>=0))
          e.preventDefault();
      });
    })

    // add submit button
    html += '<button id="jspsych-survey-text-next" class="jspsych-btn jspsych-survey-text">'+trial.button_label+'</button>';;


    display_element.innerHTML = html;

    display_element.querySelector('#jspsych-survey-text-next').addEventListener('click', function() {
      // measure response time
      var endTime = (new Date()).getTime();
      var response_time = endTime - startTime;

      // create object to hold responses
      var question_data = {};
      var matches = display_element.querySelectorAll('div.jspsych-survey-text-question');
      for(var index=0; index<matches.length; index++){
        var id = "Q" + index;
        var val = matches[index].querySelector('textarea').value;
        var obje = {};
        obje[id] = val;
        Object.assign(question_data, obje);
      }
      // save data
      var trialdata = {
        "rt": response_time,
        "responses": question_data.Q0
      };

      display_element.innerHTML = '';

      // next trial
      jsPsych.finishTrial(trialdata);
    });



    var startTime = (new Date()).getTime();
  };

  return plugin;
})();
