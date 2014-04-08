function namespace(ns) {
	var nsArr = ns.split(".");
	var nsParentObj = parent;
	var nsId = "";
	for (var i = 0; i < nsArr.length; i++) {
		nsId = nsId === "" ? nsArr[i] : nsId + "." + nsArr[i];
		if (!nsParentObj[nsArr[i]]) {
			nsParentObj[nsArr[i]] = {};
			nsParentObj[nsArr[i]].nsId = nsId;
			nsParentObj[nsArr[i]].toString = function () {
				return "NAMESPACE: " + this.nsId;
			};
		}
		nsParentObj = nsParentObj[nsArr[i]];
	}
	this[nsArr[0]] = parent[nsArr[0]]; // Make NS reachable from current context
}

namespace("js.table");

String.isBlank = function (str) {
	if (!str) {
		return true;
	}
	if (str.constructor !== String) {
		var details = "Not a String";
		throw details;
	}
	if (str === '') {
		return true;
	}
	return false;
};

String.isNotBlank = function (str) {
	return !String.isBlank(str);
};

String.isEmpty = function (str) {
	return String.isBlank(str) ? true : str.trim() === '';
};

String.isNotEmpty = function (str) {
	return !String.isEmpty(str);
};

if (!String.prototype.trim) {
	String.prototype.trim = function () {		
    var str = this.valueOf();
    var pos = -1;
    var space = " ";
    if ((pos = str.indexOf(space)) == 0){		
    	while(str.charAt(pos) == space) {
    			pos++;
    	}		
		str = str.substring(pos);		
    }
    if ((pos = str.indexOf(space, str.length - 1)) != -1) {
    	while(str.charAt(pos) != space) {
    			pos--;
    	}		
    	str = str.substring(0, pos);			
		}
    	return str;
	};
}

String.pad = function (str, totalChars, padWith, right) {
	str = str + "";
	padWith = (padWith) ? padWith + "" : "0";
	var padded = false;
	if (str.length < totalChars) {
		while (str.length < totalChars) {
			padded = true;
			if (right) {
				str = str + padWith;
			} else {
				str = padWith + str;
			}
		}
	}
	// if padWith was a multiple character string and str was overpadded
	if (padded && str.length > totalChars) {
		if (right) {
			str = str.substring(0, totalChars);
		} else {
			str = str.substring((str.length - totalChars), str.length);
		}
	}
	return str;
};

String.leftPad = function (str, totalChars, padWith) {
	return String.pad(str, totalChars, padWith, false);
};

String.rightPad = function (str, totalChars, padWith) {
	return String.pad(str, totalChars, padWith, true);
};

/*
 * Extend Date object functionality to allow parsing dates in "dd/mm/YYYY"
 * and return date in SQLite format 
 */
Date.prototype.toSqlFormat = function () {
	// Append a leading zero if day or moth is one digit long
	var day =  this.getDate() <= 9 ? '0' + this.getDate() : '' + this.getDate();
	var month =  this.getMonth()+1 <= 9 ? '0' + (this.getMonth()+1) : '' + (this.getMonth()+1);
	// Return date in YYYY-mm-dd format
	return this.getFullYear() + '-' + month + '-' + day;
};

Date.prototype.toString = function () {
	// Append a leading zero if day or moth is one digit long
	var day =  this.getDate() <= 9 ? '0' + this.getDate() : '' + this.getDate();
	var month =  this.getMonth()+1 <= 9 ? '0' + (this.getMonth()+1) : '' + (this.getMonth()+1);
	// Return date in dd/mm/YYYY format
	return day + '/' + month + '/' + this.getFullYear();
};

Date.isSqlDate = function (dateStr) {
	try {
		Date.parseSqlDate(dateStr);
	} catch (ex) {
		return false;
	}
	return true;
};

Date.parseDate = function (dateStr) {
	var dateArr = dateStr.split('/');
	if (dateArr.length !== 3 ||
			dateArr[2].length !== 4 ||
			dateArr[1].length !== 2 ||
			dateArr[0].length !== 2) {
		var details = 'Not a valid date';
		throw details;
	}
	var resultDate = new Date();
	resultDate.setFullYear(dateArr[2]);
	resultDate.setMonth(dateArr[1]-1);
	resultDate.setDate(dateArr[0]);
	return resultDate;
};

Date.parseSqlDate = function (dateStr) {
	var dateArr = dateStr.split('-');
	if (dateArr.length !== 3 ||
			dateArr[0].length !== 4 ||
			dateArr[1].length !== 2 ||
			dateArr[2].length !== 2) {
		var details = 'Not a valid date';
		throw details;
	}
	var resultDate = new Date();
	resultDate.setFullYear(dateArr[0]);
	resultDate.setMonth(dateArr[1]-1);
	resultDate.setDate(dateArr[2]);
	return resultDate;
};

js.table.Datetime = function(wrappedDate) {
	this.wrappedDate = wrappedDate
	if (!this.wrappedDate) {
		this.wrappedDate = new Date();
	}
};

js.table.Datetime.prototype.toSqlFormat = function () {
	// Append a leading zero if day or moth is one digit long
	var day = this.wrappedDate.getDate() <= 9 ? '0' + this.wrappedDate.getDate() : '' + this.wrappedDate.getDate();
	var month = this.wrappedDate.getMonth()+1 <= 9 ? '0' + (this.wrappedDate.getMonth()+1) : '' + (this.wrappedDate.getMonth()+1);
	var hours = String.leftPad(this.wrappedDate.getHours(),2,'0');
	var minutes = String.leftPad(this.wrappedDate.getMinutes(),2,'0');
	var seconds = String.leftPad(this.wrappedDate.getSeconds(),2,'0');
	var year = this.wrappedDate.getFullYear();
	// Return date in YYYY-mm-dd format HH:MM:SS
	return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
};

js.table.Datetime.prototype.toString = function () {
	// Append a leading zero if day or moth is one digit long
	var day = this.wrappedDate.getDate() <= 9 ? '0' + this.wrappedDate.getDate() : '' + this.wrappedDate.getDate();
	var month = this.wrappedDate.getMonth()+1 <= 9 ? '0' + (this.wrappedDate.getMonth()+1) : '' + (this.wrappedDate.getMonth()+1);
	var hours = String.leftPad(this.wrappedDate.getHours(),2,'0');
	var minutes = String.leftPad(this.wrappedDate.getMinutes(),2,'0');
	var seconds = String.leftPad(this.wrappedDate.getSeconds(),2,'0');
	var year = this.wrappedDate.getFullYear();
	// Return date in dd/mm/YYYY HH:MM:SS
	return day + '/' + month + '/' + year + ' ' + hours + ':' + minutes + ':' + seconds;
};

js.table.Datetime.isSqlDatetime = function (dateStr) {
	try {
		if (dateStr.charAt(4) !== '-' || dateStr.charAt(7) !== '-' ||
				dateStr.charAt(10) !== ' ' || dateStr.charAt(13) !== ':' ||
				dateStr.charAt(16) !== ':') {
			return false;
		}
		js.table.Datetime.parseSqlDatetime(dateStr);
	} catch (ex) {
		return false;
	}
	return true;
};

js.table.Datetime.parseDatetime = function (dateStr) {
	var resultDate = new Date();
	var year = parseInt(dateStr.substring(6,10), 10);
	var month = parseInt(dateStr.substring(3,5), 10)-1;
	var day = parseInt(dateStr.substring(0,2), 10);
	var hour = parseInt(dateStr.substring(11,13), 10);
	var minutes = parseInt(dateStr.substring(14,16), 10);
	var seconds = parseInt(dateStr.substring(17,20), 10);
	resultDate.setFullYear(year);
	resultDate.setMonth(month);
	resultDate.setDate(day);
	resultDate.setHours(hour, minutes, seconds);
	if(isNaN(resultDate.getTime())) {
		var details = 'Not a valid datetime';
		throw details;
	}
	return new js.table.Datetime(resultDate);
};

js.table.Datetime.parseSqlDatetime = function (dateStr) {
	var resultDate = new Date();
	var year = parseInt(dateStr.substring(0,4), 10);
	var month = parseInt(dateStr.substring(5,7), 10)-1;
	var day = parseInt(dateStr.substring(8,10), 10);
	var hour = parseInt(dateStr.substring(11,13), 10);
	var minutes = parseInt(dateStr.substring(14,16), 10);
	var seconds = parseInt(dateStr.substring(17,20), 10);
	resultDate.setFullYear(year);
	resultDate.setMonth(month);
	resultDate.setDate(day);
	resultDate.setHours(hour, minutes, seconds);
	if(isNaN(resultDate.getTime())) {
		var details = 'Not a valid datetime';
		throw details;
	}
	return new js.table.Datetime(resultDate);
};

// Parse a String and evaualtes it as a chain method invocation or attribute access on a given root element
// Ex.: property = "Object1.Object2.Object3" -> Returns Object3
// Ex2.: property = "Object1.methodA('1', 2).toString()" -> Returns the result of calling toString() method
// on the result of calling methodA('1',2) on Entity.Object1
js.table.parsePropertyChain = function (property, rootElement) {
	var propertyChainArr = property.split('.');
	var value = rootElement;
	for (var i = 0; i < propertyChainArr.length; i++) {
		var key = propertyChainArr[i];
		if (key.search('\\(') !== -1 && key.search('\\)') !== -1) {
			var methodName = key.substring(0, key.search('\\('));
			var parameters = key.substring(key.search('\\(') + 1, key.search('\\)'));
			var paramArr = eval("[" + parameters + "]");
			var method = value[methodName];
			value = method.apply(value, paramArr);
		} else {
			value = value[key];
		}
		if (value === null || value === undefined) {
			break;
		}
	}
	return value;
};

js.table.Column = function(title, property, comparator) {
	this.title = title;
	this.property = property;
	this.comparator = comparator;
};

js.table.Column.numberComparator = js.table.Column.dateComparator = function(val1, val2) {
	if(val1 === null && val2 === null) {
		return 0;
	} else if (val1 === null) {
		return -1;
	} else if (val2 === null) {
		return 1;
	} else {
		if (val1 > val2) {
			return 1;
		} else if (val1 < val2){
			return -1;
		} else {
			return 0;
		}
	}
};

js.table.Column.formattedAmountComparator = function(val1, val2) {
	val1 = parseFloat(val1.data.replace(/[.]/g, '').replace(/[,]/g, '.'));
	val2 = parseFloat(val2.data.replace(/[.]/g, '').replace(/[,]/g, '.'));
	return js.table.Column.numberComparator(val1, val2);
};

js.table.Column.syncIconComparator = function(val1, val2) {
	if (val1 === null) {
		return 1;
	} else if (val2 === null) {
		return -1;
	} else {
		return 0;
	}
};

js.table.Column.textNodeComparator = function(val1, val2) {
	val1 = val1.data !== undefined ? val1.data : val1.textContent; // FIX IE BUG
	val2 = val2.data !== undefined  ? val2.data : val2.textContent; // FIX IE BUG
	return js.table.Column.stringComparator(val1, val2);
};

js.table.Column.stringComparator = function(val1, val2) {
	var i = 0;
	// NULL value is always evaluated to be smaller
	if(val1 === null && val2 === null) {
		return 0;
	} else if (val1 === null) {
		return 1;
	} else if (val2 === null) {
		return -1;
	} else {
		while(val1.length >= i && val2.length >= i) {
			if (val1.charAt(i) > val2.charAt(i)) {
				return 1;
			} else if (val1.charAt(i) < val2.charAt(i)){
				return -1;
			}
			i++;
		}
		if (val1.length < i && val2.length < i) {
			return 0;
		} else if (val1.length < i) {
			return -1;
		} else if (val2.length < i) {
			return 1;
		}
	}
};

js.table.Table = function(entities, columns, tableId, tableClass, paginator, creationCallback) {
	this.columns = columns; // Column array
	this.tableId = tableId; // Table DOM id
	this.tableClass = tableClass; // Table CSS Stylesheet
	this.isSortedAsc = null;
	this.sortedBy = null;
	this.pageNumber = 1; // Initial page number
	this.tableDOM = null;
	this.creationCallback = creationCallback;
	
	if (paginator) {
		this.paginator = paginator; // Pagination fetch strategy
	} else {
		this.paginator = new js.table.Table.DummyPaginator(entities);
	}
	this.entities = [];
	if (this.paginator.pagesCount() >= 1) {
		this.entities = this.paginator.getPage(this.pageNumber);
	}
	
	this.sort = function(colIdx, pageLevelSort) {
		js.table.Table.comparisons = 0;
		var sortProperty = this.columns[colIdx].property;
		if (sortProperty !== this.sortedBy || (sortProperty === this.sortedBy && this.isSortedAsc)) {
			this.isSortedAsc = false;
		} else {
			this.isSortedAsc = true;
		}
		this.sortedBy = sortProperty;
		if (pageLevelSort) { // PAGE LEVEL SORT
			this.entities = js.table.Table.sort(this.entities, sortProperty, this.isSortedAsc, this.columns[colIdx].comparator);
		} else { // TABLE LEVEL SORT
			this.paginator.sort(sortProperty, this.isSortedAsc, this.columns[colIdx].comparator);
			this.pageNumber = 1; // Reset page number
			this.entities = paginator.getPage(this.pageNumber); // Fetch entities again
		}
		js.table.debug.out("Comparisons:" + js.table.Table.comparisons, js.table.debug.DEBUG);
	};
	
	this.nextPage = function() {
		if (this.pageNumber+1 <= paginator.pagesCount()) {
			this.entities = paginator.getPage(++this.pageNumber);
		} else {
			//throw "Invalid page number";  QC 12450
		}
	};
	
	this.previousPage = function() {
		if (this.pageNumber-1 >= 1) {
			this.entities = paginator.getPage(--this.pageNumber);
		} else {
			//throw "Invalid page number";  QC 12450
		}
	};
	
	// Creates the DOM structure representing this table
	this.createDOM = function() {
		var table = document.createElement("table");
		if(this.tableClass) {
			table.className = this.tableClass;
		}
		table.id = this.tableId;
		
		// Write headers
		var thead = document.createElement("thead");
		var tr = document.createElement("tr");
		for (var colIdx = 0; colIdx < this.columns.length; colIdx++) {
			var th = document.createElement("th");
			th.className = String.isNotEmpty(this.tableClass) ? this.tableClass + "_head" + colIdx : null;
			th.id = this.tableId + "_head" + colIdx;
			// If comparator object was set, add sort action to column header.
			if (this.columns[colIdx].comparator) {
				// Assign sort handler entry point function
				th.onclick = js.table.TableHandler.handleSort;
				th.className = th.className + " clickeable";
			}
			if (this.columns[colIdx].title) {
				if (this.columns[colIdx].title.constructor === Function) {
					var content = this.columns[colIdx].title();
					if (content) {
						if (content.nodeType) { // DOMElement
							th.appendChild(content);
						} else {
							th.innerHTML = content.toString() + "";
						}
					}
				} else {
					th.appendChild(document.createTextNode(this.columns[colIdx].title.toString() + ""));
				}
			}
			tr.appendChild(th);
		}
		thead.appendChild(tr);
		table.appendChild(thead);
		
		// Write body			
		var tbody = document.createElement("tbody");
		var displayedElements = this.entities;
		for (var entityIdx = 0; entityIdx < displayedElements.length; entityIdx++) {
			tr = document.createElement("tr");
			tr.id = this.tableId + "_row" + entityIdx;
			for (colIdx = 0; colIdx < this.columns.length; colIdx++) {
				var td = document.createElement("td");
				td.id = this.tableId + "_cell" + entityIdx + "-" + colIdx;
				td.className = String.isNotEmpty(this.tableClass) ? this.tableClass + "_col" + colIdx : null;
				if (this.columns[colIdx].property) {
					if (this.columns[colIdx].property.constructor === Function) {
						var content = this.columns[colIdx].property(displayedElements[entityIdx], entityIdx);
						if (content) {
							if (content.nodeType) { // DOMElement
								td.appendChild(content);
							} else {
								td.innerHTML = content.toString() + "";
							}
						}
					} else if (this.columns[colIdx].property.constructor === String && String.isNotEmpty(this.columns[colIdx].property)) {
						var textValue = js.table.Table.parsePropertyChain(this.columns[colIdx].property, displayedElements[entityIdx]);
						if (textValue != null && textValue != undefined) { // Prevent IE bug, do not append NULL text
							td.appendChild(document.createTextNode(textValue.toString() + ""));
						}
					}
				}
				tr.appendChild(td);
			}
			tbody.appendChild(tr);
		}
		table.appendChild(tbody);
		this.tableDOM = table;
		return table;
	};
};

js.table.Table.parsePropertyChain = function (propertyChainString, element) {
	return js.table.parsePropertyChain(propertyChainString, element);
};

js.table.Table.mergesort = function(entities, field, isSortedAsc, comparator) {
	if (entities.length <= 1) {
		return entities;
	} else {
		var compVal = isSortedAsc ? 1 : -1;
		var middle = Math.floor(entities.length / 2);
		var sortedList = entities.concat([]); // Clone the array
		var left = [];
		var right = [];
		while (sortedList.length > middle) {
			left.push(sortedList.shift());
		}
		while (sortedList.length > 0) {
			right.push(sortedList.shift());
		}
		left = js.table.Table.mergesort(left, field, isSortedAsc, comparator);
		right = js.table.Table.mergesort(right, field, isSortedAsc, comparator);
		while ((left.length > 0) && (right.length > 0)) {
			var leftValue = field.constructor === Function ? field(left[0], 0) : js.table.Table.parsePropertyChain(field, left[0]);
			var rightValue = field.constructor === Function ? field(right[0], 0) : js.table.Table.parsePropertyChain(field, right[0]);
			if (comparator(leftValue, rightValue) === compVal) {
				sortedList.push(right.shift());
			} else {
				sortedList.push(left.shift());
			}
			js.table.Table.comparisons++;
		}
 		while (left.length > 0) {
 			sortedList.push(left.shift());
 		}
		while (right.length > 0) {
			sortedList.push(right.shift());
		}
		return sortedList;
	}
};

js.table.Table.quicksort = function(entities, field, isSortedAsc, comparator) {
		if (entities.length <= 1) {
			return entities;
		} else {
			var less = [];
			var greater = [];
			var sortedList = [];
			var compVal = isSortedAsc ? 1 : -1;
			var middle = Math.floor(entities.length / 2);
			var pivot = entities[middle];
			entities = entities.slice(0, middle).concat(entities.slice(middle + 1, entities.length));
			var pivotValue = field.constructor === Function ? field(pivot, middle) : js.table.Table.parsePropertyChain(field, pivot);
			for (var i = 0; i < entities.length; i++) {
				var currentElementValue = field.constructor === Function  ? field(entities[i], i) : js.table.Table.parsePropertyChain(field, entities[i]);
				if (comparator(pivotValue, currentElementValue) === compVal) {
					less.push(entities[i]);
				} else {
					greater.push(entities[i]);
				}
				js.table.Table.comparisons++;
			}
			sortedList = sortedList.concat(js.table.Table.quicksort(less, field, isSortedAsc, comparator, domFunction));
			sortedList.push(pivot);
			sortedList = sortedList.concat(js.table.Table.quicksort(greater, field, isSortedAsc, comparator, domFunction));
			return sortedList;
		}
};

js.table.Table.bubblesort = function(entities, field, isSortedAsc, comparator) {
		entities = entities.slice(0, entities.length);
		var compVal = isSortedAsc ? 1 : -1;
		do {
			var swapped = false;
			for (var i = 0; i < entities.length-1; i++) { // Do not try to sort last element
				var value = field.constructor === Function ? field(entities[i], i) : js.table.Table.parsePropertyChain(field, entities[i]);
				var nextValue = field.constructor === Function ? field(entities[i+1], i+1) : js.table.Table.parsePropertyChain(field, entities[i+1]);
				if (comparator(value, nextValue) === compVal) {
					var e1 = entities[i+1];
					entities[i+1] = entities[i];
					entities[i] = e1;
					swapped = true;
				}
				js.table.Table.comparisons++;
			}
		} while(swapped);
		return entities;
};
js.table.Table.comparisons = 0;
js.table.Table.sort = js.table.Table.mergesort; // Default sort strategy, less comparisons.

js.table.Table.DummyPaginator = function(entities) {
	this.sort = function(field, isSortedAsc, comparator, domFunc) {
		entities = js.table.Table.sort(entities, field, isSortedAsc, comparator, domFunc);
	};
	
	this.pagesCount = function() {
		return 1;
	};
	
	this.getPage = function(pageNumber) {
		return entities;
	};
};

js.table.Table.RepositoryPaginator = function(repository, pageSize, criteria, orderByFields) {
	var entitiesCache = {};
	var repoSize = repository.size(criteria);
	
	var orderByClause = "";
	if (orderByFields && orderByFields.length > 0) {
		orderByClause = "ORDER BY " + orderByFields.join(',');
	}
	
	this.sort = function(field, isSortedAsc, comparator, domFunc) {
			entitiesCache = {};
			var entities = repository.toVO(repository.getByCriteria(criteria, [orderByClause]));
			for (var i = 0; i < entities.length; i++) {
				entities[i].fetchAll();
			}
			entities = js.table.Table.sort(entities, field, isSortedAsc, comparator, domFunc);
			for(var i = 0; i < this.pagesCount(); i++) {
				entitiesCache[i+1] = entities.slice(i*pageSize, (i+1)*pageSize);
			}
	};
		
	this.pagesCount = function() {
		var pc = (repoSize % pageSize) !== 0 ? parseInt(repoSize / pageSize) + 1 : repoSize / pageSize;
		return pc;
	};
	
	this.getPage = function(pageNumber) {
		if (!entitiesCache[pageNumber]) {
			var start = (pageNumber-1)*pageSize;
			var offset = "OFFSET " + start;
			var limit = "LIMIT " + pageSize;
			var params = [];
			params.push(orderByClause);
			params.push(limit);
			params.push(offset);
			entitiesCache[pageNumber] = repository.toVO(repository.getByCriteria(criteria, params));
			for (var i = 0; i < entitiesCache[pageNumber].length; i++) {
				entitiesCache[pageNumber][i].fetchAll();
			}
		}
		return entitiesCache[pageNumber].concat([]); // Return cloned array
	};
};

js.table.Table.SimplePaginator = function(entities, pageSize) {
	this.sort = function(field, isSortedAsc, comparator, domFunc) {
		entities = js.table.Table.sort(entities, field, isSortedAsc, comparator, domFunc);
	};
	
	this.pagesCount = function() {
		var pc = (entities.length % pageSize) !== 0 ? parseInt(entities.length / pageSize) + 1 : entities.length / pageSize;
		return pc;
	};
	
	this.getPage = function(pageNumber) {
		var start = (pageNumber-1)*pageSize;
		var end = start+pageSize < entities.length ? start+pageSize : entities.length;
		return entities.slice(start, end);
	};
};

// Since sort, pagination and any table interaction are fired through HTML events, there's no easy way
// to associate the HTML table with the underlying JS table representation (js.table.Table). Also adding,
// removing or reflecting updates on HTML tables is not trivial, and care must be taken in order
// to maintain the DOM correct structure.
// That's the reason for the TableHandler existence, to provide an association between HTML and JS tables.
// However it might be bypassed if so is desired. 
js.table.TableHandler = function() {
	// Set this as the global instance
	js.table.th = this;
	
	// Contains all the tables assigned to the handler instance
	var tables = [];
	
	this.getPageNumber = function(tableId) {
		try {
			var tableData = tables[tableId];
			return tableData.pageNumber;
		} catch (ex) {
			js.table.debug.out(ex, js.table.debug.ERROR);
		}
	};
	
	this.nextPage = function(tableId) {
		try {
			var tableData = tables[tableId];
			tableData.nextPage();
			this.refresh(tableId);
		} catch (ex) {
			js.table.debug.out(ex, js.table.debug.ERROR);
		}
	};
	
	this.previousPage = function(tableId) {
		try {
			var tableData = tables[tableId];
			tableData.previousPage();
			this.refresh(tableId);
		} catch (ex) {
			js.table.debug.out(ex, js.table.debug.ERROR);
		}
	};
	
	this.sort = function(tableId, colIdx) {
		var tableData = tables[tableId];
		tableData.sort(colIdx);
		this.refresh(tableId);
	};
	
	this.refresh = function (tableId) {
		var tableData = tables[tableId];
		var parentObj = tableData.tableDOM.parentNode;
		this.remove(tableData.tableDOM);
		this.create(tableData, parentObj);
	};
	
	this.remove = function(table) {
		try {
			if (table.constructor === String) {
				table = document.getElementById(table);
			}
			var parentObj = table.parentNode;
			parentObj.removeChild(table);
		} catch (ex) {
			throw ex;
		} finally {
			// Remove the table from the handler instance
			tables[table.id] = null;
		}
	};
	
	this.create = function(tableData, parentNode) {
		// Check if the tableId is already assigned to a managed table and remove it if necessary
		if (tables[tableData.tableId]) {
			try {
				this.remove(tables[tableData.tableId].tableDOM);
			} catch (ex) {
				js.table.debug.out(ex, js.table.debug.ERROR);
			}
		}
		var table = tableData.createDOM();
		// If parentNode is a string, then it corresponds to the parent node id
		if (parentNode.constructor === String) {
			parentNode = document.getElementById(parentNode);
		}
		parentNode.appendChild(table);
		tables[tableData.tableId] = tableData;
		if(tableData.creationCallback) {
			tableData.creationCallback(tableData);
		}
	};
	
	this.getRow = function(rowid, tableId) {
		if (tables[tableId]) {
			return tables[tableId].entities[rowid];
		}
	};
	
	this.getRows = function(tableId) {
		if (tables[tableId]) {
			return tables[tableId].entities;
		}
	};
	
	this.getTable = function(tableId) {
		if (tables[tableId]) {
			return tables[tableId];
		}
	}
};

js.table.TableHandler.handleSort = function(e) {
	// Get the source object id
	var columnId = this.id;
	// Get table and column index from header column id
	var tableId = columnId.substring(0,columnId.search("_head"));
	var colIdx = columnId.substring(columnId.search("_head") + 5, columnId.length);
	js.table.th.sort(tableId, colIdx);
};

js.table.TableHandler.handlePagination = function(tableId, action) {
	if(action === 'next') {
		js.table.th.nextPage(tableId);
	} else if(action === 'back') {
		js.table.th.previousPage(tableId);
	}
};