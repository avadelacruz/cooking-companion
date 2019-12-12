import React from "react";

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;
const API = "https://cooking-companion-api.herokuapp.com";

export default class TitleEdit extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			previousValue: props.title,
			currentValue: props.title
		};
	}

	saveToDatabase = async () => {
		// save new title to db using PUT
		let author = this.props.author;
		let originalTitle = this.props.title;
		let requestBody = { title: this.state.currentValue };

		let url = `${API}/recipes/${author}/${originalTitle}`;
		const response = await fetch(url, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(requestBody)
		});
		if (response.ok) {
			let updatedRecipe = await response.json();
			this.props.showNotification("Recipe edits sucessfully saved.");
			this.props.reloadFavorites();
		} else {
			this.props.showNotification("Error updating recipe.");
		}
	};

	handleKeyUp = event => {
		const { keyCode } = event;
		const { currentValue, previousValue } = this.state;

		if (keyCode === ENTER_KEY) {
			if (this.props.title === this.state.currentValue) {
				this.setState({ currentValue: previousValue });
			} else {
				this.setState({ previousValue: currentValue });
				this.saveToDatabase();
				this.props.updateTitle(currentValue);
			}

			this.props.turnOffEditMode();
		} else if (keyCode === ESCAPE_KEY) {
			this.setState({ currentValue: previousValue });
			this.props.turnOffEditMode();
		}
	};

	handleChange = event => {
		this.setState({
			currentValue: event.target.value
		});
	};

	render() {
		return (
			<input
				type="text"
				value={this.state.currentValue}
				onKeyUp={this.handleKeyUp}
				onChange={this.handleChange}
				autoFocus
			></input>
		);
	}
}
