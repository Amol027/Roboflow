import React, { useState } from "react";

const TeamMembers = () => {
  const [inviteEmails, setInviteEmails] = useState("");
  const [inviteRole, setInviteRole] = useState("Admin");
  const [inviteLink, setInviteLink] = useState("https://your-invite-link.com");
  const [linkRole, setLinkRole] = useState("Admin");
  
  // Mock user data since we don't have the context
  const user = { name: "John Doe", email: "john@example.com", role: "Admin" };
  
  const [members, setMembers] = useState([
    {
      name: user.name,
      email: user.email,
      role: user.role,
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Member",
    },
    {
      name: "Bob Wilson",
      email: "bob@example.com",
      role: "Viewer",
    },
  ]);

  const handleSendInvite = () => {
    if (!inviteEmails.trim()) return;
    alert(`Invites sent to: ${inviteEmails} as ${inviteRole}`);
    setInviteEmails("");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    alert("Invite link copied!");
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Team Members</h2>
        <p className="text-gray-600">
          Invite your team to give them access to projects in this workspace.
        </p>
      </div>

      {/* Invite section */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Invite Team Members</h3>
        
        {/* Invite by email */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Invitations (4 invite(s) available)
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="joe@gmail.com, sara@gmail.com"
              value={inviteEmails}
              onChange={(e) => setInviteEmails(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            <div className="flex gap-2">
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option>Admin</option>
                <option>Member</option>
                <option>Viewer</option>
              </select>
              <button
                onClick={handleSendInvite}
                className="bg-purple-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors whitespace-nowrap"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>

        {/* Shareable invite link */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shareable Invite Link
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              readOnly
              value={inviteLink}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
            />
            <div className="flex gap-2">
              <select
                value={linkRole}
                onChange={(e) => setLinkRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option>Admin</option>
                <option>Member</option>
                <option>Viewer</option>
              </select>
              <button
                onClick={handleCopyLink}
                className="bg-gray-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors whitespace-nowrap"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Members list */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-0">
            Team Members with Access ({members.length})
          </h3>
          <select className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-fit">
            <option>Sort by name</option>
            <option>Sort by role</option>
            <option>Sort by email</option>
          </select>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          {/* Table header */}
          <div className="grid grid-cols-2 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200">
            <div className="text-sm font-medium text-gray-700">Member</div>
            <div className="text-sm font-medium text-gray-700 text-right">Role</div>
          </div>
          
          {/* Table rows */}
          {members.map((member, idx) => (
            <div
              key={idx}
              className="grid grid-cols-2 gap-4 px-6 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col">
                <div className="font-medium text-gray-900 text-sm">{member.name}</div>
                <div className="text-gray-500 text-xs mt-1">{member.email}</div>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  member.role === 'Admin' 
                    ? 'bg-purple-100 text-purple-800' 
                    : member.role === 'Member'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {member.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamMembers;