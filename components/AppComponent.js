
var React = require('React');
var keggAPI = require('../lib/keggAPI');

module.exports = React.createClass({
  getInitialState: function() {
  	return {orgName: 'mbb', geneDescription: 'hydroxylase', findResults: []};
  },
  onUpdateOrgName: function(event) {
  	this.state.orgName = event.target.value;
  },
  onUpdateGeneDescription: function(event) {
  	this.state.geneDescription = event.target.value;
  },
  onUpdatelistName: function(event) {
  	this.state.listName = event.target.value;
  },
  onFindSubmit: function() {
  	console.log(this.state.orgName, this.state.geneDescription);
  	keggAPI.find(this.state.orgName, this.state.geneDescription).done(this.onFindReceive);
  },
  onFindReceive: function(response) {
  	console.log("API response: ", response);
  	this.setState({findResults: response});
  },
  onGetNTseq: function() {
  	keggAPI.getNtSeqs(this.state.findResults.map(function(result){return result[0]})).done(this.onNTseqReceive);
  },
  onNTseqReceive: function(response) {
  	this.setState({NTseqresults: response});
  },
  onGetAAseq: function() {
  	keggAPI.get();
  },
  render: function() {
    var tablerows = this.state.findResults
    	.map(function(result,index){
    		
    		return <tr key={"result_"+index}>
    		<td>{index+1}.</td>
    		<td><a href={"http://www.kegg.jp/dbget-bin/www_bget?"+result[0]}>{result[0]}</a></td>
    		<td>{result[1]}</td>
    		</tr>;
    	});
	var numResults = tablerows.length;
	var table = null;
	if (numResults >0) {
		table =
			<table class="table table-hover table-condensed">
    			<thead><tr><th>#</th><th>Name</th><th>Description</th></tr></thead>
    			<tbody>{tablerows} </tbody>
    		</table>;
	}

    return (
    	<div>
    	<p>Enter organism:
    	<input type="text" name="orgName" defaultValue={this.state.orgName} onChange={this.onUpdateOrgName} /><br />

    	<small><em>(NB: mbb = M. bovis BCG Pasteur 1173P2; mtu,mtv = M. tuberculosis H37Rv; msm,msg,msb = M. smegmatis MC2 155)</em></small>
    	<br /></p>

    	<p>Search gene description:
    	<input type="text" name="geneDescription" defaultValue={this.state.geneDescription} onChange={this.onUpdateGeneDescription} /><br />
    	<input type="submit" onClick={this.onFindSubmit} value="Submit"/><br />
    	</p>
    	
    	<br />
    	Found {numResults} results.
    	<br />
    	{table}
    	<br />

		Get full results? &nbsp; &nbsp;
    	<input type="submit" onClick={this.onGetNTseq} value="NT seq" /> &nbsp;
    	<input type="submit" onClick={this.onGetAAseq} value="AA seq" />
    	
    	</div>
    	);
  }
});

    	{/*
    	//can manually curate entries & delete
    	//save entries in a list. upon saving, retrieve all
    	//parameters: http://rest.kegg.jp/get/mbb:BCG_0816c/ including ntseq and aaseq
		*/}
    	
    	

