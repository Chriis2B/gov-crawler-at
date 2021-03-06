function concil_of_ministers_report_front() {
  $("#council-of-ministers-reports").html("<img src='load.gif' alt='Inhalt wird geladen...' class='load'></img>");
  var council_of_ministers_url = doURL_YQL("https://www.bka.gv.at/ministerratsprotokolle");

  $.get( council_of_ministers_url, function( data1 ) {
    var link1 = ($( "main.main .overview", data1 ).children().first()
    ).children().first().attr("href");
    $.get( doURL_YQL(link1), function( data2 ) {
      report_raw = $( ".journal-content-article", data2 ).html();
      $( ".panel.council-of-ministers-reports h1.panel-title" ).html( $( "h1", report_raw ).html() );
      $( "#council-of-ministers-reports" ).html( $( "p", report_raw).unwrap() ).append($( "ul", report_raw).unwrap());
      $("#council-of-ministers-reports p").wrap("<li class='list-group-item'></li>")

      var positions_of_topics = [];

      $("#council-of-ministers-reports li p").each( function(ii) {
        var position_of_topic = ($(this).text()).split(".");
        positions_of_topics[position_of_topic[0]] = ii;
      });

      $("#council-of-ministers-reports a").each( function(i) {
        var report_attachement_part = ($(this).text()).split("/");
        var position_of_attachement = 0;
        if ( report_attachement_part.length > 1 ) {
          var report_attachement_index = ((report_attachement_part[1]).split(" "))[0];
          report_attachement_index = (report_attachement_index.split("."))[0];
          report_attachement_index = (report_attachement_index.split(","))[0];
          if ( (!isNaN( Number(report_attachement_index) )) && ( Number(report_attachement_index) < positions_of_topics.length ) ) {
            position_of_attachement = report_attachement_index;
          } else {
            position_of_attachement = 1;
          }
        } else {
          var report_attachement_index = (report_attachement_part[0]).split(" ");
          if ( report_attachement_index[0] == 'Mitteilungen') {
            position_of_attachement = 3;
          } else if ( (report_attachement_index[2].split(","))[0] == 'Tagesordnung') {
            position_of_attachement = 2;
          } else {
            position_of_attachement = 1;
          }
        }

        $(this).appendTo( $("#council-of-ministers-reports li").eq( positions_of_topics[position_of_attachement] ) );

      });

      $("#council-of-ministers-reports a").after("<br>");
      $("#council-of-ministers-reports a").attr("target","_blank");
      $("#council-of-ministers-reports ul").remove();

    });
  });
};

concil_of_ministers_report_front();
