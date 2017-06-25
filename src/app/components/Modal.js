import React from "react";
import axios from 'axios';

export class Modal extends React.Component {
	constructor(props) {
		super();

		this.state = {
			charDetail: props.charDetail,
			films: [],
			homeworld: 'Unknown',
			species: 'Unknown',
			starships: [],
			vehicles: [],
			comment: ''
		}
	}

	onChangeComment(event) {
		this.setState({
			comment: event.target.value
		});
	}

	writeComment() {
		this.props.writeComment(this.state.charDetail.pid, this.state.comment);
		this.setState({
			comment: ''
		});
	}

	componentWillMount() {
		if(this.state.charDetail.films.length > 0) {
			let tmp = this.state.films;
			for(let [key, value] of Object.entries(this.state.charDetail.films)) {
				this.fetchData(value, (response) => {
					tmp.push(<span key={key}>{response.data.title}. Directed by {response.data.director} and released at {response.data.release_date}<br/></span>);
					this.setState({
						films: tmp
					});
				});
			}
		}

		if(this.state.charDetail.homeworld !== '') {
			this.fetchData(this.state.charDetail.homeworld, (response) => {
				let homeworld = `Name: ${response.data.name}, Population: ${response.data.population}, Climate: ${response.data.climate}, Diameter: ${response.data.diameter}, Gravity: ${response.data.gravity}, Orbital Period: ${response.data.orbital_period}, Rotation Period: ${response.data.rotation_period}, Surface Water: ${response.data.surface_water}, Terrain: ${response.data.terrain}`;

				this.setState({
					homeworld: homeworld
				});
			});
		}

		if(this.state.charDetail.species.length > 0) {
			let tmp = this.state.species;
			for(let [key, value] of Object.entries(this.state.charDetail.species)) {
				this.fetchData(value, (response) => {
					this.setState({
						species: response.data.name
					});
				});
			};
		}

		if(this.state.charDetail.vehicles.length > 0) {
			let tmp = this.state.vehicles;
			for(let [key, value] of Object.entries(this.state.charDetail.vehicles)) {
				this.fetchData(value, (response) => {
					tmp.push(<span key={key}>Name: {response.data.name}, Model: {response.data.model}, Manufacturer: {response.data.manufacturer}<br/></span>);
					this.setState({
						vehicles: tmp
					});
				});
			}
		}

		if(this.state.charDetail.starships.length > 0) {
			let tmp = this.state.starships;
			for(let [key, value] of Object.entries(this.state.charDetail.starships)) {
				this.fetchData(value, (response) => {
					tmp.push(<span key={key}>{response.data.name}<br/></span>);
					this.setState({
						starships: tmp
					});
				});
			}
		}
	}

	closeModal() {
		this.props.closeModal();
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

	render() {
		let films = 'None';
		if(this.state.films.length > 1) {
			films = this.state.films;
		}

		let starships = 'None';
		if(this.state.starships.length > 1) {
			starships = this.state.starships;
		}

		let vehicles = 'None';
		if(this.state.vehicles.length > 1) {
			vehicles = this.state.vehicles;
		}

		let comments = '';
		if(this.state.charDetail.comments.length > 0) {
			comments = [];
			for(let [key, value] of Object.entries(this.state.charDetail.comments)) {
				comments.push(<li key={key}>{value}</li>);
			}
		}

		return (
			<div className="modal">
				<div className="right">
					<i onClick={() => this.closeModal()} className="fa fa-times-circle-o red fa-2x modalCloseBtn" aria-hidden="true"></i>
				</div>
				<div className="center charDetail">
					<p><b>Name</b><br/>{this.state.charDetail.name}</p>
					<p><b>Birth year</b><br/>{this.state.charDetail.birth_year}</p>
					<p><b>Gender</b><br/>{this.state.charDetail.gender}</p>
					<p><b>Eye color</b><br/>{this.state.charDetail.eye_color}</p>
					<p><b>Hair color</b><br/>{this.state.charDetail.hair_color}</p>
					<p><b>Skin color</b><br/>{this.state.charDetail.skin_color}</p>
					<p><b>Height</b><br/>{this.state.charDetail.height}</p>
					<p><b>Mass</b><br/>{this.state.charDetail.mass}</p>
					<p><b>Species</b><br/>{this.state.species}</p>
					<p><b>Homeworld</b><br/>{this.state.homeworld}</p>
					<p><b>Starships</b><br/>{starships}</p>
					<p><b>Vehicles</b><br/>{vehicles}</p>
					<p><b>Films</b><br/>{films}</p>
				</div>
				<div className="commentWrapper">
					<p>Comments</p>
					<ul className="left">
						{comments}
					</ul>
					<div className="commentEditor center">
						<input onChange={(event) => this.onChangeComment(event)} type="text" placeholder="Enter your comment" className="commentTextbox" value={this.state.comment} />
						<br/><br/>
						<button onClick={() => this.writeComment()} className="commentBtn">Submit</button>
					</div>
				</div>
			</div>
		);
	}
}