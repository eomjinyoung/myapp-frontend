export const DashboardPage = () => {
    return (
        <div className="dashboard-page">
            <h2>Welcome to API Explorer</h2>
            <p>Select an API group from the sidebar to explore and test available endpoints.</p>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>OpenAPI Spec</h3>
                    <p>Loaded from openapi.json</p>
                </div>
                <div className="stat-card">
                    <h3>Authentication</h3>
                    <p>JWT Bearer supported</p>
                </div>
            </div>

            <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 30px;
        }
        .stat-card {
          background: rgba(100, 108, 255, 0.1);
          padding: 20px;
          border-radius: 8px;
          border: 1px solid rgba(100, 108, 255, 0.3);
        }
        .stat-card h3 {
          margin-top: 0;
          color: #646cff;
        }
      `}</style>
        </div>
    );
};
