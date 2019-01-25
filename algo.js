// Fitness Aspects

// Character Length -- This is a scale
// How many individual characters are correct -- This can be a scale



"use strict";

var charLength;
var characters;
var characterNumber;
var startTime;
var date = new Date();
var totalGenerations;
var totalLifeforms;

function integerToLetter(x = false){
	if(x === false){
		return "Missing Parameter";
	}
	if(x === 27){
		return String.fromCharCode(32);
	}
	return String.fromCharCode(x + 65);
}

// Returns a letter between a-z

function randLetter(){
	characterNumber = Math.floor( (Math.random() * 28) );
	return integerToLetter(characterNumber).toLowerCase();
}

// This function is responsbile for creating the lifeform and clearing
// any previous values

function randomLifeform(){
	charLength = Math.floor( (Math.random() * 10) + 1 );
	characters = "";
	for(var i = 0; i<charLength; i++){
		characters += randLetter();
	}
	var lifeform = characters;
	return lifeform;
}

// This should initialize everything

function initFunc(targetLifeform){
	
	startTime = date.getTime();
	var generation = [];
	//console.log("Creating seed generation of 1000 lifeforms" );
	for(var i = 0; i < 1000; i ++){
		var thisLifeform = randomLifeform();
		generation.push(thisLifeform);
	}
	totalLifeforms = 1000;
	totalGenerations = 1;
	//console.log("First Generation: " + generation);
	var elite = generationCleansing(generation, targetLifeform); // top 10%
	recursiveFunction(elite, targetLifeform);
}

function recursiveFunction(generation, targetLifeform){
	var newGen = [];
	console.log(generation);
	//console.log("Fitness: " + calculateFitness(generation[0], targetLifeform) );
	//console.log("Mutating generation");
	for(var i = 0; i < generation.length; i++){
		for(var i2 = 0; i2 < 100; i2++){
			newGen.push( mutate(generation[i]) );
		}
	}
	totalLifeforms += newGen.length;
	totalGenerations++;
	//console.log("Generation mutated");
	//console.log("Now we have a new generation with " + newGen.length + " lifeforms: " + newGen);
	//console.log("Checking fitness of each lifeform");
	for(var i3 = 0; i3 < newGen.length; i3++){
		if (calculateFitness(newGen[i3], targetLifeform) > 0.99){
			console.log("Found lifeform with fitness greater than 0.99: " + newGen[i3]);
			console.log("This lifeform was found in generation number " + totalGenerations);
			console.log("Out of a total of " + totalLifeforms + " lifeforms");
			return;
		}
	}
	var targetLifeform = targetLifeform;
	recursiveFunction( generationCleansing(newGen, targetLifeform), targetLifeform );
}

// This function finds elite lifeForms. The lifeForms in the top 10%
// and puts them into their own array.
// This function returns the elite of the current generation

function generationCleansing(generation, targetLifeform){
	var elite = [];
	//console.log("Commencing generation cleansing");
	for(var generationIterator = 0; generationIterator < generation.length; generationIterator++){
		if(elite.length < 10){
			elite.push(generation[generationIterator]);
		}
		else{
			for(var eliteIterator = 0; eliteIterator < elite.length; eliteIterator++){
				if(typeof generation[generationIterator] === "undefined"){
					generation[generationIterator] = ""; // Cheap solution
				}
				if( calculateFitness(elite[eliteIterator], targetLifeform) < calculateFitness(generation[generationIterator], targetLifeform) ){
					elite[eliteIterator] = generation[generationIterator];
					generationIterator++;
				}
			}
		}
	}
	return elite;
}

// When a lifeform mutates there is a 5% chance it's char length
// will change and a 5% chance any given character will change

function mutate(lifeform){
	// Add a letter
	if( Math.random() > 0.3 ){ // 30%
		var offset = Math.floor( Math.random() * (lifeform.length + 1) ) ;
		lifeform = lifeform.split("");
		lifeform.splice(offset, 1, lifeform[offset] + randLetter() );
		return lifeform.join("");
	}
	// Change a letter
	else if( Math.random() > 0.5 ){ // 35%
		var offset = Math.floor( Math.random() * (lifeform.length + 1) ) ;
		lifeform = lifeform.split("");
		lifeform.splice(offset, 1, randLetter() );
		return lifeform.join("");
	}
	// Remove a letter
	else{
		var offset = Math.floor( Math.random() * (lifeform.length + 1) ) ;
		lifeform = lifeform.split("");
		lifeform.splice(offset, 1, "" );
		return lifeform.join("");
	}
}

function calculateFitness(lifeForm, targetLifeform){
	var lengthFitness =  matchingLength(lifeForm, targetLifeform)// Higher is better. 1 is perfect.
	var matchFitness = matchingChars(lifeForm, targetLifeform); // Higher is better. 1 is perfect.
	return (lengthFitness + matchFitness) / 2;
}

function matchingLength(lifeForm, targetLifeform){
	var theOffset = Math.abs(lifeForm.length - targetLifeform.length);
	return ( 1 - (theOffset / targetLifeform.length) );
}

// The calculation to see how many matching letters
// the current lifeform has with the target lifeform
// is slightly complicated. So I've created a function
// for doing just that. This function returns the percentage
// of matching characters in decimal notation. 0.2 = 20%

function matchingChars(lifeForm, targetLifeform){
	var matchedLetters = 0;
	lifeForm = lifeForm.toLowerCase();
	targetLifeform = targetLifeform.toLowerCase();
	for(var i = 0; i < lifeForm.length && i < targetLifeform.length; i++){
		if( lifeForm.substring(i, i+1) === targetLifeform.substring(i, i+1) ){
			matchedLetters++;
		}
	}
	return (matchedLetters / lifeForm.length);
}
