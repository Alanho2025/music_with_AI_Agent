// src/pages/AdminIdols.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useSecureApi } from "../api/secureClient";
import IdolList from "../components/admin/IdolList";
import IdolForm from "../components/admin/IdolForm";

function AdminIdols() {
    const api = useSecureApi();

    const [idols, setIdols] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [form, setForm] = useState(null); // { idol, images }
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState(null);
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

    // 3) filter list
    const filteredIdols = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return idols;
        return idols.filter((i) =>
            [i.stage_name, i.group_name, i.position]
                .filter(Boolean)
                .join(" ")
                .toLowerCase()
                .includes(term)
        );
    }, [idols, search]);

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
                message: "modified idol saved.",
            });
        } catch (err) {
            console.error(err);
            setStatus({
                type: "error",
                message: "saved failed",
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
        <div className="flex gap-4">
            <IdolList
                idols={filteredIdols}
                selectedId={selectedId}
                onSelect={setSelectedId}
                search={search}
                onSearchChange={setSearch}
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
    );
}

export default AdminIdols;
