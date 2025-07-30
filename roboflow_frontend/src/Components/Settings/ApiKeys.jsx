import React, { useState } from "react";

const ApiKeys = () => {
  const [privateKey] = useState("********************************");
  const [punishableKey, setPunishableKey] = useState("");

  return (
    <div className="max-w-3xl px-8 py-10 mx-auto">
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">API Keys</h2>
      <p className="text-gray-600 mb-6">
        API Keys are revokable credentials used to integrate the Roboflow API into your application. Use your keys to perform inference on your models and upload images directly to your project from outside sources.{" "}
        <a
          href="https://docs.roboflow.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 underline hover:text-purple-800"
        >
          Roboflow API Documentation
        </a>
      </p>

      {/* Private Key */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Private API Keys
        </label>
        <p className="text-sm text-gray-500 mb-2">
          For use with our{" "}
          <a
            href="#"
            className="text-purple-600 underline hover:text-purple-800"
          >
            Platform APIs
          </a>{" "}
          or{" "}
          <a
            href="#"
            className="text-purple-600 underline hover:text-purple-800"
          >
            Roboflow Inference
          </a>
          .
        </p>
        <input
          type="password"
          readOnly
          value={privateKey}
          className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
        />
      </div>

      {/* Punishable Key */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Punishable API Key
        </label>
        <p className="text-sm text-gray-500 mb-2">
          For use exclusively with the client-side library.
        </p>
        <input
          type="text"
          placeholder="Enter key here"
          value={punishableKey}
          onChange={(e) => setPunishableKey(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
        />
      </div>
    </div>
  );
};

export default ApiKeys;
