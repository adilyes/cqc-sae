export const GAME_STATUS = Object.freeze({
  SETUP: 'setup',
  CONNECTING: 'connecting',
  WAITING_FOR_RIVAL: 'waiting_for_rival',
  MY_TURN: 'my_turn',
  RIVAL_TURN: 'rival_turn',
  WON: 'won',
  LOST: 'lost',
  RIVAL_LEFT: 'rival_left',
  SERVER_ERROR: 'server_error',
  GAME_ERROR: 'game_error',
});

export const NOTIFICATION_CSS_CLASS_TO_STATUS = Object.freeze({
  'notification__init': GAME_STATUS.SETUP,
  'notification__connect-to-server': GAME_STATUS.CONNECTING,
  'notification__waiting-for-rival': GAME_STATUS.WAITING_FOR_RIVAL,
  'notification__game-started-move-on': GAME_STATUS.MY_TURN,
  'notification__move-on': GAME_STATUS.MY_TURN,
  'notification__game-started-move-off': GAME_STATUS.RIVAL_TURN,
  'notification__move-off': GAME_STATUS.RIVAL_TURN,
  'notification__game-over-win': GAME_STATUS.WON,
  'notification__game-over-lose': GAME_STATUS.LOST,
  'notification__rival-leave': GAME_STATUS.RIVAL_LEFT,
  'notification__server-error': GAME_STATUS.SERVER_ERROR,
  'notification__game-error': GAME_STATUS.GAME_ERROR,
});

export const HIDDEN_NOTIFICATION_CLASS = 'none';

export const FAILURE_STATUSES = Object.freeze([
  GAME_STATUS.LOST,
  GAME_STATUS.RIVAL_LEFT,
  GAME_STATUS.SERVER_ERROR,
  GAME_STATUS.GAME_ERROR,
]);