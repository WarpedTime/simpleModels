const models = require('../models');

const Cat = models.Cat.CatModel;
const Dog = models.Dog.DogModel;

const defaultData = {
  name: 'unknown',
  bedsOwned: 0,
};
const defaultDogData = {
  name: 'unknown',
  breed: 'unknown',
  age: 0,
};

let lastAddedCat = new Cat(defaultData);
let lastAddedDog = new Dog(defaultDogData);

const hostIndex = (req, res) => {
  res.render('index', {
    currentNameCat: lastAddedCat.name,
    currentNameDog: lastAddedDog.name,
    title: 'Home',
    pageName: 'Home Page',
  });
};

const readAllCats = (req, res, callback) => {
  Cat.find(callback);
};
const readAllDogs = (req, res, callback) => {
  Dog.find(callback);
};

const readCat = (req, res) => {
  const name1 = req.query.name;

  const callback = (err, doc) => {
    if (err) {
      return res.json({ err }); // if error, return it
    }
    return res.json(doc);
  };

  Cat.findByName(name1, callback);
};
const readDog = (req, res) => {
  const name1 = req.query.name;

  const callback = (err, doc) => {
    if (err) {
      return res.json({ err }); // if error, return it
    }
    return res.json(doc);
  };

  Dog.findByName(name1, callback);
};

const hostPage1 = (req, res) => {
  const data = {};
  const callbackDog = (err, docs) => {
    if (err) {
      return res.json({ err }); // if error, return it
    }
    // return success
    data.dogs = docs;
    return res.render('page1', { dogs: data.dogs, cats: data.cats });
  };
  const callback = (err, docs) => {
    if (err) {
      return res.json({ err }); // if error, return it
    }

    // return success
    data.cats = docs;
    readAllDogs(req, res, callbackDog);
    return true;
  };

  readAllCats(req, res, callback);
  // readAllDogs(req, res, callbackDog, data);
};
const hostPage2 = (req, res) => {
  res.render('page2');
};
const hostPage3 = (req, res) => {
  const callback = (err, docs) => {
    if (err) {
      return res.json({ err }); // if error, return it
    }

    // return success
    return res.render('page3', { dogs: docs });
  };

  readAllDogs(req, res, callback);
};
const hostPage4 = (req, res) => {
  const callback = (err, docs) => {
    if (err) {
      return res.json({ err }); // if error, return it
    }
    // return success
    return res.render('page4', { dogs: docs });
  };
  readAllDogs(req, res, callback);
};

const getCatName = (req, res) => {
  res.json({ name: lastAddedCat.name });
};
const getDogName = (req, res) => {
  res.json({ name: lastAddedDog.name });
};

const setCatName = (req, res) => {
  if (!req.body.firstname || !req.body.lastname || !req.body.beds) {
    return res.status(400).json({ error: 'firstname,lastname and beds are all required' });
  }

  // if required fields are good, then set name
  const name = `${req.body.firstname} ${req.body.lastname}`;

  // dummy JSON to insert into database
  const catData = {
    name,
    bedsOwned: req.body.beds,
  };

  // create a new object of CatModel with the object to save
  const newCat = new Cat(catData);

  // create new save promise for the database
  const savePromise = newCat.save();

  savePromise.then(() => {
    // set the lastAdded cat to our newest cat object.
    // This way we can update it dynamically
    lastAddedCat = newCat;
    // return success
    res.json({ name: lastAddedCat.name, beds: lastAddedCat.bedsOwned });
  });

  // if error, return it
  savePromise.catch(err => res.json({ err }));

  return res;
};
const searchCatName = (req, res) => {
  if (!req.query.name) {
    return res.json({ error: 'Name is required to perform a search' });
  }

  return Cat.findByName(req.query.name, (err, doc) => {
    // errs, handle them
    if (err) {
      return res.json({ err }); // if error, return it
    }

    // if no matches, let them know
    // (does not necessarily have to be an error since technically it worked correctly)
    if (!doc) {
      return res.json({ error: 'No cats found' });
    }

    // if a match, send the match back
    return res.json({ name: doc.name, beds: doc.bedsOwned });
  });
};
const updateLastCat = (req, res) => {
  lastAddedCat.bedsOwned++;
  const savePromise = lastAddedCat.save();

  // send back the name as a success for now
  savePromise.then(() => res.json({ name: lastAddedCat.name, beds: lastAddedCat.bedsOwned }));

  // if save error, just return an error for now
  savePromise.catch(err => res.json({ err }));
};

const setDogName = (req, res) => {
  if (!req.body.name || !req.body.breed || !req.body.age) {
    return res.status(400).json({ error: 'name, breed and age are all required' });
  }

  const name = `${req.body.name}`;
  const breed = `${req.body.breed}`;

  // dummy JSON to insert into database
  const dogData = {
    name,
    breed,
    age: req.body.age,
  };

  // create a new object of CatModel with the object to save
  const newDog = new Dog(dogData);

  // create new save promise for the database
  const savePromise = newDog.save();

  savePromise.then(() => {
    lastAddedDog = newDog;

    res.json({ name: lastAddedDog.name, breed: lastAddedDog.breed, age: lastAddedDog.age });
  });

  // if error, return it
  savePromise.catch(err => res.json({ err }));

  return res;
};
const searchDogName = (req, res) => {
  if (!req.query.name) {
    return res.json({ error: 'Name is required to perform a search' });
  }

  return Dog.findByName(req.query.name, (err, doc) => {
    // errs, handle them
    if (err) {
      return res.json({ err }); // if error, return it
    }

    // if no matches, let them know
    // (does not necessarily have to be an error since technically it worked correctly)
    if (!doc) {
      return res.json({ error: 'No dogs found' });
    }

    // if a match, send the match back
    return res.json({ name: doc.name, breed: doc.breed, age: doc.age });
  });
};
const updateLastDog = (req, res) => {
  lastAddedDog.age++;
  const savePromise = lastAddedDog.save();

  // send back the name as a success for now
  savePromise.then(() =>
  res.json({ name: lastAddedDog.name, breed: lastAddedDog.breed, age: lastAddedDog.age }));

  // if save error, just return an error for now
  savePromise.catch(err => res.json({ err }));
};
const increaseDog = (req, res) => {
  if (!req.query.name) {
    return res.json({ error: 'Name is required to perform a search' });
  }
  let dog = {};

  const callback = (errA, doc) => {
    dog = doc;
    // errs, handle them
    if (errA) {
      return res.json({ errA }); // if error, return it
    }
    if (!doc) {
      return res.json({ error: 'No dogs found' });
    }
    dog.age++;
    
    const savePromise = dog.save();
    const foundDog = { name: dog.name, breed: dog.breed, age: dog.age };

    savePromise.then(() => {
      res.json({ name: foundDog.name, breed: foundDog.breed, age: foundDog.age });
      return res.json(foundDog);
    });

    // if save error, just return an error for now
    savePromise.catch(err => res.json({ err }));
    return savePromise;
  };

  Dog.findByName(req.query.name, callback );
};


const notFound = (req, res) => {
  res.status(404).render('notFound', {
    page: req.url,
  });
};

// export the relevant public controller functions
module.exports = {
  index: hostIndex,
  page1: hostPage1,
  page2: hostPage2,
  page3: hostPage3,
  page4: hostPage4,
  readCat,
  readDog,
  getCatName,
  getDogName,
  setCatName,
  setDogName,
  updateLastCat,
  updateLastDog,
  increaseDog,
  searchCatName,
  searchDogName,
  notFound,
};
