$(document).ready(() => {

  let questions = [];
  let answers = [];
  let corrects = [];
  let scores = [];
  let url = "https://opentdb.com/api.php?amount=10&type=multiple";
  let count = -1;
  let correct = 0;
  let sub = "images/";
  let backgrounds = [sub + "back1.gif", sub + "back2.gif", sub + "back3.gif", sub + "back4.gif", sub + "back5.gif", sub + "back6.gif", sub + "back7.gif", sub + "back8.gif", sub + "back9.gif", sub + "back10.gif"];
  shuffle(backgrounds);
  let letter_pos = 0;
  let letter_speed = 50;

  const $introButton = $("#introButton");
  const $nextButton = $("#button");
  const $inQuestion = $(".inQuestion");
  const $name = $("#nameInput");
  const $saveButton = $(".quizButton");
  const $getButton = $(".getScores");
  const db = firebase.firestore();
  const playerScores = db.collection("PlayerScores");

  $introButton.on("click", () => {
    $introButton.css("display","none");
    $("#intro").css("display","none");
    $inQuestion.css("display","block");
  })

  $nextButton.on("click", () => {
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
      //if (!no_check) { // validation that an option has been checked before moving on
      if (count == 8) {
        $nextButton.attr("value","submit");
      }
      display_question();
      //}
    } else {
      $inQuestion.css("display","none");
      setTimeout(function() {
        create_paragraph("you got ", "end", 1);
      }, 500);
      setTimeout(function() {
        typeWriter(correct + " out of 10","end")
      }, 1000)
      $("#end").css("color","white");
      if (correct < 4) {poor();}
      else if(correct < 7) {decent();}
      else if(correct == 10) {aced();}
    }
  })

  $saveButton.on("click", () => {
    post_score();
  })

  $("#nameInput").on("keyup", function (e) {
    if (e.keyCode == 13) {
      post_score();
    }
  })

  $getButton.on("click", () => {
    $(".inner-container").css("display","none");
    $("#high-scores").css("display","block");
    get_scores();
  });

  function post_score() {
    let score = 1;
    if ($name.val()) {
      console.log($name.val());
      playerScores.add({
        name: $name.val(),
        score: score
      }) .then(function(docRef) {
        console.log("doc id: ",docRef.id);
      }) .catch(function(error) {
        console.log(error);
      });
      $name.val("");
    } else {
      console.log("enter a valid name");
    }
  }

  function get_scores() {
    scores = [];
    playerScores.get()
    .then(function(querySnapshot) {
      querySnapshot.forEach((doc) => {
        let temp_score = [];
        temp_score.push(doc.data().name,doc.data().score);
        scores.push(temp_score);
      });
      scores.sort(function(a,b) {
        return b[1] - a[1];
      });
      for (let i = 0; i < scores.length; i++) {
        console.log(scores[i]);
        let $score = $("<li>"+scores[i].join("  ")+"</li>");
        $(".scores").append($score);
      }
    });
  }

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
      intro();
      display_question();
    }).catch(err => console.error(err));

  function typeWriter(text,id) {
    if (letter_pos < text.length) {
      document.getElementById(id).innerHTML += text.charAt(letter_pos);
      letter_pos++;
      setTimeout(typeWriter, letter_speed,text,id);
    } else {letter_pos = 0;}
  }

  function create_paragraph(text, id, number) {
    let para = document.createElement("p");
    para.setAttribute("id", "p" + number)
    let node = document.createTextNode("");
    para.appendChild(node);
    let $element = $("#"+id);
    $element.append(para);
    typeWriter(text,id);
  }

  function poor() {
    setTimeout(function() {
      create_paragraph("are you for real?", "end", 2)
    }, 4500);
    setTimeout(function() {
      typeWriter(" " + correct + " out of 10?","end");
    }, 6000);
    setTimeout(function() {
      create_paragraph("were you even taking this test seriously?", "end", 3)
    }, 8500);
    setTimeout(function() {
      create_paragraph("remember how i said you could win or die?", "end", 4)
    }, 12500);
    setTimeout(function() {
      create_paragraph("well it's time for you to die ;)", "end", 5)
    }, 16500);
    setTimeout(function() {
      window.location.replace("404.html");
    }, 22500);
  }

  function decent() {
    setTimeout(function() {
      create_paragraph("i mean...", "end", 2)
    }, 4500);
    setTimeout(function() {
      typeWriter(" " + correct + " isn't horrible, but it's safe to say there's room for improvement","end");
    }, 6000);
  }

  function aced() {
    setTimeout(function() {
      create_paragraph("huh", "end", 2)
    }, 4500);
    setTimeout(function() {
      typeWriter(" " + correct + " out of 10...","end");
    }, 6000);
    setTimeout(function() {
      create_paragraph("perhaps i may say that i stand corrected", "end", 3)
    }, 8500);
    setTimeout(function() {
      create_paragraph("or...", "end", 4)
    }, 12500);
    setTimeout(function() {
      typeWriter(" perhaps i may say that there may be something else going on", "end")
    }, 14500);
    setTimeout(function() {
      create_paragraph("let me take a guess at what occured", "end",5)
    }, 21500);
    setTimeout(function() {
      cheat = window.open("https://www.google.co.uk/search?source=hp&ei=Y8zRW5lIhpuwB-Dom5AN&q=how+to+cheat+in+an+online+quiz&oq=how+to+cheat+in+an+online+quiz&gs_l=psy-ab.3..0i22i30k1.1871.8215.0.8589.34.32.1.0.0.0.116.2234.28j3.32.0....0...1.1.64.psy-ab..1.33.2303.6..0j35i39k1j0i131i67k1j0i67k1j0i131k1j0i20i263k1j0i131i20i263k1j33i22i29i30k1.64.7IpzOMklmLE","status=1 ");
    }, 25500);
    setTimeout(function() {
      cheat.close()
    },30500);
    setTimeout(function() {
      $(".inner-container").css("display","block");
    }, 32500)
  }

  function break_line(id) {
    let $break_point = $("#"+id);
    $break_point.append(document.createElement("br"));
    $break_point.append(document.createElement("br"));
  }

  function intro_visible() {
    return $("#intro").is(":visible");
  }

  function intro() {
    let id = "intro";
    if (intro_visible()) {
      setTimeout(function() {
        create_paragraph("welcome, welcome to marlon's general (yet very specific) quiz", id, 1);
        if (intro_visible()) {
          setTimeout(function() {
            break_line(id);
            create_paragraph("i'm your host, ", id,2);
            if (intro_visible()) {
              setTimeout(function() {
                typeWriter("marlon bot ;)", id);
                  if (intro_visible()) {
                    setTimeout(function() {
                      break_line(id);
                      create_paragraph("please be prepared to answer 10 random questions,",id,3);
                      if (intro_visible()) {
                        setTimeout(function() {
                          typeWriter(" your life depends on the score you get",id,3);
                          if (intro_visible()) {
                            setTimeout(function() {
                              typeWriter(" (yes that was a threat)",id,3);
                              let $intro_button = $("#introButton");
                              $intro_button.prop("value","start");
                              console.log("6");
                            },2400);
                          }
                          console.log("5");
                        }, 3000);
                      }
                      console.log("4");
                    }, 2300);
                  }
                console.log("3");
              }, 1200);
            }
            console.log("2");
          }, 4500);
        }
        console.log("1");
      }, 500);
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
    document.getElementsByTagName("body")[0].style.backgroundImage = "url(" + backgrounds[count] + ")";
    let current_question = questions[count];
    shuffle(answers[count]);
    document.getElementById("question").innerHTML = current_question;
    let labels = document.getElementsByTagName("label"); // finds all label tags and radio tags
    let radios = document.getElementsByName("answer");
    for (let i = 0; i < labels.length; i++) {
      labels[i].innerHTML = answers[count][i]; // sets the text and values to the answers
      radios[i].value = answers[count][i];
    }
    document.getElementById("questionsAnswered").innerHTML = ((count + 1) + "/10");
    return count;
  }
  $("body").css("background-image","url("+backgrounds[0]+")");
})



/*

- could set text for type writer to array of sentences and loop through them, creating time waiting based off of character length
- change the way the timing is structured

*/
