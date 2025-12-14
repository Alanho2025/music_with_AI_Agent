// src/components/admin/AdminSectionHeader.jsx
import React from "react";

function AdminSectionHeader({ title, subtitle }) {
    return (
        <div className="mb-2">
            <h1 className="text-xl font-semibold text-slate-50">
                {title}
            </h1>
            <p className="mt-1 text-sm text-slate-400">
                {subtitle}
            </p>
        </div>
    );
}

export default AdminSectionHeader;
