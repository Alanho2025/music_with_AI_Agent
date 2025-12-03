// src/pages/AdminHtmlImport.jsx
import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";

import UrlImportPanel from "../components/admin/import/UrlImportPanel";
import CsvImportPanel from "../components/admin/import/CsvImportPanel";

function AdminHtmlImport() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col gap-3">
                <h1 className="text-2xl font-bold">Admin - Data Import</h1>
                <p className="text-sm text-slate-400">
                    Log in to import groups, idols, and albums.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 w-full">
            <header>
                <h1 className="text-2xl font-bold">Admin - Data Import</h1>
                <p className="text-sm text-slate-400 mt-1">
                    Import data using URL scraping or CSV upload.
                    All parsed data can be manually edited before saving to database.
                </p>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <UrlImportPanel />
                <CsvImportPanel />
            </div>
        </div>
    );
}

export default AdminHtmlImport;
