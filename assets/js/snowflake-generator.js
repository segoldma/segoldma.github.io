const characters = [
    { name: 'Beavis', id: 1 },
    { name: 'Butthead', id: 2 },
    { name: 'Daria', id: 3 },
    { name: 'Mr. Van Driessen', id: 4 },
    { name: 'Principal McVicker', id: 5 },
    { name: 'Todd', id: 6 },
    { name: 'Stewart', id: 7 },
    { name: 'Coach Buzzcut', id: 8 },
    { name: 'Tom Anderson', id: 9 }
];

const actions = [
    'watching TV',
    'eating nachos',
    'laughing at stuff',
    'breaking things',
    'being cool',
    'headbanging',
    'TP-ing a house',
    'breaking the law'
];

function generateQuery() {
    const rowCount = Math.min(50, Math.max(1, parseInt(document.getElementById('rowCount').value) || 5));
    const includeName = document.getElementById('includeName').checked;
    const includeNameId = document.getElementById('includeNameId').checked;
    const includeDt = document.getElementById('includeDt').checked;
    const includeMetrics = document.getElementById('includeMetrics').checked;
    const includeJson = document.getElementById('includeJson').checked;

    let columns = [];
    let aliases = [];

    if (includeName) {
        columns.push('name');
        aliases.push('name');
    }
    if (includeNameId) {
        columns.push('name_id');
        aliases.push('name_id');
    }
    if (includeDt) {
        columns.push('dt');
        aliases.push('dt');
    }
    if (includeMetrics) {
        columns.push('metric_1');
        aliases.push('metric_1');
        columns.push('metric_2');
        aliases.push('metric_2');
    }
    if (includeJson) {
        columns.push('metadata');
        aliases.push('metadata');
    }

    if (columns.length === 0) {
        alert('Please select at least one column type');
        return;
    }

    // First pass: collect all rows to calculate max widths
    let rows = [];
    for (let i = 0; i < rowCount; i++) {
        const values = [];
        const char = characters[i % characters.length];

        if (includeName) {
            values.push(`'${char.name}'`);
        }
        if (includeNameId) {
            values.push(`${char.id}`);
        }
        if (includeDt) {
            const date = new Date(2024, 0, 1);
            date.setDate(date.getDate() + i);
            values.push(`'${date.toISOString().split('T')[0]}'`);
        }
        if (includeMetrics) {
            values.push(`${(Math.random() * 100).toFixed(2)}`);
            values.push(`${Math.floor(Math.random() * 50)}`);
        }
        if (includeJson) {
            const jsonObj = {
                activity: actions[i % actions.length],
                is_cool: char.name === 'Beavis' || char.name === 'Butthead',
                score: Math.floor(Math.random() * 10)
            };
            values.push(`parse_json('${JSON.stringify(jsonObj).replace(/'/g, "\\'")}')`);
        }
        rows.push(values);
    }

    // Calculate max width for each column
    const maxWidths = aliases.map((_, colIdx) => {
        let maxWidth = aliases[colIdx].length; // Start with alias length
        rows.forEach(row => {
            maxWidth = Math.max(maxWidth, row[colIdx].length);
        });
        return maxWidth;
    });

    // Build query with aligned columns
    let query = 'with mock_data as (\n';

    rows.forEach((values, rowIdx) => {
        const prefix = rowIdx === 0 ? '  select ' : '  union all select ';
        const paddedValues = values.map((val, colIdx) => {
            const padding = ' '.repeat(maxWidths[colIdx] - val.length);
            return `${val}${padding} as ${aliases[colIdx]}`;
        });
        query += `${prefix}${paddedValues.join(', ')}\n`;
    });

    query += ')\n';
    query += `select\n  ${columns.join(',\n  ')}\n`;
    query += 'from mock_data;\n';

    document.getElementById('output').value = query;
}

function copyToClipboard() {
    const output = document.getElementById('output');
    const copyBtn = document.querySelector('.copy-btn');

    output.select();
    document.execCommand('copy');

    copyBtn.textContent = 'Copied!';
    copyBtn.classList.add('copied');

    setTimeout(() => {
        copyBtn.textContent = 'Copy';
        copyBtn.classList.remove('copied');
    }, 2000);
}

function clearOutput() {
    document.getElementById('output').value = '';
}

// Generate initial query on page load
window.addEventListener('DOMContentLoaded', () => {
    generateQuery();
});
