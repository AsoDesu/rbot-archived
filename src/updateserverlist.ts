import firebase from 'firebase'
var database = firebase.firestore()

async function update(serverCount: number) {
    var botRef = database.collection('bot').doc('info')
    await botRef.set({
        serverNum: serverCount
    }, {merge: true})
}

export default update