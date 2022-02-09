export const isEmpty = function (value) {
	if (!value || value.trim().length === 0) {
		return true
	} else false
};

export const issueNumber = function (id, my_array) {
	const res = my_array.findIndex(x=> x.id === id)
	return res+1
}

export const statusTag = function (value) {
	const res = [
		'<label><i class="fa fa-times-circle"></i> Cancelled</label>',
		'<label><i class="fa fa-check-circle purple"></i> Done</label>',
		'<label><i class="fa fa-adjust yellow"></i> In Progress</label>',
		'<label><i class="fa fa-circle-notch"></i> Todo</label>',
		'<label><i class="fa fa-bullseye"></i> Backlog</label>'
	]
	return res[value-1]
}

export const formatBytes = function (bytes) {
    var marker = 1000; // Change to 1000 if required
    var decimal = 2; // Change as required
    var kiloBytes = marker; // One Kilobyte is 1024 bytes
    var megaBytes = marker * marker; // One MB is 1024 KB
    var gigaBytes = marker * marker * marker; // One GB is 1024 MB
    var teraBytes = marker * marker * marker * marker; // One TB is 1024 GB

    // return bytes if less than a KB
    if(bytes < kiloBytes) return bytes + " Bytes";
    // return KB if less than a MB
    else if(bytes < megaBytes) return(bytes / kiloBytes).toFixed(decimal) + " KB";
    // return MB if less than a GB
    else if(bytes < gigaBytes) return(bytes / megaBytes).toFixed(decimal) + " MB";
    // return GB if less than a TB
    else return(bytes / gigaBytes).toFixed(decimal) + " GB";
}


export const operatorValues = function (source) {
	const result = []

	for (const key in source) {
	  if (Object.prototype.hasOwnProperty.call(source, key)) {
	      if(typeof source[key] == 'object'){
	        for(const j in source[key]){
						// if (source[key].hasOwnProperty(j))
	          if (Object.prototype.hasOwnProperty.call(source[key], j)) {
	            result.push(source[key][j])
	          }
	        }
	      }

	      if(typeof source[key] == 'string'){
	        result.push(source[key])
	      }
	  }
	}

	return result
}

export const matchErrors = function (source) {
	let errors = {}
	source.errors.forEach((entry) => {
		errors[entry.field] = entry.messages;
	});
	return errors;
}