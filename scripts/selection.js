class Choice {
	constructor(id, width, height, selected = false) {
		this.Element = document.getElementById(id);
		this.Width = width;
		this.Height = height;
		this.Selected = selected;
	}

	Select() {
		this.Selected = true;
		this.Element.classList.add("activated")
	}
	Deselect() {
		this.Selected = false;
		this.Element.classList.remove("activated")
	}
	ChangeSelect() {
		this.Selected = !this.Selected;
		if (this.Element.classList.contains("activated")) {
			this.Element.classList.remove("activated")
		}
		else {
			this.Element.classList.add("activated")
		}
	}
}

function Retry() {
	document.getElementById("retry").style.display = "none";
	document.getElementById("subtitle").innerText = "Implemented using VanillaJS";
	document.getElementById("subtitle").style.color = "white";
	document.getElementById("notice").style.display = "none";
	document.getElementById("selection").style.display = "block";
	container.style.display = "none";
	for (const choice of choices) {
		choice.Deselect();
	}
}

function InitialiseGame(func) {
	for (const choice of choices) {
		if (choice.Selected == false) continue;
		func(choice.Width, choice.Height, container);
		return true;
	}
	return false;
}

let choices = []
choices.push(new Choice("beginner", 9, 9));
choices.push(new Choice("intermediate", 16, 16));
choices.push(new Choice("advanced", 22, 22));

const goButton = document.getElementById("go");
const container = document.getElementById("gameContainer");
const retryButton = document.getElementById("retry");
// Change the selected status when the selection is clicked.
for (let i = 0; i < 3; i++) {
	choices[i].Element.addEventListener("click", () => {
		// Loop through all elements again and change them to false except for the selected one.
		for (let j = 0; j < 3; j++) {
			if (j != i) {
				choices[j].Deselect();
			}
			else {
				choices[i].Select();
			}
		}
	});
}

// Start a game when the go button is clicked.
goButton.addEventListener("click", () => {
	started = InitialiseGame(StartGame);

	// If an option is not selected, then display the notice.
	if (!started) {
		document.getElementById("notice").style.display = "block";
	}
	else {
		document.getElementById("selection").style.display = "none";
		document.getElementById("notice").style.display = "none";
	}
});

retryButton.addEventListener("click", () => {
	InitialiseGame(Retry);
});
