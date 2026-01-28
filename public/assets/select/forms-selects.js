/**
 * Selects & Tags
 */

'use strict';

$(function () {
  const select2 = $('.select2')
  if (select2.length) {
    select2.each(function () {
      var $this = $(this);
      select2Focus($this);
      $this.wrap('<div class="position-relative"></div>').select2({
        placeholder: 'Demandeur',
        dropdownParent: $this.parent()
      });
    });
  }
});

$(function () {
  $('.commune_select').select2({
    placeholder: 'Commune',
    dropdownParent: $('#commune .col-sm-8'),
    width: '100%'
  });
});

$(function () {
  $('.fkt_select').select2({
    placeholder: 'Fokontany',
    dropdownParent: $('#fokontany .col-sm-8'),
    width: '100%'
  });
});