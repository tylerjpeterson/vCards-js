'use strict';

/* global require, describe, it: true */
var fs = require('fs');
var path = require('path');
var testCard = require('../index');
var assert = require('assert');

describe('vCard', function() {

	testCard = testCard();
	testCard.version = '3.0';
	testCard.lastName = 'Doe';
	testCard.middleName = 'D';
	testCard.firstName = 'John';
	testCard.nameSuffix = 'JR';
	testCard.namePrefix = 'MR';
	testCard.nickname = 'Test User';
	testCard.gender = 'M';
	testCard.organization = 'ACME Corporation';
	testCard.photo.attachFromUrl('https://testurl', 'png');
	testCard.logo.attachFromUrl('https://testurl', 'png');
	testCard.workPhone = '312-555-1212';
	testCard.homePhone = '312-555-1313';
	testCard.cellPhone = '312-555-1414';
	testCard.pagerPhone = '312-555-1515';
	testCard.homeFax = '312-555-1616';
	testCard.workFax = '312-555-1717';
	testCard.birthday = new Date();
	testCard.anniversary = new Date();
	testCard.title = 'Crash Test Dummy';
	testCard.role = 'Crash Testing';
	testCard.email = 'john.doe@testmail';
	testCard.workEmail = 'john.doe@workmail';
	testCard.url = 'http://johndoe';
	testCard.workUrl = 'http://acemecompany/johndoe';

	testCard.homeAddress.label = 'Home Address';
	testCard.homeAddress.street = '123 Main Street';
	testCard.homeAddress.city = 'Chicago';
	testCard.homeAddress.stateProvince = 'IL';
	testCard.homeAddress.postalCode = '12345';
	testCard.homeAddress.countryRegion = 'United States of America';

	testCard.workAddress.label = 'Work Address';
	testCard.workAddress.street = '123 Corporate Loop\nSuite 500';
	testCard.workAddress.city = 'Los Angeles';
	testCard.workAddress.stateProvince = 'CA';
	testCard.workAddress.postalCode = '54321';
	testCard.workAddress.countryRegion = 'California Republic';

	testCard.source = 'http://sourceurl';
	testCard.note = 'John Doe\'s \nnotes;,';

	testCard.socialUrls.facebook = 'https://facebook/johndoe';
	testCard.socialUrls.linkedIn = 'https://linkedin/johndoe';
	testCard.socialUrls.twitter = 'https://twitter/johndoe';
	testCard.socialUrls.flickr = 'https://flickr/johndoe';
	testCard.socialUrls.custom = 'https://custom/johndoe';

	var vCardString = testCard.getFormattedString();
	var lines = vCardString.split(/[\n\r]+/);

	describe('.getFormattedString', function() {

		it('should start with BEGIN:VCARD', function(done) {
			assert(lines.length > 0 && lines[0] === 'BEGIN:VCARD');
			done();
		});

		it('should be well-formed', function(done) {
			var line = '';
			var segments = '';

			for (var i=0; i<lines.length; i++) {
				line = lines[i];

				if (line.length > 0) {
					segments = line.split(':');
					assert(segments.length >= 2 || segments[0].indexOf(';') === 0);
				}
			}
			done();
		});

		it('should encode [\\n,\',;] properly (3.0+)', function(done) {
			var line = '';

			for (var i=0; i<lines.length; i++) {
				line = lines[i];

				if (line.indexOf('NOTE') === 0) {
					assert(line.indexOf('\\n') !== -1 && line.indexOf('\\') !== -1 && line.indexOf('\\;') !== -1);
					done();
				}
			}
		});

		it('should encode numeric input as strings', function(done) {
			testCard.workAddress.postalCode = 12345;
			testCard.getFormattedString();
			done();
		});

		it('should end with END:VCARD', function(done) {
			assert(lines.length > 2 && lines[lines.length-2] === 'END:VCARD');
			done();
		});
	});

	describe('.embedFromData', function() {
		var b64 = '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';
		var iconData = fs.readFileSync(path.join(__dirname, 'icon.png'));

		testCard.photo.embedFromData(iconData, 'PNG');

		it('should base64 encode image data properly', function(done) {
			var lines = testCard.getFormattedString().split(/[\n\r]+/);
			assert(lines[11].split(':')[1] === b64);
			done();
		});
	});
});
