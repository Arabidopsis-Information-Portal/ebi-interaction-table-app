/* global _ */
/* jshint camelcase: false */
(function(window, $, _, undefined) {
  'use strict';

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
                                '<td><a href="<%= r.interaction_record.unique_identifier_for_interactor_a[0].url %>" target="_blank"><%= r.interaction_record.unique_identifier_for_interactor_a[0].id %> <i class="fa fa-external-link"></i></a></td>' +
                                '<td><a href="<%= r.interaction_record.unique_identifier_for_interactor_b[0].url %>" target="_blank"><%= r.interaction_record.unique_identifier_for_interactor_b[0].id %> <i class="fa fa-external-link"></i></a></td>' +
                                '<td>' +
                                '<% _.each(r.interaction_record.alt_identifier_for_interactor_a, function(a) { %>' +
                                '<%= a.id %>, ' +
                                '<% }) %>' +
                                '</td>' +
                                '<td>' +
                                '<% _.each(r.interaction_record.alt_identifier_for_interactor_b, function(b) { %>' +
                                '<%= b.id %>, ' +
                                '<% }) %>' +
                                '</td>' +
                                '<td>' +
                                '<% _.each(r.interaction_record.aliases_for_a, function(a) { %>' +
                                '<% if (a.url.indexOf("http") == 0) { %>' +
                                '<a href="<%= a.url %>" target="_blank"><%= a.id %> <i class="fa fa-external-link"></i></a>,' +
                                '<% } else { %>' +
                                '<%= a.id %>, ' +
                                '<% } %>' +
                                '<% }) %>' +
                                '</td>' +
                                '<td>' +
                                '<% _.each(r.interaction_record.aliases_for_b, function(b) { %>' +
                                '<% if (b.url.indexOf("http") == 0) { %>' +
                                '<a href="<%= b.url %>" target="_blank"><%= b.id %> <i class="fa fa-external-link"></i></a>,' +
                                '<% } else { %>' +
                                '<%= b.id %>, ' +
                                '<% } %>' +
                                '<% }) %>' +
                                '</td>' +
                                '<td>' +
                                '<% _.each(r.interaction_record.interaction_detection_methods, function(i) { %>' +
                                '<a href="<%= i.url %>" target="_blank"><%= i.desc %> <i class="fa fa-external-link"></i></a><br/>' +
                                '<% }) %>' +
                                '</td>' +
                                '<td><%= r.interaction_record.first_author %></td>' +
                                '<td>' +
                                '<% _.each(r.interaction_record.publication_identifier, function(p) { %>' +
                                '<% if (p.url.indexOf("http") == 0) { %>' +
                                '<a href="<%= p.url %>" target="_blank"><%= p.desc %> <i class="fa fa-external-link"></i></a><br/>' +
                                '<% } else { %>' +
                                '<%= p.desc %><br/>' +
                                '<% } %>' +
                                '<% }) %>' +
                                '</td>' +
                                '<td>' +
                                '<% _.each(r.interaction_record.ncbi_tax_identifier_for_interactor_a, function(n) { %>' +
                                '<a href="<%= n.url %>" target="_blank"><%= n.desc %> <i class="fa fa-external-link"></i></a><br/>' +
                                '<% }) %>' +
                                '</td>' +
                                '<td>' +
                                '<% _.each(r.interaction_record.ncbi_tax_identifier_for_interactor_b, function(n) { %>' +
                                '<a href="<%= n.url %>" target="_blank"><%= n.desc %> <i class="fa fa-external-link"></i></a><br/>' +
                                '<% }) %>' +
                                '</td>' +
                                '<td>' +
                                '<% _.each(r.interaction_record.interaction_types, function(i) { %>' +
                                '<a href="<%= i.url %>" target="_blank"><%= i.desc %> <i class="fa fa-external-link"></i></a><br/>' +
                                '<% }) %>' +
                                '</td>' +
                                '<td>' +
                                '<% _.each(r.interaction_record.source_databases, function(s) { %>' +
                                '<a href="<%= s.url %>" target="_blank"><%= s.desc %> <i class="fa fa-external-link"></i></a><br/>' +
                                '<% }) %>' +
                                '</td>' +
                                '<td>' +
                                '<% _.each(r.interaction_record.interaction_identifiers_in_source, function(i) { %>' +
                                '<% if (i.url.indexOf("http") == 0) { %>' +
                                '<a href="<%= i.url %>" target="_blank"><%= i.desc %> <i class="fa fa-external-link"></i></a><br/>' +
                                '<% } else { %>' +
                                '<%= i.desc %><br/>' +
                                '<% } %>' +
                                '<% }) %>' +
                                '</td>' +
                                '<td><%= r.interaction_record.confidence_score %></td>' +
                                '</tr>' +
                                '<% }) %>' +
                                '</tbody>' +
                                '</table>'),
    };

    var showError = function(err) {
        $('.ebi_tv_progress', appContext).addClass('hidden');
        $('.error', appContext).html('<div class="alert alert-danger">Error contacting the server! Please try again later.</div>');
        console.error('Status: ' + err.obj.status + '  Message: ' + err.obj.message);
    };

    var showResults = function showResults(json) {
        if ( ! (json && json.obj) || json.obj.status !== 'success') {
            $('.error', appContext).html('<div class="alert alert-danger">Invalid response!</div>');
            return;
        }

        $('.ebi_tv_progress', appContext).addClass('hidden');
        $('.result', appContext).html(templates.resultTable(json.obj));
        var iTable = $('.result table', appContext).DataTable({'lengthMenu': [10, 25, 50, 100],
                                                           'columnDefs': [{
                                                           'targets': [2,3,7,9,10,12],
                                                           'visible': false}],
                                                          });
        var colvis = new $.fn.dataTable.ColVis(iTable, {'restore': 'Restore',
                                                        'showAll': 'Show all',
                                                        'showNone': 'Show none'}
                                              );
        $('div.result', appContext).prepend('<button name="export" class="btn btn-default export-button">Export</button>');
        $('div.result', appContext).prepend(colvis.button());

        $('button[name=export]', appContext).on('click', function (e) {
            e.preventDefault();
            console.log('There are ' + iTable.data().length + ' row(s) of data in this table!');

            var ts_content = '';
            // get table headers
            iTable.columns().every(function() {
                ts_content += $(this.header()).text() + '\t';
            });
            ts_content += '\n';
            // get table data
            iTable.rows().every(function() {
                var d = this.data();
                for(var i=0;i<d.length;i++) {
                    var t = $($.parseHTML(d[i])).text();
                    ts_content += t + '\t';
                }
                ts_content += '\n';
            });

            try {
                var isFileSaverSupported = !!new Blob();
                if (!isFileSaverSupported) {
                    $('.error', appContext).html('<div class="alert alert-danger">Sorry, your browser does not support this feature. Please upgrade to a more modern browser.</div>');
                }
            } catch (e) {
                    $('.error', appContext).html('<div class="alert alert-danger">Sorry, your browser does not support this feature. Please upgrade to a more modern browser.</div>');
            }
            var clean_locus = $.trim($('#ebi_tv_gene', appContext).val()).replace(/[^a-zA-Z0-9-_]/gi, '');
            var filename = 'ebi-intact-results-for-' + clean_locus + '.txt';
            var blob = new Blob([ts_content], {type: 'text/plain;charset=utf-8'});
            window.saveAs(blob, filename);
            /*
            var filename = 'ebi-intact-results-for-' + $('#ebi_tv_gene', appContext).val() + '.txt';
            var form = $('<form>').attr({action: 'http://www.jcvi.org/arabidopsis/databounce.php',
                                         method: 'POST'});
            form.append($('<input>').attr({name: 'filename', value: filename}));
            form.append($('<input>').attr({name: 'content_type', value: 'text/plain;charset=utf-8'}));
            form.append($('<input>').attr({name: 'content', value: ts_content}));
            form.appendTo($('body'));
            form.submit();
            window.setTimeout(function() {form.remove();}, 10000);
            */
        });
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
          $('.ebi_tv_progress', appContext).removeClass('hidden');
          Agave.api.adama.search({
              'namespace': 'aip',
              'service': 'ebi_intact_by_locus_v0.2',
              'queryParams': query
          }, showResults, showError);
      });

  });

})(window, jQuery, _);
