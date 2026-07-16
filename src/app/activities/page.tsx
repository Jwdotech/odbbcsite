"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { getBackdropUrl } from "@/lib/services/backdrops";

interface MonthData {
  name: string;
  events: string[];
}

const CALENDAR_DATA: Record<number, MonthData> = {
  0: {
    name: "January",
    events: [
      "4-11 Grace Gift Emphasis",
      "7 Prayer Vigil",
      "11 Senior Citizen Sunday",
      "18 Ministry Clinic",
      "31 Dawn Prayer Breakfast",
    ],
  },
  1: {
    name: "February",
    events: [
      "15 Couple's Sunday",
      "28 Dawn Prayer Breakfast",
    ],
  },
  2: {
    name: "March",
    events: [
      "1-29 Mission Emphasis",
      "25 Prayer Vigil",
      "28 Dawn Prayer Breakfast",
      "29 Faith Promise Commitment",
    ],
  },
  3: {
    name: "April",
    events: [
      "1-3 NEGROS YOUTH CAMP",
      "5 Pastor & Ma'am Bel Wedding Anniversary",
      "10 Good Friday",
      "11 Children's Rally",
      "19-26 First Fruit Emphasis",
      "25 Dawn Prayer Breakfast",
    ],
  },
  4: {
    name: "May",
    events: [
      "10 Mother's Sunday",
      "27 Prayer Vigil",
      "30 Dawn Prayer Breakfast",
    ],
  },
  5: {
    name: "June",
    events: [
      "7-42 CHURCH ANNIVERSARY",
      "21 Father's Sunday",
      "27 Dawn Prayer Breakfast",
      "28 Lord's Supper",
    ],
  },
  6: {
    name: "July",
    events: [
      "12 Soulwinning Emphasis",
      "25 Dawn Prayer Breakfast",
      "29 Prayer Vigil",
    ],
  },
  7: {
    name: "August",
    events: [
      "9 Ministry Emphasis",
      "29 Dawn Prayer Breakfast",
    ],
  },
  8: {
    name: "September",
    events: [
      "6 Pastor & Family Appreciation Sunday",
      "26 Dawn Prayer Breakfast",
      "27 Grace Gift Emphasis",
      "30 Prayer Vigil",
    ],
  },
  9: {
    name: "October",
    events: [
      "4 Teacher's Sunday",
      "18 Pastor's Wife Appreciation Sunday",
      "31 Dawn Prayer Breakfast",
    ],
  },
  10: {
    name: "November",
    events: [
      "1 Tracts Distribution",
      "25 Prayer Vigil",
      "28 Dawn Prayer Breakfast",
      "29 Grace Gift Emphasis",
    ],
  },
  11: {
    name: "December",
    events: [
      "5 Dawn Prayer Breakfast",
      "6 Lord's Supper",
      "13 Grace Gift Thanksgiving & Family Sunday",
      "27 Year End Fellowship",
    ],
  },
};

export default function ActivitiesPage() {
  const [backdropUrl, setBackdropUrl] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  async function loadBackdrop() {
    try {
      const url = await getBackdropUrl();
      if (url) {
        setBackdropUrl(url);
      }
    } catch (err) {
      console.error("Error loading backdrop:", err);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadBackdrop();
  }, []);

  return (
    <DashboardLayout>
      <div
        className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl overflow-hidden bg-cover bg-center"
        style={
          backdropUrl
            ? {
                backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${backdropUrl}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
              }
            : undefined
        }
      >
        {/* Background with photo frame effect */}
        <div className="relative p-8">
          {/* Main content area */}
          <div className="relative z-10">
            <div className="bg-transparent rounded-3xl shadow-2xl p-8">
              <h1 className="text-6xl font-black text-center text-white mb-8 drop-shadow-lg" style={{
                textShadow: '3px 3px 6px rgba(0, 0, 0, 0.8), -1px -1px 2px rgba(0, 0, 0, 0.5)'
              }}>
                📅 CHURCH ACTIVITIES CALENDAR
              </h1>

              {/* Zoomed Month View */}
              {selectedMonth ? (
                <div className="animate-in fade-in duration-300">
                  <button
                    onClick={() => setSelectedMonth(null)}
                    className="mb-6 px-4 py-2 bg-slate-400 text-white rounded-lg font-semibold hover:bg-slate-500 transition"
                  >
                    ← Back to Calendar
                  </button>
                  
                  <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-8 border-3 border-teal-600 shadow-2xl">
                    <h2 className="text-4xl font-bold text-teal-700 mb-6">
                      {selectedMonth}
                    </h2>
                    
                    <div className="space-y-4">
                      {CALENDAR_DATA[
                        Object.keys(CALENDAR_DATA).find(
                          (key) => CALENDAR_DATA[key as unknown as number].name === selectedMonth
                        ) as unknown as number
                      ]?.events.length > 0 ? (
                        CALENDAR_DATA[
                          Object.keys(CALENDAR_DATA).find(
                            (key) => CALENDAR_DATA[key as unknown as number].name === selectedMonth
                          ) as unknown as number
                        ]?.events.map((event, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-4 p-4 bg-white rounded-xl shadow hover:shadow-lg transition"
                          >
                            <span className="text-teal-600 font-bold text-2xl">
                              ✓
                            </span>
                            <p className="text-slate-800 text-lg">{event}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-500 text-center py-12 text-lg">
                          No events scheduled for this month
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* Grid View */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(CALENDAR_DATA).map(([, monthData]) => (
                    <button
                      key={monthData.name}
                      onClick={() => setSelectedMonth(monthData.name)}
                      className="bg-slate-50 rounded-xl p-4 border-2 border-teal-600 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer text-left"
                    >
                      <h3 className="text-lg font-bold text-teal-700 mb-3">
                        {monthData.name}
                      </h3>
                      <div className="space-y-1">
                        {monthData.events.slice(0, 3).map((event, index) => (
                          <p key={index} className="text-xs text-slate-700 leading-tight">
                            ✓ {event}
                          </p>
                        ))}
                        {monthData.events.length > 3 && (
                          <p className="text-xs text-slate-500 italic mt-1">
                            +{monthData.events.length - 3} more
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

