u = require('util');
Mods = require('../deps-resolver');

mods = new Mods;

mods.add('A', ['Коля']);
mods.add('Ba', []);
mods.add('Коля', ['Ba']);
// mods.populateRelations();


console.log('resolve', mods.getResolved());

// console.log('mods', u.inspect(mods, {depth: 10}));
