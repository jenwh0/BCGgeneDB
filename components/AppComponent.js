
var React = require('React');
var keggAPI = require('../lib/keggAPI');

module.exports = React.createClass({
  getInitialState: function() {
  	return {
  		orgName: 'mbb',
  		geneDescription: 'hydrase',
  		findResults: [],
  		NTseqResults: {},
  	};
  },

  onUpdateOrgName: function(event) {
  	this.state.orgName = event.target.value;
  },

  onUpdateGeneDescription: function(event) {
  	this.state.geneDescription = event.target.value;
  },

  onFindSubmit: function() {
  	console.log(this.state.orgName, this.state.geneDescription);
  	keggAPI.find(this.state.orgName, this.state.geneDescription).done(this.onFindReceive);
  },
  onFindReceive: function(results) {
  	console.log("API response: ", results);
  	this.setState({
  		findResults: results,
  		orgName: 'asd'
  	});
  },

  onGetNTseq: function() {
  	keggAPI.getNtSeqs(this.state.findResults.map((result) => {return result[0]})).done(this.onNTseqReceive);
  	console.log("here you clicked");
  },
  onNTseqReceive: function(results) {
  	this.setState({NTseqResults: results});
  	console.log("response received");
  },

  render: function() {
    var tablerows = this.state.findResults
    	.map((result,index) => {
    		return <tr key={"result_"+index}>
    		<td>{index+1}.</td>
    		<td><a href={"http://www.kegg.jp/dbget-bin/www_bget?"+result[0]}>{result[0]}</a></td>
    		<td>{result[1]}</td>
    		</tr>;
    	});
	var numResults = tablerows.length;
	var table = null;
	if (numResults >0) {
		table = <div>
			Found {numResults} results.
	    	<br />
			<table class="table table-bordered">
    			<thead><tr><th>#</th><th>Name</th><th>Description</th></tr></thead>
    			<tbody class="table table-hover">{tablerows} </tbody>
    		</table></div>;
	}

	var NTseqdivs = Object.keys(this.state.NTseqResults)
		.map((name, index) => {
			var data = this.state.NTseqResults[name];
			return <div key={"seq_"+index}>
			{name} &nbsp; {data.description}<br />
			{data.seq}
			</div>;
		})

    return (
    	<div>
    		<p>Enter organism: &nbsp;
	    	<input type="text" name="orgName" defaultValue={this.state.orgName} onChange={this.onUpdateOrgName} /><br />

	    	<small><em>(NB: mbb = M. bovis BCG Pasteur 1173P2; mtu,mtv = M. tuberculosis H37Rv; msm,msg,msb = M. smegmatis MC2 155)</em></small>
	    	<br /></p>

	    	<p>Search gene description: &nbsp;
	    	<input type="text" name="geneDescription" defaultValue={this.state.geneDescription} onChange={this.onUpdateGeneDescription} /><br />
	    	<input type="submit" onClick={this.onFindSubmit} value="Submit"/><br />
	    	</p>
	    	
	    	<br />
	    	
	    	{table}
	    	<hr />
	    	<div>
	    		Get full results? &nbsp; &nbsp;
	    		<input type="submit" onClick={this.onGetNTseq} value="NT seq" />&nbsp;
	    		{/*<input type="submit" value="AA seq" />*/}
	    	</div>
	    	{NTseqdivs}
    	</div>
    	);
  }
});

    	{/*
    	//can manually curate entries & delete
    	//save entries in a list. upon saving, retrieve all
    	//parameters: http://rest.kegg.jp/get/mbb:BCG_0816c/ including ntseq and aaseq
		*/}
    	
    	

