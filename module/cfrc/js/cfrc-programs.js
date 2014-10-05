jQuery(document).ready(function() {
	jQuery('.table-search-edit').keyup(function() {
		var searchText = jQuery(this).val();
		console.log("searching for " + searchText);
		jQuery('#program-listing tbody tr').hide();
		jQuery('#program-listing tbody tr').filter(function (i, v) {
			var Result = false;
			var row = jQuery(this);
	        if(row.is(":containsNC('" + searchText + "')")) {
	        	console.log(row.text() + " has it!");
	        	Result = true;
	        } else {
	        	console.log(row.text() + " does not have " + searchText + "!");
	        }
	        return (Result);
		})
		//show the rows that match.
		.show();
	});
});

jQuery.extend(jQuery.expr[":"], {
	"containsNC": function(elem, i, match, array) {
		return (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
	}
});
