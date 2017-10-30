import Render from './../render.jsx';
import React, { Component } from 'react';
import axios from 'axios';
import './index.css';

class MiniRL extends Component {
  constructor(props) {
		 super(props);

		 this.state = {
			 url: '',
			 output: ''
		 }
		 
		 this.getMinirl = this.getMinirl.bind(this);
		 this.copyMinirl = this.copyMinirl.bind(this);
		 this.changeUrl = this.changeUrl.bind(this);
	}

	changeUrl(e) {
		this.setState({url: e.target.value});
	}
	
	getMinirl() {
		axios.post('/api/minirl', {url: this.state.url})
		.then((res) => {
			console.log(res);
			if (res.data.error !== undefined) {
				this.setState({output: res.data.error});
			} else {
				this.setState({output: window.location.href+res.data.minirl});
			}
		}).catch((res) => {
			this.setState({output: 'An error occured'});
		});
	}

	copyMinirl() {
		document.getElementById('output').select();
		document.execCommand('copy');
	}

	render() {
		document.title = "MiniRL";
		return (
			<div className="App">
        <section id="title">
					<h1>MiniRL</h1>
					<p>Baka-length URLs</p>
				</section>
				<section id="body">
					<div>
						<input type="text" onSubmit={this.getMinirl} onChange={this.changeUrl} placeholder="Paste a link..." value={this.state.url} autoFocus></input>
						<button type="submit" onClick={this.getMinirl}>Bakaify</button>
					</div>
					<p>{this.state.output}</p>
					<textarea id="output" value={this.state.output}></textarea>
					{this.state.output !== '' && (<button type="submit" onClick={this.copyMinirl}>Copy URL</button>)}
				</section>
			</div>
		);
	}
}

Render(MiniRL);
