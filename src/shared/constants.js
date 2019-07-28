module.exports = Object.freeze({
  TOTAL_ROUNDS: 3,
  TOTAL_CARDS: 108,
  PLAYER_COUNT: 2,
  PLAYER_NAMES: ['Danne', 'Nany'],
  CARDS_PER_PLAYER: {
    2: 10,
    3: 9,
    4: 8,
    5: 7,
  },
  IMG_NAMES: [
    'sushigo_back.png',
    'sushigo_tempura.png',
    'sushigo_sashimi.png',
    'sushigo_dumpling.png',
    'sushigo_maki_1.png',
    'sushigo_nigiri_salmon.png',
    'sushigo_nigiri_squid.png',
    'sushigo_nigiri_egg.png',
    'sushigo_pudding.png',
    'sushigo_wasabi.png',
    'sushigo_chopsticks.png',
  ],

  IMAGE_SIZE: {
    width: 241,
    height: 367,
  },

  CARDS: [
    {
      name: 'Tempura',
      filename: 'sushigo_tempura.png',
      count: 14,
      color: 'black',
    },
    {
      name: 'Sashimi',
      filename: 'sushigo_sashimi.png',
      count: 14,
      color: 'red',
    },
    {
      name: 'Dumpling',
      filename: 'sushigo_dumpling.png',
      count: 14,
      color: 'blue',
    },
    {
      name: 'Maki',
      filename: 'sushigo_maki_1.png',
      count: 26,
      color: 'green',
    },
    {
      name: 'Salmon Nigiri',
      filename: 'sushigo_nigiri_salmon.png',
      count: 10,
      color: 'purple',
    },
    {
      name: 'Squid Nigiri',
      filename: 'sushigo_nigiri_squid.png',
      count: 5,
      color: 'gray',
    },
    {
      name: 'Egg Nigiri',
      filename: 'sushigo_nigiri_egg.png',
      count: 5,
      color: 'pink',
    },
    {
      name: 'Pudding',
      filename: 'sushigo_pudding.png',
      count: 10,
      color: 'orange',
    },
    {
      name: 'Wasabi',
      filename: 'sushigo_wasabi.png',
      count: 6,
      color: 'lightblue',
    },
    {
      name: 'Chopsticks',
      filename: 'sushigo_chopsticks.png',
      count: 4,
      color: 'pink',
    },
  ],

  CARD_SIZE: {
    width: 100,
    height: 150,
  },

  CARD_MARGIN: {
    x: 10,
    y: 5,
  },

  CARD_STATE: {
    IN_DECK: 'is_in_deck',
    IN_HAND: 'is_in_hand',
    MOVING_TO_TABLE: 'is_moving_to_table',
    ON_THE_TABLE: 'is_on_the_table',
    HOVERED_OVER: 'is_hovered_over',
    BEING_CHOSEN: 'is_being_chosen',
    WAITING_TO_BE_REVEALED: 'is_waiting_to_be_revealed',
    BEING_REVEALED: 'is_being_revealed',
  },

  CARD_UPDATE_DIRECTION: [1, -1, 0, 0],

  // PLAYER_POSITIONS: [
  //   { x: 0, y: 0 }, // First
  //   { x: 0, y: CARD_SIZE.height * 3 + CARD_MARGINS.y }, // Second
  //   null,
  //   null,
  // ],

  DECK_POSITION: {
    x: 1200,
    y: 200,
  },
  GAME_STATE: {
    STARTING_GAME: 'starting_game',
    DEALING_CARDS_TO_PLAYERS: 'dealing_cards_to_players',
    PLAYERS_CHOOSE_CARD: 'players_choose_card',
    PLAYERS_REVEAL_CARD: 'players_reveal_card',
    PLAYERS_PUT_DOWN_HAND: 'players_put_down_hand',
    PLAYERS_PICKUP_HAND: 'players_pickup_hand',
    END_OF_TURN: 'is_end_of_turn',
    CALCULATING_SCORES: 'calculating_scores',
  },
  MSG_TYPES: {
    JOIN_GAME: 'join_game',
    GAME_UPDATE: 'update',
    INPUT: 'input',
    GAME_OVER: 'dead',
    CLIENT_UPDATE: 'client_update',
    // VALIDATE_CARD: 'validate_card',
    // VALID_CARD: 'valid_card',
    // INVALID_CARD: 'invalid_card',
    // CARD_CHOSEN: 'card_was_chosen',
  },
  CANVAS_DIMENSIONS: {
    width: 1400,
    height: 610,
  },
  CARD_UPDATE_SPEED: 10,
});
