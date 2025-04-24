"use client";

import React, { useState } from "react";
import Checkbox from "@/components/Checkbox";

export default function CheckboxTestPage() {
  const [standardChecked, setStandardChecked] = useState(false);
  const [externalLinkChecked, setExternalLinkChecked] = useState(true);

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "30px", fontFamily: "Manrope", fontSize: "32px" }}>
        Checkbox Component Test
      </h1>

      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "20px", fontFamily: "Manrope", fontSize: "24px" }}>
          Standard Checkbox
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <Checkbox
            checked={standardChecked}
            onChange={setStandardChecked}
            label="Standard Checkbox (Unchecked)"
          />
          <Checkbox
            checked={true}
            onChange={() => {}}
            label="Standard Checkbox (Checked)"
          />
          <Checkbox
            checked={false}
            onChange={() => {}}
            label="Standard Checkbox (Disabled)"
            disabled={true}
          />
        </div>
      </div>

      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "20px", fontFamily: "Manrope", fontSize: "24px" }}>
          External Link Checkbox
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <Checkbox
            variant="external-link"
            checked={externalLinkChecked}
            onChange={setExternalLinkChecked}
            label="Spotify Playlist"
          />
          <Checkbox
            variant="external-link"
            checked={false}
            onChange={() => {}}
            label="YouTube Video"
          />
        </div>
      </div>

      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "20px", fontFamily: "Manrope", fontSize: "24px" }}>
          Add Checkbox
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <Checkbox
            variant="add"
            onChange={() => alert("Add new item clicked")}
            label="Add New Item"
          />
          <Checkbox
            variant="add"
            onChange={() => alert("Add new link clicked")}
            label="Add New Link"
          />
        </div>
      </div>
    </div>
  );
}
