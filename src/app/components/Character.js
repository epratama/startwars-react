import React from "react";

export class Character extends React.Component {
	constructor(props) {
		super();

		this.state = {
			name: props.name,
			popularity: props.popularity,
			charID: props.charID
		};
	}

	openModal() {
		this.props.openModal(this.props.charID);
	}

	vote(scope = '', charID = '') {
		if(scope !== '' && charID !== '') {
			switch(scope) {
				case 'plus':
					this.setState({
						popularity: (this.state.popularity + 1)
					});
					break;
				case 'minus':
					this.setState({
						popularity: (this.state.popularity - 1)
					});
					break;
			}

			this.props.vote(scope, charID);
		}
	}

	render() {
		return (
			<div className="col-1-4 center char_body">
				<i onClick={() => this.openModal()} className="fa fa-info-circle moreInfo" aria-hidden="true" title="Click here for more details"></i>
				<br/><br/>
				<div className="char-name">{this.state.name}</div>
				<div className="char-populatiry center">
					Popularity<br/>
					{this.state.popularity}
				</div>
				<div className="row-2 clearfix">
					<div className="col-1-2 center">
						<i onClick={() => this.vote('plus', this.state.charID)} className="fa fa-plus-square green voteBtn" aria-hidden="true"></i>
					</div>
					<div className="col-1-2 center">
						<i onClick={() => this.vote('minus', this.state.charID)} className="fa fa-minus-square red voteBtn" aria-hidden="true"></i>
					</div>
				</div>
			</div>
		);
	}
}