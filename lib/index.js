const nano = require('nano');



const getOperator = operator => {
  switch(operator) {
    case "==":
      return "$eq"
    case ">":
      return "$gt"
    case "<":
      return "$lt"
    case ">=":
      return "$gte"
    case "<=":
      return "$lte"
    default:
      return "$eq"
  }
  
}


module.exports = exports = (protocol, host, user, password) => {
  var couch = nano(protocol + user + ':' + password  + '@' +  host);
  var db;
  var doc;
  var q;

  const firecouch =  {
    collection(selector){
      db = couch.use(selector)
      return this
    },
    doc(selector){
      doc = selector
      return this
    },
    where(field, operator, value){
      if(!q){
        q = {}
      }
      q[field]= {[getOperator(operator)]: value}
      return this;
    },
    get(){
      if(doc){
        let d  = doc;
        doc = false;
        return db.get(d).then(doc => {return {snap: doc}})
      } else  {
        // check if mango query 
        if(q){
          // use find
          let n = q;
          q = false;
          return db.find({selector: n, limit: 99999}).then(res => {return {snap: res.docs}})
        } else {
          //get complete collection
          return db.list({include_docs: true, limit:9999}).then(res => {return {snap: res.rows}})
        }
      }
    },
    async set(data){
      let d  = doc;
      doc = false;
      let ref; 
      try{
       refdoc = await db.get(d)
      }catch{
        return db.insert({ ...data,  _id: d})
      }
      let ins = {...data, _id: d, _rev: refdoc._rev}
      return db.insert(ins)
    },
    async update(data){
      let d  = doc;
      doc = false;
      let ref; 
      try{
       refdoc = await db.get(d)
      }catch{
        return db.insert({ ...data,  _id: d})
      }
      let ins = {...refdoc,  ...data, _id: d, _rev: refdoc._rev}
      return db.insert(ins)
    }

  }

  return firecouch
}
