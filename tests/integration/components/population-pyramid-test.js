import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('population-pyramid', 'Integration | Component | population pyramid', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{population-pyramid}}`);

  assert.equal(this.$().text().split('\n')[1], '  Hover over bars for details about each age cohort');
});
