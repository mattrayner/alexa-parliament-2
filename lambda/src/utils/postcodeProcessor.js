'use strict';
exports.__esModule = true;
var moment = require("moment");
function PostcodeProcessor(store) {
    var object = {
        member: null,
        constituency: null,
        party: null,
        incumbency: null,
        image: {
            mcu: null,
            portrait: null
        }
    };
    var memberTriple = store.getQuads(null, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'https://id.parliament.uk/schema/Person')[0];
    if (memberTriple) {
        var memberNameTriple = store.getQuads(memberTriple.subject, "http://example.com/F31CBD81AD8343898B49DC65743F0BDF", null)[0];
        if (memberNameTriple) {
            object.member = memberNameTriple.object.value;
        }
        var imageTriple = store.getQuads(memberTriple.subject, 'https://id.parliament.uk/schema/memberHasMemberImage', null)[0];
        if (imageTriple) {
            var splitObject = imageTriple.object.value.split('/');
            var id = splitObject[splitObject.length - 1];
            object.image.mcu = "https://api.parliament.uk/Live/photo/" + id + ".jpeg?crop=MCU_3:2&width=1200&quality=80";
            object.image.portrait = "https://api.parliament.uk/Live/photo/" + id + ".jpeg?height=800&quality=80";
        }
    }
    var partyTriple = store.getQuads(null, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'https://id.parliament.uk/schema/Party')[0];
    if (partyTriple) {
        var partyNameTriple = store.getQuads(partyTriple.subject, "https://id.parliament.uk/schema/partyName", null)[0];
        if (partyNameTriple) {
            object.party = partyNameTriple.object.value;
        }
    }
    var incumbencyTriple = store.getQuads(null, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'https://id.parliament.uk/schema/SeatIncumbency')[0];
    if (incumbencyTriple) {
        var incumbencyStartDateTriple = store.getQuads(incumbencyTriple.subject, "https://id.parliament.uk/schema/parliamentaryIncumbencyStartDate", null)[0];
        if (incumbencyStartDateTriple) {
            object.incumbency = moment(incumbencyStartDateTriple.object.value, "YYYY-MM-DDZ").format("DD-MM-YYYY");
        }
    }
    var constituencyTriple = store.getQuads(null, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'https://id.parliament.uk/schema/ConstituencyGroup')[0];
    if (constituencyTriple) {
        var constituencyNameTriple = store.getQuads(constituencyTriple.subject, "https://id.parliament.uk/schema/constituencyGroupName", null)[0];
        if (constituencyNameTriple) {
            object.constituency = constituencyNameTriple.object.value;
        }
    }
    return object;
}
exports.PostcodeProcessor = PostcodeProcessor;
