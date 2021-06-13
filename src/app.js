const express = require('express')
const app = express()
const webc = require('dialogflow-fulfillment')
var serviceAccount2 = {
  "configfile"
}

var chatdata = require('firebase-admin')

chatdata.initializeApp({
  credential: chatdata.credential.cert(serviceAccount2)
})

const database = chatdata.firestore()

app.get('/', (req, res) => {
  res.send('serversssssssssss???')
})
var dis
var bre = 0
var con = 0
var sme = 0
var spe = 0
var fev = 0
var cou = 0

app.post('/', express.json(), (req, res) => {
  const agent = new webc.WebhookClient({
    request: req,
    response: res
  })
  function compare (a, b) {
    if (parseInt(a.COVID_BEDS_WITH_OXYGEN_VACANT) > parseInt(b.COVID_BEDS_WITH_OXYGEN_VACANT)) {
      return -1
    }
    if (parseInt(a.COVID_BEDS_WITH_OXYGEN_VACANT) < parseInt(b.COVID_BEDS_WITH_OXYGEN_VACANT)) {
      return 1
    }
    return 0
  }
  async function getFromApi (agent) {
    console.log('getFromApi called')
    var temp_dis = agent.parameters.districts
    dis = temp_dis.toUpperCase()
    var request = require('request')
    var options = {
      'method': 'GET',
      'url': 'https://api.covidbedsindia.in/v1/storages/608983fc03eef384cad05a78/West%20Bengal',
      'headers': {
      }
    }
    var answer
    const util = require('util')
    const requestPromise = util.promisify(request)
    const response = await requestPromise(options)
    const obj = JSON.parse(response.body)
    var dist = []
    for (var i of obj) {
      if (i.DISTRICT.includes(dis)) {
        dist.push(i)
      }
    }

    dist.sort(compare)
    var cnt = 0
    var answer = "Here are some hospitals in your District with available vetilators as per our data, please call the hospital beforehand to confirm,\n"
    var temp = 1
    for (var i of dist) {
      temp = 0
      if (cnt >= 5) break
      console.log(i.DISTRICT)
      console.log(i.HOSPITAL_NAME)
      console.log(i.CONTACT)
      console.log('Vacant beds: ' + i.COVID_BEDS_WITH_OXYGEN_VACANT)
      cnt++
      answer = answer + 'Name : ' + i.HOSPITAL_NAME + '\n' + 'Contact : ' + i.CONTACT + '\n' + 'Vacant beds with oxygen: ' + i.COVID_BEDS_WITH_OXYGEN_VACANT + '\n\n'
    }
    if (temp) {
      agent.add("Sorry, I can't find the data at the moment.")
    } else {
      agent.add(answer)
    }
  }

  async function getbeds () {
    var temp_dis = agent.parameters.districts
    dis = temp_dis.toUpperCase()
    console.log(dis)
    var request = require('request')
    var options = {
      'method': 'GET',
      'url': 'https://api.covidbedsindia.in/v1/storages/608983fc03eef384cad05a78/West%20Bengal',
      'headers': {
      }
    }
    var answer
    const util = require('util')
    const requestPromise = util.promisify(request)
    const response = await requestPromise(options)
    const obj = JSON.parse(response.body)

    var dist = []
    console.log(dis)
    for (var i of obj) {
      if (i.DISTRICT.includes(dis)) {
        dist.push(i)
      }
    }
    dist.sort(compare)
    var cnt = 0
    var answer = 'Here are some Hospitals with available Covid Beds in your city, Please make sure to call and check for exact availablity \n'
    var temp = 1
    for (var i of dist) {
      temp = 0
      if (cnt >= 5) break
      console.log(i.DISTRICT)
      console.log(i.HOSPITAL_NAME)
      console.log(i.CONTACT)
      console.log('Vacant beds: ' + i.COVID_BEDS_WITH_OXYGEN_VACANT)
      cnt++
      answer = answer + 'Name : ' + i.HOSPITAL_NAME + '\n' + 'Contact : ' + i.CONTACT + '\n' + 'Vacant beds with oxygen: ' + i.COVID_BEDS_WITH_OXYGEN_VACANT + '\n\n'
    }
    return answer
  }
  async function dentaldata (agent) {
    var reply = 'You should video consult one of the following Dentists. \n'
    var snap = await database.collection('Dentists').get()
    snap.forEach(
      (doc) => {
        reply += doc.data().Name + '\n'
        reply += doc.data().Link + '\n\n'
      }
    )
    agent.add(reply)
  }
  async function menthlth (agent) {
    var reply = 'You should video consult one of the following Mental Health Practitioners \n'
    var snap = await db.collection('Thera').get()
    snap.forEach(
      (doc) => {
        reply += doc.data().Name + '\n'
        reply += doc.data().Link + '\n\n'
      }
    )
    agent.add(reply)
  }

  async function gastro (agent) {
    console.log('sds1')
    var reply = 'You should video consult one of the following gastrology specialists. \n'
    var snap = await db.collection('Derma').get()
    snap.forEach(
      (doc) => {
        reply += doc.data().Name + '\n'
        reply += doc.data().Link + '\n\n'
      }
    )
  }
  async function Gendata (agent) {
    var reply = 'You should video consult one of the following General Physicains. \n'
    var snap = await database.collection('GenPhys').get()
    snap.forEach(
      (doc) => {
        reply += doc.data().Name + '\n'
        reply += doc.data().Link + '\n\n'
        console.log(reply)
      }
    )
    agent.add(reply)
  }
  async function ENTdata (agent) {
    var reply = 'You should video consult one of the following ENT Specialists. \n'
    var snap = await database.collection('ENT').get()
    snap.forEach(
      (doc) => {
        reply += doc.data().Name + '\n'
        reply += doc.data().Link + '\n\n'
      }
    )
    agent.add(reply)
  }
  async function Cough (agent) {
    var rep = agent.parameters.commonresponse
    if (rep.toUpperCase() === 'YES') cou = 1
    agent.add('Are you experiencing shortness of breath?')
  }
  async function Breath (agent) {
    var rep = agent.parameters.commonresponse
    if (rep.toUpperCase() === 'YES') bre = 1
    agent.add('Have you recently lost your sense of smell or taste?')
  } async function Smell (agent) {
    var rep = agent.parameters.commonresponse
    if (rep.toUpperCase() === 'YES') sme = 1
    agent.add('Have you come in contact with anybody who has tested covid positive person in the last 14 days?')
  } async function Contact (agent) {
    var rep = agent.parameters.commonresponse
    if (rep.toUpperCase() === 'YES') con = 1
    agent.add('Are you having trouble speaking full sentences?')
  }

  async function Fever (agent) {
    var rep = agent.parameters.commonresponse
    if (rep.toUpperCase() === 'YES') { fev = 1 }
    agent.add('Do you have cough?')
  }
  async function covidresponse (agent) {
    var rep = agent.parameters.commonresponse
    if (rep.toUpperCase() === 'YES') spe = 1
    if (bre === 1 || spe === 1) {
      var temp_reply = await getbeds()
      var reply = 'You are at high risk of having Covid-19, I recommend you to visit a hospital immediately.\n'
      reply = reply + temp_reply
    } else {
      if (con === 1) {
        if (fev === 1 || sme === 1) {
          var reply = 'I recommend you to get tested for Covid-19\n'
        } else {
          var reply = "Please don't worry, your chances of having Covid-19 is very slim, Stay at home and follow the Covid Guidelines\n"
        }
      } else {
        if (fev === 1 || sme === 1) {
          var reply = 'I recommend you to get tested for Covid-19\n'
        } else {
          var reply = "I don't think you have Covid-19 as per symptoms data collected worldwide for covid-19.\n"
        }
      }
    }
    bre = 0
    con = 0
    sme = 0
    spe = 0
    fev = 0
    cou = 0
    agent.add(reply)
  }

  function testfunc (agent) {
    var num = agent.parameters.num
    var docRef = database.collection('rooms').doc(num)
    docRef.get().then((doc) => {
      if (!doc.exists) {
        database.collection('rooms').doc(num).set({
          name: num
        })
      }
    }).catch((error) => {
      console.log('Error getting document:', error)
    })
    database.collection('rooms').doc(num).collection('messages').add({
      message: agent.parameters.any,
      name: agent.parameters.num,
      timestamp: chatdata.firestore.FieldValue.serverTimestamp()
    })
    agent.add('Your message has been recorded, please hold on, Our community will reach you soon.')
  }

  function sd (agent) {
    console.log(agent.session)
    agent.add('ssss')
  }

  let intentMap = new Map()
  intentMap.set('Covidbed', getFromApi)
  intentMap.set('Breath', Breath)
  intentMap.set('Cough', Cough)
  intentMap.set('Smell', Smell)
  intentMap.set('Contact', Contact)
  intentMap.set('Fever', Fever)
  intentMap.set('Speech', covidresponse)
  intentMap.set('Cough', Cough)
  intentMap.set('test', testfunc)
  intentMap.set('dental', dentaldata)
  intentMap.set('ent', ENTdata)
  intentMap.set('gas', gastro)
  intentMap.set('Genral', Gendata)
  intentMap.set('Mentalhealthshowdoc', menthlth)

  agent.handleRequest(intentMap)
})
module.exports = app
