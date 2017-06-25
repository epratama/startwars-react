import React from "react";
import { render } from "react-dom";
import axios from 'axios';
import './css/main.scss';

import { Character } from "./components/Character.js";
import { Modal } from "./components/Modal.js";

class App extends React.Component {
	constructor(props) {
		super();
		this.state = {
			loading: true,
			data: {},
			dataOutput: {},
			search: '',
			modal: '',
			charCounter: 0,
			callback: function(response) {
				if(typeof response !== 'undefined') {
					if(typeof response.data.results !== 'undefined' && response.data.results.length > 0) {
						let tmp = this.state.data;
						let counter = this.state.charCounter;
						for(let value of response.data.results) {
							value.popularity = 0;
							value.pid = counter;
							value.comments = [];
							tmp[counter] = value;
							counter++;
						}

						this.setState({
							data: tmp,
							charCounter: counter
						});

						if(typeof response.data.next !== 'undefined' && response.data.next !== null) {
							this.fetchData(response.data.next, this.state.callback.bind(this));
						} else {
							let tmpOutput = [];
							for(let [key, value] of Object.entries(this.state.data)) {
								tmpOutput.push(value);
							}
							this.setState({
								dataOutput: tmpOutput
							});

							this.setLoading();
						}

					}
				}
			}
		};
	}

	componentDidMount() {
		this.fetchData('http://swapi.co/api/people/?page=1', this.state.callback.bind(this));
	}

	setLoading() {
		this.setState({
			loading: !this.state.loading
		});
	}

	fetchData(url = '', callback = '') {
		if(url !== '') {
			axios.get(url)
			.then(function (response) {
				if(typeof callback === 'function') {
					callback(response);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
		}
	}

	openModal(key = '') {
		if(key !== '') {
			if(typeof this.state.data[key] !== 'undefined') {
				this.setState({
					modal: key
				})
			}
		}
	}

	closeModal() {
		this.setState({
			modal: ''
		})
	}

	onChangeSearch(event) {
		this.setState({
			search: event.target.value
		});
	}

	vote(scope = '', charID = '') {
		if(scope !== '' && charID !== '') {
			let tmp = this.state.data;
			switch(scope) {
				case 'plus':
					tmp[charID].popularity += 1;
					break;
				case 'minus':
					tmp[charID].popularity -= 1;
					break;
			}

			this.setState({
				data: tmp
			});

			this.doSort();
		}
	}

	writeComment(key = '', comment = '') {
		if(key !== '' && comment !== '') {
			var tmp = this.state.data;
			var tmpComment = tmp[key].comments;
			tmpComment.push(comment);
			tmp[key].comments = tmpComment;

			this.setState({
				data: tmp
			});

			this.doSort();
		}
	}

	doSort() {
		let tmpOutput = [];
		for(let [key, value] of Object.entries(this.state.data)) {
			tmpOutput.push(value);
		}

		tmpOutput = tmpOutput.sort((a, b) => {
			return b.popularity - a.popularity;
		});

		this.setState({
			dataOutput: tmpOutput
		});
	}

	render() {
		let output = '';
		let searchBox = '';
		if(this.state.loading) {
			output = (
				<div className="center loading">
					<i className="fa fa-spinner fa-spin fa-5x fa-fw"></i>
					<span className="sr-only">Loading...</span>
				</div>
			);
		} else {
			searchBox = (
				<div>
					<input onChange={(event) => this.onChangeSearch(event)} className="searchBox" type="text" name="search" placeholder="Search character name" value={this.state.search} />
				</div>
			);

			if(typeof this.state.dataOutput !== 'undefined') {
				output = this.state.dataOutput.map((value, key) => {
			   		let proceed = false;
			   		if(this.state.search === '') {
			   			proceed = true;
			   		} else {
			   			let name = value.name.toLowerCase();
			   			let keyword = this.state.search.toLowerCase();

			   			if(name.indexOf(keyword) >= 0) {
			   				proceed = true;
			   			}
			   		}

			   		if(proceed) {
			   			return (<Character
			   							key={key}
			   							charID={value.pid}
			   							name={value.name}
			   							popularity={value.popularity}
			   							openModal={this.openModal.bind(this)}
			   							vote={this.vote.bind(this)}
			   						/>
			   						);
			   		}
			    });
			}
		}

		let modal = this.state.modal !== '' ? (<Modal
												charDetail={this.state.data[this.state.modal]}
												closeModal={this.closeModal.bind(this)}
												writeComment={this.writeComment.bind(this)}
												/>
												) : '';

		return (
			<div className="wrapper center">
				{searchBox}
				{output}
				{modal}
			</div>
		);
	}
}

render(<App/>, window.document.getElementById('app'));