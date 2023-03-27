// Utils to export a Javascript double array into a CSV file
function exportToCsv(filename, rows) {
    var processRow = function (row) {
        var finalVal = '';
        for (var j = 0; j < row.length; j++) {
            var innerValue = ((row[j] === null) || (typeof (row[j]) === "undefined")) ? '' : row[j].toString();
            if (row[j] instanceof Date) {
                innerValue = row[j].toLocaleString();
            }
            ;
            var result = innerValue.replace(/"/g, '""');
            if (result.search(/("|,|\n)/g) >= 0)
                result = '"' + result + '"';
            if (j > 0)
                finalVal += ',';
            finalVal += result;
        }
        return finalVal + '\n';
    };
    var csvFile = '';
    for (var i = 0; i < rows.length; i++) {
        csvFile += processRow(rows[i]);
    }
    var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    var link = document.createElement("a");
    if (link.download !== undefined) { // feature detection
        // Browsers that support HTML5 download attribute
        var url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
window.members_list = window.members_list || [[
        'Profile Id',
        'Full Name',
        'ProfileLink',
        'Bio',
        'Image Src',
        'Groupe Id',
        'Group Joining Text',
        'Profile Type'
    ]];
// Add a Download button to export parsed member into a CSV file
function buildCTABtn() {
    var canvas = document.createElement('div');
    var canvasStyles = [
        'position: fixed;',
        'top: 0;',
        'left: 0;',
        'z-index: 10;',
        'width: 100%;',
        'height: 100%;',
        'pointer-events: none;'
    ];
    canvas.setAttribute('style', canvasStyles.join(''));
    var btn = document.createElement('div');
    var btnStyles = [
        'position: absolute;',
        'bottom: 30px;',
        'right: 130px;',
        'color: white;',
        'min-width: 150px;',
        'background: var(--primary-button-background);',
        'border-radius: var(--button-corner-radius);',
        'padding: 0px 12px;',
        'cursor: pointer;',
        'font-weight:600;',
        'font-size:15px;',
        'display: inline-flex;',
        'pointer-events: auto;',
        'height: 36px;',
        'align-items: center;',
        'justify-content: center;'
    ];
    btn.setAttribute('style', btnStyles.join(''));
    var downloadText = document.createTextNode('Download\u00A0');
    var numberSpan = document.createElement("span");
    numberSpan.setAttribute('id', 'fb-group-scraper-number-tracker');
    numberSpan.textContent = "0";
    var memberText = document.createTextNode('\u00A0members');
    btn.appendChild(downloadText);
    btn.appendChild(numberSpan);
    btn.appendChild(memberText);
    btn.addEventListener('click', function () {
        var timestamp = new Date().toISOString();
        exportToCsv("groupMemberExport-".concat(timestamp, ".csv"), window.members_list);
    });
    canvas.appendChild(btn);
    document.body.appendChild(canvas);
    return canvas;
}
function processResponse(dataGraphQL) {
    var _a;
    var _b, _c, _d, _e, _f, _g;
    // Only look for Group GraphQL responses
    var data;
    if ((_b = dataGraphQL === null || dataGraphQL === void 0 ? void 0 : dataGraphQL.data) === null || _b === void 0 ? void 0 : _b.group) {
        // Initial Group members page
        data = dataGraphQL.data.group;
    }
    else if (((_d = (_c = dataGraphQL === null || dataGraphQL === void 0 ? void 0 : dataGraphQL.data) === null || _c === void 0 ? void 0 : _c.node) === null || _d === void 0 ? void 0 : _d.__typename) === 'Group') {
        // New members load on scroll
        data = dataGraphQL.data.node;
    }
    else {
        // If no group members, return fast
        return;
    }
    var membersEdges;
    // Both are used (new_forum_members seems to be the new way)
    if ((_e = data === null || data === void 0 ? void 0 : data.new_members) === null || _e === void 0 ? void 0 : _e.edges) {
        membersEdges = data.new_members.edges;
    }
    else if ((_f = data === null || data === void 0 ? void 0 : data.new_forum_members) === null || _f === void 0 ? void 0 : _f.edges) {
        membersEdges = data.new_forum_members.edges;
    }
    else if ((_g = data === null || data === void 0 ? void 0 : data.search_results) === null || _g === void 0 ? void 0 : _g.edges) {
        membersEdges = data.search_results.edges;
    }
    else {
        return;
    }
    var membersData = membersEdges.map(function (memberNode) {
        var _a, _b, _c, _d;
        // Member Data
        var _e = memberNode.node, id = _e.id, name = _e.name, bio_text = _e.bio_text, url = _e.url, profile_picture = _e.profile_picture, profileType = _e.__isProfile;
        // Group Joining Info
        var joiningText = ((_a = memberNode === null || memberNode === void 0 ? void 0 : memberNode.join_status_text) === null || _a === void 0 ? void 0 : _a.text) || ((_c = (_b = memberNode === null || memberNode === void 0 ? void 0 : memberNode.membership) === null || _b === void 0 ? void 0 : _b.join_status_text) === null || _c === void 0 ? void 0 : _c.text);
        // Facebook Group Id
        var groupId = (_d = memberNode.node.group_membership) === null || _d === void 0 ? void 0 : _d.associated_group.id;
        return [
            id,
            name,
            url,
            (bio_text === null || bio_text === void 0 ? void 0 : bio_text.text) || '',
            (profile_picture === null || profile_picture === void 0 ? void 0 : profile_picture.uri) || '',
            groupId,
            joiningText || '',
            profileType
        ];
    });
    (_a = window.members_list).push.apply(_a, membersData);
    // Update member tracker counter
    var tracker = document.getElementById('fb-group-scraper-number-tracker');
    if (tracker) {
        tracker.textContent = window.members_list.length.toString();
    }
}
function parseResponse(dataRaw) {
    var dataGraphQL = [];
    try {
        dataGraphQL.push(JSON.parse(dataRaw));
    }
    catch (err) {
        // Sometime Facebook return multiline response
        var splittedData = dataRaw.split("\n");
        // If not a multiline response
        if (splittedData.length <= 1) {
            console.error('Fail to parse API response', err);
            return;
        }
        // Multiline response. Parse each response
        for (var i = 0; i < splittedData.length; i++) {
            var newDataRaw = splittedData[i];
            try {
                dataGraphQL.push(JSON.parse(newDataRaw));
            }
            catch (err2) {
                console.error('Fail to parse API response', err);
            }
        }
    }
    for (var j = 0; j < dataGraphQL.length; j++) {
        processResponse(dataGraphQL[j]);
    }
}
function main() {
    buildCTABtn();
    // Watch API calls to find GraphQL responses to parse
    var matchingUrl = '/api/graphql/';
    var send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function () {
        this.addEventListener('readystatechange', function () {
            if (this.responseURL.includes(matchingUrl) && this.readyState === 4) {
                parseResponse(this.responseText);
            }
        }, false);
        send.apply(this, arguments);
    };
}
main();
