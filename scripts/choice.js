export class Choice {
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
