/* global _ */
/*global cytoscape*/
/* jshint camelcase: false */
(function(window, $, _, cytoscape, undefined) {
  'use strict';

  var appContext = $('[data-app-name="ebi-interaction-table-app"]');

  window.addEventListener('Agave::ready', function() {
    var Agave = window.Agave;

    var init = function() {
        var allScripts, i, arborURL, re;
        allScripts = document.querySelectorAll( 'script' );
        re = /^(.*)(\/cytoscape[^\/]*)\/(.*)cytoscape\.js??(.*)?$/;
        for ( i = 0; i < allScripts.length && ! arborURL; i++ ) {
            if ( re.test( allScripts[i].src ) ) {
                var match = re.exec( allScripts[i].src );
                arborURL = match[1] + match[2] + '/lib/arbor.js';
            }
        }
        if ( arborURL ) {
            var el = document.createElement( 'script' );
            el.src = arborURL;
            el.type = 'text/javascript';
            document.body.appendChild( el );
        }
    };

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
        $('.ebi_tv_table_progress', appContext).addClass('hidden');
        $('.ebi_tv_graph_progress', appContext).addClass('hidden');
        $('.error', appContext).html('<div class="alert alert-danger">Error contacting the server! Please try again later.</div>');
        console.error('Status: ' + err.obj.status + '  Message: ' + err.obj.message);
    };

    var showTableResults = function showTableResults(json) {
        if ( ! (json && json.obj) || json.obj.status !== 'success') {
            $('.error', appContext).html('<div class="alert alert-danger">Invalid response!</div>');
            return;
        }

        $('.ebi_tv_table_progress', appContext).addClass('hidden');
        $('.ebi_tv_graph_progress', appContext).addClass('hidden');
        $('.ebi_tv_progress', appContext).addClass('hidden');
        $('.ebi_tv_table_result', appContext).html(templates.resultTable(json.obj));
        var iTable = $('.ebi_tv_table_result table', appContext).DataTable({'lengthMenu': [10, 25, 50, 100],
                                                           'columnDefs': [{
                                                           'targets': [2,3,7,9,10,12],
                                                           'visible': false}],
                                                          });
        var colvis = new $.fn.dataTable.ColVis(iTable, {'restore': 'Restore',
                                                        'showAll': 'Show all',
                                                        'showNone': 'Show none'}
                                              );
        $('div.ebi_tv_table_result', appContext).prepend('<button name="export" class="btn btn-default export-button">Export</button>');
        $('div.ebi_tv_table_result', appContext).prepend(colvis.button());

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
        });
    };

    var showGraphResults = function showGraphResults(json) {
        if ( ! (json && json.obj) ) {
            $('.error', appContext).html('<div class="alert alert-danger">Invalid response!</div>');
            return;
        }

        $('.ebi_tv_progress', appContext).addClass('hidden');
        var view = assignViewOptions(json.obj);
        renderCytoscape(view);
        renderLegend(view.keyInfo);
    };

    var assignViewOptions = function assignViewOptions(elements) {
        var colors, experiments, colorsused, fontSize, i, j, k, m, found;

        for ( m = 0; m < elements.edges.length; m++ ) {
            if ( elements.edges[m].data.confidence_score !== '-' ) {
                if ( elements.edges[m].data.confidence_score < 0.30 ) {
                    elements.edges[m].data.lineThickness = 1;
                } else if ( elements.edges[m].data.confidence_score >= 0.30 && elements.edges[m].data.confidence_score < 0.40 ) {
                    elements.edges[m].data.lineThickness = 3;
                } else if ( elements.edges[m].data.confidence_score >= 0.40 && elements.edges[m].data.confidence_score < 0.50 ) {
                    elements.edges[m].data.lineThickness = 6;
                } else if ( elements.edges[m].data.confidence_score >= 0.50 && elements.edges[m].data.confidence_score < 0.60 ) {
                    elements.edges[m].data.lineThickness = 9;
                } else if ( elements.edges[m].data.confidence_score >= 0.60 && elements.edges[m].data.confidence_score < 0.70 ) {
                    elements.edges[m].data.lineThickness = 11;
                } else if ( elements.edges[m].data.confidence_score >= 0.70 ) {
                    elements.edges[m].data.lineThickness = 15;
                }
            } else {
                elements.edges[m].data.lineThickness = 1;
            }
        }

        /*
        * loop through the json elements received through the AJAX call and
        * assign colors to the experiment types.
        */
        colors = [
            '#2BAB2B', '#3366CC', '#B8008A', '#7634D9', '#FF8A14', '#FF0000',
            '#74F774', '#73A2FF', '#F28DD9', '#AF8DE0', '#FA9696', '#175E17',
            '#0A3180', '#69004E', '#400F8A', '#5C330A', '#730000'
        ];
        experiments = [];
        colorsused = [];
        k = 0;

        /*
        * based on the number of nodes, changes up the font size - otherwise the
        * edge labels make it impossible to see the nodes, which is annoying
        */
        fontSize = 10;
        if (elements.nodes.length < 25) {
            fontSize = 20;
        }
        else if (elements.nodes.length >= 25 && elements.nodes.length < 50) {
            fontSize = 15;
        }
        else if (elements.nodes.length >= 50 && elements.nodes.length < 100) {
            fontSize = 12;
        }
        else if (elements.nodes.length >= 100) {
            fontSize = 9;
        }

        for ( i = 0; i < elements.edges.length; i++ ) {
            // find out whether this particular experiment has been assigned a color yet
            found = 0;
            for ( j = 0; j < experiments.length; j++ ) {
                if (experiments[j] === elements.edges[i].data.interaction_detection_method_desc ) {
                    found = 1;
                    elements.edges[i].data.lineColor = colorsused[j];
                }
            }

            /*
            * if it's new give it a color, and add the new color and the
            * corresponding experiment name to two arrays. They will be used to
            * construct the graph key later.
            *
            * k is the counter to which colors have been used already. if the
            * number of experiments is greater than the number of colors, the
            * counter resets and it starts reusing colors.
            */
            if ( experiments.indexOf(elements.edges[i].data.interaction_detection_method_desc) === -1 ) {
                experiments.push(elements.edges[i].data.interaction_detection_method_desc);
                colorsused.push(colors[k]);
                elements.edges[i].data.lineColor = colors[k];
                k++;
                if ( k >= colors.length ) {
                    k = 0;
                }
            }
        }
        console.log(JSON.stringify(elements));

        return {
            keyInfo: {
                colorsused: colorsused,
                experiments: experiments
            },
            fontSize: fontSize,
            elements: elements
        };
    };

    /**
    * Loads Cy from the JSON received; assigns view options based on this data,
    * and constructs the Cytoscape object.
    */
    var renderCytoscape = function renderCytoscape(view) {
        $('#ebi_tv_cy').removeClass('hidden');
        $('#ebi_tv_cy').cytoscape({
            minZoom: 0.25,
            maxZoom: 4,
            wheelSensitivity: 0.25,
            motionBlur: false,
            layout: {
                name: 'arbor',
                liveUpdate: false,
                fit: true,
                maxSimulationTime: 200,
                ungrabifyWhileSimulating: true,
                stepSize: 0.1,
                padding: [ 50, 50, 50, 50 ],
                gravity: true,
                stableEnergy: function(energy) {
                    return (energy.max <= 0.5) || (energy.mean <= 0.3);
                }
            },
            style: cytoscape.stylesheet()
            .selector('node')
                .css({
                    'content': 'data(locus)',
                    'font-size': view.fontSize,
                    'width': 25,
                    'height': 25,
                    'background-color': 'grey'
                })
            .selector('edge')
                .css({
                    'line-color': 'data(lineColor)',
                    'width': 'data(lineThickness)'
                })
            .selector(':selected')
                .css({
                    'background-color': 'black',
                    'line-color': 'black',
                    'target-arrow-color': 'black',
                    'source-arrow-color': 'black'
                })
            .selector('.faded')
                .css({
                    'opacity': 0.25,
                    'text-opacity': 0
                }),
            elements: view.elements,
            // bind functions to various events - notably, the mouseover tooltips
            ready: function() {
                var cy = this;

                cy.elements().unselectify();

                cy.on('tap', 'node', function(e) {
                    var node = e.cyTarget;
                    var neighborhood = node.neighborhood().add(node);

                    cy.elements().addClass('faded');
                    neighborhood.removeClass('faded');
                });

                cy.on('tap', function(e) {
                    if (e.cyTarget === cy) {
                        cy.elements().removeClass('faded');
                    }
                });

                //on mouseover/mouseout, display and hide the appropriate type of mouseover (by calling the makeMouseover()/unmakeMouseover() functions)
                cy.on('mouseover', 'edge', function( e ) {
                    var tip = $('#ebi_tv_tooltip');
                    var parentOffset = $('#ebi_tv_cy_wrapper').offset();
                    var relX = e.originalEvent.pageX - parentOffset.left;
                    var relY = e.originalEvent.pageY - parentOffset.top;
                    tip.css({left: relX + 5, top: relY + 5});
                    tip.html(getEdgeInfo(e.cyTarget));
                    tip.show();
                });

                cy.on('mouseout', 'edge', function() {
                    $('#ebi_tv_tooltip').hide();
                });
            } //end ready function
        }); //end Cytoscape object options
    }; //end render()

    var renderLegend = function renderLegend(keyInfo) {
        var experiments, colorsused, key, i, ul;

        experiments = keyInfo.experiments;
        colorsused = keyInfo.colorsused;
        key = $('#ebi_tv_colors');
        key.empty();
        key.append('<h5>Interaction determination by line color</h5>');
        ul = $('<ul>');
        for ( i = 0; i < experiments.length; i++ ) {
            ul.append('<li style="color:' + colorsused[i] + '">' + experiments[i] + '</li>');
        }
        key.append(ul);
        $('#ebi_tv_legend').removeClass('hidden');
    };

    var getEdgeInfo = function getEdgeInfo(target) {
      // var sourceName = target.data('source');
      // var targetName = target.data('target');
      var experiment = target.data('interaction_detection_method_desc');
      var CV = target.data('confidence_score');
      var publication = target.data('publication');
      var firstAuthor = target.data('first_author');
      var sourceDatabase = target.data('source_database');

      return '<dl class="dl-horizontal">' +
      '<dt>Experiment</dt><dd>' + experiment +
      '</dd><dt>Confidence score</dt><dd>' + CV +
      '</dd><dt>First author</dt><dd>' + firstAuthor +
      '</dd><dt>Source Database</dt><dd>' + sourceDatabase +
      '</dd><dt>Publication</dt><dd>' + publication +
      '</dd></dl>';
    };

    init();

    $('#ebi_tv_gene_form_reset').on('click', function () {
        $('.error', appContext).empty();
        $('#ebi_tv_gene', appContext).val('');
        $('.ebi_tv_table_result', appContext).empty();
        $('.ebi_tv_graph_result', appContext).empty();
        $('#ebi_tv_cy').addClass('hidden');
        $('#ebi_tv_legend').addClass('hidden');
        $('#ebi_tv_colors').empty();
        $('#ebi_tv_tooltip').empty();
      });

      $('form[name=ebi_tv_gene_form]').on('submit', function (e) {
          e.preventDefault();

          var query = {
              locus: this.ebi_tv_gene.value,
          };

          $('.ebi_tv_table_result', appContext).empty();
          $('.ebi_tv_graph_result', appContext).empty();
          $('.error', appContext).empty();
          $('.ebi_tv_table_progress', appContext).removeClass('hidden');
          $('.ebi_tv_graph_progress', appContext).removeClass('hidden');
          $('.ebi_tv_progress', appContext).removeClass('hidden');
          Agave.api.adama.search({
              'namespace': 'eriksf-dev',
              'service': 'ebi_intact_by_locus_v0.3',
              'queryParams': query
          }, showTableResults, showError);

          Agave.api.adama.search({
              'namespace': 'eriksf-dev',
              'service': 'ebi_intact_cytoscape_by_locus_v0.4',
              'queryParams': query
          }, showGraphResults, showError);
      });

  });

})(window, jQuery, _, cytoscape);
