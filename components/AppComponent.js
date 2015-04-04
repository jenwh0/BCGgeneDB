var React = require('React');
var keggAPI = require('../lib/keggAPI');

module.exports = React.createClass({
  onUpdateOrgName: function(event) {
  	this.state.orgName = event.target.value;
  },
  onUpdateGeneDescription: function(event) {
  	this.state.geneDescription = event.target.value;
  },
  onFindSubmit: function() {
  	console.log(this.state.orgName, this.state.geneDescription);
  	keggAPI.find(this.state.orgName, this.state.geneDescription).done(function(response){
  		console.log("API response: ",response);
  	});
  },
  getInitialState: function() {
  	return {orgName: 'mbb', geneDescription: 'hydroxylase'};

  },
  render: function() {
    return (
    	<div>
    	Enter organism:
    	<input type="text" name="orgName" defaultValue={this.state.orgName} onChange={this.onUpdateOrgName} /><br />

    	<em>(NB: mbb = M. bovis BCG; mtv = M. tuberculosis H37Rv; msg = M. smegmatis MC2 155)</em><br /><br />

    	Search gene description:
    	<input type="text" name="geneDescription" defaultValue={this.state.geneDescription} onChange={this.onUpdateGeneDescription} /><br /><br />
    	<input type="submit" onClick={this.onFindSubmit} value="Submit"/><br />
    	
    	{/*rest.kgg/jp/find/[orgName]/[geneDescription]
    	//return number of entries
    	//can manually curate entries & delete
    	//save entries in a list. upon saving, retrieve all
    	//parameters: http://rest.kegg.jp/get/mbb:BCG_0816c/ including ntseq and aaseq
		*/}
    	
    	Save gene entries? <input type="text" name="listName" defaultValue="list name"/><br/>
    	<input type="submit" value="Submit" />
    	
    	</div>
    	);
  }
});
