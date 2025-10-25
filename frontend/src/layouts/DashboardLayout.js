import React, { useState } from "react";
import OverviewTab from "./Tabs/OverviewTab";
import DocumentsTab from "./Tabs/DocumentsTab";
import RiskTab from "./Tabs/RiskTab";

export default function DashboardLayout() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="dashboard">
      <nav>
        <button onClick={() => setActiveTab("overview")}>Overview</button>
        <button onClick={() => setActiveTab("documents")}>Documents</button>
        <button onClick={() => setActiveTab("risk")}>Risk</button>
      </nav>

      <div className="tab-content">
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "documents" && <DocumentsTab />}
        {activeTab === "risk" && <RiskTab />}
      </div>
    </div>
  );
}