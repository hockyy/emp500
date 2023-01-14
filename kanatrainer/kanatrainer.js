
let index = 0;
let inCorrectAmount = 0;
let totalInCorrect = 0;
let totalCorrect = 0;
let totalAsked = 0;

let jp = undefined;
let ro = undefined;
let input = undefined;
let info = undefined;
let tips = undefined;

let examMode = false;
let question = 0;
let maxQuestions = 10;
let results = [];

let mode = "jp-ro";

let charsetIndex = 0;
let charset = charsets[charsetIndex].set;

let score = undefined;

let charsetInfo = charsets[charsetIndex].info;

function loadApp() {
	console.log("Loading kana trainer app");
	console.log("Initializing elements");
	jp = document.getElementById("kana-jp");
	ro = document.getElementById("kana-ro");
	input = document.getElementById("userInput");
	info = document.getElementById("alert");
	tips = document.getElementById("tips");
	score = document.getElementById("score");
	charsetInfo = document.getElementById("charsetInfo");
	
	tips.hidden = true;
	//displayKana();
	move("next");
	
	$(function() {
		$('[data-toggle="tooltip"]').tooltip();
	});
	
	input.addEventListener("keyup", function(event) {
		if (event.keyCode === 13) {
			event.preventDefault();
			okButtonPressed();
		}
	});
	
	console.log("Kana trainer app loading complete");
}

function loadChart() {
	forcePrintAllCharsets();
}

function viewChart() {
	window.open("./chart.html", "_blank", "toolbar=no, scrollbars=yes, resizable=yes");
}

let lastInCorrect = undefined;
let lastHint = undefined;
function okButtonPressed() {
	console.log("User input: " + input.value);
	let correct = undefined;
	let displayed = undefined;
	
	if (mode === "jp-ro") {
		correct = charset[index].ro;
		displayed = charset[index].jp;
	}
	else {
		correct = charset[index].jp;
		displayed = charset[index].ro;
	}
	
	if (!examMode) {
		if (input.value.toLowerCase() === correct) {
			if (lastHint !== index) ++totalCorrect;		
			
			inCorrectAmount = 0;
			info.innerHTML = '<div class="alert alert-success" role="alert">Correct! ' + displayed + ' &rarr; ' + correct + '</div>';
			move("next")
		}
		else {
			if (lastInCorrect !== index) ++totalInCorrect;
			lastInCorrect = index;
			
			if (inCorrectAmount >= 1) {
				info.innerHTML = '<div class="alert alert-danger" role="alert">Incorrect. Correct answer: ' + correct + '</div>';
				inCorrectAmount = 0;
				lastHint = index;
				input.value = correct;
			}
			else {
				++inCorrectAmount;
				info.innerHTML = '<div class="alert alert-danger" role="alert">Incorrect, try again!</div>';
			}
		}
	}
	else {
		if (input.value.toLowerCase() === correct) {
			info.innerHTML = '<div class="alert alert-success" role="alert">Exam: Correct!</div>';
			results[question] = true;
			++totalCorrect;
		}
		else {
			info.innerHTML = '<div class="alert alert-danger" role="alert">Exam: Incorrect!</div>';
			results[question] = false;
			++totalInCorrect;
		}
		
		if (++question === maxQuestions) {
			examMode = false;
			question = 0;
			info.innerHTML = '<div class="alert alert-primary" role="alert">Exam: Complete. Grade: ' + totalCorrect + "/" + maxQuestions + '</div>';
			window.alert("Exam complete, Grade: " + totalCorrect + " / " + maxQuestions);
			totalCorrect = 0;
			totalInCorrect = 0;
			totalAsked = 0;
		}
		move("next");
	}
	
}

function move(direction) {

	input.value = "";
	
	index = Math.floor(Math.random() * charset.length);
	
	displayKana();
	
	totalAsked++;
	
}

function displayKana() {
	if (mode === "jp-ro") {
		jp.innerText = charset[index].jp;
		ro.innerText = "";
	}
	else {
		jp.innerText = "";
		ro.innerText = charset[index].ro;
	}
	
	if (totalAsked < 1) {
		return;
	}
	
	score.innerText = parseFloat(100*(totalCorrect/totalAsked)).toFixed(2) + " % correct"; //"Correct: " + totalCorrect + ", incorrect: " + totalInCorrect;
}

let fontSizes = ["16px", "24px", "36px", "48px", "64px", "128px"];
let fontIndex = 4;
function toggleKanaFont() {
	if (++fontIndex >= fontSizes.length) {
		fontIndex = 0;
	}
	//console.log(fontSizes[fontIndex]);
	$("#kana-jp").css("font-size", fontSizes[fontIndex]);
	$("#toggleFontButton").html("Font size: " + (fontIndex+1) + "/" + fontSizes.length);
}

function beginExam(max) {
	if (!examMode) {
		window.alert("Exam started.");
		console.log("Max questions: " + max);
		totalAsked = 0;
		totalCorrect = 0;
		totalInCorrect = 0;
		maxQuestions = max;
		examMode = true;
	}
	else {
		window.alert("Exam is already in progress.");
	}
}

function toggleTips() {
	if (!examMode) {
		if (tips.hidden) {
			tips.hidden = false;
		}
		else {
			tips.hidden = true;
		}
	}
	else {
		window.alert("Exam in progress. Cannot perform action.");
	}
}

/* 

font-family: 'DotGothic16', sans-serif;
font-family: 'Noto Sans JP', sans-serif;
font-family: 'RocknRoll One', sans-serif;

*/
let charsetOpen = false;
let fontFamilies = ["font-family: 'DotGothic16', sans-serif;", "font-family: 'Noto Sans JP', sans-serif;", "font-family: 'RocknRoll One', sans-serif;"];
function printAll(charsetSwitched) {
	if (!examMode) {
		let print = document.getElementById("print");
		let html = "";
	
		if (print.innerText.length < 1 || charsetSwitched) {
			html = "<table><tr>";
			
			for (let i = 0; i < charset.length; ++i) {
				let differentFontsKana = "";

				for (let f = 0; f < fontFamilies.length; ++f) {
					differentFontsKana += '<span style="font-size: 32px; ' + fontFamilies[f] + '">' + charset[i].jp + '</span>';
				}
				html += '<td><b style="text-align: center;">' + ((i+1) + '.</b><br>' + differentFontsKana + '<span style="font-size: 16px">' + charset[i].ro) + '</span></td>';
				
				if ((i+1) % 5 === 0 && i !== 0) {
					html += "</tr><tr>"
				}
			}
			
			if (html.endsWith("</tr>")) {
				html += "</table>";
			}
			else {
				html += "</tr></table>";
			}
			
			//console.log(html);
			print.innerHTML = html;
			
			charsetOpen = true;
		}
		else {
			print.innerHTML = "";
			
			charsetOpen = false;
		}
	}
	else {
		window.alert("Exam in progress. Cannot perform action.");
	}
	
}

function forcePrintAllCharsets() {
	let print = document.getElementById("print");
	let html = "";
	let curCs = undefined;
	
	for (let ii = 0; ii < charsets.length; ++ii) {
		curCs = charsets[ii].set;
		console.log(curCs);
		html += '<table style="display: inline-block"><tr>';
		for (let i = 0; i < curCs.length; ++i) {
			html += '<td><b style="text-align: center;">' + ((i+1) + '.</b><br> <span style="font-size: 32px">' + curCs[i].jp + '</span><span style="font-size: 16px">' + curCs[i].ro) + '</span></td>';
			
			if ((i+1) % 5 === 0 && i !== 0) {
				html += "</tr><tr>"
			}
		}
		
		if (html.endsWith("</tr>")) {
			html += "</table>";
		}
		else {
			html += "</tr></table>";
		}
		html += '<span class="spacer"></span>';
	}
	
	console.log(html);
	print.innerHTML = html;
}

function changeMode() {
	if (!examMode) {
		if (mode === "jp-ro") {
			mode = "ro-jp";
		}
		else {
			mode = "jp-ro";
		}
		
		document.getElementById("learningMode").innerHTML = "<b>Learning mode:</b> " + mode;
		displayKana();
	}
	else {
		window.alert("Exam in progress. Cannot perform action.");
	}
	
}

function changeCharset() {
	if (!examMode) {
						
		if (++charsetIndex >= charsets.length) {
			charsetIndex = 0;
		}
				
		let next = charsets[charsetIndex];
		
		charset = next.set;
		charsetInfo.innerHTML = next.info;
		
		totalAsked = 0;
		totalCorrect = 0;
		totalInCorrect = 0;
		
		move("next");
		
		if (charsetOpen) printAll(true);
	}
	else {
		window.alert("Exam in progress. Cannot perform action.");
	}
}