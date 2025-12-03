// src/components/admin/import/CsvImportPanel.jsx
import React, { useState } from "react";
import Papa from "papaparse";
import axios from "axios";

function CsvImportPanel() {
    const [rows, setRows] = useState(null);

    function handleFile(e) {
        const file = e.target.files[0];
        Papa.parse(file, {
            header: true,
            complete: (result) => setRows(result.data),
        });
    }

    async function handleSave() {
        await axios.post("/api/import/save", { data: rows });
        alert("CSV saved to DB!");
    }

    return (
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Import From CSV</h2>

            <input type="file" accept=".csv" onChange={handleFile} className="mb-3" />

            {rows && (
                <>
                    <div className="overflow-auto h-64 text-xs bg-slate-800 p-2 rounded">
                        <pre>{JSON.stringify(rows, null, 2)}</pre>
                    </div>

                    <button
                        onClick={handleSave}
                        className="w-full bg-blue-600 hover:bg-blue-700 mt-3 py-2 rounded"
                    >
                        Save to Database
                    </button>
                </>
            )}
        </div>
    );
}

export default CsvImportPanel;
