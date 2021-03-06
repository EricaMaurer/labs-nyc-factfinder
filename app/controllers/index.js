import Ember from 'ember';
import { computed } from 'ember-decorators/object'; // eslint-disable-line
import mapboxgl from 'mapbox-gl';

import layerGroups from '../layer-groups';
import sources from '../sources';
import selectedFeatures from '../layers/selected-features';
import highlightedFeature from '../layers/highlighted-feature';

const selectedFillLayer = selectedFeatures.fill;

const { service } = Ember.inject;

const { alias } = Ember.computed;

export default Ember.Controller.extend({
  selection: service(),
  mapMouseover: service(),

  layerGroups,
  sources,
  zoom: 12,
  center: [-73.916016, 40.697299],
  mode: 'direct-select',

  selectedFillLayer,
  highlightedFeature,

  summaryLevel: alias('selection.summaryLevel'),

  @computed('selection.current')
  selectedSource(current) {
    return {
      type: 'geojson',
      data: current,
    };
  },

  actions: {
    handleClick(event) {
      const selection = this.get('selection');
      const summaryLevel = selection.summaryLevel;

      let layers = [];

      switch (summaryLevel) { // eslint-disable-line
        case 'tracts':
          layers = ['census-tracts-fill'];
          break;
        case 'blocks':
          layers = ['census-blocks-fill'];
          break;
        case 'ntas':
          layers = ['neighborhood-tabulation-areas-fill'];
          break;
        case 'pumas':
          layers = ['nyc-pumas-fill'];
          break;
      }

      const [found] =
        event.target.queryRenderedFeatures(
          event.point,
          { layers },
        );


      if (found) {
        selection.handleSelectedFeature([found]);
      }
    },

    handleMousemove(e) {
      const mapMouseover = this.get('mapMouseover');
      mapMouseover.highlighter(e);
    },

    handleSummaryLevelToggle(summaryLevel) {
      this.get('selection').handleSummaryLevelToggle(summaryLevel);
    },

    handleMapLoad(map) {
      // setup controls
      const navigationControl = new mapboxgl.NavigationControl();
      const geoLocateControl = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      });

      map.addControl(navigationControl, 'top-left');
      map.addControl(new mapboxgl.ScaleControl({ unit: 'imperial' }), 'bottom-left');
      map.addControl(geoLocateControl, 'top-left');
    },
  },
});
