
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "./Contexts/userContext";

// Pages and Components
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PasswordResetFlow from "./pages/PasswordResetFlow";
import HomePage from "./pages/HomePage";
import LoadingSpinner from "./Components/LoadingSpinner";
import NewProject from "./Components/Features/NewProject";
import WorkflowPage from "./pages/WorkflowPage";
import DeploymentsPage from "./pages/DeploymentsPage";
import SettingsLayout from "./Components/Settings/SettingsLayout";
import PlanBilling from "./Components/Settings/PlanBilling";
import Usage from "./Components/Settings/Usage";
import TeamMembers from "./Components/Settings/TeamMembers";
import ApiKeys from "./Components/Settings/ApiKeys";
import ThirdPartyKeys from "./Components/Settings/ThirdPartyKeys";
import Account from "./Components/Settings/Account";
import CreateWorkflow from "./Components/CreateWorkflow";
import MonitoringPage from "./pages/Monitoring";
import WorkflowPageAlt from "./Components/WorkFlows/WorkflowPageAlt";
import ExploreTemplates from "./Components/WorkFlows/ExploreTemplates";

import "./index.css";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useUser();
  if (loading) return <LoadingSpinner />;
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useUser();
  if (loading) return <LoadingSpinner />;
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/forgetPassword" element={<PublicRoute><PasswordResetFlow /></PublicRoute>} />

    {/* Protected */}
    <Route path="/dashboard" element={<HomePage />} />
    <Route path="/projects/new" element={<NewProject />} />
    <Route path="/workflow" element={<ProtectedRoute><WorkflowPage /></ProtectedRoute>} />
    <Route path="/CreateWorkflow" element={<ProtectedRoute><CreateWorkflow /></ProtectedRoute>} />
    <Route path="/deployment" element={<ProtectedRoute><DeploymentsPage /></ProtectedRoute>} />
    <Route path="/monitoring" element={<ProtectedRoute><MonitoringPage /></ProtectedRoute>} />
    <Route path="/workflowview" element={<ProtectedRoute><WorkflowPageAlt /></ProtectedRoute>} />
    <Route path="/exploreTemplates" element={<ProtectedRoute><ExploreTemplates /></ProtectedRoute>} />

    {/* Settings Layout */}
    <Route path="/settings" element={<ProtectedRoute><SettingsLayout /></ProtectedRoute>}>
      <Route index element={<Navigate to="/settings/account" replace />} />
      <Route path="account" element={<Account />} />
      <Route path="plan-billing" element={<PlanBilling />} />
      <Route path="usage" element={<Usage />} />
      <Route path="team-members" element={<TeamMembers />} />
      <Route path="api-keys" element={<ApiKeys />} />
      <Route path="third-party-keys" element={<ThirdPartyKeys />} />
    </Route>

    {/* Catch-All */}
    {/* <Route path="*" element={<Navigate to="/dashboard" replace />} /> */}
  </Routes>
);

const App = () => (
  <UserProvider>
    <Router>
      <AppRoutes />
    </Router>
  </UserProvider>
);

export default App;
