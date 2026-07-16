import { ParsedPrayer } from "@/lib/ai/parser";
import { CALENDAR_DATA, MEMBERS_ABROAD, MISSIONARIES } from "@/lib/constants/prayerData";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function generatePrayerBookletHtml(preview: ParsedPrayer[]): string {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Get current month activities
  const currentMonth = new Date().getMonth();
  const currentMonthData = CALENDAR_DATA[currentMonth];
  const monthActivities = currentMonthData.events;

  // Categorize entries
  const prayerEntries: ParsedPrayer[] = [];

  preview.forEach((entry) => {
    if (entry.name.toLowerCase().includes("missionary") || entry.isUnknown) {
      return;
    }
    prayerEntries.push(entry);
  });

  const firstPageEntry = prayerEntries.find(
    (entry) => entry.name.trim().toLowerCase() === "sis. bel"
  );
  const otherPrayerEntries = prayerEntries.filter(
    (entry) => entry.name.trim().toLowerCase() !== "sis. bel"
  );

  const missionariesPerPage = 5;
  const prayerEntriesPerPage = 4;
  const missionaryChunks: string[][] = [];
  for (let i = 0; i < MISSIONARIES.length; i += missionariesPerPage) {
    missionaryChunks.push(MISSIONARIES.slice(i, i + missionariesPerPage));
  }

  const prayerPageCount = Math.ceil(otherPrayerEntries.length / prayerEntriesPerPage);
  const bodyPageCount = prayerPageCount;

  const renderHeader = (pageNumber: number): string => `
      <div class="page-header">
        <div class="header-left">
          <div class="logo-circle">PRAYER</div>
        </div>
        <div class="header-right">
          <div class="page-label">PRAYER REQUEST 2026</div>
          <div class="page-number">Page | ${pageNumber}</div>
        </div>
      </div>
    `;

  const renderActivityPage = (): string => {
    return `
      <div class="page">
        ${renderHeader(1)}
        <div class="activity-card">
          <div class="activity-title">2026 CHURCH ACTIVITIES</div>
          <table class="activity-table">
            <tbody>
              ${monthActivities
                .map(
                  (activity) => {
                    const parts = activity.split(" ");
                    const dateLabel = parts.shift() ?? "";
                    const text = escapeHtml(parts.join(" "));
                    return `
                      <tr>
                        <td class="activity-date">${dateLabel}</td>
                        <td class="activity-text">${text}</td>
                      </tr>
                    `;
                  }
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <div class="abroad-card">
          <div class="activity-title">BRETHREN/LOVED ONES IN ABROAD</div>
          <div class="abroad-grid">
            ${MEMBERS_ABROAD.map(
              (member, index) =>
                `<div class="abroad-item">${index + 1}. ${escapeHtml(member)}</div>`
            ).join("")}
          </div>
        </div>

        ${firstPageEntry ? `
          <div class="first-page-prayer">
            <h3 class="first-page-prayer-title">${escapeHtml(firstPageEntry.name)}</h3>
            <ul>
              ${firstPageEntry.requests
                .map((request) => `<li>${escapeHtml(request)}</li>`)
                .join("")}
            </ul>
          </div>
        ` : ""}
      </div>
    `;
  };

  const renderBodyPage = (pageIndex: number): string => {
    const startIdx = pageIndex * prayerEntriesPerPage;
    const pageEntries = otherPrayerEntries.slice(startIdx, startIdx + prayerEntriesPerPage);
    const missionaryChunk = missionaryChunks[pageIndex] ?? missionaryChunks[0] ?? [];
    const pageNumber = pageIndex + 2;

    return `
      <div class="page">
        ${renderHeader(pageNumber)}
        <h2 class="section-title">PRAYER LIST</h2>
        <div class="prayer-columns">
          ${pageEntries
            .map(
              (member) => `
                <div class="prayer-entry">
                  <h3>${escapeHtml(member.name)}</h3>
                  <ul>
                    ${member.requests
                      .map((request) => `<li>${escapeHtml(request)}</li>`)
                      .join("")}
                  </ul>
                </div>
              `
            )
            .join("")}
        </div>

        <div class="missionary-card bottom">
          <div class="activity-title">MISSIONARIES</div>
          <div class="missionary-list">
            ${missionaryChunk
              .map(
                (missionary, index) =>
                  `<div class="missionary-item">${index + 1 + pageIndex * missionariesPerPage}. ${escapeHtml(missionary)}</div>`
              )
              .join("")}
          </div>
        </div>
      </div>
    `;
  };

  const pagesHtml = [renderActivityPage()];

  for (let pageIndex = 0; pageIndex < bodyPageCount; pageIndex += 1) {
    pagesHtml.push(renderBodyPage(pageIndex + 2));
  }

  pagesHtml.push(
    `
      <div class="page">
        <div class="footer">
          <p>With faith, we lift these requests in prayer. 🙏</p>
          <p>May God's grace be upon us all.</p>
        </div>
      </div>
    `
  );

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          @page { size: A4; margin: 20px; }
          * { box-sizing: border-box; }
          body {
            font-family: 'Calibri', 'Helvetica Neue', Arial, sans-serif;
            color: #1e293b;
            margin: 0;
            font-size: 11pt;
          }
          .page {
            width: 100%;
            min-height: auto;
            padding: 24px;
            page-break-after: always;
          }
          .page:last-child {
            page-break-after: avoid;
          }
          .cover {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            height: 100vh;
          }
          .cover h1 { font-size: 36px; margin-bottom: 10px; font-weight: bold; }
          .cover p { font-size: 14px; margin: 5px 0; }

          .section-title {
            font-size: 14pt;
            font-weight: bold;
            border-bottom: 2px solid #000;
            padding-bottom: 6px;
            margin-bottom: 10px;
            margin-top: 0;
          }
          .subsection-title {
            font-size: 12pt;
            font-weight: bold;
            margin: 12px 0 6px;
          }
          .prayer-columns {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          .prayer-entry {
            margin-bottom: 10px;
            break-inside: avoid;
            page-break-inside: avoid;
            border-left: 3px solid #1d4ed8;
            padding: 12px 14px;
            background: #fbfbff;
            border-radius: 10px;
          }
          .prayer-entry h3 {
            font-size: 11pt;
            margin: 0 0 4px 0;
            font-weight: bold;
            color: #1d4ed8;
          }
          .prayer-entry ul {
            margin: 0;
            padding-left: 14px;
            font-size: 10pt;
          }
          .prayer-entry li {
            margin-bottom: 2px;
            line-height: 1.25;
          }
          .missionary-list {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 6px;
          }
          .missionary-item {
            padding: 3px 8px;
            background-color: #f9f9f9;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            font-size: 10pt;
            line-height: 1.3;
          }
          .missionary-item.empty {
            font-style: italic;
            color: #64748b;
          }
          .activity-card,
          .abroad-card,
          .missionary-card {
            background: #ffffff;
            border: 1px solid #cbd5e1;
            border-radius: 12px;
            padding: 12px 14px;
            margin-bottom: 14px;
          }
          .abroad-card {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .activity-title {
            font-size: 11pt;
            font-weight: bold;
            margin-bottom: 10px;
            color: #1d4ed8;
          }
          .activity-table {
            width: 100%;
            border-collapse: collapse;
          }
          .activity-table td {
            vertical-align: top;
            padding: 4px 6px;
          }
          .activity-date {
            width: 75px;
            font-weight: bold;
            color: #0f172a;
            font-size: 10pt;
            padding-right: 8px;
          }
          .activity-text {
            font-size: 10pt;
            color: #1e293b;
          }
          .abroad-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 8px;
            font-size: 10pt;
          }
          .abroad-item {
            margin-bottom: 4px;
            break-inside: avoid;
            page-break-inside: avoid;
          }
          .first-page-prayer {
            margin-top: 16px;
            padding: 14px 16px;
            background: #eff6ff;
            border: 1px solid #c7d2fe;
            border-radius: 12px;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .first-page-prayer-title {
            margin: 0 0 8px 0;
            font-size: 12pt;
            font-weight: bold;
            color: #1d4ed8;
          }
          .first-page-prayer ul {
            margin: 0;
            padding-left: 18px;
            font-size: 10pt;
          }
          .first-page-prayer li {
            margin-bottom: 4px;
            line-height: 1.35;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            font-style: italic;
            font-size: 10pt;
          }
        </style>
      </head>
      <body>
        ${pagesHtml.join("\n")}
      </body>
    </html>
  `;
}
