document.getElementById('uploadButton').addEventListener('click', () => {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', handleFileSelect);

// Add demo button handler with toggle behavior
const demoButton = document.getElementById('demoButton');
let demoDataLoaded = false;
let demoData = null;

demoButton.addEventListener('click', async () => {
    if (!demoDataLoaded) {
        await loadDemoData();
    } else {
        hideExample();
    }
});

// Add drag and drop handlers
const dropZone = document.getElementById('dropZone');

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('dragover');
    
    const file = e.dataTransfer.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            hideExample(); // Hide example if showing
            processRunResults(JSON.parse(e.target.result));
        };
        reader.readAsText(file);
    }
});

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            hideExample(); // Hide example if showing
            processRunResults(JSON.parse(e.target.result));
        };
        reader.readAsText(file);
    }
}

async function loadDemoData() {
    try {
        if (!demoData) {
            const demoUrl = demoButton.getAttribute('data-demo-url');
            const response = await fetch(demoUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            demoData = await response.json();
        }
        processRunResults(demoData);
        demoDataLoaded = true;
        demoButton.textContent = 'Hide Example';
    } catch (error) {
        console.error('Error loading demo data:', error);
        alert('Failed to load example data. Please try again later.');
    }
}

function hideExample() {
    document.getElementById('chart-container').innerHTML = '';
    demoButton.textContent = 'Show Example';
    demoDataLoaded = false;
}

function formatDuration(seconds) {
    if (seconds < 60) {
        return `${seconds.toFixed(1)}s`;
    }
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = (seconds % 60).toFixed(1);
    
    let result = '';
    if (hours > 0) {
        result += `${hours}h `;
    }
    if (minutes > 0 || hours > 0) {
        result += `${minutes}m `;
    }
    if (remainingSeconds !== '0.0') {
        result += `${remainingSeconds}s`;
    }
    return result.trim();
}

function processRunResults(data) {
    const results = data.results;
    const generatedAt = data.metadata.generated_at;

    const chartData = results.map(node => {
        const compileStart = new Date(node.timing[0].started_at);
        const executeEnd = new Date(node.timing[1].completed_at);
        const runtimeSeconds = (executeEnd - compileStart) / 1000;

        let runtimeCategory;
        if (runtimeSeconds < 60) {
            runtimeCategory = "< 1 min";
        } else if (runtimeSeconds < 180) {
            runtimeCategory = "1-3 mins";
        } else if (runtimeSeconds < 600) {
            runtimeCategory = "3-10 mins";
        } else {
            runtimeCategory = "10+ mins";
        }

        return {
            thread: `${node.thread_id}`,
            compile_started_at: compileStart.toISOString(),
            execute_completed_at: executeEnd.toISOString(),
            node_name: node.unique_id,
            status: node.status,
            runtime_category: runtimeCategory,
            runtime_seconds: runtimeSeconds,
            runtime_formatted: formatDuration(runtimeSeconds)
        };
    });

    createVisualization(chartData, generatedAt);
}

function createVisualization(data, generatedAt) {
    // Clear any existing chart
    document.getElementById('chart-container').innerHTML = '';
    
    // Main chart specification
    const mainChart = {
        width: "container",
        height: 400,
        mark: 'bar',
        encoding: {
            x: {
                field: 'compile_started_at',
                type: 'temporal',
                title: 'Time',
                scale: { domain: { selection: 'brush' } },
                axis: {
                    format: '%H:%M:%S',
                    tickCount: 10
                }
            },
            x2: { field: 'execute_completed_at' },
            y: {
                field: 'thread',
                type: 'nominal',
                title: 'Thread'
            },
            color: {
                field: 'runtime_category',
                type: 'nominal',
                title: 'Runtime Category',
                scale: {
                    domain: ['< 1 min', '1-3 mins', '3-10 mins', '10+ mins'],
                    range: ['#1a5f1a', '#4CAF50', '#FFC107', '#F44336']
                },
                legend: {
                    orient: 'top',
                    title: null,
                    labelFontSize: 12,
                    symbolSize: 100,
                    symbolType: 'square'
                }
            },
            tooltip: [
                { field: 'thread', type: 'nominal' },
                { field: 'node_name', type: 'nominal' },
                { field: 'status', type: 'nominal' },
                { field: 'runtime_formatted', type: 'nominal', title: 'Runtime' },
                { field: 'compile_started_at', type: 'temporal', format: '%Y-%m-%d %H:%M:%S' },
                { field: 'execute_completed_at', type: 'temporal', format: '%Y-%m-%d %H:%M:%S' }
            ]
        }
    };

    // Time selector specification
    const brushChart = {
        width: "container",
        height: 60,
        mark: 'bar',
        selection: {
            brush: { type: 'interval', encodings: ['x'] }
        },
        encoding: {
            x: {
                field: 'compile_started_at',
                type: 'temporal',
                title: '',
                axis: {
                    format: '%H:%M:%S',
                    tickCount: 10
                }
            },
            x2: { field: 'execute_completed_at' },
            y: {
                field: 'thread',
                type: 'nominal',
                title: null,
                axis: null
            },
            color: {
                field: 'runtime_category',
                type: 'nominal',
                legend: null,
                scale: {
                    domain: ['< 1 min', '1-3 mins', '3-10 mins', '10+ mins'],
                    range: ['#1a5f1a', '#4CAF50', '#FFC107', '#F44336']
                }
            },
            opacity: { value: 0.7 }
        }
    };

    // Combined specification
    const spec = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        title: {
            text: `Run Results: ${generatedAt}`,
            anchor: 'start',
            fontSize: 16
        },
        data: { values: data },
        vconcat: [mainChart, brushChart],
        config: {
            view: { stroke: null },
            axis: { grid: false }
        }
    };

    vegaEmbed('#chart-container', spec, { 
        actions: false,
        renderer: 'svg'
    });
} 