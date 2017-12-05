window.onload = function() {
    var main = function(error, oriTL112017) {

        buildCircos('#chart1', oriTL112017, [
            {
                color: '#00d',
                position: 0.0001
            }
        ])
    };
    var gieStainColor = {
        sleeping: '#f00',
        place: '#ff0',
        driving: '#00f',
        walk: '#0f0'
    };

    var buildCircos = function (container, oriTL112017, axes) {
        var circos = new Circos({
            container: container,
            width: 1000,
            height: 1000
        });

        var places = [];
        var eventData = [];
        var calories = [];
        var highlight = [];
        var data = [];
        var start = 0;
        var end = 0;

        oriTL112017.forEach(function(day, index) {
            day.events.forEach(function(ev, idx) {
                end = start + ev.duration - 1;
                eventData.push({
                    block_id: 'day' + index + 'ev' + idx,
                    start: start,
                    end: end,
                    position: (parseInt(start) + parseInt(end)) / 2,
                    name: ev.type,
                    steps: ev.steps,
                    calories: ev.calories
                });
                data.push({
                    len: ev.duration,
                    color: gieStainColor[ev.type],
                    label: ev.type,
                    id: 'day' + index + 'ev' + idx
                });
                start = start + ev.duration;

            })
        });

        places = eventData.map(function (d) {
            return {
                // block_id: d.block_id,
                block_id: 'day0ev0',
                position: (parseInt(d.start) + parseInt(d.end)) / 2,
                value: d.steps / 1000000 || 0
            }
        });

        calories = eventData.map(function (d) {
            return {
                // block_id: d.block_id,
                block_id: 'day0ev0',
                position: (parseInt(d.start) + parseInt(d.end)) / 2,
                value: d.calories / 100000 || 0
            }
        });

        highlight = eventData.map(function (d) {
            return {
                block_id: 'day0ev0',
                start: parseInt(d.start),
                end: parseInt(d.end),
                name: d.name
            }
        });

        circos
            .layout(
                [{id: "day0ev0", color: '#03a9f4', len:end}],
                {
                    innerRadius: 400,
                    outerRadius: 500,
                    labels: {display: false},
                    ticks: {display: false}
                }
            )
            .line('snp-250', places, {
                innerRadius: 0.5,
                outerRadius:0.8,
                min: 0,
                max: 0.035,
                color: '#222222',
                axes: axes
            })
            .line('calories', calories, {
                innerRadius: 0.8,
                outerRadius:1,
                min: 0,
                max: 0.035,
                color: '#222222',
                axes: axes
            })
            .highlight('highlight', highlight, {
                innerRadius: 400,
                outerRadius: 500,
                opacity: 1,
                color: function (d) {
                    return gieStainColor[d.name]
                }
            })

            .render()
    };

    d3.queue()
        .defer(d3.json, './data/oriTL112017.json')

        .await(main)
};