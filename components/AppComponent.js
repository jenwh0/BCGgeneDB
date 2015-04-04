var React = require('React');
var keggAPI = require('../lib/keggAPI');

module.exports = React.createClass({
  getInitialState: function() {
  	return {orgName: 'mbb', geneDescription: 'hydroxylase', findResults: [], listName: 'list name'};
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
  onUpdatelistSave: function(listName) {
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

    return (
    	<div>
    	Enter organism:
    	<input type="text" name="orgName" defaultValue={this.state.orgName} onChange={this.onUpdateOrgName} /><br />

    	<em>(NB: mbb = M. bovis BCG; mtv = M. tuberculosis H37Rv; msg = M. smegmatis MC2 155)</em><br /><br />

    	Search gene description:
    	<input type="text" name="geneDescription" defaultValue={this.state.geneDescription} onChange={this.onUpdateGeneDescription} /><br /><br />
    	<input type="submit" onClick={this.onFindSubmit} value="Submit"/><br />
    	
    	<br />
    	Found {numResults} results.
    	<br />
    	<table> <tbody>{tablerows} </tbody> </table>
    	<br /><br />

    	{/*
    	//can manually curate entries & delete
    	//save entries in a list. upon saving, retrieve all
    	//parameters: http://rest.kegg.jp/get/mbb:BCG_0816c/ including ntseq and aaseq
		*/}
    	
    	Save gene entries? <input type="text" name="listName" defaultValue={this.state.listName} onChange={this.onUpdatelistName}/><br/>
    	<input type="submit" onClick={this.onUpdatelistSave} value="Save" />
    	
    	</div>
    	);
  }
});
