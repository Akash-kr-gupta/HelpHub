// src/pages/Home.js
import React from "react";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import FeatureCard from "../components/FeatureCard";

export default function Home() {
  const features = [
    {
      title: "Needy Person Help Connect",
      description:
        "Request food, clothes, medicine, or general help using location and photo‑based real‑time assistance. Volunteers nearby can accept your request and confirm completion so donors know their support reached the right person.",
      link: "/request",
      pill: "Mutual Aid",
      steps: [
        "Post a help need (food / clothes / medicine) with photo and location.",
        "Nearby volunteers or donors see your request and accept it.",
        "Helper confirms completion so the community knows support was delivered.",
      ],
    },
    {
      title: "Lost / Found Pet Alerts",
      description:
        "Upload pet photos and area alerts for lost or found pets. The community and local NGOs receive targeted notifications, and owners get matched with similar‑looking pet posts to speed up reunions.",
      link: "/animal-rescue",
      pill: "Pets & Community",
      steps: [
        "Upload a pet photo and your location (last seen or found spot).",
        "HelpHub sends alerts in a nearby radius to pet‑friendly groups and NGOs.",
        "Owner is notified if a matching‑looking pet post appears in the area.",
      ],
    },
    {
      title: "Blood / Medicine Urgency",
      description:
        "Post urgent blood or medicine requests with filters by blood group and location. Nearby pre‑registered donors can respond directly, and you get real‑time status updates on who is coming and when.",
      link: "/blood-network",
      pill: "Emergency Health",
      steps: [
        "Create an urgent request with blood group, hospital, and required timeline.",
        "HelpHub filters nearby registered donors and shows a contact‑ready list.",
        "Track status in real time: Available → Contacted → On the way → Completed.",
      ],
    },
    {
      title: "Animal Rescue & Help Reporter",
      description:
        "Report injured, hungry, or lost animals by uploading a photo and your location. Choose the issue type and get notified when nearby volunteers and NGOs accept and start helping.",
      link: "/animal-rescue",
      pill: "Animal Rescue",
      steps: [
        "Snap a photo and pin the location of an injured, hungry, or lost animal.",
        "Select the issue (injured / hungry / lost) so rescuers know what to bring.",
        "Nearby NGOs and volunteers receive alerts and update you once help arrives.",
      ],
    },
  ];

  return (
    <>
     
      <main>
        <Hero />

        <div className="container">
          <h2>How HelpHub Works</h2>
          <p className="lead">
            HelpHub connects people in crisis with volunteers, donors, and NGOs in real time.
            By sharing your location and a photo, you make it easy for helpers nearby to understand
            the situation and act fast—whether it’s food for a needy family, a lost pet, urgent blood,
            or an injured stray animal.
          </p>

          <div className="features">
            {features.map((feat, i) => (
              <FeatureCard key={i} {...feat} />
            ))}
          </div>

          <section className="mt-12">
            <h3>Why Use HelpHub?</h3>
            <ul>
              <li>
                <strong>Real‑time, location‑based help</strong>—requests are matched to nearby volunteers and donors.
              </li>
              <li>
                <strong>Photo + location verification</strong>—uploading images and coordinates reduces fake requests.
              </li>
              <li>
                <strong>End‑to‑end tracking</strong>—you can see when a helper accepts, arrives, or marks a request as completed.
              </li>
              <li>
                <strong>Community‑powered</strong>—neighbors, NGOs, and local blood/medicine donors work together to respond faster than scattered WhatsApp groups.
              </li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}