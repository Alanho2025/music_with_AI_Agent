// src/hooks/useGroups.js
import { useEffect, useState } from "react";
import api from "../api/client";

/**
 * Public groups for the <select> in the form.
 */
export function useGroups() {
    const [groups, setGroups] = useState([]);
    const [loadingGroups, setLoadingGroups] = useState(false);
    const [groupsError, setGroupsError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function fetchGroups() {
            try {
                setLoadingGroups(true);
                setGroupsError(null);
                const res = await api.get("/groups");
                if (!cancelled) {
                    setGroups(res.data || []);
                }
            } catch (err) {
                console.error("fetch groups error", err);
                if (!cancelled) {
                    setGroupsError(
                        err.response?.data?.error || "Failed to load groups."
                    );
                }
            } finally {
                if (!cancelled) setLoadingGroups(false);
            }
        }

        fetchGroups();

        return () => {
            cancelled = true;
        };
    }, []);

    return { groups, loadingGroups, groupsError };
}
