"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { getMembers } from "@/lib/services/members";
import { getMissionaries } from "@/lib/services/missionaries";

// Calendar data
const CALENDAR_DATA: Record<number, { name: string; events: string[] }> = {
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

export default function DashboardPage() {
  const [memberCount, setMemberCount] = useState<number | null>(null);
  const [activeCount, setActiveCount] = useState<number | null>(null);
  const [prayerCount, setPrayerCount] = useState<number>(0);
  const [missionaryCount, setMissionaryCount] = useState<number>(0);
  const [currentMonthEvents, setCurrentMonthEvents] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load members
        const members = await getMembers();
        setMemberCount(members.length);
        setActiveCount(members.filter((m) => m.active).length);

        // Load missionaries
        const missionaries = await getMissionaries();
        setMissionaryCount(missionaries.length);

        // Load current month events
        const currentMonth = new Date().getMonth();
        const monthData = CALENDAR_DATA[currentMonth];
        setCurrentMonthEvents(monthData?.events || []);

        // Load prayer requests count from localStorage or set to 0
        const savedPrayers = localStorage.getItem("prayerRequests");
        if (savedPrayers) {
          try {
            const prayers = JSON.parse(savedPrayers);
            setPrayerCount(Array.isArray(prayers) ? prayers.length : 0);
          } catch {
            setPrayerCount(0);
          }
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Refresh data every 30 seconds for real-time updates
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const cards = [
    {
      title: "Members",
      value: loading ? "..." : memberCount ?? 0,
      href: "/members",
      icon: "👥",
    },
    {
      title: "Prayer Requests",
      value: loading ? "..." : prayerCount,
      href: "/prayer-requests",
      icon: "🙏",
    },
    {
      title: "Missionaries",
      value: loading ? "..." : missionaryCount,
      href: "/missionaries",
      icon: "🌍",
    },
    {
      title: "Activities",
      value: currentMonthEvents.length,
      href: "/activities",
      icon: "📅",
    },
  ];

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="block bg-white rounded-xl shadow p-6 hover:shadow-md hover:-translate-y-0.5 transition"
          >
            <h2 className="font-semibold">
              {card.icon} {card.title}
            </h2>
            <p className="text-4xl mt-3 font-bold">{card.value}</p>
          </Link>
        ))}
      </div>

      {/* Real-time Data Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mt-8">
        {/* Members Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold mb-4">👥 Members</h2>
          {loading ? (
            <p className="text-slate-500">Loading...</p>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-slate-700">
                <span className="font-bold text-teal-700">{memberCount}</span> total members
              </p>
              <p className="text-sm text-slate-700">
                <span className="font-bold text-green-700">{activeCount}</span> active members
              </p>
              <p className="text-sm text-slate-700">
                <span className="font-bold text-orange-700">{(memberCount ?? 0) - (activeCount ?? 0)}</span> inactive
              </p>
              <Link
                href="/members"
                className="inline-block mt-3 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 transition"
              >
                View All →
              </Link>
            </div>
          )}
        </div>

        {/* Prayer Requests Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold mb-4">🙏 Prayer Requests</h2>
          <div className="space-y-2">
            <p className="text-sm text-slate-700">
              <span className="font-bold text-blue-700">{prayerCount}</span> requests logged
            </p>
            <p className="text-xs text-slate-500">
              Latest session activities tracked
            </p>
            <Link
              href="/prayer-requests"
              className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
            >
              Add Request →
            </Link>
          </div>
        </div>

        {/* Missionaries Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold mb-4">🌍 Missionaries</h2>
          {loading ? (
            <p className="text-slate-500">Loading...</p>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-slate-700">
                <span className="font-bold text-purple-700">{missionaryCount}</span> missionaries on file
              </p>
              <p className="text-xs text-slate-500">
                Serving the mission field
              </p>
              <Link
                href="/missionaries"
                className="inline-block mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition"
              >
                View All →
              </Link>
            </div>
          )}
        </div>

        {/* Current Month Activities Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold mb-4">📅 {CALENDAR_DATA[new Date().getMonth()].name} Events</h2>
          {currentMonthEvents.length > 0 ? (
            <div className="space-y-2">
              {currentMonthEvents.slice(0, 3).map((event, idx) => (
                <p key={idx} className="text-xs text-slate-700">
                  ✓ {event}
                </p>
              ))}
              {currentMonthEvents.length > 3 && (
                <p className="text-xs text-slate-500 italic">
                  +{currentMonthEvents.length - 3} more events
                </p>
              )}
              <Link
                href="/activities"
                className="inline-block mt-3 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700 transition"
              >
                View Calendar →
              </Link>
            </div>
          ) : (
            <p className="text-sm text-slate-500">No events this month</p>
          )}
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">🤖 AI Assistant</h2>

        <ul className="space-y-2">
          <li>
            ✅{" "}
            {loading
              ? "Loading members..."
              : `${memberCount ?? 0} members on file (${activeCount ?? 0} active)`}
          </li>
          <li>
            🌍{" "}
            {loading
              ? "Loading missionaries..."
              : `${missionaryCount} missionaries serving`}
          </li>
          <li>🙏 {prayerCount} prayer requests logged this session</li>
          <li>
            📅 {currentMonthEvents.length} events happening in {CALENDAR_DATA[new Date().getMonth()].name}
          </li>
          <li>
            🚀 Ready for GO PRAY —{" "}
            <Link href="/prayer-requests" className="text-blue-700 underline">
              go to Prayer Workspace
            </Link>
          </li>
        </ul>
      </div>
    </DashboardLayout>
  );
}
