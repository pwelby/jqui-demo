/*
 * File: mtable.js, created by Peter Welby 18 Oct. 2015
 * This script implements the multiplication table generation and
 * form validation logic.
 * Updated 11/5/2015 to use the jQuery validation plugin
 * Updated 11/6/2015 to add validation for inputs given directly via the search string,
 *                      and to add a maxlength validator rule to further prevent massive tables
 */

"use strict";

/** Function: generateTable(objInput) -- generate the table from parsed search string values */
var generateTable = function(objInput) {
    var i, j,
        strContent = "", strTitle = "",
        rStart, rEnd,
        cStart, cEnd;

    rStart = objInput.rStart;
    rEnd = objInput.rEnd;
    cStart = objInput.cStart;
    cEnd = objInput.cEnd;

    strContent += "<table>";

    // start at one less than the row and column start values to make a spot for the labels
    for (i = rStart - 1; i <= rEnd; i++) {
        strContent += "<tr>";

        // j goes between the cStart and cEnd values
        for (j = cStart - 1; j <= cEnd; j++) {
            // handle the printing of labels, and put nothing in the top-left corner
            if (i === rStart - 1) {
                if (j === cStart - 1) {
                    // top-left corner, so we need an empty cell
                    strContent += "<td class='indexLabel'>" + " " + "</td>";
                } else {
                    // first row, need to print column labels
                    strContent += "<td class='indexLabel'>" + j + "</td>";
                }
            } else if (j === cStart - 1) {
                strContent += "<td class='indexLabel'>" + i + "</td>";
            } else if (i === j) {
                // we're calculating a square, so highlight it
                strContent += "<td class='squareProduct'>" + (i * j) + "</td>";
            } else {
                strContent += "<td>" + (i * j) + "</td>";
            }

        }
        strContent += "</tr>";
    }

    strContent += "</table>";

    strTitle += "[" + cStart + ", " + cEnd + "] * [" + rStart + ", " + rEnd + "]";

    // addTab defined in ui.js
    addTab($("#tableArea"), strTitle, strContent);
};

/** Function: checkInputs(objInput) -- check the parsed search string values for invalid inputs
 *  to prevent circumvention of the form validator */
var checkInputs = function(objInput) {
    var errBox = $("#message");
    // Check for ordering errors
    if ((objInput.rEnd < objInput.rStart) || (objInput.cEnd) < objInput.cStart) {
        errBox.html("End values cannot be less than start values! Use the form to enter new values.");
        return false;
    // Check for max-value errors
    } else if ((objInput.rStart > 999) || (objInput.rEnd > 999) || (objInput.cStart > 999) || (objInput.cEnd > 999)) {
        errBox.html("Values cannot be greater than 999! Use the form to enter new values.");
        return false;
    // Check for inputs out of range of one another
    } else if ((Math.abs(objInput.rEnd - objInput.rStart) > 25) || (Math.abs(objInput.cEnd - objInput.cStart) > 25)) {
        errBox.html("Values cannot differ by more than 25! Use the form to enter new values.");
        return false;
    } else {
        errBox.html("");
        return true;
    }
};

/** Setup: wait for the document to load, then add the validate listener and run the
 *  search string parsing and table generation logic */
$(document).ready(function() {
    var mainForm = $("#mainForm");

    // Add a rule to check for end values being greater than or equal to the start values
    $.validator.addMethod("greaterEqual", function(value, element, param) {
        return !value || parseInt(value) >= parseInt($("#" + param).val());
    }, "The end value cannot be less than the start value.");

    // Add a rule to check for start and end values that are too far apart
    $.validator.addMethod("deltaRange", function(value, element, params) {
        var other = $("#" + params[0]),
            threshold = params[1];
        return !other.val() || Math.abs(parseInt(value) - parseInt(other.val())) <= threshold;
    }, "The start and end values cannot differ by more than {1}.");

    // Add a rule to allow only integers
    $.validator.addMethod("integer", function (value, element, param) {
        var intRegex = /-?\d+/;

        return param && intRegex.test(value);
    }, "Please enter an integer.");

    /*
    // Return false at the end of the submit handler to suppress the page refresh
    mainForm.submit(function(event){
        var objInputVals = {};

        event.preventDefault();

        objInputVals.cStart = $("#cStart").val();
        objInputVals.cEnd = $("#cEnd").val();
        objInputVals.rStart = $("#rStart").val();
        objInputVals.rEnd = $("#rEnd").val();

        generateTable(objInputVals);

        return false;
    });
    */

    mainForm.validate({
        submitHandler: function(form) {
            var objInputVals = {};

            objInputVals.cStart = $("#cStart").val();
            objInputVals.cEnd = $("#cEnd").val();
            objInputVals.rStart = $("#rStart").val();
            objInputVals.rEnd = $("#rEnd").val();

            generateTable(objInputVals);

            return false;
        },
        rules: {
            rStart: { required: true, integer: true, deltaRange: ["rEnd", 25], min: -100, max: 100 },
            rEnd: { required: true, integer: true, greaterEqual: "rStart", deltaRange: ["rStart", 25], min: -100, max: 100 },
            cStart: { required: true, integer: true, deltaRange:  ["cEnd", 25], min: -100, max: 100 },
            cEnd: { required: true, integer: true, greaterEqual: "cStart", deltaRange: ["cStart", 25], min: -100, max: 100 }
        }
    });
    /*
    // If we've got a search string, parse it
    if(location.search) {
        var i, inputVals = [], inputObj = {},
            searchSplit = location.search.substr(1).split("&");

        for (i = 0; i < searchSplit.length; i++) {
            inputVals.push(searchSplit[i].split("="));
        }

        for (i = 0; i < inputVals.length; i++) {
            inputObj[inputVals[i][0]] = parseInt(inputVals[i][1]);
        }

        // If the search string inputs are valid, get them into the fields and generate a table from them.
        if (checkInputs(inputObj)) {
            $("#rStart").val(inputObj.rStart);
            $("#rEnd").val(inputObj.rEnd);
            $("#cStart").val(inputObj.cStart);
            $("#cEnd").val(inputObj.cEnd);

            generateTable(inputObj);
        }
    }
    */
});
