import React, { useState } from "react";
import html2canvas from "html2canvas";
import { Card } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Select, SelectItem } from "./components/ui/select";

const draftOrder = [
  "Washington Nationals", "Los Angeles Angels", "Seattle Mariners", "Colorado Rockies",
  "Chicago White Sox", "Oakland Athletics", "Pittsburgh Pirates", "Kansas City Royals",
  "St. Louis Cardinals", "Miami Marlins", "Detroit Tigers", "Cleveland Guardians",
  "Cincinnati Reds", "New York Mets", "San Francisco Giants", "Toronto Blue Jays",
  "Boston Red Sox", "San Diego Padres", "New York Yankees", "Arizona Diamondbacks",
  "Chicago Cubs", "Tampa Bay Rays", "Milwaukee Brewers", "Minnesota Twins",
  "Baltimore Orioles", "Philadelphia Phillies", "Houston Astros", "Atlanta Braves",
  "Texas Rangers", "Los Angeles Dodgers"
];

const prospects = [
  { id: 1, name: "#1 Ethan Holliday", position: "SS", school: "Stillwater (OK)" },
  { id: 2, name: "#2 Seth Hernandez", position: "RHP", school: "Corona (CA)" },
  { id: 3, name: "#3 Eli Willits", position: "SS", school: "Fort Cobb-Broxton (OK)" },
  // ... continue the full list
];

export default function MockDraft() {
  const [picks, setPicks] = useState({});
  const userTeam = "Chicago White Sox";

  const handlePick = (teamIndex, playerId) => {
    const selectedPlayer = prospects.find(p => p.id === parseInt(playerId));
    setPicks(prev => ({ ...prev, [teamIndex]: selectedPlayer }));
  };

  const autoPickRemaining = () => {
    const usedIds = Object.values(picks).map(p => p?.id);
    const available = prospects.filter(p => !usedIds.includes(p.id));
    const updated = { ...picks };

    draftOrder.forEach((team, index) => {
      if (!updated[index]) {
        if (team === userTeam) return;
        const next = available.shift();
        if (next) updated[index] = next;
      }
    });

    setPicks(updated);
  };

  const exportToJPEG = () => {
    const element = document.body;
    html2canvas(element, { backgroundColor: "#ffffff" }).then(canvas => {
      const link = document.createElement("a");
      link.download = "mock-draft.jpeg";
      link.href = canvas.toDataURL("image/jpeg", 1.0);
      link.click();
    });
  };

  const pickedIds = Object.values(picks).map(p => p?.id);

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-center">
        <img
          src="/soxmachine-banner-1800.png"
          alt="Sox Machine Logo"
          className="h-20 object-contain"
        />
      </div>

      <h1 className="text-2xl font-bold text-center">2025 MLB Draft Simulator</h1>

      {draftOrder.map((team, index) => (
        <Card key={index} className="p-4 flex items-center justify-between gap-4">
          <div className="font-medium w-1/4">
            {index + 1}. {team}
          </div>

          <Select
            value={picks[index]?.id || ""}
            onChange={value => handlePick(index, value)}
            className="w-2/3"
          >
            <option value="">Select a prospect</option>
            {prospects.map(player => (
              <SelectItem
                key={player.id}
                value={player.id}
                disabled={pickedIds.includes(player.id) && picks[index]?.id !== player.id}
              >
                {player.name} – {player.position}, {player.school}
              </SelectItem>
            ))}
          </Select>
        </Card>
      ))}

      <div className="flex justify-center gap-4 pt-4 flex-wrap">
        <Button onClick={autoPickRemaining}>Auto-Pick (except White Sox)</Button>
        <Button onClick={exportToJPEG}>Export to JPEG</Button>
      </div>
    </div>
  );
}
