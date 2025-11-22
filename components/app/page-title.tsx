import React from "react";

export function PageTitle({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full flex items-center justify-start px-4 py-3">
            <span className="text-4xl font-bold text-accent-foreground">
                {children}
            </span>
        </div>
    );
}
