# Writing Suitable MathELO Problems

## Style Guidelines for Problems

### Do We Care about Guessing?

No. People should be able to guess the answers.

Trust the ELO algorithm to reward people who have knowledge and people who guess.

### Are Word Problems Okay?

Yes, with reservations. 

A word problem should be a short paragraph, no longer.

The word problem should not resemble a riddle.

The word problem should be so simple that a Google Translate query would translate it correctly.

### Do We Like Riddles?

No. Riddles deserve scorn.

Brain teasers are extremely dubious. Even Martin-Gardner-style questions like the one about
the monks going up and down the mountain are not the ones we are looking for.

### Jo Boaler Math?

We hate Jo Boaler Math.

There is such a thing as a right answer. Not everyone is a winner, reinventing the wheel is usually a 
waste of time (and most people get it wrong), and skill matters.

### Are Memorized Answers Okay?

Yes. Knowledge of this type has value.

However, the time limit for these sorts of questions should be so low that Googling the question is 
impossible.

Some may worry that memorized knowledge is a bad thing. These are the sorts of people who cannot 
reliably tell the difference between someone who has memorized a table of integrals and someone
who can do calculus.

``` tex

How many two-dimensional point groups exist that could be used to map an infinite tesselation 
back onto itself?


```

The answer to the latter example problem could be memorized, but anyone who has taken Abstract Algebra 
would probably have to calculate the answer. 

(The answer is 10: five cyclic groups, and five dihedral groups.)

### Should there Be Calculator Problems?

No. 

A reasonably skilled person should be able to do every MathELO problem without a calculator. Indeed,
most problems should be solvable without pen and paper.

Most Mathematics professors would not be able to calculate "calculate the product of 1311 and 357" 
without a pen and paper. And
if these professors were given a problem like this one when using the website, they would log off. 
(The problem is tedious and boring.) Therefore we should avoid problems like that one.

On the other hand, a problem like "calculate the product of 1001 and 999" is arguably ok because it 
is an indirect way of testing whether the player knows about the difference of squares pattern. ( 1001 x 999 = (1000 + 1)(1000 - 1) = 1000^2 - 1 = 999999)

### Should We Include College Math Material?

Yes. Calculus (Single and Multiple Variable), Linear Algebra, and Differential Equations are fine.

Some Combinatorics and Discrete Math problems should also be fine.

### Is a Square a Rectangle?

Yes.

This is not a trivial question. The site will have to have standards about certain definitions. For 
example, do the Natural Numbers include zero? Textbooks disagree. Similarly, textbooks disagree 
whether a square is a rectangle.

The site will have to be consistent and open about these things.

### Can you Copyright a Problem? (Can We Copy Problems?)

As far as I can tell, most Mathematics problems cannot be copyrighted. You cannot copyright "2 x 5",
nor can you copyright a question that asks you to calculate an integral.

Word problems are likely a gray area.

You cannot copy someone else's Geometry diagram and use it, but I imagine that you can create your
own pbolem that contains an equivalent figure and asks the student to solve an equivalent problem. 
(For example, Xeroxing the Pons Asinorum diagram from someone's Euclid Volume 1 would probably not 
be okay, but recreating the Pons Asinorum diagram is probably fine.)

## Problems: By Answer Type

### 3-digit Non-Negative Integer, or Negative Integer from -99 to -1

Most problems should have an answer that is an integer with
fewer than four digits.

Problems that ask people to calculate the product of two three-digit numbers are of limited value
and interest. Knowing the times tables is important, knowing how to be a human calculator is not important.

``` tex

What is 5 times 13?

```

Another reason for three-digit answers: we want people to be able to punch the correct answer into their phone even if they're standing up on the city bus, holding on to a strap.

### Always, Sometimes, Never 

This type of problem states a conjecture. The player has to say whether the conjecture is "always true" (meaning that it is a theorem), "sometimes true," or "never true." 

These sorts of problems are good for testing whether a person understands Geometry and logical 
inference.

### Inequality Multiple Choice

The player is given two quantities. The player has to identify which inequality sign explains the
relationship between the two quantities.

The equals sign should be one of the options. 

The same seven options will be available each time, so the chance of guessing successfully will
be minimized.

### Select the Range

The question proposes seven ranges of real numbers on the number line. The correct answer is within
one of those ranges.

### Lattice Point Drawing

The player places two or three points onto a grid to provide the answer. 

For example, "Plot y = 3x - 2" could be answered by selecting the points (0,-2) and (0,1). 

Another usage of this: draw the interval of convergence for an infinite series.

### LLM-parsed Natural Language Answer

It should be possible to train a LLM to interpret and grade natural language answers.

This type of question should only be available to paid subscribers. LLM tokens are expensive.

Example problem:

``` tex

You and a friend are watching a roulette wheel in a casino. The last three spins of the wheel have
landed on red, rather than black. Your friend says it's a good time to bet on black, because it's 'due.'

Is your friend right or wrong, and why?

```

The LLM would have to be trained to reject the answer "wrong" but accept the answer "The friend is 
wrong because each spin of a roulette wheel should be independent. The probability of landing on 'black' will not depend on the three most recent spins."


### Algebraic Expressions

It will be necessary to create problems that allow the following to appear in answers:

 - Radicals
 - Special Constants (such as pi)
 - Polynomials

### Specify the Function

Some questions should have a function as an answer. This will be tricky to grade because functions
can take on different forms.

To some extent the trickiness can be avoided by asking the function to be stated in standard form.

## Problems: By Question Type

### SVG Standard

Currently the only type of problem we will support is one where the question can be stated within
a small SVG file that can be viewed easily on a cell phone or on a desktop computer.

This means that geometry problems will have to be simple, if we choose to have them at all.
