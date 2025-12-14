// src/pages/AdminIdols.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useSecureApi } from "../api/secureClient";
import IdolList from "../components/admin/idols/IdolList";
import IdolForm from "../components/admin/idols/IdolForm";
import AdminSectionHeader from "../components/admin/AdminSectionHeader";
import IdolToolbar from "../components/admin/idols/IdolToolbar";

function AdminIdols() {
    const api = useSecureApi();

    const [idols, setIdols] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [form, setForm] = useState(null); // { idol, images }
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState(null);

    // filters: group, birthdate range, image_url null or not
    const [filters, setFilters] = useState({
        group: "",
        birthFrom: "",
        birthTo: "",
        imageStatus: "all", // "all" | "with" | "without"
    });

    // 1) 載入 idol list
    useEffect(() => {
        let cancelled = false;

        async function loadIdols() {
            try {
                const res = await api.get("/admin/idols");
                if (cancelled) return;
                setIdols(res.data);
                if (res.data.length > 0) {
                    setSelectedId(res.data[0].id);
                }
            } catch (err) {
                console.error(err);
            }
        }

        loadIdols();

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 2) 載入單一 idol detail
    useEffect(() => {
        if (!selectedId) return;

        let cancelled = false;

        async function loadDetail() {
            setLoading(true);
            try {
                const res = await api.get(`/admin/idols/${selectedId}`);
                if (cancelled) return;

                const data = res.data || {};
                setForm({
                    idol: data.idol || {},
                    images: data.images || [],
                });
            } catch (err) {
                console.error(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadDetail();

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedId]);

    // groups for toolbar select
    const groupOptions = useMemo(() => {
        const set = new Set();
        idols.forEach((i) => {
            if (i.group_name) set.add(i.group_name);
        });
        return Array.from(set).sort();
    }, [idols]);

    // 3) filter list: search + filters
    const filteredIdols = useMemo(() => {
        const term = search.trim().toLowerCase();

        return idols.filter((i) => {
            // search
            if (term) {
                const haystack = [i.stage_name, i.group_name, i.position]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

                if (!haystack.includes(term)) {
                    return false;
                }
            }

            // group filter (by group_name)
            if (filters.group && i.group_name !== filters.group) {
                return false;
            }

            // image_url null or not
            if (filters.imageStatus === "with" && !i.image_url) {
                return false;
            }
            if (filters.imageStatus === "without" && i.image_url) {
                return false;
            }

            // birthdate range
            if (i.birthdate) {
                const birth = new Date(i.birthdate);

                if (filters.birthFrom) {
                    const from = new Date(filters.birthFrom);
                    if (birth < from) return false;
                }
                if (filters.birthTo) {
                    const to = new Date(filters.birthTo);
                    if (birth > to) return false;
                }
            }

            return true;
        });
    }, [idols, search, filters]);

    // 4) handlers，往下丟給子元件用
    const handleIdolChange = (field, value) => {
        setForm((prev) => ({
            ...prev,
            idol: {
                ...prev.idol,
                [field]: value,
            },
        }));
    };

    const handleImageChange = (index, field, value) => {
        setForm((prev) => {
            const images = [...(prev.images || [])];
            images[index] = { ...images[index], [field]: value };
            return { ...prev, images };
        });
    };

    const handleAddImage = () => {
        setForm((prev) => ({
            ...prev,
            images: [
                ...(prev.images || []),
                {
                    id: null,
                    image_url: "",
                    sort_order: (prev.images || []).length + 1,
                },
            ],
        }));
    };

    const handleRemoveImage = (index) => {
        setForm((prev) => {
            const copy = [...(prev.images || [])];
            copy.splice(index, 1);
            const normalized = copy.map((img, idx) => ({
                ...img,
                sort_order: idx + 1,
            }));
            return { ...prev, images: normalized };
        });
    };

    const handleSave = async () => {
        if (!selectedId || !form) return;
        setSaving(true);
        setStatus(null);
        try {
            await api.put(`/admin/idols/${selectedId}`, form);
            setStatus({
                type: "success",
                message: "Modified idol saved.",
            });
        } catch (err) {
            console.error(err);
            setStatus({
                type: "error",
                message: "Save failed.",
            });
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        if (!status) return;
        const timer = setTimeout(() => setStatus(null), 3000);
        return () => clearTimeout(timer);
    }, [status]);

    return (
        <div className="flex flex-col gap-4">
            <AdminSectionHeader
                title="Idols"
                subtitle="Manage idol profiles, birthdays, groups, and gallery images."
            />

            <IdolToolbar
                search={search}
                onSearchChange={setSearch}
                filters={filters}
                onFilterChange={setFilters}
                groups={groupOptions}
            />

            <div className="flex gap-4">
                <IdolList
                    idols={filteredIdols}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                // 如果你不想在 IdolList 裡再顯示搜尋框，可以把下面兩行從 IdolList 裡移除
                // 並且這裡不再傳 search / onSearchChange
                // search={search}
                // onSearchChange={setSearch}
                />

                <IdolForm
                    loading={loading}
                    form={form}
                    saving={saving}
                    status={status}
                    onIdolChange={handleIdolChange}
                    onImageChange={handleImageChange}
                    onAddImage={handleAddImage}
                    onRemoveImage={handleRemoveImage}
                    onSave={handleSave}
                />
            </div>
        </div>
    );
}

export default AdminIdols;
