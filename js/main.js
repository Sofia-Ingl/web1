$(function() {

	const MAX_Y = 3;
	const MIN_Y = -5;

	function isNumber(number) {
		return !isNaN(number) && isFinite(number);
	}

	function validateX() {
		let result = $("#xbuttons").hasClass("active");
		if (!result) {
			$("#xbuttons").addClass("button-error");
		} else {
			$("#xbuttons").removeClass("button-error");
		}
		return result;
	}

	function validateY() {

		let y = getY();

		if (isNumber(y) && y>=MIN_Y && y<=MAX_Y) {

			$("#y-input").removeClass("input-error");
			return true;
		}
		$("#y-input").addClass("input-error");
		return false;

	}

	function validateData() {

		return validateX() & validateY();
	}

	function getX() {
		if ($("#xbuttons").hasClass("active")) {
			return parseFloat($(".x-button.selected").val());
		}
		return NaN;
	}

	function getY() {
		let y = $("#y-input").val();
		if (typeof y != "undefined") { 
			y = y.replace(",", ".");
			if (/^[+-]?[0-9]+\.?[0-9]*$/.test(y)) {
				return parseFloat(y);
			} 
		}
		return NaN;
		
	}

	function getR() {
		return parseFloat($("#r-options").val());
	}

	function drawDot(x, y, r) {
		const CENTER_X = 150;
		const CENTER_Y = 120;
		if (isNumber(x) && isNumber(y) && isNumber(r) && y>=MIN_Y && y<=MAX_Y) {
			let relativeX = x*100/r;
			let relativeY = y*100/r;
			let absoluteX = CENTER_X + Math.round(relativeX);
			let absoluteY = CENTER_Y - Math.round(relativeY);
			$("#dot").attr("r", 3);
			$("#dot").attr("cx", absoluteX);
			$("#dot").attr("cy", absoluteY);

		} else {
			$("#dot").attr("r", 0);
		}
	}

	function restore() {
		$.ajax({
	        url: "php/restore.php",
	        type: "POST",
	        success: function (data){
	            if (typeof data == "string") {
	            	data = JSON.parse(data);
	            }
	            for (str of data) {
	            	newRow = '<tr>';
			        newRow += '<td>' + str.x + '</td>';
			        newRow += '<td>' + str.y + '</td>';
			        newRow += '<td>' + str.r + '</td>';
			        newRow += '<td>' + str.currentTime + '</td>';
			        newRow += '<td>' + str.executionTime + '</td>';
			        newRow += '<td>' + str.hit + '</td></tr>';
			        $('#result-table').append(newRow);
	            }
	        }
    	});
	}

	function clearTable() {
		$.ajax({
	        url: "php/clear.php",
	        type: "POST",
	        success: function (){
	            $("#result-table > tr").remove();
	        }
    	});
	}

	function addRow() {
		$.ajax({
			url: "php/form.php",
			method: "POST",
			data: $("#values-form").serialize() + "&x="+$(".x-button.selected").val() + '&timezone=' + new Date().getTimezoneOffset(),
			// dataType: "json",
			success: function(data) {
				alert(data);
				data = JSON.parse(data);
				if (data.valid) {
					newRow = '<tr>';
			        newRow += '<td>' + data.x + '</td>';
			        newRow += '<td>' + data.y + '</td>';
			        newRow += '<td>' + data.r + '</td>';
			        newRow += '<td>' + data.currentTime + '</td>';
			        newRow += '<td>' + data.executionTime + '</td>';
			        newRow += '<td>' + data.hit + '</td></tr>';
			        $('#result-table').append(newRow);
		    	}
			},
			error: function (jqXHR, exception) {
		        let msg = '';
		        if (jqXHR.status === 0) {
		            msg = 'Not connected.\nVerify Network.';
		        } else if (jqXHR.status == 404) {
		            msg = 'Page not found. [404]';
		        } else if (jqXHR.status == 500) {
		            msg = 'Internal server error [500].';
		        } else if (exception === 'parsererror') {
		            msg = 'Requested JSON parse failed.';
		        } else if (exception === 'timeout') {
		            msg = 'Timeout error.';
		        } else if (exception === 'abort') {
		            msg = 'Ajax request aborted.';
		        } else {
		            msg = 'Unknown Error.\n' + jqXHR.responseText;
		        }
		        console.log(msg);
			},

		});
	}

	$("#values-form").on("submit", function(event) {
		event.preventDefault();
		if (!validateData()) return;
		addRow();
	});
	

	$("#values-form").on("reset", function(event) {

		$("#xbuttons").removeClass("active");
		$("#xbuttons").children(".x-button").removeClass("selected");
		drawDot(NaN, NaN, NaN);
		clearTable();

	});


	$("#r-options").on("change", function() {
		drawDot(getX(), getY(), getR());
	});

	$("#y-input").on("keypress", function(event) {
		let test = /[0-9.,\-+]/.test(event.key);
		if (!test) {
			event.preventDefault();
		}
	}); 

	$("#y-input").on("input", function() {
		drawDot(getX(), getY(), getR());
	});

	$(".x-button").click(function(){
		if ($(this).hasClass("selected")) {
			$(this).removeClass("selected");
			$("#xbuttons").removeClass("active");
		} else {
			$(this).addClass("selected");
			$(this).siblings("button.selected").removeClass("selected");
			$("#xbuttons").addClass("active");
			$("#xbuttons").removeClass("button-error");
		}
		drawDot(getX(), getY(), getR());
	});

	window.onunload = function() {
		clearTable();
	};

	restore();

});

