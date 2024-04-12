import {
    exportToCsv,
    ListStorage,
    UIContainer,
    createCta,
    createSpacer,
    createTextSpan
} from 'browser-scraping-utils';

interface FBMember {
    profileId: string
    fullName: string
    profileLink: string
    bio: string
    imageSrc: string
    groupId: string
    groupJoiningText: string
    profileType: string
}
class FBStorage extends ListStorage<FBMember> {
    name = 'fb-scrape-storage'
    get headers() {
        return [
            'Profile Id',
            'Full Name',
            'Profile Link',
            'Bio',
            'ImageSrc',
            'GroupId',
            'Group Joining Text',
            'Profile Type'
        ]
    }
    itemToRow(item: FBMember): string[]{
        return [
            item.profileId,
            item.fullName,
            item.profileLink,
            item.bio,
            item.imageSrc,
            item.groupId,
            item.groupJoiningText,
            item.profileType
        ]
    }
}



const memberListStore = new FBStorage();
const counterId = 'fb-group-scraper-number-tracker';
const exportName = 'groupMemberExport';


async function updateConter(){
    // Update member tracker counter
    const tracker = document.getElementById(counterId)
    if(tracker){
        const countValue = await memberListStore.getCount();
        tracker.textContent = countValue.toString()
    }
}

const uiWidget = new UIContainer();

function buildCTABtn(){
    
    // Button Download
    const btnDownload = createCta();
    btnDownload.appendChild(createTextSpan('Download\u00A0'))
    btnDownload.appendChild(createTextSpan('0', {
        bold: true,
        idAttribute: counterId
    }))
    btnDownload.appendChild(createTextSpan('\u00A0users'))

    btnDownload.addEventListener('click', async function() {
        const timestamp = new Date().toISOString()
        const data = await memberListStore.toCsvData()
        try{
            exportToCsv(`${exportName}-${timestamp}.csv`, data)
        }catch(err){
            console.error('Error while generating export');
            // @ts-ignore
            console.log(err.stack)
        }
    });

    uiWidget.addCta(btnDownload)

    // Spacer
    uiWidget.addCta(createSpacer())

    // Button Reinit
    const btnReinit = createCta();
    btnReinit.appendChild(createTextSpan('Reset'))
    btnReinit.addEventListener('click', async function() {
        await memberListStore.clear();
        await updateConter();
    });
    uiWidget.addCta(btnReinit);

    // Draggable
    uiWidget.makeItDraggable();

    // Render
    uiWidget.render()

    // Initial
    window.setTimeout(()=>{
        updateConter()
    }, 1000)
}

function processResponse(dataGraphQL: any): void{
    // Only look for Group GraphQL responses
    let data: any;
    if(dataGraphQL?.data?.group){
        // Initial Group members page
        data = dataGraphQL.data.group;
    } else if(dataGraphQL?.data?.node?.__typename === 'Group'){
        // New members load on scroll
        data = dataGraphQL.data.node;
    } else {
        // If no group members, return fast
        return;
    }

    let membersEdges: Array<any>;
    // Both are used (new_forum_members seems to be the new way)
    if(data?.new_members?.edges){
        membersEdges = data.new_members.edges;
    }else if(data?.new_forum_members?.edges){
        membersEdges = data.new_forum_members.edges;
    }else if(data?.search_results?.edges){
        membersEdges = data.search_results.edges;
    }else{
        return
    }

    const membersData = membersEdges.map(memberNode=>{
        const nodeType = memberNode.node.__isEntity;
        const node = nodeType === "GroupUserInvite" ? memberNode.node.invitee_profile : memberNode.node;

        if(!node){
            return null
        }

        // Member Data
        const {
            id,
            name,
            bio_text,
            url,
            profile_picture,
            __isProfile:profileType
        } = node;

        // Group Joining Info
        const joiningText = memberNode?.join_status_text?.text || memberNode?.membership?.join_status_text?.text;

        // Facebook Group Id
        const groupId = node.group_membership?.associated_group.id

        return {
            profileId: id,
            fullName: name,
            profileLink: url,
            bio: bio_text?.text || '',
            imageSrc: profile_picture?.uri || '',
            groupId: groupId,
            groupJoiningText: joiningText || '',
            profileType: profileType
        }
    })

    const toAdd: [string, FBMember][] = []
    membersData.forEach(memberData=>{
        if(memberData){
            toAdd.push([memberData.profileId, memberData])
        }
    })

    memberListStore.addElems(toAdd).then(()=>{
        updateConter();
    })

}

function parseResponse(dataRaw: string): void{
    let dataGraphQL: Array<any> = [];
    try{
        dataGraphQL.push(JSON.parse(dataRaw))
    }catch(err){
        // Sometime Facebook return multiline response
        const splittedData = dataRaw.split("\n");

        // If not a multiline response
        if(splittedData.length<=1){
            console.error('Fail to parse API response', err);
            return;
        }

        // Multiline response. Parse each response
        for(let i=0; i<splittedData.length;i++){
            const newDataRaw = splittedData[i];
            try{
                dataGraphQL.push(JSON.parse(newDataRaw));
            }catch(err2){
                console.error('Fail to parse API response', err);
            }
        }
    }

    for(let j=0; j<dataGraphQL.length; j++){
        processResponse(dataGraphQL[j])
    }
}

function main(): void {
    buildCTABtn()

    // Watch API calls to find GraphQL responses to parse
    const matchingUrl = '/api/graphql/';
    let send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function() {
        this.addEventListener('readystatechange', function() {
            if (this.responseURL.includes(matchingUrl) && this.readyState === 4) {
                parseResponse(this.responseText);
            }
        }, false);
        // @ts-ignore
        send.apply(this, arguments);
    };
}

main();
