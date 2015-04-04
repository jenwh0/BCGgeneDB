var React = require('React');

module.exports = React.createClass({
  render: function() {
    return (
    	<div>
    	<form action = "">
    	Enter organism: <input type="text" name="orgName" value="mbb" /><br />
    	<em>NB: mbb = M. bovis BCG; mtv = M. tuberculosis H37Rv; msg = M. smegmatis MC2 155</em><br />
    	Search gene description: <input type="text" name="geneDescription" value="hydroxylase" /><br />
    	<input type="submit" value="Submit"/><br />
    	</form>
    	{/*rest.kgg/jp/find/[orgName]/[geneDescription]
    	//return number of entries
    	//can manually curate entries & delete
    	//save entries in a list. upon saving, retrieve all
    	//parameters: http://rest.kegg.jp/get/mbb:BCG_0816c/ including ntseq and aaseq
		*/}
    	<form action = "">
    	Save gene entries? <input type="text" name="listName" value="list name"/><br/>
    	<input type="submit" value="Submit" />
    	</form>
    	</div>
    	);
  }
});
