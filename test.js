const firecouch =  require('./lib')
let db = firecouch('http://', 'localhost:5984', 'admin', 'test')

db.collection('users').doc('test4').get().then(d=>{
  console.log(d.snap)
})

db.collection('users').where('name', '==', "heinz").where('mail', "==", "heinz@ketchup.design").get().then(d=>{
  console.log(d.snap)
})

db.collection('users').get().then(d=>{
  console.log(d.snap)
})