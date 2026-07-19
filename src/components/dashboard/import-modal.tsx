"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getUsersAction } from "@/actions/user-action";
import { importEntityFromPortfolioAction, getItemsFromPortfolioAction } from "@/actions/import-action";

interface ImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    entityType: 'courses' | 'projects' | 'education' | 'experience';
}

export function ImportModal({ isOpen, onClose, entityType }: ImportModalProps) {
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<number | ''>('');
    const [items, setItems] = useState<any[]>([]);
    const [selectedRecordId, setSelectedRecordId] = useState<number | ''>('');
    
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingUsers, setIsFetchingUsers] = useState(false);
    const [isFetchingItems, setIsFetchingItems] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsFetchingUsers(true);
            getUsersAction()
                .then((data) => {
                    // filter out active user
                    if (Array.isArray(data)) {
                        setUsers(data.filter((u) => !u.is_active));
                    }
                })
                .catch((error) => {
                    console.error("Failed to fetch users", error);
                    toast.error("Failed to fetch portfolios");
                })
                .finally(() => {
                    setIsFetchingUsers(false);
                });
        } else {
            setSelectedUserId('');
            setSelectedRecordId('');
            setItems([]);
        }
    }, [isOpen]);

    useEffect(() => {
        if (selectedUserId) {
            setIsFetchingItems(true);
            setSelectedRecordId('');
            getItemsFromPortfolioAction(Number(selectedUserId), entityType)
                .then((data) => {
                    setItems(data || []);
                })
                .catch(() => {
                    toast.error("Failed to fetch items from selected portfolio");
                })
                .finally(() => {
                    setIsFetchingItems(false);
                });
        } else {
            setItems([]);
            setSelectedRecordId('');
        }
    }, [selectedUserId, entityType]);

    if (!isOpen) return null;

    const handleImport = async () => {
        if (!selectedRecordId) {
            toast.error("Please select a record to import.");
            return;
        }
        setIsLoading(true);
        try {
            const result = await importEntityFromPortfolioAction(Number(selectedRecordId), entityType);
            if (result.success) {
                toast.success(result.message);
                onClose();
            } else {
                toast.error(result.message);
            }
        } catch (error: any) {
            toast.error(error.message || "An error occurred during import.");
        } finally {
            setIsLoading(false);
        }
    };

    const getItemLabel = (item: any) => {
        if (entityType === 'courses') return item.title;
        if (entityType === 'projects') return item.title;
        if (entityType === 'education') return `${item.degree} at ${item.institution}`;
        if (entityType === 'experience') return `${item.role} at ${item.company}`;
        return 'Unknown item';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-surface border border-border rounded-2xl shadow-xl w-full max-w-md p-6 relative z-10 max-h-[90vh] flex flex-col">
                <h3 className="text-xl font-bold text-foreground mb-4 capitalize">
                    Import {entityType}
                </h3>
                <p className="text-muted text-sm mb-6">
                    Select a portfolio and then select the specific record you wish to import.
                </p>

                {isFetchingUsers ? (
                    <div className="text-sm text-muted mb-4">Loading portfolios...</div>
                ) : users.length === 0 ? (
                    <div className="text-sm text-red-400 mb-4">No other portfolios found.</div>
                ) : (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-foreground mb-2">Select Portfolio</label>
                        <select
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(Number(e.target.value))}
                            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                        >
                            <option value="">-- Select a Portfolio --</option>
                            {users.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.portfolio_name || u.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {selectedUserId !== '' && (
                    <div className="flex-1 overflow-y-auto min-h-[150px] mb-6 pr-2 border-t border-border pt-4">
                        <label className="block text-sm font-medium text-foreground mb-2">Select Record</label>
                        {isFetchingItems ? (
                            <div className="text-sm text-muted">Loading items...</div>
                        ) : items.length === 0 ? (
                            <div className="text-sm text-muted">No {entityType} found in this portfolio.</div>
                        ) : (
                            <div className="space-y-2">
                                {items.map((item) => (
                                    <label
                                        key={item.id}
                                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                            selectedRecordId === item.id 
                                                ? 'bg-primary/10 border-primary text-primary' 
                                                : 'bg-background border-border hover:bg-elevated'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="import_record"
                                            className="mt-1"
                                            checked={selectedRecordId === item.id}
                                            onChange={() => setSelectedRecordId(item.id)}
                                        />
                                        <span className="text-sm font-medium leading-tight">{getItemLabel(item)}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className="flex justify-end gap-3 mt-auto pt-4 border-t border-border">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-lg text-foreground hover:bg-background transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleImport}
                        disabled={isLoading || !selectedRecordId}
                        className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-inverse font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Importing..." : "Import"}
                    </button>
                </div>
            </div>
        </div>
    );
}
