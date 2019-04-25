const { init: initTwitter } = require('./sources/twitter/index');
const TopicVueJs = require('./topics/vuejs');
const TopicReact = require('./topics/react');
const TopicAngular = require('./topics/angular');
const TopicEmberJs = require('./topics/emberjs');
const TopicPreact = require('./topics/preact');
const TopicAurelia = require('./topics/aurelia');
const TopicBackboneJs = require('./topics/backbonejs');
const TopicSvelte = require('./topics/svelte');

const init = () => {
  TopicVueJs();
  TopicReact();
  TopicAngular();
  TopicEmberJs();
  TopicPreact();
  TopicAurelia();
  TopicBackboneJs();
  TopicSvelte();

  initTwitter();
};

module.exports = init;
