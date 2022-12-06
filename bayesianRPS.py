# bayesianRPS.py by Diego Padilla
#
# Note that when you run main(), you can only play 50 times before the program terminates. This is because I made this
# code with the intention of solely testing my logic and making a working version, sort of like a skeleton code for the
# actual working project. As such, all of the descriptive function headers will be in this file, as these are the
# functions that actually implement the logic behind my algorithm.
#
# Check out the write-up: https://www.overleaf.com/read/wckbbmkdnwry
# Check out the demo video: https://youtu.be/YELui2iw8Hc
# Check out the website: https://dpadilla03.github.io/

import random


# Function: initial_guess
# ------------------------------------
# Before we find our probabilities, they are all initialized to 1/3, thus our guesses will be random. This function will
# do just that, and randomly generate R, P, or S, a guess of Rock, Paper, Scissors.
def initial_guess():
    random_decider = random.uniform(0, 99.999)
    if random_decider < 33.333:
        return 'R'
    elif 33.333 < random_decider < 66.666:
        return 'P'
    else:
        return 'S'


# Function: prior_given_current
# ------------------------------------
# Given a move prior, and a move current, returns P(Prev = prior | Cur = current) by returning the number of times
# current was played after prior, over the total number of times that current was played in the array, history.
# Can result in 0, prior and current must be "R", "P", or "S".
def prior_given_current(prior, current, history):
    # initializing a counter for the event where Prev = Prior and Cur = current, AND for the total amount of times
    # current appears
    pc_count = 0
    total_current_count = 0
    # Loops through the player's move history
    for i in range(len(history)):
        if history[i] == current:
            # Increments count for Cur = current
            total_current_count += 1
        if history[i] == prior:
            if i != len(history) - 1 and history[i + 1] == current:
                # Increments count for both events in the conditional probability
                pc_count += 1
    # Catches any cases in which we return 0 / 0, which would result in a division by zero error.
    if pc_count == 0:
        return 0
    return pc_count / total_current_count


# Function: did_win
# ------------------------------------
# Given two moves, the user's user and the computer's computer, determine who wins by the rules of Rock Paper Scissors.
# Returns 1 if the user wins, 0 if the user loses, and 2 if the user draws with the computer
def did_win(user, computer):
    if user == 'R':
        if computer == 'R':
            return 2
        elif computer == 'S':
            return 1
        else:
            return 0
    elif user == 'P':
        if computer == 'P':
            return 2
        elif computer == 'R':
            return 1
        else:
            return 0
    else:
        if computer == 'S':
            return 2
        elif computer == 'P':
            return 1
        else:
            return 0


# Function: take_input
# ------------------------------------
# This is a python-version specific function that takes in an input from the user ('R', 'P', or 'S') to store as apart
# of game_history for the main game.
def take_input():
    inp = input('R, P, or S: \n')
    if inp != 'R' and inp != 'S' and inp != 'P':
        # We don't want to have to deal with non rock, paper, or scissors values, so we raise errors for any inputs that
        # break this.
        raise ValueError('Invalid Input!')
    else:
        return inp


# Function: greatest_of
# ------------------------------------
# Given three numbers, p1, p2, p3, returns 0 if p1 is the largest number, 1 if p2 is the largest number, and 2 if p3 is
# the largest number. This function is useful for determining which of the three conditionals is our largest
# probability.
def greatest_of(p1, p2, p3):
    if p1 > p2 and p1 > p3:
        return 0
    elif p2 > p1 and p2 > p3:
        return 1
    else:
        return 2


# Function: prob
# ------------------------------------
# Given a move choice, and a game history history, calculates the user's probability of playing that specific move
# (choice). Useful for calculating our priors and normalization constants as described in the writeup.
def prob(choice, history):
    count = 0
    for i in range(len(history)):
        if history[i] == choice:
            # Counting the number of times choice appeared
            count += 1
    # Returning p(choice)
    return count / len(history)


# Function: compute_answer
# ------------------------------------
# Given three probabilities p1, p2, p3, return rock, paper, or scissors, to oppose the highest probability of a certain
# Meant to be entered in specific order of prob rock given prior move, prob of paper given prior move, prob scissors
# given prior move. For example, if p1 is the highest, then the probability of rock given prior move is the highest,
# so we return paper to counter rock.
def compute_answer(p1, p2, p3):
    if greatest_of(p1, p2, p3) == 0:
        return 'P'
    elif greatest_of(p1, p2, p3) == 1:
        return 'S'
    elif greatest_of(p1, p2, p3) == 2:
        return 'R'


# Function: main
# ------------------------------------
# This function main() acts as the game function in js, and plays the game/has the main code for updating probabilities.
def main():
    # Establishing a new game, with no moves
    num_games = 0
    game_history = []
    last_move = ''

    # Initializing p of r, or s being the current move given r, p, or s being the prior move. These values are
    # initialized as 1 / 3 because before observations we initially believe the player has an equal chance of choosing
    # rock, paper, or scissors.
    p_r_given_r = 1 / 3
    p_r_given_p = 1 / 3
    p_r_given_s = 1 / 3

    p_p_given_r = 1 / 3
    p_p_given_p = 1 / 3
    p_p_given_s = 1 / 3

    p_s_given_r = 1 / 3
    p_s_given_p = 1 / 3
    p_s_given_s = 1 / 3

    # Initializing variables to keep track of the wins, losses, and draws
    comp = 0
    you = 0
    draw = 0

    # This loop keeps the program going for a total of 50 games, as described in the header
    while num_games < 50:
        # The program makes an educated guess using compute_answer() on the conditional probabilities based on the
        # player's previous move. If there was not a previous move, use initial_guess() to initially pick a random
        # choice, rock, paper, or scissors.
        if last_move == 'R':
            computer_guess = compute_answer(p_r_given_r, p_p_given_r, p_s_given_r)
        elif last_move == 'P':
            computer_guess = compute_answer(p_r_given_p, p_p_given_p, p_s_given_p)
        elif last_move == 'S':
            computer_guess = compute_answer(p_r_given_s, p_p_given_s, p_s_given_s)
        else:
            computer_guess = initial_guess()

        # The program takes the user's move
        game_history.append(take_input())
        num_games += 1
        cur = game_history[num_games - 1]

        # Print what we played, and what the computer played
        print(f"You played: {cur}, the computer played: {computer_guess}")

        # Outcome decided using did_win, scores are updated and outcomes are printed
        if did_win(cur, computer_guess) == 1:
            print('You won, for now...')
            you += 1
        elif did_win(cur, computer_guess) == 0:
            print('You lost, the computer won!')
            comp += 1
        else:
            print('Draw, nobody wins!')
            draw += 1

        # Updating probabilities. These will be used as our priors and normalization constants.
        p_r = prob('R', game_history)
        p_p = prob('P', game_history)
        p_s = prob('S', game_history)

        # Print the new probabilities.
        print(f'P: {p_r} {p_p} {p_s}')

        # Depending on what the most recent move was, we update 3 conditional probabilities to determine the next move.
        # The equations and explanations for these are explained in the writeup.
        if num_games > 1:
            if cur == 'R':
                p_r_given_r = (prior_given_current('R', 'R', game_history) * p_r) / p_r
                p_p_given_r = (prior_given_current('R', 'P', game_history) * p_p) / p_r
                p_s_given_r = (prior_given_current('R', 'S', game_history) * p_s) / p_r
            elif cur == 'P':
                p_r_given_p = (prior_given_current('P', 'R', game_history) * p_r) / p_p
                p_p_given_p = (prior_given_current('P', 'P', game_history) * p_p) / p_p
                p_s_given_p = (prior_given_current('P', 'S', game_history) * p_s) / p_p
            else:
                p_r_given_s = (prior_given_current('S', 'R', game_history) * p_r) / p_s
                p_p_given_s = (prior_given_current('S', 'P', game_history) * p_p) / p_s
                p_s_given_s = (prior_given_current('S', 'S', game_history) * p_s) / p_s

        # Print the game history, probabilities, and results
        print(f'{game_history}')
        print(f'Probs of rock (given r, p, s): {p_r_given_r}, {p_r_given_p}, {p_r_given_s}, Probs of paper (given r, p, s): {p_p_given_r}, {p_p_given_p}, {p_p_given_s}, Probs of scissors (given r, p, s): {p_s_given_r}, {p_s_given_p}, {p_s_given_s}')
        print(f'Computer: {comp}, You: {you}, Draws: {draw}\n')

        # Update the last move
        last_move = cur


if __name__ == "__main__":
    main()
