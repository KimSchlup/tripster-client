"use client";

import Header from "@/components/Header";

export default function MyRoadtrips() {
    return (
        <>
            <Header isLoggedIn={true} />
            <div style={{ padding: "32px", maxWidth: "1500px", margin: "0 auto" }}>
                <h1>My Roadtrips</h1>
            </div>
        </>
    );
}
