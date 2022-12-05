// Establishing all of our variables and our elemnts from HTML to work with below
var num_games = 0
var game_history = []
var last_move = ""

// p of r, or s being the current move given r, p, or s being the prior move, stored as [R, P, S]
var p_r_given_r = 1 / 3
var p_r_given_p = 1 / 3
var p_r_given_s = 1 / 3

var p_p_given_r = 1 / 3
var p_p_given_p = 1 / 3
var p_p_given_s = 1 / 3

var p_s_given_r = 1 / 3
var p_s_given_p = 1 / 3
var p_s_given_s = 1 / 3
var comp = 0
var you = 0
var draw = 0

// HTML elements
var you_page = document.getElementById("user-score");
var comp_page = document.getElementById("computer-score");
var draw_page = document.getElementById("draws");
var sb_query = document.querySelector(".scores");
var r_query = document.querySelector(".result");
var rock_choice = document.getElementById("rock");
var paper_choice = document.getElementById("paper");
var scissors_choice = document.getElementById("scissors");
var sc_unlock = document.getElementById("sec_button");
var reset_b = document.getElementById("reset_button");
var initial_exp = document.getElementById("largetext1");
var final_exp = document.getElementById("bayesian_probs");
var initial_pg = document.getElementById("pg1");
var final_pg = document.getElementById("pg2");

var p_r_given_r_display = document.getElementById("p_r_given_r");
var p_r_given_p_display = document.getElementById("p_r_given_p");
var p_r_given_s_display = document.getElementById("p_r_given_s");

var p_p_given_r_display = document.getElementById("p_p_given_r");
var p_p_given_p_display = document.getElementById("p_p_given_p");
var p_p_given_s_display = document.getElementById("p_p_given_s");

var p_s_given_r_display = document.getElementById("p_s_given_r");
var p_s_given_p_display = document.getElementById("p_s_given_p");
var p_s_given_s_display = document.getElementById("p_s_given_s");


// Function game() governs the actual game and adjusts the probabilities as necessary. Acts as 'main()' from the pycharm source code, more info there.
function game(user_play) {
    var computer_guess;
    if (last_move == "R") {
        computer_guess = compute_highest_probs(p_r_given_r, p_p_given_r, p_s_given_r);
    } else if (last_move == "P") {
        computer_guess = compute_highest_probs(p_r_given_p, p_p_given_p, p_s_given_p);
    } else if (last_move == "S") {
        computer_guess = compute_highest_probs(p_r_given_s, p_p_given_s, p_s_given_s);
    } else {
        computer_guess = initial_guess();
    }

    game_history.push(user_play);
    num_games ++;
    console.log("You played: " + user_play + ", Bayes Played: " + computer_guess);
    console.log(game_history)

    game_result = did_win(user_play, computer_guess);
    
    if (game_result == 1) {
        you ++;
    } else if (game_result == 0) {
        comp ++;
    } else {
        draw ++;
    }

    you_page.innerHTML = you;
    comp_page.innerHTML = comp;
    draw_page.innerHTML = "Draw: " + draw.toString();

    const p_r = probability("R", game_history);
    const p_p = probability("P", game_history);
    const p_s = probability("S", game_history);

    r_query.innerHTML = "You Played: " + user_play + ", Bayes Played: " + computer_guess + message(game_result);
    console.log("r: " + p_r + ", p: " + p_p + ", s: " + p_s)

    if (num_games > 1) {
        if (user_play == "R") {
            p_r_given_r = (prior_given_current("R", "R", game_history) * p_r) / p_r;
            p_p_given_r = (prior_given_current("R", "P", game_history) * p_p) / p_r;
            p_s_given_r = (prior_given_current("R", "S", game_history) * p_s) / p_r;
        } else if (user_play == "P") {
            p_r_given_p = (prior_given_current("P", "R", game_history) * p_r) / p_p;
            p_p_given_p = (prior_given_current("P", "P", game_history) * p_p) / p_p;
            p_s_given_p = (prior_given_current("P", "S", game_history) * p_s) / p_p;
        } else {
            p_r_given_s = (prior_given_current("S", "R", game_history) * p_r) / p_s;
            p_p_given_s = (prior_given_current("S", "P", game_history) * p_p) / p_s;
            p_s_given_s = (prior_given_current("S", "S", game_history) * p_s) / p_s;
        }
    }

    p_r_given_r_display.innerHTML = "Probability of you playing rock given previous rock: " + (p_r_given_r * 100).toString() + "%";
    p_r_given_p_display.innerHTML = "Probability of you playing rock given previous paper: " + (p_r_given_p * 100).toString() + "%";
    p_r_given_s_display.innerHTML = "Probability of you playing rock given previous scissors: " + (p_r_given_s * 100).toString() + "%";
    
    p_p_given_r_display.innerHTML = "Probability of you playing paper given previous rock: " + (p_p_given_r * 100).toString() + "%";
    p_p_given_p_display.innerHTML = "Probability of you playing paper given previous paper: " + (p_p_given_p * 100).toString() + "%";
    p_p_given_s_display.innerHTML = "Probability of you playing paper given previous scissors: " + (p_p_given_s * 100).toString() + "%";
    
    p_s_given_r_display.innerHTML = "Probability of you playing scissors given previous rock: " + (p_s_given_r * 100).toString() + "%";
    p_s_given_p_display.innerHTML = "Probability of you playing scissors given previous paper: " + (p_s_given_p * 100).toString() + "%";
    p_s_given_s_display.innerHTML = "Probability of you playing scissors given previous scissors: " + (p_s_given_s * 100).toString() + "%";
    console.log("P_R (given R, P, S): " + p_r_given_r + ", " + p_r_given_p + ", " + p_r_given_s + ", P_P (given R, P, S): " + p_p_given_r + ", " + p_p_given_p + ", " + p_p_given_s + ", P_S (given R, P, S): " + p_s_given_r + ", " + p_s_given_p + ", " + p_p_given_s)
    last_move = user_play;
    if (num_games >= 50){
        sc_unlock.style.display = "block";
        reset_b.style.display = "block";
        sc_unlock.style.padding = "10px";
        reset_b.style.padding = "10px";
    }
}

// Function message() exclusive to js version, simply helps display the result message
function message(result) {
    if (result == 1) {
        return ", You Win! :)";
    } else if (result == 0) {
        return ", You Lost :("
    } else{
        return ", It's a draw :/"
    }
}

// Function reset() exclusive to js version, resets the game stats so it can keep going
function reset() {
    num_games = 0
    game_history = []
    last_move = ""

    p_r_given_r = 1 / 3
    p_r_given_p = 1 / 3
    p_r_given_s = 1 / 3

    p_p_given_r = 1 / 3
    p_p_given_p = 1 / 3
    p_p_given_s = 1 / 3

    p_s_given_r = 1 / 3
    p_s_given_p = 1 / 3
    p_s_given_s = 1 / 3
    comp = 0
    you = 0
    draw = 0

    you_page.innerHTML = you;
    comp_page.innerHTML = comp;
    draw_page.innerHTML = "Draw: " + draw.toString();
    r_query.innerHTML = "-";

    p_r_given_r_display.innerHTML = "Probability of you playing rock given previous rock: " + (p_r_given_r * 100).toString() + "%";
    p_r_given_p_display.innerHTML = "Probability of you playing rock given previous paper: " + (p_r_given_p * 100).toString() + "%";
    p_r_given_s_display.innerHTML = "Probability of you playing rock given previous scissors: " + (p_r_given_s * 100).toString() + "%";
    
    p_p_given_r_display.innerHTML = "Probability of you playing paper given previous rock: " + (p_p_given_r * 100).toString() + "%";
    p_p_given_p_display.innerHTML = "Probability of you playing paper given previous paper: " + (p_p_given_p * 100).toString() + "%";
    p_p_given_s_display.innerHTML = "Probability of you playing paper given previous scissors: " + (p_p_given_s * 100).toString() + "%";
    
    p_s_given_r_display.innerHTML = "Probability of you playing scissors given previous rock: " + (p_s_given_r * 100).toString() + "%";
    p_s_given_p_display.innerHTML = "Probability of you playing scissors given previous paper: " + (p_s_given_p * 100).toString() + "%";
    p_s_given_s_display.innerHTML = "Probability of you playing scissors given previous scissors: " + (p_s_given_s * 100).toString() + "%";
}

// Function initial_guess () creates an initial guess for the game, more info on pycharm source code.
function initial_guess() {
    var random_decider;
    random_decider = Math.random(0, 1);
    if (random_decider < 0.333) {
        return "R";
    } else if (0.333 < random_decider && random_decider < 0.666) {
        return "P";
    } else {
        return "S";
    }
}

// Calculates the probability of your prior guess being prior given current guess current from array history. More info in pycharm source code.
function prior_given_current(prior, current, history) {
    var pc_count = 0;
    var total_current_count = 0;
  
    for (let i = 0; i < game_history.length; i++) {
        if (history[i] == current) {
            total_current_count ++;
        }
        if (history[i] == prior) {
            if (i != history.length - 1 && history[i + 1] == current) {
            pc_count ++;
        }
      }
    }
    if (pc_count == 0) {
        return 0;
    }
    return pc_count / total_current_count;
}

// Calculates winner. More info in pycharm source code.
function did_win(user, computer) {
    if (user == "R") {
        if (computer == "R") {
            return 2;
        } else if (computer == "S") {
            return 1;
        } else {
            return 0;
        }
    } else if (user == "P") {
        if (computer == "P") {
            return 2;
        } else if (computer == "R") {
            return 1;
        } else {
            return 0;
        }
    } else {
        if (computer == "S") {
            return 2;
        } else if (computer == "P") {
            return 1;
        } else {
            return 0;
        }
    }
}

// Returns the greatest probability of the 3 given. More info in pycharm source code.
function greatest_of(p1, p2, p3) {
    if (p1 > p2 && p1 > p3) {
        return 0;
    } else if (p2 > p1 && p2 > p3) {
        return 1;
    } else {
        return 2;
    }
}

// Given the greatest probability from greatest_of(), return a guess. More info in pycharm source code.
function compute_highest_probs(p1, p2, p3) {
    const computed = greatest_of(p1, p2, p3);
    if (computed == 0) {
        return "P"
    } else if (computed == 1) {
        return "S"
    } else if (computed == 2) {
        return "R"
    }
}

// Finds probability of a move choice given array history. More info in pycharm source code.
function probability(choice, history){
    var count = 0;
    for (let i = 0; i < history.length; i++){
        if (history[i] == choice) {
            count ++;
        }
    }
    return count / history.length;
}

// Exclusive to js version, allows for the reveal and unlock of reset and secret buttons
function unlock() {
    sc_unlock.style.display = "none";
    initial_exp.style.display = "block";
    final_exp.style.display = "block";
    initial_pg.style.display = "block";
    final_pg.style.display = "block";
    
}

// main() on js version acts on inputs from the HTML elements
function main(){
    rock_choice.addEventListener('click', function() {
        game("R");
    })
    paper_choice.addEventListener('click', function() {
        game("P");
    })
    scissors_choice.addEventListener('click', function() {
        game("S");
    })
    reset_b.addEventListener('click', function()  { 
        reset();
    })
    sc_unlock.addEventListener('click', function() {
        unlock();
    })
}

main();