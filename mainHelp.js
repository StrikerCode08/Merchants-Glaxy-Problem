var Metrals = {};
var Currency = {};

const romanNumbersValue = {
	i : 1,
	v : 5,
	x : 10,
	l : 50,
	c : 100,
	d : 500,
	m : 1000
};
const romanNumbers = [ 'i', 'v', 'x', 'l', 'c', 'd', 'm' ];

/*  Check Valid input */
var isValueRegEx = new RegExp(/^[a-z]+\s+is\s+[i|v|x|l|c|d|m]$/i);
var isCreditRegEx = new RegExp(/^([a-z\s]+)is\s+(\d+.?\d*)\s+credits$/i);
var HowMuchRegEx = new RegExp(/^how\s+much\s+is\s+([a-z\s]+)[?]$/i);
var HowManyRegEx = new RegExp(/^how\s+many\s+credits\s+is\s+([a-z\s]+)[?]$/i);
var isValidRomanRegEx = new RegExp(/^m{0,3}(cm|cd|d?c{0,3})(xc|xl|l?x{0,3})(ix|iv|v?i{0,3})$/);




/*
 * Use This function to convert inter-galaxy currency to it's value. Function
 * Works as follows,
 * 1)Convert inter-Galaxy currency array to respective roman
 * numeral,while converting use saved inter-galaxy currency for conversion.
 * 2)Check if constructed roman numeral is valid.
 * 3)Convert that roman numeral
 * to decimal number.
 */
function ConvertCurrency(PartArr) {
	var RomanString = "";
	var answer = 0;
	for (let i = 0; i < PartArr.length; i++) {
		if (Currency[PartArr[i].toLowerCase()]) {
			RomanString += Currency[PartArr[i].toLowerCase()];
		} else if (Metrals[PartArr[i].toLowerCase()]) {
			console.log(PartArr[i] + " is not currency,it's a unit");
			return -1;
		} else {
			console.log("Unknown currency " + PartArr[i] + " queried");
			return -1;
		}
	}
	if (!isValidRomanRegEx.test(RomanString)) {
		console.log("Invalid amount " + PartArr);
		return -1;
	}
	var RomanDigits = [];
	RomanString.split("").forEach(function(e, i, arr) {
		RomanDigits.push(romanNumbersValue[e]);
		if (romanNumbersValue[e] < romanNumbersValue[arr[i + 1]]) {
			RomanDigits[i] *= -1;
		}
	});
	answer = RomanDigits.reduce(function(sum, elt) {
		return sum + elt;
	});
	return answer;
}
/*
 * Public function to process inputs and to do inter-Galaxy currency
 * conversions.input is validated against regular expressions and if valid
 * respective input part is processes further.
 */
exports.Merchant = function(input) {
	var RegAns = null;
    RegAns = isValueRegEx.exec(input);
    if (RegAns !== null) {
        var part = RegAns[0].split(/\s+/);
        if (!Currency[part[0].toLowerCase()]) {
            var index = romanNumbers.indexOf(part[2].toLowerCase())
            if (index > -1) {
                Currency[part[0].toLowerCase()] = part[2].toLowerCase();
                romanNumbers.splice(index, 1);
            } else {
                console.log(part[2]+'Value Already stored' );
            }
        } else if (Currency[part[0].toLowerCase()] !== romanNumbersValue[2].toLowerCase()) {
            console.log(part[0] + 'Converted already');
        }
        return ;
    }
	
    RegAns = isCreditRegEx.exec(input);
    if (RegAns !== null) {
        var Credit = parseFloat(RegAns[2])
        console.log(Credit);
        var part = RegAns[1].trim()
        console.log(part);
        if (part === "") {
            return console.log("Enter A currency");
        }
        part = part.split(/\s+/)
        var unit = part.pop()
        if (Currency[unit.toLowerCase()]) {
            return console.log(unit + 'Is a currency, Needs to be a Unit');
        }
        if (part.length < 1) {
            return console.log('No currency Provided');
        }
        var value = ConvertCurrency(part);
        if ((Credit / value) < 0.00001) {
            return console.log('Low credit');
        }
        if (value !== -1) {
            value = Credit / value
            Metrals[unit.toLowerCase()] = value
        } else {
            return console.log('Invalid Currency');
        }
        return 
    }
	
	RegAns = HowMuchRegEx.exec(input);
	if (RegAns !== null) {
        var part = RegAns[1].trim()
        if (part === "") {
            return console.log("Enter a currency to convert");
        } 
        part = part.split(/\s+/)
        var value = ConvertCurrency(part)
        if (value !== -1) {
            return console.log(part + "Is" + value);
        } else {
            return console.log('invalid currency');
        }
    }
	RegAns = HowManyRegEx.exec(input);
	if (RegAns !== null) {
        var part = RegAns[1].trim()
        if (part === "") {
            return console.log('Enter Any currency');
        } 
        part = part.split(/\s+/)
        var unit = part.pop()
        if (!Metrals[unit.toLowerCase()]) {
            return console.log("No Metals Provided");
        }
        if (part.length < 1) {
            return console.log('No currency given');
        }
        var value = ConvertCurrency(part)
        if (value !== 1) {
            value *= Metrals[unit.toLowerCase()]
            return console.log(RegAns[1] + "is" + value + 'Credits');
        } else {
            return console.log('Invalid Currency');
        }
    }
	return console.log("I have no idea what you are talking about");
};