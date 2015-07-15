/* global _ */
/* jshint camelcase: false */
(function(window, $, _, undefined) {
  'use strict';

  console.log('Hello, ebi interaction table app!');

  var appContext = $('[data-app-name="ebi-interaction-table-app"]');

  window.addEventListener('Agave::ready', function() {
    var Agave = window.Agave;

    var templates = {
        resultTable: _.template('<table class="table table-striped table-bordered">' +
                                '<thead><tr>' +
                                '<th>Identifier A</th>' +
                                '<th>Identifier B</th>' +
                                '<th>Alternative Id A</th>' +
                                '<th>Alternative Id B</th>' +
                                '<th>Aliases for A</th>' +
                                '<th>Aliases for B</th>' +
                                '<th>Detection Method</th>' +
                                '<th>First Author</th>' +
                                '<th>Id of Publication</th>' +
                                '<th>NCBI Taxon A</th>' +
                                '<th>NCBI Taxon B</th>' +
                                '<th>Interaction Type</th>' +
                                '<th>Source</th>' +
                                '<th>Interaction Identifier(s)</th>' +
                                '<th>Confidence Score</th>' +
                                '</tr></thead><tbody>' +
                                '<% _.each(result, function(r) { %>' +
                                '<tr>' +
                                '<td><%= r.interaction_record.unique_identifier_for_interactor_a %></td>' +
                                '<td><%= r.interaction_record.unique_identifier_for_interactor_b %></td>' +
                                '<td><%= r.interaction_record.alt_identifier_for_interactor_a %></td>' +
                                '<td><%= r.interaction_record.alt_identifier_for_interactor_b %></td>' +
                                '<td><%= r.interaction_record.aliases_for_a %></td>' +
                                '<td><%= r.interaction_record.aliases_for_b %></td>' +
                                '<td><%= r.interaction_record.interaction_detection_methods %></td>' +
                                '<td><%= r.interaction_record.first_author %></td>' +
                                '<td><%= r.interaction_record.publication_identifier %></td>' +
                                '<td><%= r.interaction_record.ncbi_tax_identifier_for_interactor_a %></td>' +
                                '<td><%= r.interaction_record.ncbi_tax_identifier_for_interactor_b %></td>' +
                                '<td><%= r.interaction_record.interaction_types %></td>' +
                                '<td><%= r.interaction_record.source_databases %></td>' +
                                '<td><%= r.interaction_record.interaction_identifiers_in_source %></td>' +
                                '<td><%= r.interaction_record.confidence_score %></td>' +
                                '</tr>' +
                                '<% }) %>' +
                                '</tbody>' +
                                '</table>'),
    };

    var showError = function(err) {
        $('.error', appContext).html('<div class="alert alert-danger">Error contacting the server! Please try again later.</div>');
        console.error('Status: ' + err.obj.status + '  Message: ' + err.obj.message);
    };

    var showResults = function showResults(json) {
        if ( ! (json && json.obj) || json.obj.status !== 'success') {
            $('.error', appContext).html('<div class="alert alert-danger">Invalid response!</div>');
            return;
        }

        $('.result', appContext).html(templates.resultTable(json.obj));
        var iTable = $('.result table', appContext).DataTable({'lengthMenu': [10, 25, 50, 100],
                                                               'columnDefs': [{
                                                                   'targets': [2,3,7,8,12,13],
                                                                   'visible': false}],
                                                              });
        var colvis = new $.fn.dataTable.ColVis(iTable, {'restore': 'Restore',
                                                        'showAll': 'Show all',
                                                        'showNone': 'Show none'}
                                              );
        $(colvis.button()).insertBefore('div.result');
    };

    $('#ebi_tv_gene_form_reset').on('click', function () {
        $('.error', appContext).empty();
        $('#ebi_tv_gene', appContext).val('');
        $('.result', appContext).empty();
      });

      $('form[name=ebi_tv_gene_form]').on('submit', function (e) {
          e.preventDefault();

          var query = {
              locus: this.ebi_tv_gene.value,
          };

          $('.result', appContext).empty();
          $('.error', appContext).empty();
          Agave.api.adama.search({
              'namespace': 'eriksf-dev',
              'service': 'ebi_intact_by_locus_v0.1',
              'queryParams': query
          }, showResults, showError);
      });

  });

})(window, jQuery, _);
