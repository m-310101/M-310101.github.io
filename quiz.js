let questions = [];
let answers = [];
let corrects = [];
let url = "https://opentdb.com/api.php?amount=10&type=multiple";
let count = -1;
let correct = 0;
let sub = "images/";
let backgrounds = [sub+"back1.gif",sub+"back2.gif",sub+"back3.gif",sub+"back4.gif",sub+"back5.gif",sub+"back6.gif",sub+"back7.gif",sub+"back8.gif",sub+"back9.gif",sub+"back10.gif"];
shuffle(backgrounds);


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

function create_paragraph(text, id) {
  let para = document.createElement("p");
  let node = document.createTextNode(text);
  para.appendChild(node);
  let element = document.getElementById(id);
  element.appendChild(para);
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
  if (count < 9) { // checks if there have been 10 questions or not
    if (!no_check) { // validation that an option has been checked before moving on
      if (count == 8) {
        document.getElementById('button').value = "submit";
      }
      display_question();
    }
  } else {
    let question_element = document.getElementsByClassName("inQuestion")[0];
    //let end_screen = document.getElementsByClassName("end")[0];
    question_element.style.display = "none";
    //end_screen.style.visibility = "visible";
    //document.getElementById("endScore").innerHTML += correct + " out of 10";
    create_paragraph("You got "+correct+" out of 10","end");
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
  document.getElementsByTagName("body")[0].style.backgroundImage = "url("+backgrounds[count]+")";
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

window.onload = function() {
  document.getElementsByTagName("body")[0].style.backgroundImage = "url("+backgrounds[0]+")"
}
