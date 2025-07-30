import React from 'react';

const ThirdPartyKeys = () => {
  return (
    <div className="p-6 space-y-8 text-sm">
      <h1 className="text-2xl font-semibold text-gray-800">
        Workspace Third Party Keys
      </h1>
      <p className="text-gray-600 max-w-2xl">
        Give Roboflow access to your accounts on other services so we can interface with your labeling, training, and deployment pipelines.
      </p>

      {/* OpenAI */}
      <section className="border border-gray-200 rounded-xl p-4 space-y-3 bg-white shadow-sm">
        <h2 className="font-semibold text-gray-700">OpenAI</h2>
        <p className="text-sm text-gray-500">
          Link your <a href="https://platform.openai.com/account/api-keys" className="text-purple-600 underline">OpenAI Key</a> to unlock GPT-4 powered functionality in Roboflow.
        </p>
        <label className="block text-sm font-medium text-gray-600 mt-2">Settings</label>
        <input
          type="text"
          placeholder="API Keys"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </section>

      {/* AWS */}
      <section className="border border-gray-200 rounded-xl p-4 space-y-3 bg-white shadow-sm">
        <h2 className="font-semibold text-gray-700">Amazon Web Services</h2>
        <p className="text-sm text-gray-500">
          Please <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html" className="text-purple-600 underline">create a programmatic access user</a> on your AWS account with <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html" className="text-purple-600 underline">these IAM policies</a>.
        </p>
        <label className="block text-sm font-medium text-gray-600 mt-2">Settings</label>
        <input
          type="text"
          placeholder="Access Key ID"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <input
          type="password"
          placeholder="Security Access Key"
          className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </section>

      {/* Azure */}
      <section className="border border-gray-200 rounded-xl p-4 space-y-3 bg-white shadow-sm">
        <h2 className="font-semibold text-gray-700">Azure Cognitive Services (Custom Vision)</h2>
        <p className="text-sm text-gray-500">
          If you haven't setup a resource, <a href="https://portal.azure.com/" className="text-purple-600 underline">do so here first</a>.
        </p>
        <label className="block text-sm font-medium text-gray-600 mt-2">Settings</label>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">https://</span>
          <input
            type="text"
            placeholder="Your Resource"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <span className="text-sm text-gray-500">.cognitiveservices.azure.com</span>
        </div>
        <input
          type="text"
          placeholder="Training Key"
          className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <select className="mt-2 block w-40 rounded-md border border-gray-300 px-3 py-2 text-sm">
          <option>Fo</option>
          <option>Free</option>
          <option>Standard</option>
        </select>
      </section>
    </div>
  );
};

export default ThirdPartyKeys;
