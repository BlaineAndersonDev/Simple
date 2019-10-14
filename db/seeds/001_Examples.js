exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('examples').del()
  .then(function () {
    // Inserts seed entries
    return knex('examples').insert([
      {
        name: 'Blaine Anderson',
        username: 'Mordred',
        number: 5
      },
      {
        name: 'Kelli Anderson',
        username: 'WickedWife',
        number: 7
      },
      {
        name: 'Chris Potter',
        username: 'Steel_Rabbit',
        number: 15
      },
      {
        name: 'Justin Robare',
        username: 'Lionell',
        number: 3
      },
      {
        name: 'Andy',
        username: 'Percival',
        number: 352
      }
    ]);
  });
};
