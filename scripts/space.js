import { Flag } from "./flag.js";
import { Contents } from "./contents.js";

export class Space {
	constructor(revealed, contentsToGive, id, flag = Flag.Nothing) {
		this.Revealed = revealed;
		// The contents can either be " " or "M" which stand for an empty space and a mine respectively.
		this.Contents = contentsToGive;
		this.ID = id;
		this.Flag = flag;
		this.Number = 0;
	}

	Reveal() {
		this.Revealed = true;
		let spaceToChange = document.getElementById(this.ID);
		switch (this.Contents) {
			case Contents.Mine:
				spaceToChange.innerHTML = "<img src='media/mine.svg' style='width:95%'>";
				break;
			case Contents.Num:
				spaceToChange.innerHTML = String(this.Number);
				break;
			case Contents.Empty:
				spaceToChange.innerHTML = "";
				break;
			default:
				console.error(`Switch not exhaustive! Tried to switch on: ${this.Contents}`);
				break;
		}
		spaceToChange.style.backgroundColor = "#333";
		spaceToChange.classList.add("activated");
	}
	ChangeID(newId) {
		this.ID = newId;
	}
	ChangeContents(newContents) {
		this.Contents = newContents;
	}
	SetNumber(num) {
		this.Contents = Contents.Num;
		this.Number = num;
	}
	ChangeFlag(newFlag) {
		this.Flag = newFlag;
	}
}
