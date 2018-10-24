let questions = [];
let answers = [];
let corrects = [];
let url = "https://opentdb.com/api.php?amount=10&type=multiple";
let count = -1;
let correct = 0;


fetch(url)
  .then(res => res.json())
  .then((out) => {
    for (let i = 0; i < out.results.length; i++) {
      let current = out.results[i];
      let temp_answers = [];
      questions.push(current.question);
      corrects.push(current.correct_answer);
      temp_answers.push(current.correct_answer);
      for (let i = 0; i < current.incorrect_answers.length; i++) {
        temp_answers.push(current.incorrect_answers[i]);
      }
      answers.push(temp_answers);
    }
    console.log(corrects);
    display_question();
  }).catch(err => console.error(err));

window.onload = function() {
function create_paragraph(text, id) {
  let para = document.createElement("p");
  let node = document.createTextNode(text);
  para.appendChild(node);
  if (html_class) {
    let element = document.getElementsByClassName(html_class)[0];
    element.appendChild(para);
  } else {
    let element = document.getElementById(html_id);
    element.appendChild(para);
  }
}
}

function check() {
  let no_check = true;
  let enters = document.getElementsByName("answer");
  for (let i = 0; i < enters.length; i++) {
    if (enters[i].checked) {
      if (enters[i].value == corrects[count]) {
        correct++;
      }
      enters[i].checked = false;
      no_check = false;
    }
  }
  if (count < 9){ // checks if there have been 10 questions or not
    if (!no_check) { // validation that an option has been checked before moving on
      display_question();
    }
  } else {
    let question_element = document.getElementsByClassName("inQuestion")[0];
    //let end_screen = document.getElementsByClassName("end")[0];
    question_element.style.display = "none";
    //end_screen.style.visibility = "visible";
    //document.getElementById("endScore").innerHTML += correct + " out of 10";
    create_paragraph("You got "+correct+" out of 10","endScore");
  }
}

function shuffle(arr) { // simple function to shuffle a given array
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}

function display_question() {
  count++;
  let current_question = questions[count];
  shuffle(answers[count]);
  document.getElementById("question").innerHTML = current_question;
  let labels = document.getElementsByTagName("label"); // finds all label tags and radio tags
  let radios = document.getElementsByName("answer");
  for (let i = 0; i < labels.length; i++) {
    labels[i].innerHTML = answers[count][i]; // sets the text and values to the answers
    radios[i].value = answers[count][i];
  }
  document.getElementById("questionsAnswered").innerHTML = ((count+1) + "/10");
  return count;
}
